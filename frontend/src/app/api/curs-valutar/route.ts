import { NextRequest, NextResponse } from "next/server";
import type { CursValutarDoc } from "@/lib/meilisearch";

/**
 * GET /api/curs-valutar?q=&data=&page=&limit=
 *
 * Cursul valutar BNR. Fără filtre → cursul celei mai recente zile (37 valute).
 *
 * Query params:
 *   q      — căutare pe valută/denumire (ex. EUR, dolar)
 *   data   — filtrează pe o dată specifică (ex. 2026-07-31)
 *   page   — pagina (default 1)
 *   limit  — rezultate pe pagină (default 50 — toate valutele intră pe o pagină)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() ?? "";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") ?? "50", 10) || 50),
    );
    const data = searchParams.get("data")?.trim() ?? "";

    const { Meilisearch } = await import("meilisearch");
    const client = new Meilisearch({
      host: process.env.MEILISEARCH_HOST || "http://localhost:7700",
      apiKey: process.env["MEILISEARCH_API_KEY"] || "",
    });

    const index = client.index("curs_valutar");

    const filters: string[] = [];
    if (data) filters.push(`data = "${data}"`);

    // Fără query și fără filtre → vrem cea mai recentă zi, nu toate istoricul
    let hits: CursValutarDoc[] = [];
    let total = 0;

    if (!q && !data) {
      // Cea mai recentă dată disponibilă
      const latestResult = await index.search("", {
        limit: 1,
        sort: ["data:desc"],
      });
      const latestDate = (latestResult.hits?.[0] as CursValutarDoc | undefined)
        ?.data;

      if (latestDate) {
        const result = await index.search("", {
          filter: `data = "${latestDate}"`,
          limit: 100,
        });
        hits = (result.hits ?? []) as CursValutarDoc[];
        // Sortează după valoarea ratei (EUR, USD, GBP primele)
        hits.sort((a, b) => b.rata - a.rata);
        total = hits.length;
      }
    } else {
      const result = await index.search(q, {
        hitsPerPage: limit,
        page,
        filter: filters.length > 0 ? filters.join(" AND ") : undefined,
        sort: data ? ["data:desc"] : undefined,
      });
      hits = (result.hits ?? []) as CursValutarDoc[];
      total = result.totalHits ?? 0;
    }

    // Data ultimei publicări (pentru UI: „Cursul din 31.07.2026")
    const latest =
      hits[0]?.data ??
      (
        await index.search("", { limit: 1, sort: ["data:desc"] })
      ).hits?.[0]?.data ??
      null;

    return NextResponse.json(
      {
        hits,
        total,
        page,
        totalPages: Math.max(1, Math.ceil(total / limit)),
        latestDate: latest,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
        },
      },
    );
  } catch (error) {
    console.error("Curs valutar API error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
