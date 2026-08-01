import { NextRequest, NextResponse } from "next/server";
import type { AbsorbtieFondDoc } from "@/lib/meilisearch";

/**
 * GET /api/proiecte-fonduri/rezumat
 *
 * Cardurile hero pentru pagina Investiții și Fonduri:
 *   - total proiecte + valoare totală contractată (din proiecte_fonduri)
 *   - absorbția pe programe (din absorbtie_fonduri, cea mai recentă perioadă)
 */
export async function GET() {
  try {
    const { Meilisearch } = await import("meilisearch");
    const client = new Meilisearch({
      host: process.env["MEILISEARCH_HOST"] || "http://localhost:7700",
      apiKey: process.env["MEILISEARCH_API_KEY"] || "",
    });
    const proiecte = client.index("proiecte_fonduri");
    const absorbtie = client.index("absorbtie_fonduri");

    // Total proiecte + valoare totală (suma pe toate — până la 10k, suficient
    // pentru cardul hero; totalul exact din stats)
    const [stats, projRes, absRes] = await Promise.all([
      proiecte.getStats(),
      proiecte.search("", { limit: 1000, sort: ["valoare_totala:desc"] }),
      absorbtie.search("", { limit: 200 }),
    ]);

    const projDocs = (projRes.hits ?? []) as Array<{
      valoare_totala: number | null;
      plati: number | null;
    }>;
    const totalValoare = projDocs.reduce(
      (sum, d) => sum + (d.valoare_totala ?? 0),
      0,
    );
    const totalPlati = projDocs.reduce(
      (sum, d) => sum + (d.plati ?? 0),
      0,
    );

    const absDocs = (absRes.hits ?? []) as AbsorbtieFondDoc[];
    // Cea mai recentă perioadă de raportare
    const perioade = [...new Set(absDocs.map((d) => d.perioada))].sort();
    const perioadaCurenta = perioade[perioade.length - 1] ?? "";
    const absorbtiePePrograme = absDocs
      .filter((d) => d.perioada === perioadaCurenta)
      .sort((a, b) => (b.alocare ?? 0) - (a.alocare ?? 0));

    return NextResponse.json(
      {
        totalProiecte: stats.numberOfDocuments ?? 0,
        totalValoare,
        totalPlati,
        absorbtiePePrograme,
        perioada: perioadaCurenta,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch (error) {
    console.error("Proiecte fonduri rezumat API error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
