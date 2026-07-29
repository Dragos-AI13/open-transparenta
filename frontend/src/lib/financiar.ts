import { Meilisearch } from "meilisearch";

export interface FinancialData {
  id: string;
  cui: string;
  an: number;
  caen?: string;
  active_imobilizate?: number;
  active_circulante?: number;
  stocuri?: number;
  creante?: number;
  numerar?: number;
  cheltuieli_avans?: number;
  datorii?: number;
  venituri_avans?: number;
  provizioane?: number;
  capitaluri_proprii?: number;
  capital_subscris?: number;
  patrimoniu_regie?: number;
  cifra_afaceri?: number;
  venituri_totale?: number;
  cheltuieli_totale?: number;
  profit_brut?: number;
  pierdere_bruta?: number;
  profit_net?: number;
  pierdere_neta?: number;
  numar_salariati?: number;
}

export interface FinancialResponse {
  cui: string;
  years: number[];
  hits: FinancialData[];
}

const MEILISEARCH_HOST =
  process.env.MEILISEARCH_HOST || "http://localhost:7700";
const MEILISEARCH_API_KEY = process.env.MEILISEARCH_API_KEY || "";
const INDEX_NAME = "financial";

export async function getFinancialData(cui: string): Promise<FinancialResponse> {
  const client = new Meilisearch({
    host: MEILISEARCH_HOST,
    apiKey: MEILISEARCH_API_KEY,
  });

  const result = await client.index(INDEX_NAME).search("", {
    filter: [`cui = "${cui}"`],
    sort: ["an:desc"],
    limit: 30,
  });

  const hits = result.hits as unknown as FinancialData[];
  const years = [...new Set(hits.map((h) => h.an))].sort((a, b) => b - a);

  return { cui, years, hits };
}
