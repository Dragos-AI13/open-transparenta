import { NextResponse } from "next/server";

/**
 * GET /api/retea-scolara/rezumat
 *
 * Cardurile hero pentru pagina Rețea școlară:
 * total unități, județe acoperite, mediu urban/rural.
 */
export async function GET() {
  try {
    const { Meilisearch } = await import("meilisearch");
    const client = new Meilisearch({
      host: process.env["MEILISEARCH_HOST"] || "http://localhost:7700",
      apiKey: process.env["MEILISEARCH_API_KEY"] || "",
    });
    const index = client.index("retea_scolara");

    const [stats, res] = await Promise.all([
      index.getStats(),
      index.search("", { limit: 1, facets: ["judet_nume", "mediu"] }),
    ]);

    const judete = res.facetDistribution?.judet_nume ?? {};
    const medii = res.facetDistribution?.mediu ?? {};

    return NextResponse.json(
      {
        totalUnitati: stats.numberOfDocuments ?? 0,
        totalJudete: Object.keys(judete).length,
        urban: medii["URBAN"] ?? 0,
        rural: medii["RURAL"] ?? 0,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch (error) {
    console.error("Retea scolara rezumat API error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
