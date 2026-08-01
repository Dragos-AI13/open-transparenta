"use client";

import { useCallback, useEffect, useState } from "react";
import type { BacalaureatDoc } from "@/lib/meilisearch";

// ── Types ──────────────────────────────────────

interface BacResponse {
  hits: BacalaureatDoc[];
  total: number;
  page: number;
  totalPages: number;
  facetJudete: Record<string, number>;
}

interface TopJudet {
  judet: string;
  candidati: number;
  prezenti: number;
  promovati: number;
  rata: number;
}

interface RezumatResponse {
  candidati: number;
  prezenti: number;
  promovati: number;
  rataNationala: number;
  topJudete: TopJudet[];
  sesiune: string;
}

// ── Formatare ──────────────────────────────────

function rataCuloare(rata: number): string {
  if (rata >= 70) return "text-emerald-400";
  if (rata >= 50) return "text-amber-400";
  return "text-red-400";
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

export default function BacalaureatTable() {
  const [data, setData] = useState<BacResponse | null>(null);
  const [rezumat, setRezumat] = useState<RezumatResponse | null>(null);
  const [error, setError] = useState(false);
  const [q, setQ] = useState("");
  const [input, setInput] = useState("");
  const [judet, setJudet] = useState("");
  const [minCand, setMinCand] = useState(10); // ignoră școlile cu puțini candidați
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setError(false);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "50",
        minCand: String(minCand),
      });
      if (q) params.set("q", q);
      if (judet) params.set("judet", judet);

      const [listRes, rezRes] = await Promise.all([
        fetch(`/api/bacalaureat?${params}`),
        fetch("/api/bacalaureat/rezumat"),
      ]);
      if (!listRes.ok) throw new Error("API error");
      const json = (await listRes.json()) as BacResponse;
      setData(json);
      const rez = (await rezRes.json()) as RezumatResponse;
      setRezumat(rez);
    } catch {
      setError(true);
    }
  }, [q, judet, minCand, page]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQ(input.trim());
    setPage(1);
  };

  const judete = data?.facetJudete ?? {};
  const judeteSortate = Object.keys(judete).sort((a, b) =>
    a.localeCompare(b, "ro"),
  );

  return (
    <div>
      {/* Summary cards */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-4">
          <p className="text-xs uppercase tracking-wider text-text-muted">
            Rată națională de promovare
          </p>
          <p className={`mt-1 text-lg font-bold ${rataCuloare(rezumat?.rataNationala ?? 0)}`}>
            {rezumat ? `${rezumat.rataNationala.toLocaleString("ro-RO", { maximumFractionDigits: 1 })}%` : "—"}
          </p>
          <p className="mt-0.5 text-xs text-text-muted">
            {rezumat?.sesiune || ""}
          </p>
        </div>
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-4">
          <p className="text-xs uppercase tracking-wider text-text-muted">
            Candidați prezenți
          </p>
          <p className="mt-1 text-lg font-bold text-text-primary">
            {rezumat ? `${rezumat.prezenti.toLocaleString("ro-RO")} prezenți` : "—"}
          </p>
          <p className="mt-0.5 text-xs text-text-muted">
            {rezumat
              ? `${rezumat.promovati.toLocaleString("ro-RO")} promovați`
              : ""}
          </p>
        </div>
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-4">
          <p className="text-xs uppercase tracking-wider text-text-muted">
            Top județ (rată)
          </p>
          <p className="mt-1 text-lg font-bold text-emerald-400">
            {rezumat?.topJudete?.[0]
              ? `${rezumat.topJudete[0].judet} — ${rezumat.topJudete[0].rata.toLocaleString("ro-RO", { maximumFractionDigits: 1 })}%`
              : "—"}
          </p>
          <p className="mt-0.5 text-xs text-text-muted">
            {rezumat?.topJudete?.[1]
              ? `2. ${rezumat.topJudete[1].judet} (${rezumat.topJudete[1].rata.toLocaleString("ro-RO", { maximumFractionDigits: 1 })}%)`
              : ""}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearch} className="flex flex-1 gap-2 sm:max-w-md">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Caută școală, județ, localitate..."
            className="w-full rounded-lg border border-border-subtle bg-bg-surface px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-blue-500/50 focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
          >
            Caută
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs text-text-muted">Județ:</label>
          <select
            value={judet}
            onChange={(e) => {
              setJudet(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-border-subtle bg-bg-surface px-3 py-2 text-sm text-text-primary focus:border-blue-500/50 focus:outline-none"
          >
            <option value="">Toate</option>
            {judeteSortate.map((j) => (
              <option key={j} value={j}>
                {j}
              </option>
            ))}
          </select>
          <label className="text-xs text-text-muted">Min candidați:</label>
          <select
            value={minCand}
            onChange={(e) => {
              setMinCand(Number(e.target.value));
              setPage(1);
            }}
            className="rounded-lg border border-border-subtle bg-bg-surface px-3 py-2 text-sm text-text-primary focus:border-blue-500/50 focus:outline-none"
          >
            <option value={1}>Toți</option>
            <option value={10}>≥ 10</option>
            <option value={30}>≥ 30</option>
            <option value={50}>≥ 50</option>
          </select>
        </div>
      </div>

      {/* Result count */}
      {data && (
        <p className="mt-4 text-sm text-text-muted">
          {data.total.toLocaleString("ro-RO")} școli
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
              Nu am putut încărca rezultatele la bacalaureat. Încearcă din nou.
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
            <div className="text-2xl opacity-40">📝</div>
            <p className="mt-2 text-sm text-text-muted">
              Nu am găsit școli pentru aceste filtre.
            </p>
            <button
              onClick={() => {
                setInput("");
                setQ("");
                setJudet("");
                setMinCand(10);
                setPage(1);
              }}
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
                    <th className="px-4 py-3 font-medium">Școală</th>
                    <th className="px-4 py-3 font-medium">Județ</th>
                    <th className="px-4 py-3 text-right font-medium">Candidați</th>
                    <th className="px-4 py-3 text-right font-medium">Prezenți</th>
                    <th className="px-4 py-3 text-right font-medium">Promovați</th>
                    <th className="px-4 py-3 text-right font-medium">Rată</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {data.hits.map((doc) => (
                    <tr key={doc.id} className="transition hover:bg-bg-elevated/50">
                      <td className="max-w-[280px] px-4 py-3">
                        <p className="font-medium leading-snug text-text-primary">
                          {doc.denumire || doc.siiir}
                        </p>
                        {doc.localitate && (
                          <p className="mt-0.5 text-xs text-text-muted">
                            {doc.localitate}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-blue-400">
                          {doc.judet}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-text-secondary">
                        {doc.candidati.toLocaleString("ro-RO")}
                      </td>
                      <td className="px-4 py-3 text-right text-text-secondary">
                        {doc.prezenti.toLocaleString("ro-RO")}
                      </td>
                      <td className="px-4 py-3 text-right text-text-secondary">
                        {doc.promovati.toLocaleString("ro-RO")}
                      </td>
                      <td className={`px-4 py-3 text-right font-mono font-semibold ${rataCuloare(doc.rata_promovare)}`}>
                        {doc.rata_promovare.toLocaleString("ro-RO", { maximumFractionDigits: 1 })}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="divide-y divide-border-subtle md:hidden">
              {data.hits.map((doc) => (
                <div key={doc.id} className="px-4 py-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium leading-snug text-text-primary">
                      {doc.denumire || doc.siiir}
                    </p>
                    <span
                      className={`shrink-0 font-mono text-sm font-bold ${rataCuloare(doc.rata_promovare)}`}
                    >
                      {doc.rata_promovare.toLocaleString("ro-RO", { maximumFractionDigits: 1 })}%
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-text-muted">
                    <span>
                      {doc.judet_nume || doc.judet}
                      {doc.localitate ? ` · ${doc.localitate}` : ""}
                    </span>
                    <span>{doc.candidati} candidați</span>
                  </div>
                </div>
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
