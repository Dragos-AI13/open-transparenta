import { NextRequest, NextResponse } from "next/server";
import type { BugetStatDoc } from "@/lib/meilisearch";

/**
 * GET /api/buget-stat?q=&tip=&an=&nivel=&page=&limit=&sort=
 *
 * Bugetul de stat: venituri și cheltuieli pe capitole, per an.
 *
 * Query params:
 *   q      — căutare pe denumire (ex. „educație", „sănătate", „transport")
 *   tip    — venituri | cheltuieli | deficit
 *   an     — 2023 | 2024 | 2025
 *   nivel  — total | detalii (rândurile de sinteză vs detaliate)
 *   sort   — valoare:desc (default) sau valoare:asc
 *   page, limit
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() ?? "";
    const tip = searchParams.get("tip")?.trim() ?? "";
    const an = searchParams.get("an")?.trim() ?? "";
    const nivel = searchParams.get("nivel")?.trim() ?? "";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
    const limit = Math.min(
      200,
      Math.max(1, parseInt(searchParams.get("limit") ?? "50", 10) || 50),
    );
    const sortParam = searchParams.get("sort") ?? "valoare:desc";

    const { Meilisearch } = await import("meilisearch");
    const client = new Meilisearch({
      host: process.env.MEILISEARCH_HOST || "http://localhost:7700",
      apiKey: process.env["MEILISEARCH_API_KEY"] || "",
    });

    const index = client.index("buget_stat");

    const filters: string[] = [];
    if (tip) filters.push(`tip = "${tip}"`);
    if (an) filters.push(`an = ${an}`);
    if (nivel) filters.push(`nivel = "${nivel}"`);

    const sort = sortParam === "valoare:asc" ? ["valoare:asc"] : ["valoare:desc"];

    const result = await index.search(q, {
      hitsPerPage: limit,
      page,
      filter: filters.length > 0 ? filters.join(" AND ") : undefined,
      sort,
    });

    const hits = (result.hits ?? []) as BugetStatDoc[];

    // Total exact din stats când nu sunt filtre
    let total: number;
    if (!q && !tip && !an && !nivel) {
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
    console.error("Buget stat API error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
