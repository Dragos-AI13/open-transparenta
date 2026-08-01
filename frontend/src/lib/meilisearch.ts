import { Meilisearch } from "meilisearch";

// ─── Client ──────────────────────────────────────

const client = new Meilisearch({
  host: process.env.MEILISEARCH_HOST || "http://localhost:7700",
  apiKey: process.env.MEILISEARCH_API_KEY || "",
});

const INDEX_NAME = "companies";

// ─── Types ───────────────────────────────────────

export interface CompanyDoc {
  cui: string;
  denumire: string;
  forma_juridica: string;
  stare: string;
  adresa: string;
  localitate: string;
  judet: string;
  cod_caen: string;
  cod_caen_denumire: string;
  caen_sectiune?: string;
  telefon?: string;
  email?: string;
  website?: string;
  data_infiintare?: string;
  numar_registru_comert?: string;
}

// ─── Întreprinderi Publice (AMEPIP) ──────────────

export interface IntreprinderePublicaDoc {
  cui: string;                    // RO54760
  denumire: string;               // COMPANIA DE APĂ ORADEA SA
  numar_registru_comert?: string; // J05/14/1991
  ticker_symbol?: string;         // ex. SNP
  caen?: string;                  // 3600
  caen_denumire?: string;         // Captarea, tratarea si distributia apei
  ani: number[];                  // [2019, 2020, 2021, 2022, 2023]
  indicatori: Record<number, Record<string, number | null>>;  // an → indicator → valoare
}

// ─── Decizii Concurență (Consiliul Concurenței) ──

export interface DecizieConcurentaDoc {
  id: string;         // slug PDF sanitizat
  numar: string;      // "180/2026"
  an?: string;        // "2026"
  categorie: string;  // "Servicii", "Industrie și energie"...
  titlu: string;      // "Decizia 180/2026"
  url_pdf: string;    // link direct PDF
  url_sursa: string;  // link sursă
}

export interface SearchFilters {
  judet?: string;
  localitate?: string;
  forma_juridica?: string;
  stare?: string;
}

export interface SearchResult {
  hits: CompanyDoc[];
  total: number;
  page: number;
  totalPages: number;
  facetDistribution?: Record<string, Record<string, number>>;
}

// ─── Index Setup ─────────────────────────────────

export async function ensureIndex() {
  try {
    // Check if index exists
    const index = client.index(INDEX_NAME);
    await index.getStats();
  } catch {
    // Create index with settings
    await client.createIndex(INDEX_NAME, { primaryKey: "cui" });
  }

  // Apply settings
  const index = client.index(INDEX_NAME);
  await index.updateSettings({
    searchableAttributes: [
      "denumire",
      "cui",
      "adresa",
      "cod_caen_denumire",
      "localitate",
      "judet",
    ],
    filterableAttributes: ["judet", "forma_juridica", "stare", "localitate", "cui"],
    sortableAttributes: ["denumire"],
    rankingRules: ["words", "typo", "proximity", "attribute", "sort", "exactness"],
  });

  return index;
}

// ─── Search ──────────────────────────────────────

export async function searchCompanies(
  query: string,
  filters?: SearchFilters,
  page = 1,
  limit = 20,
): Promise<SearchResult> {
  const index = client.index(INDEX_NAME);

  // Build filter string
  const filterParts: string[] = [];
  if (filters?.judet) filterParts.push(`judet = "${filters.judet}"`);
  if (filters?.localitate) filterParts.push(`localitate = "${filters.localitate}"`);
  if (filters?.forma_juridica)
    filterParts.push(`forma_juridica = "${filters.forma_juridica}"`);
  if (filters?.stare) filterParts.push(`stare = "${filters.stare}"`);

  const result = await index.search(query, {
    limit,
    offset: (page - 1) * limit,
    filter: filterParts.length > 0 ? filterParts : undefined,
    facets: ["judet", "forma_juridica", "stare"],
  });

  return {
    hits: result.hits as unknown as CompanyDoc[],
    total: result.estimatedTotalHits ?? 0,
    page,
    totalPages: Math.ceil((result.estimatedTotalHits ?? 0) / limit),
    facetDistribution: result.facetDistribution,
  };
}

// ─── Get by CUI ──────────────────────────────────

export async function getCompany(cui: string): Promise<CompanyDoc | null> {
  try {
    const index = client.index(INDEX_NAME);
    const doc = await index.getDocument(cui);
    return doc as unknown as CompanyDoc;
  } catch {
    return null;
  }
}

// ─── Bulk add documents ──────────────────────────

export async function addCompanies(docs: CompanyDoc[]) {
  const index = client.index(INDEX_NAME);
  return await index.addDocuments(docs);
}

// ─── Clear index ─────────────────────────────────

export async function clearCompanies() {
  const index = client.index(INDEX_NAME);
  return await index.deleteAllDocuments();
}
