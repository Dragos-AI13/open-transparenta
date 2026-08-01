"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { ChartOptions } from "chart.js";
import type { IntreprinderePublicaDoc } from "@/lib/meilisearch";

// ── Register Chart.js (idempotent, sigur chiar dacă FinancialCharts deja a registrat) ──

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

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

function getTrend(
  values: (number | null | undefined)[],
): "up" | "down" | "same" | null {
  const nums = values.filter((v): v is number => v != null);
  if (nums.length < 2) return null;
  const last = nums[nums.length - 1];
  const prev = nums[nums.length - 2];
  if (prev === 0) return null;
  const pct = (last - prev) / Math.abs(prev);
  if (pct > 0.02) return "up";
  if (pct < -0.02) return "down";
  return "same";
}

// ── Indicator definitions ──────────────────────

const INDICATORS: { key: string; label: string; suffix: string; goodWhen: "up" | "down" | null }[] = [
  { key: "ROE", label: "ROE (rentabilitate)", suffix: "%", goodWhen: "up" },
  { key: "ROA", label: "ROA (active)", suffix: "%", goodWhen: "up" },
  { key: "EBITDA", label: "EBITDA", suffix: "", goodWhen: "up" },
  { key: "Marja de profit net", label: "Marja profit net", suffix: "%", goodWhen: "up" },
  { key: "Rata lichiditatii Curente", label: "Lichiditate curentă", suffix: "", goodWhen: null },
  { key: "Datorii totale", label: "Datorii totale", suffix: "", goodWhen: "down" },
  { key: "Cota de piata", label: "Cota de piață", suffix: "%", goodWhen: null },
];

// ── Loading skeleton ───────────────────────────

function Skeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-6 w-56 rounded bg-white/10" />
      <div className="h-40 rounded-lg bg-white/5" />
      <div className="h-32 rounded-lg bg-white/5" />
    </div>
  );
}

// ── Main component ─────────────────────────────

export default function IntreprinderePublicaCard({ cui }: { cui: string }) {
  const [data, setData] = useState<IntreprinderePublicaDoc | null | "hidden">(
    "hidden",
  );
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(
          `/api/intreprinderi-publice/${encodeURIComponent(cui)}`,
        );
        if (res.status === 404) {
          if (!cancelled) setData("hidden"); // nu e întreprindere publică
          return;
        }
        if (!res.ok) throw new Error("API error");
        const json = (await res.json()) as IntreprinderePublicaDoc;
        if (!cancelled) setData(json);
      } catch {
        if (!cancelled) setError(true);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [cui]);

  // Ascuns complet pentru firme normale
  if (data === "hidden") return null;

  // Loading
  if (data === null && !error) {
    return (
      <div className="rounded-xl border border-blue-500/20 bg-bg-surface p-5">
        <Skeleton />
      </div>
    );
  }

  // Error
  if (error || data === null) {
    return null; // eroare non-critică — nu blocăm profilul
  }

  const doc = data;
  const years = [...doc.ani].sort((a, b) => a - b);

  // Serie pentru mini-chart: ROE + EBITDA pe ani
  const chartYears = years;
  const roeSeries = chartYears.map((y) => doc.indicatori?.[y]?.ROE ?? null);
  const ebitdaSeries = chartYears.map(
    (y) => doc.indicatori?.[y]?.EBITDA ?? null,
  );

  const chartData = {
    labels: chartYears,
    datasets: [
      {
        label: "ROE (%)",
        data: roeSeries,
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.15)",
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        borderWidth: 2,
        yAxisID: "y",
      },
      {
        label: "EBITDA",
        data: ebitdaSeries,
        borderColor: "#22c55e",
        backgroundColor: "transparent",
        tension: 0.4,
        pointRadius: 3,
        borderWidth: 2,
        yAxisID: "y1",
      },
    ],
  };

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index" as const, intersect: false },
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: { padding: 14, usePointStyle: true, font: { size: 11 } },
      },
      tooltip: {
        backgroundColor: "#1a1a1a",
        titleColor: "#e0e0e0",
        bodyColor: "#a0a0a0",
        borderColor: "#333",
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: { grid: { color: "rgba(255,255,255,0.05)" } },
      y: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { font: { size: 10 } } },
      y1: {
        position: "right" as const,
        grid: { drawOnChartArea: false },
        ticks: { font: { size: 10 }, callback: (v: string | number) => formatNum(Number(v)) },
      },
    },
  };

  return (
    <div className="rounded-xl border border-blue-500/20 bg-bg-surface p-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-text-primary">
          🏛️ Întreprindere publică
        </h3>
        <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
          Capital de stat
        </span>
      </div>

      {/* Indicatori tabel pe ani */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border-subtle text-xs uppercase tracking-wider text-text-muted">
              <th className="py-2 pr-4 font-medium">Indicator</th>
              {years.map((y) => (
                <th key={y} className="px-3 py-2 text-right font-medium">
                  {y}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {INDICATORS.map((ind) => {
              const values = years.map((y) => doc.indicatori?.[y]?.[ind.key] ?? null);
              const hasAny = values.some((v) => v != null);
              if (!hasAny) return null;
              const trend = getTrend(values);
              const lastVal = [...values].reverse().find((v) => v != null);
              const trendColor =
                trend === "up"
                  ? ind.goodWhen === "down"
                    ? "text-red-400"
                    : "text-green-400"
                  : trend === "down"
                    ? ind.goodWhen === "down"
                      ? "text-green-400"
                      : "text-red-400"
                    : "text-text-muted";

              return (
                <tr key={ind.key} className="border-b border-border-subtle/50 last:border-0">
                  <td className="py-2 pr-4 text-xs text-text-secondary">
                    {ind.label}
                  </td>
                  {values.map((v, i) => (
                    <td
                      key={i}
                      className={`px-3 py-2 text-right font-mono text-xs ${
                        v == null ? "text-text-muted/50" : "text-text-primary"
                      }`}
                    >
                      {formatNum(v, ind.suffix)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mini-chart ROE + EBITDA */}
      {chartYears.length >= 2 && (
        <div className="mt-5">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
            📈 Evoluție ROE & EBITDA
          </h4>
          <div className="h-48">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      )}

      {/* Source note */}
      <p className="mt-4 text-[11px] text-text-muted/70">
        Date: AMEPIP (OUG 109/2011) · data.gov.ro · ultimii{" "}
        {years.length > 1 ? `${years.length} ani` : "an"} disponibili
        {doc.ticker_symbol ? ` · simbol bursier ${doc.ticker_symbol}` : ""}
      </p>
    </div>
  );
}
