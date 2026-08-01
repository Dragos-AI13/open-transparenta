import { NextResponse } from "next/server";
import type { BacalaureatDoc } from "@/lib/meilisearch";

/**
 * GET /api/bacalaureat/rezumat
 *
 * Cardurile hero: rata națională de promovare + total candidați/prezenți,
 * top județe după rată.
 */
export async function GET() {
  try {
    const { Meilisearch } = await import("meilisearch");
    const client = new Meilisearch({
      host: process.env["MEILISEARCH_HOST"] || "http://localhost:7700",
      apiKey: process.env["MEILISEARCH_API_KEY"] || "",
    });
    const index = client.index("bacalaureat");

    // Toate școlile — paginare cu getDocuments (search are cap de 1000 la
    // totalHits; getDocuments nu, deci aduce toate cele 1.382 de școli)
    const docs: BacalaureatDoc[] = [];
    const LIMIT = 1000;
    for (let offset = 0; ; offset += LIMIT) {
      const page = await index.getDocuments({
        limit: LIMIT,
        offset,
        fields: [
          "candidati",
          "prezenti",
          "promovati",
          "rata_promovare",
          "judet_nume",
          "sesiune",
        ],
      });
      const batch = (page.results ?? page) as BacalaureatDoc[];
      if (batch.length === 0) break;
      docs.push(...batch);
      if (batch.length < LIMIT) break;
    }

    let candidati = 0;
    let prezenti = 0;
    let promovati = 0;
    for (const d of docs) {
      candidati += d.candidati ?? 0;
      prezenti += d.prezenti ?? 0;
      promovati += d.promovati ?? 0;
    }
    const rataNationala = prezenti
      ? Math.round((promovati / prezenti) * 1000) / 10
      : 0;

    // Top județe după rată (agregare pe județ din școli)
    const byJudet = new Map<
      string,
      { candidati: number; prezenti: number; promovati: number }
    >();
    for (const d of docs) {
      if (!d.judet_nume) continue;
      const e = byJudet.get(d.judet_nume) ?? { candidati: 0, prezenti: 0, promovati: 0 };
      e.candidati += d.candidati ?? 0;
      e.prezenti += d.prezenti ?? 0;
      e.promovati += d.promovati ?? 0;
      byJudet.set(d.judet_nume, e);
    }
    const judete = [...byJudet.entries()]
      .map(([nume, v]) => ({
        judet: nume,
        candidati: v.candidati,
        prezenti: v.prezenti,
        promovati: v.promovati,
        rata: v.prezenti ? Math.round((v.promovati / v.prezenti) * 1000) / 10 : 0,
      }))
      .sort((a, b) => b.rata - a.rata);

    return NextResponse.json(
      {
        candidati,
        prezenti,
        promovati,
        rataNationala,
        topJudete: judete.slice(0, 5),
        sesiune: docs[0]?.sesiune ?? "",
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch (error) {
    console.error("Bacalaureat rezumat API error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
