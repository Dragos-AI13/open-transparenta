import { NextRequest, NextResponse } from "next/server";
import type { BugetStatDoc } from "@/lib/meilisearch";

/**
 * GET /api/buget-stat/rezumat
 *
 * Rezumat pe ani: venituri totale, cheltuieli totale, deficit.
 * Pentru hero-ul paginii („Buget 2025: 357 mld lei venituri, -142 mld deficit").
 */
export async function GET(request: NextRequest) {
  try {
    const { Meilisearch } = await import("meilisearch");
    const client = new Meilisearch({
      host: process.env.MEILISEARCH_HOST || "http://localhost:7700",
      apiKey: process.env["MEILISEARCH_API_KEY"] || "",
    });
    const index = client.index("buget_stat");

    // Toate rândurile de nivel "total" (sinteza), sortate după an
    const result = await index.search("", {
      filter: 'nivel = "total"',
      limit: 200,
      sort: ["an:desc"],
    });
    const docs = (result.hits ?? []) as BugetStatDoc[];

    // Grupează pe an
    const byYear = new Map<number, { venituri: number | null; cheltuieli: number | null; deficit: number | null }>();
    for (const doc of docs) {
      const entry = byYear.get(doc.an) ?? { venituri: null, cheltuieli: null, deficit: null };
      if (doc.tip === "venituri" && doc.denumire.toUpperCase().includes("TOTAL") && entry.venituri === null) {
        entry.venituri = doc.valoare;
      } else if (doc.tip === "cheltuieli" && doc.capitol === "5001") {
        entry.cheltuieli = doc.valoare;
      } else if (doc.tip === "deficit") {
        entry.deficit = doc.valoare;
      }
      byYear.set(doc.an, entry);
    }

    const rezumat = [...byYear.entries()]
      .sort((a, b) => b[0] - a[0])
      .map(([an, v]) => ({ an, ...v }));

    return NextResponse.json(
      { ani: rezumat },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch (error) {
    console.error("Buget rezumat API error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
