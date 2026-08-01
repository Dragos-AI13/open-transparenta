"use client";

import { useCallback, useEffect, useState } from "react";
import type { TaxaImpozitDoc } from "@/lib/meilisearch";

// ── Types ──────────────────────────────────────

interface TaxeListResponse {
  hits: TaxaImpozitDoc[];
  total: number;
  page: number;
  totalPages: number;
}

interface TrimestruRezumat {
  an: number;
  trimestru: number;
  total: number | null;
  tva: number | null;
  indice_total: number | null;
}

interface RezumatResponse {
  trimestre: TrimestruRezumat[];
}

// ── Formatare ──────────────────────────────────

function formatValoare(valoare: number | null, unitate: string): string {
  if (valoare === null) return "—";
  if (unitate.includes("milioane")) {
    // milioane lei → mld lei (valoare/1000)
    const mld = valoare / 1000;
    if (mld >= 100) return `${mld.toLocaleString("ro-RO", { maximumFractionDigits: 2 })} mld`;
    return `${mld.toLocaleString("ro-RO", { maximumFractionDigits: 2 })} mld`;
  }
  // număr contribuabili
  return valoare.toLocaleString("ro-RO");
}

function formatIndice(indice: number | null): { text: string; cls: string } {
  if (indice === null) return { text: "—", cls: "text-text-muted" };
  const diff = indice - 100;
  if (diff > 0)
    return { text: `▲ ${diff.toLocaleString("ro-RO", { maximumFractionDigits: 1 })}%`, cls: "text-emerald-400" };
  if (diff < 0)
    return { text: `▼ ${Math.abs(diff).toLocaleString("ro-RO", { maximumFractionDigits: 1 })}%`, cls: "text-red-400" };
  return { text: "—", cls: "text-text-muted" };
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

export default function TaxeImpoziteTable() {
  const [data, setData] = useState<TaxeListResponse | null>(null);
  const [rezumat, setRezumat] = useState<TrimestruRezumat[]>([]);
  const [error, setError] = useState(false);
  const [q, setQ] = useState("");
  const [input, setInput] = useState("");
  const [sectiune, setSectiune] = useState("Venituri bugetare");
  const [an, setAn] = useState(2026);
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setError(false);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "50",
        sectiune,
        an: String(an),
      });
      if (q) params.set("q", q);

      const [listRes, rezRes] = await Promise.all([
        fetch(`/api/taxe-impozite?${params}`),
        fetch("/api/taxe-impozite/rezumat"),
      ]);
      if (!listRes.ok) throw new Error("API error");
      const json = (await listRes.json()) as TaxeListResponse;
      setData(json);
      const rez = (await rezRes.json()) as RezumatResponse;
      setRezumat(rez.trimestre);
    } catch {
      setError(true);
    }
  }, [q, sectiune, an, page]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQ(input.trim());
    setPage(1);
  };

  const trimCurent = rezumat.find((t) => t.an === an && t.trimestru === 1);
  const tvaTrim = rezumat.find((t) => t.an === an && t.trimestru === 1);

  return (
    <div>
      {/* Summary cards */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-4">
          <p className="text-xs uppercase tracking-wider text-text-muted">
            Venituri administrate T1 {an}
          </p>
          <p className="mt-1 text-lg font-bold text-emerald-400">
            {trimCurent?.total
              ? `${trimCurent.total.toLocaleString("ro-RO", { maximumFractionDigits: 1 })} mil lei`
              : "—"}
          </p>
          {trimCurent?.indice_total && (
            <p className="mt-0.5 text-xs text-text-muted">
              față de T1 {an - 1}:{" "}
              <span
                className={
                  trimCurent.indice_total >= 100 ? "text-emerald-400" : "text-red-400"
                }
              >
                {trimCurent.indice_total >= 100 ? "▲" : "▼"}{" "}
                {Math.abs(trimCurent.indice_total - 100).toLocaleString("ro-RO", {
                  maximumFractionDigits: 1,
                })}
                %
              </span>
            </p>
          )}
        </div>
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-4">
          <p className="text-xs uppercase tracking-wider text-text-muted">
            TVA încasată T1 {an}
          </p>
          <p className="mt-1 text-lg font-bold text-text-primary">
            {tvaTrim?.tva
              ? `${tvaTrim.tva.toLocaleString("ro-RO", { maximumFractionDigits: 1 })} mil lei`
              : "—"}
          </p>
          <p className="mt-0.5 text-xs text-text-muted">milioane lei</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearch} className="flex flex-1 gap-2 sm:max-w-md">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Caută (ex. TVA, profit, accize)..."
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
          <label className="text-xs text-text-muted">Secțiune:</label>
          <select
            value={sectiune}
            onChange={(e) => {
              setSectiune(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-border-subtle bg-bg-surface px-3 py-2 text-sm text-text-primary focus:border-amber-500/50 focus:outline-none"
          >
            <option value="Venituri bugetare">Venituri bugetare</option>
            <option value="Contribuabili înregistrați">Contribuabili</option>
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
            {[2026, 2025, 2024].map((a) => (
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
          {data.total.toLocaleString("ro-RO")} indicatori
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
              Nu am putut încărca datele fiscale. Încearcă din nou.
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
            <div className="text-2xl opacity-40">💳</div>
            <p className="mt-2 text-sm text-text-muted">
              Nu am găsit indicatori pentru aceste filtre.
            </p>
            <button
              onClick={() => {
                setInput("");
                setQ("");
                setSectiune("Venituri bugetare");
                setAn(2026);
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
                    <th className="px-4 py-3 font-medium">Indicator</th>
                    <th className="px-4 py-3 font-medium">An</th>
                    <th className="px-4 py-3 font-medium text-right">
                      Trim. curent
                    </th>
                    <th className="px-4 py-3 font-medium text-right">
                      Trim. anterior
                    </th>
                    <th className="px-4 py-3 font-medium text-right">
                      Evoluție
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.hits.map((doc) => {
                    const evol = formatIndice(doc.indice);
                    return (
                      <tr
                        key={doc.id}
                        className="border-b border-border-subtle/50 transition last:border-0 hover:bg-bg-elevated/50"
                      >
                        <td className="px-4 py-3">
                          <span className="font-medium text-text-primary">
                            {doc.indicator}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-text-muted">
                          {doc.an} T{doc.trimestru}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-sm font-semibold text-text-primary">
                          {formatValoare(doc.valoare_curent, doc.unitate)}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-sm text-text-muted">
                          {formatValoare(doc.valoare_anterior, doc.unitate)}
                        </td>
                        <td className={`px-4 py-3 text-right font-mono text-sm ${evol.cls}`}>
                          {evol.text}
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
                const evol = formatIndice(doc.indice);
                return (
                  <div key={doc.id} className="px-4 py-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-text-primary">
                        {doc.indicator}
                      </p>
                      <span
                        className={`shrink-0 font-mono text-xs ${evol.cls}`}
                      >
                        {evol.text}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-xs text-text-muted">
                      <span>
                        {doc.an} T{doc.trimestru}
                      </span>
                      <span className="font-mono text-sm font-semibold text-text-primary">
                        {formatValoare(doc.valoare_curent, doc.unitate)}
                      </span>
                    </div>
                  </div>
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

      <p className="mt-3 text-xs text-text-muted">
        Sursă: ANAF — Buletin statistic fiscal (data.gov.ro, trimestrial).
        Venituri în milioane lei; evoluția = trim. curent față de trim.
        corespunzător anului anterior.
      </p>
    </div>
  );
}
