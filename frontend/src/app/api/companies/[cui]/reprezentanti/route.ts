import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/companies/{cui}/reprezentanti
 *
 * Get the legal representatives (administrators, associates, liquidators)
 * for a company by CUI (e.g. RO12345678).
 *
 * Flow: find company by CUI → get its cod_inmatriculare (sanitized, e.g. J40-1737-1992)
 * → filter the "reprezentanti" index by cod_inmatriculare.
 *
 * Returns 404 if the company is not found.
 * Returns 400 if CUI is missing.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ cui: string }> },
) {
  try {
    const { cui } = await params;

    if (!cui || cui.trim() === "") {
      return NextResponse.json(
        { error: "Missing CUI parameter" },
        { status: 400 },
      );
    }

    const normalizedCui = cui.trim().toUpperCase();

    const { Meilisearch } = await import("meilisearch");
    const client = new Meilisearch({
      host: process.env.MEILISEARCH_HOST || "http://localhost:7700",
      apiKey: process.env["MEILISEARCH_API_KEY"] || "",
    });

    // 1. Find company by CUI to get its cod_inmatriculare
    const companyResult = await client.index("companies").search(normalizedCui, {
      limit: 1,
    });

    const company = companyResult.hits?.[0] ?? null;

    if (!company) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 },
      );
    }

    const codInmatriculare =
      (company as Record<string, unknown>).cod_inmatriculare ?? "";

    if (!codInmatriculare) {
      return NextResponse.json(
        { hits: [], total: 0, cui: normalizedCui },
        { status: 200 },
      );
    }

    // 2. Filter representatives by cod_inmatriculare (already sanitized: J40-1737-1992)
    const result = await client.index("reprezentanti").search("", {
      filter: `cod_inmatriculare = "${codInmatriculare}"`,
      limit: 100,
    });

    const hits = result.hits ?? [];

    // Sort: administrators first, then associates, then the rest
    const priority = (calitate: string): number => {
      const c = calitate.toLowerCase();
      if (c.includes("administrator")) return 0;
      if (c.includes("asociat") || c.includes("actionar")) return 1;
      if (c.includes("director")) return 2;
      return 3;
    };

    hits.sort(
      (a, b) =>
        priority(String((a as Record<string, unknown>).calitate ?? "")) -
        priority(String((b as Record<string, unknown>).calitate ?? "")),
    );

    return NextResponse.json(
      {
        hits,
        total: hits.length,
        cui: normalizedCui,
        cod_inmatriculare: codInmatriculare,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
        },
      },
    );
  } catch (error) {
    console.error("Company representatives API error:", error);

    const message =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}
