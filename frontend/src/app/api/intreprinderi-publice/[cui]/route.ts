import { NextRequest, NextResponse } from "next/server";
import type { IntreprinderePublicaDoc } from "@/lib/meilisearch";

/**
 * GET /api/intreprinderi-publice/{cui}
 *
 * Detalii complete pentru o întreprindere publică (ex. RO54760).
 *
 * Returns 404 if the CUI is not a public enterprise.
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

    const result = await client
      .index("intreprinderi_publice")
      .search(normalizedCui, { limit: 1 });

    const doc = (result.hits?.[0] as IntreprinderePublicaDoc | undefined) ?? null;

    // Verify exact CUI match (search may return fuzzy results)
    if (!doc || doc.cui !== normalizedCui) {
      return NextResponse.json(
        { error: "Company is not a public enterprise" },
        { status: 404 },
      );
    }

    return NextResponse.json(doc, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Intreprindere publica detail API error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
