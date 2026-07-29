import { Suspense } from "react";
import { Meilisearch } from "meilisearch";
import CompanyCard from "@/components/companii/CompanyCard";
import SearchFiltersClient from "@/components/companii/SearchFilters";
import PaginationClient from "@/components/companii/Pagination";
import SearchBar from "@/components/companii/SearchBar";

// ── Types ───────────────────────────────────────

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
    limit?: string;
    judet?: string;
    localitate?: string;
    forma_juridica?: string | string[];
    stare?: string | string[];
    caen_sectiune?: string;
    website?: string;
    sort?: string;
  }>;
}

// ── Meilisearch client (server-only) ────────────

function getClient() {
  return new Meilisearch({
    host: process.env.MEILISEARCH_HOST || "http://localhost:7700",
    apiKey: process.env.MEILISEARCH_API_KEY || "",
  });
}

// ── Helper ──────────────────────────────────────

function parseMultiParam(v: string | string[] | undefined): string[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

// ── Server Component ────────────────────────────

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;

  const q = params.q || "";
  const page = Math.max(1, parseInt(params.page || "1", 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(params.limit || "20", 10) || 20));

  // Build filter string for Meilisearch
  const filterParts: string[] = [];

  if (params.judet) {
    filterParts.push(`judet = "${params.judet}"`);
  }
  if (params.localitate) {
    filterParts.push(`localitate = "${params.localitate}"`);
  }
  if (params.caen_sectiune) {
    filterParts.push(`caen_sectiune = "${params.caen_sectiune}"`);
  }

  const formaJuridica = parseMultiParam(params.forma_juridica);
  if (formaJuridica.length === 1) {
    filterParts.push(`forma_juridica = "${formaJuridica[0]}"`);
  } else if (formaJuridica.length > 1) {
    filterParts.push(`forma_juridica IN [${formaJuridica.map((f) => `"${f}"`).join(", ")}]`);
  }

  const stare = parseMultiParam(params.stare);
  if (stare.length === 1) {
    filterParts.push(`stare = "${stare[0]}"`);
  } else if (stare.length > 1) {
    filterParts.push(`stare IN [${stare.map((s) => `"${s}"`).join(", ")}]`);
  }

  // Website filter
  if (params.website === "yes") {
    filterParts.push('website != ""');
  } else if (params.website === "no") {
    filterParts.push('website = ""');
  }

  const filter = filterParts.length > 0 ? filterParts.join(" AND ") : undefined;

  // Sort
  let sort: string[] | undefined;
  if (params.sort === "denumire:asc") sort = ["denumire:asc"];
  else if (params.sort === "denumire:desc") sort = ["denumire:desc"];
  else if (params.sort === "data_infiintare:desc") sort = ["data_infiintare:desc"];
  else if (params.sort === "data_infiintare:asc") sort = ["data_infiintare:asc"];

  // Execute search
  const client = getClient();
  let hits: any[] = [];
  let total = 0;
  let totalPages = 0;
  let facetDistribution: Record<string, Record<string, number>> | null = null;
  let error: string | null = null;

  try {
    const result = await client.index("companies").search(q, {
      limit,
      offset: (page - 1) * limit,
      filter,
      sort,
      facets: ["judet", "forma_juridica", "stare"],
    });

    hits = result.hits as any[];
    total = result.estimatedTotalHits ?? 0;
    totalPages = Math.ceil(total / limit);
    facetDistribution = result.facetDistribution ?? null;
  } catch (e) {
    error = e instanceof Error ? e.message : "Eroare la căutare";
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 gap-6 px-4 py-8">
      {/* Filters sidebar */}
      <Suspense fallback={<div className="w-72 shrink-0" />}>
        <SearchFiltersClient facetDistribution={facetDistribution} />
      </Suspense>

      {/* Results */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <div className="mb-4 flex items-baseline justify-between">
          <div>
            {q && (
              <h1 className="text-lg font-semibold text-text-primary">
                Rezultate pentru „{q}”
              </h1>
            )}
            <p className="text-sm text-text-muted">
              {total > 0
                ? `${total.toLocaleString()} de firm${total === 1 ? "ă" : "e"} găsit${total === 1 ? "ă" : "e"}`
                : "Caută în registrul comerțului"}
              {filterParts.length > 0 && " (cu filtre active)"}
            </p>
          </div>
        </div>

        {/* Search bar */}
        <div className="mb-6">
          <Suspense fallback={null}>
            <SearchBar />
          </Suspense>
        </div>

        {/* Error state */}
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Empty query */}
        {!q && hits.length === 0 && !error && (
          <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-lg font-medium text-text-primary">
              Introdu un termen de căutare
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              Caută după denumirea firmei, CUI, adresă sau cod CAEN
            </p>
          </div>
        )}

        {/* No results */}
        {q && hits.length === 0 && !error && (
          <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
            <div className="text-5xl mb-4">📭</div>
            <h2 className="text-lg font-medium text-text-primary">
              Nicio firmă găsită
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              Încearcă să modifici termenii de căutare sau să elimini unele filtre
            </p>
          </div>
        )}

        {/* Results list */}
        {hits.length > 0 && (
          <div className="space-y-3">
            {hits.map((company) => (
              <CompanyCard key={company.cod_inmatriculare} company={company} />
            ))}
          </div>
        )}

        {/* Pagination */}
        <Suspense fallback={null}>
          <PaginationClient
            currentPage={page}
            totalPages={totalPages}
          />
        </Suspense>
      </div>
    </div>
  );
}
