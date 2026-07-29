import { NextRequest, NextResponse } from "next/server";
import { getCompany } from "@/lib/meilisearch";

/**
 * GET /api/companies/{cui}
 *
 * Get a single company by CUI (e.g. RO12345678).
 * Searches by the `cui` field since the Meilisearch primary key is cod_inmatriculare.
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

    // Search by CUI field since that's the user-facing identifier
    const { Meilisearch } = await import("meilisearch");
    const client = new Meilisearch({
      host: process.env.MEILISEARCH_HOST || "http://localhost:7700",
      apiKey: process.env.MEILISEARCH_API_KEY || "",
    });

    const result = await client
      .index("companies")
      .search(normalizedCui, {
        limit: 1,
      });

    const company = result.hits?.[0] ?? null;

    if (!company) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(company, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Company detail API error:", error);

    const message =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}
