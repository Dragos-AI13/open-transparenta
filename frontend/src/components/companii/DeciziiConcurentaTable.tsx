"use client";

import { useCallback, useEffect, useState } from "react";
import type { DecizieConcurentaDoc } from "@/lib/meilisearch";

// ── Types ──────────────────────────────────────

interface ListResponse {
  hits: DecizieConcurentaDoc[];
  total: number;
  page: number;
  totalPages: number;
}

const CATEGORII = [
  "Toate",
  "Industrie și energie",
  "Bunuri de consum",
  "Servicii",
  "Carteluri și licitații",
  "Cercetare",
  "Investiții străine",
  "Direcția teritorială",
  "Analiză și monitorizare",
];

// ── Loading skeleton ───────────────────────────

function Skeleton() {
  return (
    <div className="animate-pulse space-y-2">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-12 rounded-lg bg-white/5" />
      ))}
    </div>
  );
}

// ── Main component ─────────────────────────────

export default function DeciziiConcurentaTable() {
  const [data, setData] = useState<ListResponse | null>(null);
  const [error, setError] = useState(false);
  const [q, setQ] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("q") ?? "";
  });
  const [input, setInput] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("q") ?? "";
  });
  const [categorie, setCategorie] = useState<string>(() => {
    if (typeof window === "undefined") return "Toate";
    const c = new URLSearchParams(window.location.search).get("categorie");
    return c && CATEGORII.includes(c) ? c : "Toate";
  });
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setError(false);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
      });
      if (q) params.set("q", q);
      if (categorie !== "Toate") params.set("categorie", categorie);

      const res = await fetch(`/api/decizii-concurenta?${params}`);
      if (!res.ok) throw new Error("API error");
      const json = (await res.json()) as ListResponse;
      setData(json);
    } catch {
      setError(true);
    }
  }, [q, categorie, page]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQ(input.trim());
    setPage(1);
  };

  const reset = () => {
    setInput("");
    setQ("");
    setCategorie("Toate");
    setPage(1);
  };

  return (
    <div>
      {/* Search + filter row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearch} className="flex flex-1 gap-2 sm:max-w-md">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Caută decizie (ex. concentrare, cartel)..."
            className="w-full rounded-lg border border-border-subtle bg-bg-surface px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-amber-500/50 focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-500"
          >
            Caută
          </button>
        </form>

        <div className="flex items-center gap-2">
          <label className="text-xs text-text-muted">Categorie:</label>
          <select
            value={categorie}
            onChange={(e) => {
              setCategorie(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-border-subtle bg-bg-surface px-3 py-2 text-sm text-text-primary focus:border-amber-500/50 focus:outline-none"
          >
            {CATEGORII.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Result count */}
      {data && (
        <p className="mt-4 text-sm text-text-muted">
          {data.total.toLocaleString("ro-RO")}{" "}
          {data.total === 1 ? "decizie" : "decizii"}
          {q && (
            <>
              {" "}
              pentru „<strong className="text-text-secondary">{q}</strong>"
            </>
          )}
          {categorie !== "Toate" && (
            <>
              {" "}
              · <strong className="text-text-secondary">{categorie}</strong>
            </>
          )}
        </p>
      )}

      {/* Table / states */}
      <div className="mt-3 overflow-hidden rounded-xl border border-border-subtle bg-bg-surface">
        {error ? (
          <div className="p-10 text-center">
            <div className="text-2xl opacity-40">⚠️</div>
            <p className="mt-2 text-sm text-text-muted">
              Nu am putut încărca deciziile. Încearcă din nou.
            </p>
            <button
              onClick={load}
              className="mt-3 rounded-lg border border-border-subtle px-4 py-1.5 text-sm text-text-secondary transition hover:bg-bg-elevated"
            >
              Reîncearcă
            </button>
          </div>
        ) : data === null ? (
          <Skeleton />
        ) : data.hits.length === 0 ? (
          <div className="p-10 text-center">
            <div className="text-2xl opacity-40">🔒</div>
            <p className="mt-2 text-sm text-text-muted">
              Nu am găsit decizii
              {q && (
                <>
                  {" "}
                  pentru „<strong className="text-text-secondary">{q}</strong>"
                </>
              )}
              .
            </p>
            <button
              onClick={reset}
              className="mt-3 rounded-lg border border-border-subtle px-4 py-1.5 text-sm text-text-secondary transition hover:bg-bg-elevated"
            >
              Resetează filtrele
            </button>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border-subtle text-xs uppercase tracking-wider text-text-muted">
                    <th className="px-4 py-3 font-medium">Decizie</th>
                    <th className="px-4 py-3 font-medium">Categorie</th>
                    <th className="px-4 py-3 font-medium">An</th>
                    <th className="px-4 py-3 font-medium text-right">
                      Document
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.hits.map((doc) => (
                    <tr
                      key={doc.id}
                      className="border-b border-border-subtle/50 transition last:border-0 hover:bg-bg-elevated/50"
                    >
                      <td className="px-4 py-3">
                        <a
                          href={doc.url_pdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-text-primary transition hover:text-amber-400"
                        >
                          {doc.titlu}
                        </a>
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-xs text-amber-300">
                          {doc.categorie}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-text-muted">
                        {doc.an ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <a
                          href={doc.url_pdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-full border border-border-subtle px-3 py-1 text-xs text-text-secondary transition hover:bg-bg-elevated hover:text-text-primary"
                          title="Deschide PDF-ul"
                        >
                          PDF ↗
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="divide-y divide-border-subtle md:hidden">
              {data.hits.map((doc) => (
                <a
                  key={doc.id}
                  href={doc.url_pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-3.5 transition hover:bg-bg-elevated/50"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-text-primary">
                      {doc.titlu}
                    </p>
                    <span className="shrink-0 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-xs text-amber-300">
                      {doc.categorie}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-4 text-xs text-text-muted">
                    <span>An: {doc.an ?? "—"}</span>
                    <span className="inline-flex items-center gap-1">
                      PDF ↗
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="rounded-lg border border-border-subtle px-3.5 py-1.5 text-sm text-text-secondary transition enabled:hover:bg-bg-elevated disabled:opacity-40"
          >
            ← Înapoi
          </button>
          <span className="px-3 text-sm text-text-muted">
            Pagina {page} / {data.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
            disabled={page >= data.totalPages}
            className="rounded-lg border border-border-subtle px-3.5 py-1.5 text-sm text-text-secondary transition enabled:hover:bg-bg-elevated disabled:opacity-40"
          >
            Înainte →
          </button>
        </div>
      )}
    </div>
  );
}
