import { NextRequest, NextResponse } from "next/server";
import type { BacalaureatDoc } from "@/lib/meilisearch";

/**
 * GET /api/bacalaureat?q=&judet=&sesiune=&page=&limit=&sort=
 *
 * Ratele de promovare la bacalaureat pe școli (agregate din candidați).
 *
 * Query params:
 *   q       — căutare pe denumire școală/județ/localitate
 *   judet   — cod (AB) sau nume (Alba)
 *   sesiune — "sesiunea 2-2025"
 *   sort    — rata_promovare:desc (default) sau candidati:desc
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() ?? "";
    const judet = searchParams.get("judet")?.trim() ?? "";
    const sesiune = searchParams.get("sesiune")?.trim() ?? "";
    const minCand = Math.max(1, parseInt(searchParams.get("minCand") ?? "1", 10) || 1);
    const sort = searchParams.get("sort")?.trim() ?? "rata_promovare:desc";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
    const limit = Math.min(
      200,
      Math.max(1, parseInt(searchParams.get("limit") ?? "50", 10) || 50),
    );

    const { Meilisearch } = await import("meilisearch");
    const client = new Meilisearch({
      host: process.env["MEILISEARCH_HOST"] || "http://localhost:7700",
      apiKey: process.env["MEILISEARCH_API_KEY"] || "",
    });
    const index = client.index("bacalaureat");

    const filters: string[] = [`candidati >= ${minCand}`];
    if (judet) filters.push(`judet = "${judet}" OR judet_nume = "${judet}"`);
    if (sesiune) filters.push(`sesiune = "${sesiune}"`);

    const result = await index.search(q, {
      hitsPerPage: limit,
      page,
      filter: filters.length > 0 ? filters.join(" AND ") : undefined,
      sort: [sort],
      facets: ["judet_nume"],
    });

    const hits = (result.hits ?? []) as BacalaureatDoc[];

    let total: number;
    if (!q && !judet && !sesiune && minCand <= 1) {
      const stats = await index.getStats();
      total = stats.numberOfDocuments ?? 0;
    } else if (judet && !q && !sesiune) {
      const facets = result.facetDistribution?.judet_nume;
      total =
        (facets && facets[judet]) || result.totalHits || 0;
    } else {
      total = result.totalHits ?? 0;
    }

    return NextResponse.json(
      {
        hits,
        total,
        page,
        totalPages: Math.max(1, Math.ceil(total / limit)),
        facetJudete: result.facetDistribution?.judet_nume ?? {},
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch (error) {
    console.error("Bacalaureat API error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
