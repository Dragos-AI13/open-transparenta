import { NextRequest, NextResponse } from "next/server";
import type { TaxaImpozitDoc } from "@/lib/meilisearch";

/**
 * GET /api/taxe-impozite/rezumat
 *
 * Rezumat pe trimestre: total venituri bugetare + total contribuabili activi.
 * Pentru cardurile hero („Venituri T1 2026: 119,23 mld lei, +9,4%").
 */
export async function GET(request: NextRequest) {
  try {
    const { Meilisearch } = await import("meilisearch");
    const client = new Meilisearch({
      host: process.env.MEILISEARCH_HOST || "http://localhost:7700",
      apiKey: process.env["MEILISEARCH_API_KEY"] || "",
    });
    const index = client.index("taxe_impozite");

    const result = await index.search("", {
      filter: 'sectiune = "Venituri bugetare"',
      limit: 200,
      sort: ["an:desc", "trimestru:desc"],
    });
    const docs = (result.hits ?? []) as TaxaImpozitDoc[];

    // Grupează pe (an, trimestru): totalul și TVA
    const byQuarter = new Map<
      string,
      { an: number; trimestru: number; total: number | null; tva: number | null; indice_total: number | null }
    >();
    for (const doc of docs) {
      if (doc.unitate !== "milioane lei") continue;
      const key = `${doc.an}_${doc.trimestru}`;
      const entry =
        byQuarter.get(key) ?? {
          an: doc.an,
          trimestru: doc.trimestru,
          total: null,
          tva: null,
          indice_total: null,
        };
      if (doc.indicator.toUpperCase().startsWith("TOTAL")) {
        entry.total = doc.valoare_curent;
        entry.indice_total = doc.indice;
      } else if (doc.indicator === "TVA") {
        entry.tva = doc.valoare_curent;
      }
      byQuarter.set(key, entry);
    }

    const trimestre = [...byQuarter.values()].sort(
      (a, b) => b.an - a.an || b.trimestru - a.trimestru,
    );

    return NextResponse.json(
      { trimestre },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch (error) {
    console.error("Taxe rezumat API error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
