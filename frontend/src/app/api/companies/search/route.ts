import { NextRequest, NextResponse } from "next/server";
import { searchCompanies } from "@/lib/meilisearch";
import type { SearchFilters } from "@/lib/meilisearch";

/**
 * GET /api/companies/search
 *
 * Search companies with optional filters.
 *
 * Query params:
 *   q               — search query (default: "")
 *   page            — page number (default: 1)
 *   limit           — results per page (default: 20, max: 100)
 *   judet           — filter by county
 *   localitate      — filter by locality
 *   forma_juridica  — filter by legal form (SRL, SA, PFA, etc.)
 *   stare           — filter by status (Activa, Dizolvata, etc.)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // --- Parse query params ---
    const q = searchParams.get("q") ?? "";
    const pageStr = searchParams.get("page") ?? "1";
    const limitStr = searchParams.get("limit") ?? "20";

    const page = Math.max(1, parseInt(pageStr, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(limitStr, 10) || 20));

    // --- Build optional filters (only non-empty values) ---
    const filters: SearchFilters = {};
    const judet = searchParams.get("judet");
    const localitate = searchParams.get("localitate");
    const formaJuridica = searchParams.get("forma_juridica");
    const stare = searchParams.get("stare");

    if (judet) filters.judet = judet;
    if (localitate) filters.localitate = localitate;
    if (formaJuridica) filters.forma_juridica = formaJuridica;
    if (stare) filters.stare = stare;

    // --- Execute search ---
    const result = await searchCompanies(q, filters, page, limit);

    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Search API error:", error);

    const message =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}
