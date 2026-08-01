"use client";

import { useCallback, useEffect, useState } from "react";
import type { BugetStatDoc } from "@/lib/meilisearch";

// ── Types ──────────────────────────────────────

interface BugetListResponse {
  hits: BugetStatDoc[];
  total: number;
  page: number;
  totalPages: number;
}

interface RezumatAn {
  an: number;
  venituri: number | null;
  cheltuieli: number | null;
  deficit: number | null;
}

interface RezumatResponse {
  ani: RezumatAn[];
}

// ── Formatare ──────────────────────────────────

function formatMld(valoareMiiLei: number): string {
  // valoare în mii lei → miliarde lei
  const mld = valoareMiiLei / 1_000_000;
  const abs = Math.abs(mld);
  if (abs >= 1000) return `${(mld / 1000).toLocaleString("ro-RO", { maximumFractionDigits: 2 })} trilioane`;
  if (abs >= 1) return `${mld.toLocaleString("ro-RO", { maximumFractionDigits: 2 })} mld`;
  if (abs >= 0.001) return `${(mld * 1000).toLocaleString("ro-RO", { maximumFractionDigits: 0 })} mil`;
  return `${valoareMiiLei.toLocaleString("ro-RO")} mii`;
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

export default function BugetStatTable() {
  const [data, setData] = useState<BugetListResponse | null>(null);
  const [rezumat, setRezumat] = useState<RezumatAn[]>([]);
  const [error, setError] = useState(false);
  const [q, setQ] = useState("");
  const [input, setInput] = useState("");
  const [tip, setTip] = useState("cheltuieli");
  const [an, setAn] = useState(2025);
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setError(false);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "50",
        tip,
        an: String(an),
      });
      if (q) params.set("q", q);

      const [listRes, rezRes] = await Promise.all([
        fetch(`/api/buget-stat?${params}`),
        fetch("/api/buget-stat/rezumat"),
      ]);
      if (!listRes.ok) throw new Error("API error");
      const json = (await listRes.json()) as BugetListResponse;
      setData(json);
      const rez = (await rezRes.json()) as RezumatResponse;
      setRezumat(rez.ani);
    } catch {
      setError(true);
    }
  }, [q, tip, an, page]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQ(input.trim());
    setPage(1);
  };

  const anCurent = rezumat.find((r) => r.an === an);

  return (
    <div>
      {/* Summary cards */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-4">
          <p className="text-xs uppercase tracking-wider text-text-muted">
            Venituri {an}
          </p>
          <p className="mt-1 text-lg font-bold text-emerald-400">
            {anCurent?.venituri ? formatMld(anCurent.venituri) : "—"}
          </p>
          <p className="text-xs text-text-muted">lei</p>
        </div>
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-4">
          <p className="text-xs uppercase tracking-wider text-text-muted">
            Cheltuieli {an}
          </p>
          <p className="mt-1 text-lg font-bold text-text-primary">
            {anCurent?.cheltuieli ? formatMld(anCurent.cheltuieli) : "—"}
          </p>
          <p className="text-xs text-text-muted">lei</p>
        </div>
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-4">
          <p className="text-xs uppercase tracking-wider text-text-muted">
            Deficit {an}
          </p>
          <p
            className={`mt-1 text-lg font-bold ${
              anCurent?.deficit && anCurent.deficit < 0
                ? "text-red-400"
                : "text-emerald-400"
            }`}
          >
            {anCurent?.deficit ? formatMld(anCurent.deficit) : "—"}
          </p>
          <p className="text-xs text-text-muted">lei</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearch} className="flex flex-1 gap-2 sm:max-w-md">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Caută (ex. învățământ, sănătate, transport)..."
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
          <label className="text-xs text-text-muted">Tip:</label>
          <select
            value={tip}
            onChange={(e) => {
              setTip(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-border-subtle bg-bg-surface px-3 py-2 text-sm text-text-primary focus:border-amber-500/50 focus:outline-none"
          >
            <option value="venituri">Venituri</option>
            <option value="cheltuieli">Cheltuieli</option>
            <option value="deficit">Deficit</option>
          </select>
          <label className="text-xs text-text-muted">An:</label>
          <select
            value={an}
            onChange={(e) => {
              setAn(Number(e.target.value));
              setPage(1);
            }}
            className="rounded-lg border border-border-subtle bg-bg-surface px-3 py-2 text-sm text-text-primary focus:border-amber-500/50 focus:outline-none"
          >
            {[2025, 2024, 2023].map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Result count */}
      {data && (
        <p className="mt-4 text-sm text-text-muted">
          {data.total.toLocaleString("ro-RO")} rânduri
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
              Nu am putut încărca bugetul. Încearcă din nou.
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
            <div className="text-2xl opacity-40">📋</div>
            <p className="mt-2 text-sm text-text-muted">
              Nu am găsit rânduri pentru aceste filtre.
            </p>
            <button
              onClick={() => {
                setInput("");
                setQ("");
                setTip("cheltuieli");
                setAn(2025);
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
                    <th className="px-4 py-3 font-medium">Denumire</th>
                    <th className="px-4 py-3 font-medium">Capitol</th>
                    <th className="px-4 py-3 font-medium">An</th>
                    <th className="px-4 py-3 font-medium text-right">
                      Valoare (lei)
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
                        <span className="font-medium text-text-primary">
                          {doc.denumire}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-text-muted">
                        {doc.capitol}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-text-muted">
                        {doc.an}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-sm font-semibold text-text-primary">
                        {formatMld(doc.valoare)}
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
                  <p className="text-sm font-medium text-text-primary">
                    {doc.denumire}
                  </p>
                  <div className="mt-1 flex items-center justify-between text-xs text-text-muted">
                    <span>
                      Capitol {doc.capitol} · {doc.an}
                    </span>
                    <span className="font-mono text-sm font-semibold text-text-primary">
                      {formatMld(doc.valoare)}
                    </span>
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

      <p className="mt-3 text-xs text-text-muted">
        Sursă: Ministerul Finanțelor (data.gov.ro) — legea bugetară anuală,
        anexa 1 (sinteza). Valori în lei, credite bugetare aprobate.
      </p>
    </div>
  );
}
