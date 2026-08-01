import { NextRequest, NextResponse } from "next/server";
import type { ReteaScolaraDoc } from "@/lib/meilisearch";

/**
 * GET /api/retea-scolara?q=&judet=&mediu=&tip=&page=&limit=&sort=
 *
 * Rețeaua școlară a României (ME): toate unitățile de învățământ.
 *
 * Query params:
 *   q      — căutare pe denumire/localitate/județ/email
 *   judet  — cod (AB) sau nume (Alba)
 *   mediu  — URBAN | RURAL
 *   tip    — tip unitate
 *   sort   — denumire:asc (default)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() ?? "";
    const judet = searchParams.get("judet")?.trim() ?? "";
    const mediu = searchParams.get("mediu")?.trim() ?? "";
    const tip = searchParams.get("tip")?.trim() ?? "";
    const sort = searchParams.get("sort")?.trim() ?? "denumire:asc";
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
    const index = client.index("retea_scolara");

    const filters: string[] = [];
    if (judet) {
      // acceptă cod (AB) sau nume (Alba)
      filters.push(`judet = "${judet}" OR judet_nume = "${judet}"`);
    }
    if (mediu) filters.push(`mediu = "${mediu.toUpperCase()}"`);
    if (tip) filters.push(`tip = "${tip}"`);

    const result = await index.search(q, {
      hitsPerPage: limit,
      page,
      filter: filters.length > 0 ? filters.join(" AND ") : undefined,
      sort: [sort],
      facets: ["judet_nume", "mediu"],
    });

    const hits = (result.hits ?? []) as ReteaScolaraDoc[];

    let total: number;
    if (!q && !judet && !mediu && !tip) {
      const stats = await index.getStats();
      total = stats.numberOfDocuments ?? 0;
    } else if (judet && !q && !mediu && !tip) {
      // total exact pentru județe mari (facet)
      const facets = result.facetDistribution?.judet_nume;
      const byCod = result.facetDistribution?.judet;
      total =
        (facets && facets[judet]) ||
        (byCod && byCod[judet.toUpperCase()]) ||
        result.totalHits ||
        0;
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
        facetMediu: result.facetDistribution?.mediu ?? {},
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch (error) {
    console.error("Retea scolara API error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
