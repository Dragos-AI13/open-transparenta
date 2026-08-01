"use client";

import { useCallback, useEffect, useState } from "react";
import type { AbsorbtieFondDoc, ProiectFondDoc } from "@/lib/meilisearch";

// ── Types ──────────────────────────────────────

interface ProiecteResponse {
  hits: ProiectFondDoc[];
  total: number;
  page: number;
  totalPages: number;
}

interface RezumatResponse {
  totalProiecte: number;
  totalValoare: number;
  totalPlati: number;
  absorbtiePePrograme: AbsorbtieFondDoc[];
  perioada: string;
}

// Culori badge per program
const PROGRAM_COLORS: Record<string, string> = {
  POIM: "border-indigo-500/20 bg-indigo-500/10 text-indigo-400",
  POC: "border-cyan-500/20 bg-cyan-500/10 text-cyan-400",
  POCU: "border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-400",
  POR: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  POAT: "border-amber-500/20 bg-amber-500/10 text-amber-400",
  POAD: "border-rose-500/20 bg-rose-500/10 text-rose-400",
  POCA: "border-blue-500/20 bg-blue-500/10 text-blue-400",
};

const PROGRAM_NAMES: Record<string, string> = {
  POIM: "PO Infrastructură Mare",
  POC: "PO Competitivitate",
  POCU: "PO Capital Uman",
  POR: "PO Regional",
  POAT: "PO Asistență Tehnică",
  POAD: "PO Ajutorarea persoanelor defavorizate",
  POCA: "PO Capacitate Administrativă",
};

// ── Formatare ──────────────────────────────────

function formatLei(valoare: number | null): string {
  if (valoare === null) return "—";
  if (valoare >= 1e9)
    return `${(valoare / 1e9).toLocaleString("ro-RO", { maximumFractionDigits: 2 })} mld RON`;
  if (valoare >= 1e6)
    return `${(valoare / 1e6).toLocaleString("ro-RO", { maximumFractionDigits: 2 })} mil RON`;
  return `${valoare.toLocaleString("ro-RO", { maximumFractionDigits: 0 })} RON`;
}

