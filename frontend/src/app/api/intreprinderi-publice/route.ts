import { NextRequest, NextResponse } from "next/server";
import type { IntreprinderePublicaDoc } from "@/lib/meilisearch";

/**
 * GET /api/intreprinderi-publice?q=&page=&limit=&caen=&sort=
 *
 * Lista întreprinderilor publice (AMEPIP) cu căutare, filtru CAEN și paginare.
 *
 * Query params:
 *   q      — căutare full-text pe denumire/CUI (opțional)
 *   page   — pagina (default 1)
 *   limit  — rezultate pe pagină (default 20, max 100)
 *   caen   — filtru pe cod CAEN (opțional)
 *   sort   — sortare: "denumire" | "denumire:desc" (default "denumire:asc")
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
    const caen = searchParams.get("caen")?.trim() ?? "";
    const sort = searchParams.get("sort")?.trim() || "denumire:asc";

    const { Meilisearch } = await import("meilisearch");
    const client = new Meilisearch({
      host: process.env.MEILISEARCH_HOST || "http://localhost:7700",
      apiKey: process.env["MEILISEARCH_API_KEY"] || "",
    });

    const index = client.index("intreprinderi_publice");

    const filters: string[] = [];
    if (caen) filters.push(`caen = ${caen}`);

    const sortOptions: string[] = [];
    if (sort === "denumire" || sort === "denumire:asc") sortOptions.push("denumire:asc");
    else if (sort === "denumire:desc") sortOptions.push("denumire:desc");

    const result = await index.search(q, {
      hitsPerPage: limit,
      page,
      filter: filters.length > 0 ? filters.join(" AND ") : undefined,
      sort: sortOptions.length > 0 ? sortOptions : undefined,
    });

    const hits = (result.hits ?? []) as IntreprinderePublicaDoc[];

    // Meilisearch 1.12 capătă totalHits/estimatedTotalHits la 1000.
    // Pentru lista completă (fără query/filtre) folosim numberOfDocuments — exact.
    let total: number;
    if (!q && !caen) {
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
    console.error("Intreprinderi publice list API error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
