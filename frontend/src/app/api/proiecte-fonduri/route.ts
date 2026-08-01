import { NextRequest, NextResponse } from "next/server";
import type { ProiectFondDoc } from "@/lib/meilisearch";

/**
 * GET /api/proiecte-fonduri?q=&program=&judet=&stadiu=&page=&limit=&sort=
 *
 * Proiecte finanțate din fonduri europene (MFE): titlu, program, beneficiar,
 * județ, valori, stadiu.
 *
 * Query params:
 *   q       — căutare full-text pe titlu/beneficiar/județ
 *   program — POIM | POC | POCU | POR | POAT | POAD | POCA
 *   judet   — numele județului (ex. „Bihor")
 *   stadiu  — „Proiect finalizat" | „Proiect nefinalizat"
 *   sort    — valoare_totala:desc (default) sau titlu:asc
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() ?? "";
    const program = searchParams.get("program")?.trim() ?? "";
    const judet = searchParams.get("judet")?.trim() ?? "";
    const stadiu = searchParams.get("stadiu")?.trim() ?? "";
    const sort = searchParams.get("sort")?.trim() ?? "valoare_totala:desc";
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
    const index = client.index("proiecte_fonduri");

    const filters: string[] = [];
    if (program) filters.push(`program = "${program}"`);
    if (judet) filters.push(`judet = "${judet}"`);
    if (stadiu) filters.push(`stadiu = "${stadiu}"`);

    const result = await index.search(q, {
      hitsPerPage: limit,
      page,
      filter: filters.length > 0 ? filters.join(" AND ") : undefined,
      sort: [sort],
      facets: ["program"], // pentru count exact pe programe mari (>1000 docs)
    });

    const hits = (result.hits ?? []) as ProiectFondDoc[];

    let total: number;
    if (!q && !program && !judet && !stadiu) {
      const stats = await index.getStats();
      total = stats.numberOfDocuments ?? 0;
    } else if (program && !q && !judet && !stadiu) {
      // Pitfall Meilisearch: totalHits e capat la 1000 (POR are 8040) →
      // count exact din facetDistribution.program
      const facets = result.facetDistribution?.program;
      total = (facets && facets[program]) || result.totalHits || 0;
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
    console.error("Proiecte fonduri API error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
