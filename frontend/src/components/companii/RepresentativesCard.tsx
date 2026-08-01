"use client";

import { useEffect, useState } from "react";

// ── Types ──────────────────────────────────────

interface RepresentativeDoc {
  id: string;
  cod_inmatriculare: string;
  numar_registru_comert?: string;
  persoana_imputernicita: string;
  calitate: string;
  data_nastere?: string;
  localitate_nastere?: string;
  judet_nastere?: string;
  localitate?: string;
  judet?: string;
  tara?: string;
}

interface ApiResponse {
  hits: RepresentativeDoc[];
  total: number;
  cui: string;
}

// ── Helpers ────────────────────────────────────

function getRoleStyle(calitate: string): string {
  const c = calitate.toLowerCase();
  if (c.includes("administrator")) {
    return "border-indigo-500/20 bg-indigo-500/10 text-indigo-300";
  }
  if (c.includes("asociat") || c.includes("actionar")) {
    return "border-green-500/20 bg-green-500/10 text-green-300";
  }
  if (c.includes("director")) {
    return "border-cyan-500/20 bg-cyan-500/10 text-cyan-300";
  }
  if (c.includes("lichidator") || c.includes("sindic")) {
    return "border-orange-500/20 bg-orange-500/10 text-orange-300";
  }
  return "border-border-subtle bg-bg-surface text-text-secondary";
}

// ── Loading skeleton ───────────────────────────

function Skeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center justify-between gap-4 rounded-lg border border-border-subtle bg-bg-surface/50 p-3.5">
          <div className="space-y-2">
            <div className="h-3.5 w-48 rounded bg-white/10" />
            <div className="h-3 w-24 rounded bg-white/5" />
          </div>
          <div className="h-6 w-28 rounded-full bg-white/10" />
        </div>
      ))}
    </div>
  );
}

// ── Main component ─────────────────────────────

export default function RepresentativesCard({ cui }: { cui: string }) {
  const [data, setData] = useState<RepresentativeDoc[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(
          `/api/companies/${encodeURIComponent(cui)}/reprezentanti`,
        );
        if (!res.ok) throw new Error("API error");
        const json = (await res.json()) as ApiResponse;
        if (!cancelled) setData(json.hits ?? []);
      } catch {
        if (!cancelled) setError(true);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [cui]);

  return (
    <div className="rounded-xl border border-border-subtle bg-bg-surface p-5">
      <h3 className="text-sm font-semibold text-text-primary">
        🧑‍💼 Administratori și Acționari
      </h3>

      <div className="mt-4">
        {error ? (
          <div className="rounded-lg border border-border-subtle border-dashed bg-bg-surface/50 p-6 text-center">
            <div className="text-2xl opacity-40">⚠️</div>
            <p className="mt-2 text-xs text-text-muted">
              Nu am putut încărca reprezentanții legali. Încearcă din nou mai
              târziu.
            </p>
          </div>
        ) : data === null ? (
          <Skeleton />
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-border-subtle border-dashed bg-bg-surface/50 p-6 text-center">
            <div className="text-2xl opacity-40">🧑‍💼</div>
            <p className="mt-2 max-w-xs text-xs leading-relaxed text-text-muted">
              Nu există date despre reprezentanții legali pentru această firmă
              în setul public ONRC.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {data.map((rep) => (
              <li
                key={rep.id}
                className="flex items-center justify-between gap-4 rounded-lg border border-border-subtle bg-bg-surface/50 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-text-primary">
                    {rep.persoana_imputernicita}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-text-muted">
                    {rep.localitate}
                    {rep.judet ? `, ${rep.judet}` : ""}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${getRoleStyle(rep.calitate)}`}
                >
                  {rep.calitate}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
