"use client";

import { useCallback, useEffect, useState } from "react";
import type { CursValutarDoc } from "@/lib/meilisearch";

// ── Types ──────────────────────────────────────

interface CursResponse {
  hits: CursValutarDoc[];
  total: number;
  latestDate: string | null;
}

// ── Formatare ──────────────────────────────────

function formatRata(rata: number, multiplier: number): string {
  // Valute cu multiplier (HUF, JPY, KRW...) au rate mari — mai puține zecimale
  if (multiplier > 1) {
    return rata.toLocaleString("ro-RO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return rata.toLocaleString("ro-RO", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });
}

function formatData(data: string): string {
  try {
    const [y, m, d] = data.split("-");
    return `${d}.${m}.${y}`;
  } catch {
    return data;
  }
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

export default function CursValutarTable() {
  const [data, setData] = useState<CursResponse | null>(null);
  const [error, setError] = useState(false);
  const [q, setQ] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("q") ?? "";
  });
  const [input, setInput] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("q") ?? "";
  });

  const load = useCallback(async () => {
    setError(false);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      const res = await fetch(`/api/curs-valutar?${params}`);
      if (!res.ok) throw new Error("API error");
      const json = (await res.json()) as CursResponse;
      setData(json);
    } catch {
      setError(true);
    }
  }, [q]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQ(input.trim());
  };

  return (
    <div>
      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 sm:max-w-md">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Caută valută (ex. EUR, dolar, franc)..."
          className="w-full rounded-lg border border-border-subtle bg-bg-surface px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-amber-500/50 focus:outline-none"
        />
        <button
          type="submit"
          className="shrink-0 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-500"
        >
          Caută
        </button>
      </form>

      {/* Status line */}
      {data && (
        <p className="mt-4 text-sm text-text-muted">
          {data.latestDate && (
            <>
              Cursul oficial BNR din{" "}
              <strong className="text-text-secondary">
                {formatData(data.latestDate)}
              </strong>
              {" "}
            </>
          )}
          · {data.total.toLocaleString("ro-RO")} valute
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
              Nu am putut încărca cursul valutar. Încearcă din nou.
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
            <div className="text-2xl opacity-40">💱</div>
            <p className="mt-2 text-sm text-text-muted">
              Nu am găsit valute pentru „
              <strong className="text-text-secondary">{q}</strong>".
            </p>
            <button
              onClick={() => {
                setInput("");
                setQ("");
              }}
              className="mt-3 rounded-lg border border-border-subtle px-4 py-1.5 text-sm text-text-secondary transition hover:bg-bg-elevated"
            >
              Resetează
            </button>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border-subtle text-xs uppercase tracking-wider text-text-muted">
                    <th className="px-4 py-3 font-medium">Valută</th>
                    <th className="px-4 py-3 font-medium">Denumire</th>
                    <th className="px-4 py-3 font-medium text-right">
                      Rata (lei)
                    </th>
                    <th className="px-4 py-3 font-medium text-right">
                      Multiplier
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.hits.map((doc) => (
                    <tr
                      key={doc.id}
                      className={`border-b border-border-subtle/50 transition last:border-0 hover:bg-bg-elevated/50 ${
                        doc.valuta === "EUR" ||
                        doc.valuta === "USD" ||
                        doc.valuta === "CHF" ||
                        doc.valuta === "GBP"
                          ? "bg-amber-500/[0.04]"
                          : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-2">
                          <span className="rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 font-mono text-xs font-bold text-amber-300">
                            {doc.valuta}
                          </span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-text-secondary">
                        {doc.denumire}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-sm font-semibold text-text-primary">
                        {formatRata(doc.rata, doc.multiplier)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-text-muted">
                        {doc.multiplier > 1 ? `× ${doc.multiplier}` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="divide-y divide-border-subtle md:hidden">
              {data.hits.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between px-4 py-3.5"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 font-mono text-xs font-bold text-amber-300">
                        {doc.valuta}
                      </span>
                      {doc.multiplier > 1 && (
                        <span className="text-xs text-text-muted">
                          × {doc.multiplier}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-text-secondary">
                      {doc.denumire}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-base font-semibold text-text-primary">
                      {formatRata(doc.rata, doc.multiplier)}
                    </p>
                    <p className="text-xs text-text-muted">lei</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <p className="mt-3 text-xs text-text-muted">
        Sursă: Banca Națională a României (bnr.ro) — curs de referință, publicat
        zilnic.
      </p>
    </div>
  );
}
