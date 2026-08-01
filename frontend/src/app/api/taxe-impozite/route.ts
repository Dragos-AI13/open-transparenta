import { NextRequest, NextResponse } from "next/server";
import type { TaxaImpozitDoc } from "@/lib/meilisearch";

/**
 * GET /api/taxe-impozite?q=&sectiune=&an=&trimestru=&page=&limit=&sort=
 *
 * Datele fiscale ANAF din Buletinul Statistic Fiscal: venituri bugetare
 * pe tipuri de impozite + contribuabili activi, cu comparație pe trimestre.
 *
 * Query params:
 *   q         — căutare pe indicator (ex. „TVA", „profit", „salarii")
 *   sectiune  — „Venituri bugetare" | „Contribuabili înregistrați"
 *   an        — 2024 | 2025 | 2026
 *   trimestru — 1-4
 *   sort      — an:desc (default) sau valoare_curent:desc
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() ?? "";
    const sectiune = searchParams.get("sectiune")?.trim() ?? "";
    const an = searchParams.get("an")?.trim() ?? "";
    const trimestru = searchParams.get("trimestru")?.trim() ?? "";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
    const limit = Math.min(
      200,
      Math.max(1, parseInt(searchParams.get("limit") ?? "50", 10) || 50),
    );

    const { Meilisearch } = await import("meilisearch");
    const client = new Meilisearch({
      host: process.env.MEILISEARCH_HOST || "http://localhost:7700",
      apiKey: process.env["MEILISEARCH_API_KEY"] || "",
    });
    const index = client.index("taxe_impozite");

    const filters: string[] = [];
    if (sectiune) filters.push(`sectiune = "${sectiune}"`);
    if (an) filters.push(`an = ${an}`);
    if (trimestru) filters.push(`trimestru = ${trimestru}`);

    const result = await index.search(q, {
      hitsPerPage: limit,
      page,
      filter: filters.length > 0 ? filters.join(" AND ") : undefined,
      sort: ["an:desc", "trimestru:desc"],
    });

    const hits = (result.hits ?? []) as TaxaImpozitDoc[];

    let total: number;
    if (!q && !sectiune && !an && !trimestru) {
      const stats = await index.getStats();
      total = stats.numberOfDocuments ?? 0;
    } else {
      total = result.totalHits ?? 0;
    }

    return NextResponse.json(
      {
        hits,
        total,
        page,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch (error) {
    console.error("Taxe impozite API error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
