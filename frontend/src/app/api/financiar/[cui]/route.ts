import { NextRequest, NextResponse } from "next/server";
import { getFinancialData } from "@/lib/financiar";

/**
 * GET /api/financiar/{cui}
 *
 * Returnează toți indicatorii financiari pentru o firmă, pe ani.
 *
 * Query params:
 *   ani  — optional, filter by year range (e.g. "2020-2024" or "2024,2025")
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
    const result = await getFinancialData(normalizedCui);

    // Optional year filter
    const { searchParams } = new URL(request.url);
    const aniParam = searchParams.get("ani");
    if (aniParam) {
      // Support formats: "2024,2025" or "2020-2024"
      let years: number[] = [];
      if (aniParam.includes("-")) {
        const [start, end] = aniParam.split("-").map((y) => parseInt(y, 10));
        if (!isNaN(start) && !isNaN(end)) {
          years = Array.from({ length: end - start + 1 }, (_, i) => start + i);
        }
      } else {
        years = aniParam.split(",").map((y) => parseInt(y.trim(), 10)).filter((y) => !isNaN(y));
      }
      if (years.length > 0) {
        result.hits = result.hits.filter((h) => years.includes(h.an));
        result.years = result.years.filter((y) => years.includes(y));
      }
    }

    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Financial API error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
