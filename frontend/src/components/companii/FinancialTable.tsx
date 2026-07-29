"use client";

import type { FinancialData } from "@/lib/financiar";

// ── Format helpers ────────────────────────────

function formatRON(value: number | undefined | null): string {
  if (value === null || value === undefined) return "—";
  const abs = Math.abs(value);
  const prefix = value < 0 ? "−" : "";
  if (abs >= 1_000_000) {
    return `${prefix}${(abs / 1_000_000).toFixed(1).replace(".", ",")}M`;
  }
  if (abs >= 1_000) {
    return `${prefix}${(abs / 1_000).toFixed(0).replace(".", ",")}k`;
  }
  return `${prefix}${value.toLocaleString("ro-RO")}`;
}

function getTrend(current: number | undefined, previous: number | undefined): "up" | "down" | "same" | null {
  if (current == null || previous == null || previous === 0) return null;
  const diff = current - previous;
  const pct = diff / Math.abs(previous);
  if (pct > 0.01) return "up";
  if (pct < -0.01) return "down";
  return "same";
}

// ── Indicators to display ─────────────────────

interface IndicatorDef {
  key: keyof FinancialData;
  label: string;
  goodWhen: "up" | "down" | null; // null = neutral
}

const INDICATORS: IndicatorDef[] = [
  { key: "cifra_afaceri", label: "Cifra de afaceri", goodWhen: "up" },
  { key: "profit_net", label: "Profit net", goodWhen: "up" },
  { key: "pierdere_neta", label: "Pierdere netă", goodWhen: "down" },
  { key: "active_imobilizate", label: "Active imobilizate", goodWhen: null },
  { key: "active_circulante", label: "Active circulante", goodWhen: null },
  { key: "datorii", label: "Datorii", goodWhen: "down" },
  { key: "capitaluri_proprii", label: "Capitaluri proprii", goodWhen: "up" },
  { key: "numar_salariati", label: "Nr. salariați", goodWhen: "up" },
];

// ── Trend icon ─────────────────────────────────

function TrendIcon({
  trend,
  goodWhen,
}: {
  trend: "up" | "down" | "same" | null;
  goodWhen: "up" | "down" | null;
}) {
  if (!trend) return null;
  const isGood = trend === goodWhen || goodWhen === null;
  const color = isGood ? "text-green-400" : "text-red-400";

  if (trend === "up") return <span className={color}>▲</span>;
  if (trend === "down") return <span className={color}>▼</span>;
  return <span className="text-text-muted">➡</span>;
}

// ── Component ─────────────────────────────────

export default function FinancialTable({
  data,
}: {
  data: FinancialData[];
}) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-xl border border-border-subtle border-dashed bg-bg-surface/50 p-6 text-center">
        <div className="text-2xl">📊</div>
        <h3 className="mt-2 text-sm font-semibold text-text-primary">
          Situații Financiare
        </h3>
        <p className="mt-1 text-xs text-text-muted">
          Date financiare indisponibile pentru această firmă
        </p>
      </div>
    );
  }

  const years = [...new Set(data.map((d) => d.an))].sort((a, b) => a - b);

  return (
    <div className="rounded-xl border border-border-subtle bg-bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">
          📊 Situații Financiare
        </h3>
        <span className="text-xs text-text-muted">
          {years.length} an{years.length !== 1 ? "i" : ""}
        </span>
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border-subtle">
              <th className="pb-2 pr-4 text-xs font-medium uppercase tracking-wider text-text-muted">
                Indicator
              </th>
              {years.map((year) => (
                <th
                  key={year}
                  className="pb-2 px-3 text-right text-xs font-medium text-text-muted"
                >
                  {year}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {INDICATORS.map((ind) => {
              // Get values per year
              const values: (number | undefined)[] = years.map((year) => {
                const entry = data.find((d) => d.an === year);
                return entry?.[ind.key] as number | undefined;
              });

              const lastIdx = values.length - 1;
              const hasAnyData = values.some((v) => v != null);

              if (!hasAnyData) return null;

              return (
                <tr
                  key={ind.key}
                  className="border-b border-border-subtle last:border-0 hover:bg-bg-elevated/50"
                >
                  <td className="py-2.5 pr-4 text-text-secondary whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span>{ind.label}</span>
                      {getTrend(values[lastIdx], values[lastIdx - 1]) && (
                        <TrendIcon
                          trend={getTrend(values[lastIdx], values[lastIdx - 1])}
                          goodWhen={ind.goodWhen}
                        />
                      )}
                    </div>
                  </td>
                  {values.map((val, i) => {
                    const prevVal = i > 0 ? values[i - 1] : undefined;
                    const trend = getTrend(val, prevVal);
                    const isGood = trend === ind.goodWhen || ind.goodWhen === null;

                    return (
                      <td
                        key={i}
                        className={`py-2.5 px-3 text-right font-mono text-sm transition-colors ${
                          trend
                            ? isGood
                              ? "text-green-400"
                              : "text-red-400"
                            : "text-text-primary"
                        }`}
                      >
                        {formatRON(val)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 sm:hidden">
        {INDICATORS.map((ind) => {
          const values: (number | undefined)[] = years.map((year) => {
            const entry = data.find((d) => d.an === year);
            return entry?.[ind.key] as number | undefined;
          });

          const hasAnyData = values.some((v) => v != null);
          if (!hasAnyData) return null;

          return (
            <div key={ind.key} className="rounded-lg bg-bg-elevated p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-text-secondary">
                  {ind.label}
                </span>
                {getTrend(values[values.length - 1], values[values.length - 2]) && (
                  <TrendIcon
                    trend={getTrend(values[values.length - 1], values[values.length - 2])}
                    goodWhen={ind.goodWhen}
                  />
                )}
              </div>
              <div className="mt-1 flex flex-wrap gap-3">
                {years.map((year, i) => (
                  <div key={year} className="text-right">
                    <div className="text-xs text-text-muted">{year}</div>
                    <div className="font-mono text-sm text-text-primary">
                      {formatRON(values[i])}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
