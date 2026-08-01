"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReteaScolaraDoc } from "@/lib/meilisearch";

// ── Types ──────────────────────────────────────

interface ReteaResponse {
  hits: ReteaScolaraDoc[];
  total: number;
  page: number;
  totalPages: number;
  facetJudete: Record<string, number>;
  facetMediu: Record<string, number>;
}

interface RezumatResponse {
  totalUnitati: number;
  totalJudete: number;
  urban: number;
  rural: number;
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

export default function ReteaScolaraTable() {
  const [data, setData] = useState<ReteaResponse | null>(null);
  const [rezumat, setRezumat] = useState<RezumatResponse | null>(null);
  const [error, setError] = useState(false);
  const [q, setQ] = useState("");
  const [input, setInput] = useState("");
  const [judet, setJudet] = useState("");
  const [mediu, setMediu] = useState("");
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setError(false);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "50" });
      if (q) params.set("q", q);
      if (judet) params.set("judet", judet);
      if (mediu) params.set("mediu", mediu);

      const [listRes, rezRes] = await Promise.all([
        fetch(`/api/retea-scolara?${params}`),
        fetch("/api/retea-scolara/rezumat"),
      ]);
      if (!listRes.ok) throw new Error("API error");
      const json = (await listRes.json()) as ReteaResponse;
      setData(json);
      const rez = (await rezRes.json()) as RezumatResponse;
      setRezumat(rez);
    } catch {
      setError(true);
    }
  }, [q, judet, mediu, page]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQ(input.trim());
    setPage(1);
  };

  const judete = data?.facetJudete ?? {};
  const judeteSortate = Object.entries(judete)
    .sort((a, b) => b[1] - a[1])
    .map(([n]) => n);

  return (
    <div>
      {/* Summary cards */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-4">
          <p className="text-xs uppercase tracking-wider text-text-muted">
            Unități de învățământ
          </p>
          <p className="mt-1 text-lg font-bold text-text-primary">
            {rezumat
              ? `${rezumat.totalUnitati.toLocaleString("ro-RO")} unități`
              : "—"}
          </p>
          <p className="mt-0.5 text-xs text-text-muted">
            an școlar 2025-2026
          </p>
        </div>
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-4">
          <p className="text-xs uppercase tracking-wider text-text-muted">
            Mediu urban
          </p>
          <p className="mt-1 text-lg font-bold text-blue-400">
            {rezumat ? `${rezumat.urban.toLocaleString("ro-RO")} unități` : "—"}
          </p>
          <p className="mt-0.5 text-xs text-text-muted">
            {rezumat && rezumat.totalUnitati
              ? `${((rezumat.urban / rezumat.totalUnitati) * 100).toLocaleString("ro-RO", { maximumFractionDigits: 1 })}% din total`
              : ""}
          </p>
        </div>
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-4">
          <p className="text-xs uppercase tracking-wider text-text-muted">
            Mediu rural
          </p>
          <p className="mt-1 text-lg font-bold text-emerald-400">
            {rezumat ? `${rezumat.rural.toLocaleString("ro-RO")} unități` : "—"}
          </p>
          <p className="mt-0.5 text-xs text-text-muted">
            {rezumat ? `${rezumat.totalJudete} județe acoperite` : ""}
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
            placeholder="Caută școală, localitate, județ..."
            className="w-full rounded-lg border border-border-subtle bg-bg-surface px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-blue-500/50 focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
          >
            Caută
          </button>
        </form>

        <div className="flex items-center gap-2">
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
          <label className="text-xs text-text-muted">Mediu:</label>
          <select
            value={mediu}
            onChange={(e) => {
              setMediu(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-border-subtle bg-bg-surface px-3 py-2 text-sm text-text-primary focus:border-blue-500/50 focus:outline-none"
          >
            <option value="">Toate</option>
            <option value="URBAN">Urban</option>
            <option value="RURAL">Rural</option>
          </select>
        </div>
      </div>

      {/* Result count */}
      {data && (
        <p className="mt-4 text-sm text-text-muted">
          {data.total.toLocaleString("ro-RO")} unități
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
              Nu am putut încărca rețeaua școlară. Încearcă din nou.
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
            <div className="text-2xl opacity-40">🏫</div>
            <p className="mt-2 text-sm text-text-muted">
              Nu am găsit unități pentru aceste filtre.
            </p>
            <button
              onClick={() => {
                setInput("");
                setQ("");
                setJudet("");
                setMediu("");
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
                    <th className="px-4 py-3 font-medium">Unitate</th>
                    <th className="px-4 py-3 font-medium">Județ</th>
                    <th className="px-4 py-3 font-medium">Localitate</th>
                    <th className="px-4 py-3 font-medium">Mediu</th>
                    <th className="px-4 py-3 font-medium">Tip</th>
                    <th className="px-4 py-3 font-medium">Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {data.hits.map((doc) => (
                    <tr key={doc.id} className="transition hover:bg-bg-elevated/50">
                      <td className="max-w-[260px] px-4 py-3">
                        <p className="font-medium leading-snug text-text-primary">
                          {doc.denumire}
                        </p>
                        {doc.adresa && (
                          <p className="mt-0.5 text-xs text-text-muted">
                            {doc.adresa}
                            {doc.cod_postal ? `, ${doc.cod_postal}` : ""}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-blue-400">
                          {doc.judet}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-text-secondary">
                        {doc.localitate ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            doc.mediu === "URBAN"
                              ? "text-blue-400"
                              : doc.mediu === "RURAL"
                                ? "text-emerald-400"
                                : "text-text-muted"
                          }
                        >
                          {doc.mediu ? doc.mediu.toLowerCase() : "—"}
                        </span>
                      </td>
                      <td className="max-w-[140px] truncate px-4 py-3 text-text-secondary">
                        {doc.tip ?? "—"}
                      </td>
                      <td className="max-w-[180px] px-4 py-3 text-xs text-text-secondary">
                        {doc.email && (
                          <a
                            href={`mailto:${doc.email}`}
                            className="block truncate text-blue-400 hover:underline"
                          >
                            {doc.email}
                          </a>
                        )}
                        {doc.telefon && (
                          <span className="mt-0.5 block truncate text-text-muted">
                            {doc.telefon}
                          </span>
                        )}
                        {!doc.email && !doc.telefon && "—"}
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
                      {doc.denumire}
                    </p>
                    <span className="shrink-0 rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium uppercase text-blue-400">
                      {doc.judet}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-text-muted">
                    <span>
                      {doc.localitate ?? "—"}
                      {doc.mediu ? ` · ${doc.mediu.toLowerCase()}` : ""}
                    </span>
                    <span className="truncate pl-3 text-blue-400">
                      {doc.email ?? ""}
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
