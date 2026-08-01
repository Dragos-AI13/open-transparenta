"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { IntreprinderePublicaDoc } from "@/lib/meilisearch";

// ── Types ──────────────────────────────────────

interface ListResponse {
  hits: IntreprinderePublicaDoc[];
  total: number;
  page: number;
  totalPages: number;
}

// ── Format helpers ─────────────────────────────

function formatNum(value: number | null | undefined, suffix = ""): string {
  if (value === null || value === undefined) return "—";
  const abs = Math.abs(value);
  if (abs >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(".", ",")}M${suffix}`;
  }
  if (abs >= 1_000) {
    return `${(value / 1_000).toFixed(0).replace(".", ",")}k${suffix}`;
  }
  return `${value.toLocaleString("ro-RO")}${suffix}`;
}

function lastIndicator(
  doc: IntreprinderePublicaDoc,
  key: string,
): number | null {
  if (!doc.indicatori) return null;
  const years = [...doc.ani].sort((a, b) => b - a);
  for (const y of years) {
    const val = doc.indicatori[y]?.[key];
    if (val !== undefined && val !== null) return val;
  }
  return null;
}

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

export default function IntreprinderiPubliceTable() {
  const [data, setData] = useState<ListResponse | null>(null);
  const [error, setError] = useState(false);
  // Citește q din URL la mount (ex. /companii/intreprinderi-publice?q=apa)
  const [q, setQ] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("q") ?? "";
  });
  const [input, setInput] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("q") ?? "";
  });
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<"denumire:asc" | "denumire:desc">(
    "denumire:asc",
  );

  const load = useCallback(async () => {
    setError(false);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
        sort,
      });
      if (q) params.set("q", q);

      const res = await fetch(`/api/intreprinderi-publice?${params}`);
      if (!res.ok) throw new Error("API error");
      const json = (await res.json()) as ListResponse;
      setData(json);
    } catch {
      setError(true);
    }
  }, [q, page, sort]);

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
    setPage(1);
  };

  return (
    <div>
      {/* Search + sort row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearch} className="flex flex-1 gap-2 sm:max-w-md">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Caută după nume sau CUI..."
            className="w-full rounded-lg border border-border-subtle bg-bg-surface px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-indigo-500/50 focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
          >
            Caută
          </button>
        </form>

        <div className="flex items-center gap-2">
          <label className="text-xs text-text-muted">Ordonează:</label>
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value as "denumire:asc" | "denumire:desc");
              setPage(1);
            }}
            className="rounded-lg border border-border-subtle bg-bg-surface px-3 py-2 text-sm text-text-primary focus:border-indigo-500/50 focus:outline-none"
          >
            <option value="denumire:asc">Denumire A-Z</option>
            <option value="denumire:desc">Denumire Z-A</option>
          </select>
        </div>
      </div>

      {/* Result count */}
      {data && (
        <p className="mt-4 text-sm text-text-muted">
          {data.total.toLocaleString("ro-RO")}{" "}
          {data.total === 1 ? "întreprindere publică" : "întreprinderi publice"}
          {q && (
            <>
              {" "}
              pentru „<strong className="text-text-secondary">{q}</strong>"
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
              Nu am putut încărca datele. Încearcă din nou.
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
            <div className="text-2xl opacity-40">🏛️</div>
            <p className="mt-2 text-sm text-text-muted">
              Nu am găsit întreprinderi publice
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
              Resetează căutarea
            </button>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border-subtle text-xs uppercase tracking-wider text-text-muted">
                    <th className="px-4 py-3 font-medium">Denumire</th>
                    <th className="px-4 py-3 font-medium">CUI</th>
                    <th className="px-4 py-3 font-medium">CAEN</th>
                    <th className="px-4 py-3 font-medium text-right">ROE</th>
                    <th className="px-4 py-3 font-medium text-right">EBITDA</th>
                    <th className="px-4 py-3 font-medium text-right">
                      Lichiditate
                    </th>
                    <th className="px-4 py-3 font-medium text-right">Ani</th>
                  </tr>
                </thead>
                <tbody>
                  {data.hits.map((doc) => {
                    const roe = lastIndicator(doc, "ROE");
                    const ebitda = lastIndicator(doc, "EBITDA");
                    const lichid = lastIndicator(
                      doc,
                      "Rata lichiditatii Curente",
                    );
                    return (
                      <tr
                        key={doc.cui}
                        className="border-b border-border-subtle/50 transition last:border-0 hover:bg-bg-elevated/50"
                      >
                        <td className="px-4 py-3">
                          <Link
                            href={`/companii/firma/${doc.cui}`}
                            className="font-medium text-text-primary transition hover:text-indigo-400"
                          >
                            {doc.denumire}
                          </Link>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-text-muted">
                          {doc.cui}
                        </td>
                        <td className="px-4 py-3 text-xs text-text-muted">
                          {doc.caen ? `${doc.caen} ${doc.caen_denumire ?? ""}`.trim().slice(0, 38) : "—"}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-xs">
                          {roe !== null ? (
                            <span className={roe >= 0 ? "text-green-400" : "text-red-400"}>
                              {formatNum(roe, "%")}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-xs text-text-secondary">
                          {formatNum(ebitda)}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-xs text-text-secondary">
                          {formatNum(lichid)}
                        </td>
                        <td className="px-4 py-3 text-right text-xs text-text-muted">
                          {doc.ani?.length ?? 0}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="divide-y divide-border-subtle md:hidden">
              {data.hits.map((doc) => {
                const roe = lastIndicator(doc, "ROE");
                const ebitda = lastIndicator(doc, "EBITDA");
                return (
                  <Link
                    key={doc.cui}
                    href={`/companii/firma/${doc.cui}`}
                    className="block px-4 py-3.5 transition hover:bg-bg-elevated/50"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-text-primary">
                        {doc.denumire}
                      </p>
                      <span className="shrink-0 font-mono text-xs text-text-muted">
                        {doc.cui}
                      </span>
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted">
                      <span>
                        ROE:{" "}
                        <strong className={roe !== null && roe >= 0 ? "text-green-400" : "text-red-400"}>
                          {formatNum(roe, "%")}
                        </strong>
                      </span>
                      <span>
                        EBITDA: <strong className="text-text-secondary">{formatNum(ebitda)}</strong>
                      </span>
                      {doc.caen && <span>CAEN {doc.caen}</span>}
                    </div>
                  </Link>
                );
              })}
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
