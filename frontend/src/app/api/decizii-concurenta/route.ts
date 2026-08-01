import { NextRequest, NextResponse } from "next/server";
import type { DecizieConcurentaDoc } from "@/lib/meilisearch";

/**
 * GET /api/decizii-concurenta?q=&categorie=&an=&page=&limit=
 *
 * Lista deciziilor Consiliului Concurenței cu căutare, filtru categorie/an și paginare.
 *
 * Query params:
 *   q          — căutare full-text pe titlu/număr (opțional)
 *   categorie  — filtru pe categorie (opțional)
 *   an         — filtru pe an (opțional)
 *   page       — pagina (default 1)
 *   limit      — rezultate pe pagină (default 20, max 100)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() ?? "";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10) || 20),
    );
    const categorie = searchParams.get("categorie")?.trim() ?? "";
    const an = searchParams.get("an")?.trim() ?? "";

    const { Meilisearch } = await import("meilisearch");
    const client = new Meilisearch({
      host: process.env.MEILISEARCH_HOST || "http://localhost:7700",
      apiKey: process.env["MEILISEARCH_API_KEY"] || "",
    });

    const index = client.index("decizii_concurenta");

    const filters: string[] = [];
    if (categorie) filters.push(`categorie = "${categorie}"`);
    if (an) filters.push(`an = ${an}`);

    const result = await index.search(q, {
      hitsPerPage: limit,
      page,
      filter: filters.length > 0 ? filters.join(" AND ") : undefined,
    });

    const hits = (result.hits ?? []) as DecizieConcurentaDoc[];

    // Meilisearch 1.12 capătă totalHits la 1000 — stats e exact pentru lista completă
    let total: number;
    if (!q && !categorie && !an) {
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
        totalPages: Math.ceil(total / limit),
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
        },
      },
    );
  } catch (error) {
    console.error("Decizii concurenta API error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