function formatEur(valoare: number | null): string {
  if (valoare === null) return "—";
  if (valoare >= 1e9)
    return `${(valoare / 1e9).toLocaleString("ro-RO", { maximumFractionDigits: 2 })} mld €`;
  if (valoare >= 1e6)
    return `${(valoare / 1e6).toLocaleString("ro-RO", { maximumFractionDigits: 2 })} mil €`;
  return `${valoare.toLocaleString("ro-RO", { maximumFractionDigits: 0 })} €`;
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

export default function ProiecteFonduriTable() {
  const [data, setData] = useState<ProiecteResponse | null>(null);
  const [rezumat, setRezumat] = useState<RezumatResponse | null>(null);
  const [error, setError] = useState(false);
  const [q, setQ] = useState("");
  const [input, setInput] = useState("");
  const [program, setProgram] = useState("");
  const [judet, setJudet] = useState("");
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setError(false);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "50",
      });
      if (q) params.set("q", q);
      if (program) params.set("program", program);
      if (judet) params.set("judet", judet);

      const [listRes, rezRes] = await Promise.all([
        fetch(`/api/proiecte-fonduri?${params}`),
        fetch("/api/proiecte-fonduri/rezumat"),
      ]);
      if (!listRes.ok) throw new Error("API error");
      const json = (await listRes.json()) as ProiecteResponse;
      setData(json);
      const rez = (await rezRes.json()) as RezumatResponse;
      setRezumat(rez);
    } catch {
      setError(true);
    }
  }, [q, program, judet, page]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQ(input.trim());
    setPage(1);
  };

  const absorbtieTotal = rezumat?.absorbtiePePrograme ?? [];

  return (
    <div>
      {/* Summary cards */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-4">
          <p className="text-xs uppercase tracking-wider text-text-muted">
            Proiecte contractate
          </p>
          <p className="mt-1 text-lg font-bold text-text-primary">
            {rezumat
              ? `${rezumat.totalProiecte.toLocaleString("ro-RO")} proiecte`
              : "—"}
          </p>
          <p className="mt-0.5 text-xs text-text-muted">
            pe 7 programe operaționale
          </p>
        </div>
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-4">
          <p className="text-xs uppercase tracking-wider text-text-muted">
            Valoare totală contractată
          </p>
          <p className="mt-1 text-lg font-bold text-emerald-400">
            {formatLei(rezumat?.totalValoare ?? null)}
          </p>
          <p className="mt-0.5 text-xs text-text-muted">
            plăți: {formatLei(rezumat?.totalPlati ?? null)}
          </p>
        </div>
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-4">
          <p className="text-xs uppercase tracking-wider text-text-muted">
            Raportare absorbție
          </p>
          <p className="mt-1 text-lg font-bold text-text-primary">
            {rezumat?.perioada || "—"}
          </p>
          <p className="mt-0.5 text-xs text-text-muted">
            {absorbtieTotal.length} programe raportate
          </p>
        </div>
      </div>

      {/* Absorbție bars */}
      {absorbtieTotal.length > 0 && (
        <div className="mb-5 rounded-xl border border-border-subtle bg-bg-surface p-4">
          <p className="mb-3 text-xs uppercase tracking-wider text-text-muted">
            Stadiul absorbției fondurilor europene ({rezumat?.perioada})
          </p>
          <div className="space-y-2.5">
            {absorbtieTotal.slice(0, 6).map((a) => {
              const pct = Math.min(100, a.absorbtie_pct ?? 0);
              return (
                <div key={a.id} className="flex items-center gap-3">
                  <span className="w-44 shrink-0 truncate text-xs text-text-secondary">
                    {a.program.replace(/\*+$/, "")}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-amber-500/80"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-20 shrink-0 text-right font-mono text-xs text-text-primary">
                    {a.absorbtie_pct?.toLocaleString("ro-RO", { maximumFractionDigits: 1 }) ?? "—"}%
                  </span>
                  <span className="hidden w-24 shrink-0 text-right text-xs text-text-muted sm:block">
                    {formatEur(a.plati)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearch} className="flex flex-1 gap-2 sm:max-w-md">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Caută proiect, beneficiar, județ..."
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
          <label className="text-xs text-text-muted">Program:</label>
          <select
            value={program}
            onChange={(e) => {
              setProgram(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-border-subtle bg-bg-surface px-3 py-2 text-sm text-text-primary focus:border-amber-500/50 focus:outline-none"
          >
            <option value="">Toate</option>
            {Object.keys(PROGRAM_COLORS).map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <label className="text-xs text-text-muted">Județ:</label>
          <select
            value={judet}
            onChange={(e) => {
              setJudet(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-border-subtle bg-bg-surface px-3 py-2 text-sm text-text-primary focus:border-amber-500/50 focus:outline-none"
          >
            <option value="">Toate</option>
            {[
              "Alba", "Arad", "Argeș", "Bacău", "Bihor", "Bistrița-Năsăud", "Botoșani",
              "Brașov", "Brăila", "București", "Buzău", "Caraș-Severin", "Cluj",
              "Constanța", "Covasna", "Dâmbovița", "Dolj", "Galați", "Giurgiu",
              "Gorj", "Harghita", "Hunedoara", "Ialomița", "Iași", "Ilfov",
              "Maramureș", "Mehedinți", "Mureș", "Neamț", "Olt", "Prahova",
              "Satu Mare", "Sălaj", "Sibiu", "Suceava", "Teleorman", "Timiș",
              "Tulcea", "Vâlcea", "Vaslui", "Vrancea",
            ].map((j) => (
              <option key={j} value={j}>
                {j}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Result count */}
      {data && (
        <p className="mt-4 text-sm text-text-muted">
          {data.total.toLocaleString("ro-RO")} proiecte
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
              Nu am putut încărca proiectele. Încearcă din nou.
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
            <div className="text-2xl opacity-40">🏗️</div>
            <p className="mt-2 text-sm text-text-muted">
              Nu am găsit proiecte pentru aceste filtre.
            </p>
            <button
              onClick={() => {
                setInput("");
                setQ("");
                setProgram("");
                setJudet("");
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
                    <th className="px-4 py-3 font-medium">Proiect</th>
                    <th className="px-4 py-3 font-medium">Program</th>
                    <th className="px-4 py-3 font-medium">Beneficiar</th>
                    <th className="px-4 py-3 font-medium">Județ</th>
                    <th className="px-4 py-3 text-right font-medium">Valoare</th>
                    <th className="px-4 py-3 font-medium">Stadiu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {data.hits.map((doc) => (
                    <tr key={doc.id} className="transition hover:bg-bg-elevated/50">
                      <td className="max-w-[300px] px-4 py-3">
                        <p className="font-medium leading-snug text-text-primary">
                          {doc.titlu}
                        </p>
                        {doc.smis && (
                          <p className="mt-0.5 font-mono text-[11px] text-text-muted">
                            SMIS {doc.smis}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                            PROGRAM_COLORS[doc.program] ??
                            "border-border-subtle bg-white/5 text-text-muted"
                          }`}
                        >
                          {doc.program}
                        </span>
                      </td>
                      <td className="max-w-[160px] truncate px-4 py-3 text-text-secondary">
                        {doc.beneficiar ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-text-secondary">
                        {doc.judet ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-text-primary">
                        {formatLei(doc.valoare_totala)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            doc.stadiu?.toLowerCase().includes("finalizat")
                              ? "text-emerald-400"
                              : doc.stadiu
                                ? "text-amber-400"
                                : "text-text-muted"
                          }
                        >
                          {doc.stadiu ?? "—"}
                        </span>
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
                      {doc.titlu}
                    </p>
                    <span
                      className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase ${
                        PROGRAM_COLORS[doc.program] ??
                        "border-border-subtle bg-white/5 text-text-muted"
                      }`}
                    >
                      {doc.program}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-text-muted">
                    <span>
                      {doc.beneficiar ?? "—"}
                      {doc.judet ? ` · ${doc.judet}` : ""}
                    </span>
                    <span className="font-mono text-sm font-semibold text-text-primary">
                      {formatLei(doc.valoare_totala)}
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
    </div>
  );
}
