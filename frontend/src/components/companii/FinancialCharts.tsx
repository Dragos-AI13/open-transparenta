"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import type { FinancialData } from "@/lib/financiar";

// ── Register Chart.js components ──────────────

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

// ── Dark theme defaults ───────────────────────

ChartJS.defaults.color = "#a0a0a0";
ChartJS.defaults.borderColor = "#1e1e1e";
ChartJS.defaults.font.family = "Inter, system-ui, sans-serif";

// ── Helpers ────────────────────────────────────

function formatShort(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) {
    return `${(abs / 1_000_000).toFixed(1)}M RON`;
  }
  if (abs >= 1_000) {
    return `${(abs / 1_000).toFixed(0)}k RON`;
  }
  return `${value.toLocaleString("ro-RO")} RON`;
}

// ── Props ──────────────────────────────────────

interface Props {
  data: FinancialData[];
}

// ── Color palette (dark friendly) ─────────────

const COLORS = {
  cifra_afaceri: "#6366f1",     // indigo
  profit_net: "#22c55e",        // green
  profit_brut: "#4ade80",       // light green
  pierdere_neta: "#ef4444",     // red
  active_imobilizate: "#6366f1", // indigo
  active_circulante: "#06b6d4", // cyan
  datorii: "#f97316",           // orange
  capitaluri: "#22c55e",        // green
  gradient_from: "rgba(99, 102, 241, 0.15)",
  gradient_to: "rgba(99, 102, 241, 0)",
  grid_color: "rgba(255,255,255,0.05)",
};

// ── Chart 1: Revenue & Profit Trend ───────────

function RevenueProfitChart({ data }: Props) {
  const years = [...new Set(data.map((d) => d.an))].sort((a, b) => a - b);

  const revenue = years.map((y) => {
    const entry = data.find((d) => d.an === y);
    return entry?.cifra_afaceri ?? null;
  });

  const grossProfit = years.map((y) => {
    const entry = data.find((d) => d.an === y);
    if (entry?.profit_brut != null) return entry.profit_brut;
    return null;
  });

  const netProfit = years.map((y) => {
    const entry = data.find((d) => d.an === y);
    return entry?.profit_net ?? null;
  });

  const chartData = {
    labels: years,
    datasets: [
      {
        label: "Cifra de afaceri",
        data: revenue,
        borderColor: COLORS.cifra_afaceri,
        backgroundColor: (ctx: any) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, COLORS.gradient_from);
          gradient.addColorStop(1, COLORS.gradient_to);
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2.5,
      },
      {
        label: "Profit brut",
        data: grossProfit,
        borderColor: COLORS.profit_brut,
        backgroundColor: "transparent",
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 2,
        borderDash: [5, 5],
      },
      {
        label: "Profit net",
        data: netProfit,
        borderColor: COLORS.profit_net,
        backgroundColor: "transparent",
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle" as const,
          font: { size: 11 },
        },
      },
      tooltip: {
        backgroundColor: "#1a1a1a",
        titleColor: "#e0e0e0",
        bodyColor: "#a0a0a0",
        borderColor: "#333",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (ctx: any) => {
            const val = ctx.parsed.y;
            if (val === null) return `${ctx.dataset.label}: —`;
            return `${ctx.dataset.label}: ${val.toLocaleString("ro-RO")} RON`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { color: COLORS.grid_color, drawBorder: false },
        ticks: { font: { size: 11 } },
      },
      y: {
        grid: { color: COLORS.grid_color, drawBorder: false },
        ticks: {
          font: { size: 10 },
          callback: (val: any) => formatShort(val),
        },
      },
    },
  };

  return (
    <div className="h-72">
      <Line data={chartData} options={options} />
    </div>
  );
}

// ── Chart 2: Assets vs Liabilities ────────────

function AssetsLiabilitiesChart({ data }: Props) {
  const years = [...new Set(data.map((d) => d.an))].sort((a, b) => a - b);

  const assets = years.map((y) => {
    const entry = data.find((d) => d.an === y);
    if (entry?.active_imobilizate != null && entry?.active_circulante != null) {
      return entry.active_imobilizate + entry.active_circulante;
    }
    // If total not available, try individual
    return entry?.active_imobilizate ?? 0;
  });

  const liabilities = years.map((y) => {
    const entry = data.find((d) => d.an === y);
    return entry?.datorii ?? 0;
  });

  const equity = years.map((y) => {
    const entry = data.find((d) => d.an === y);
    return entry?.capitaluri_proprii ?? 0;
  });

  const chartData = {
    labels: years,
    datasets: [
      {
        label: "Active totale",
        data: assets,
        backgroundColor: COLORS.active_imobilizate,
        borderRadius: 4,
        barThickness: 28,
      },
      {
        label: "Datorii",
        data: liabilities,
        backgroundColor: COLORS.datorii,
        borderRadius: 4,
        barThickness: 28,
      },
      {
        label: "Capitaluri proprii",
        data: equity,
        backgroundColor: COLORS.capitaluri,
        borderRadius: 4,
        barThickness: 28,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: "rectRounded" as const,
          font: { size: 11 },
        },
      },
      tooltip: {
        backgroundColor: "#1a1a1a",
        titleColor: "#e0e0e0",
        bodyColor: "#a0a0a0",
        borderColor: "#333",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (ctx: any) =>
            `${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString("ro-RO")} RON`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 } },
      },
      y: {
        grid: { color: COLORS.grid_color, drawBorder: false },
        stacked: false,
        ticks: {
          font: { size: 10 },
          callback: (val: any) => formatShort(val),
        },
      },
    },
  };

  return (
    <div className="h-72">
      <Bar data={chartData} options={options} />
    </div>
  );
}

// ── Chart 3: Current Year Structure (Doughnut) ─

function StructureChart({ data }: Props) {
  // Use the most recent year
  const years = [...new Set(data.map((d) => d.an))].sort((a, b) => b - a);
  const latestYear = years[0];
  const latestData = data.find((d) => d.an === latestYear);

  if (!latestData) {
    return (
      <div className="flex h-56 flex-col items-center justify-center gap-2 text-center">
        <div className="text-2xl opacity-40">🧩</div>
        <p className="text-sm text-text-muted">
          Nu există date despre structura activelor pentru {latestYear ?? "acest an"}.
        </p>
      </div>
    );
  }

  const hasBreakdown =
    latestData.active_imobilizate != null ||
    latestData.active_circulante != null ||
    latestData.stocuri != null ||
    latestData.creante != null ||
    latestData.numerar != null;

  const breakdownItems: { label: string; value: number; color: string }[] = [];

  if (latestData.active_imobilizate) {
    breakdownItems.push({
      label: "Active imobilizate",
      value: latestData.active_imobilizate,
      color: "#6366f1",
    });
  }
  if (latestData.stocuri) {
    breakdownItems.push({
      label: "Stocuri",
      value: latestData.stocuri,
      color: "#f59e0b",
    });
  }
  if (latestData.creante) {
    breakdownItems.push({
      label: "Creanțe",
      value: latestData.creante,
      color: "#06b6d4",
    });
  }
  if (latestData.numerar) {
    breakdownItems.push({
      label: "Numerar",
      value: latestData.numerar,
      color: "#22c55e",
    });
  }

  // If only a couple of items, not useful for doughnut
  if (!hasBreakdown || breakdownItems.length < 2) {
    return (
      <div className="flex h-56 flex-col items-center justify-center gap-2 text-center">
        <div className="text-2xl opacity-40">🧩</div>
        <p className="text-sm text-text-muted">
          Nu sunt suficiente detalii despre structura activelor pentru{" "}
          {latestYear} pentru a desena graficul.
        </p>
      </div>
    );
  }

  const chartData = {
    labels: breakdownItems.map((i) => i.label),
    datasets: [
      {
        data: breakdownItems.map((i) => i.value),
        backgroundColor: breakdownItems.map((i) => i.color),
        borderColor: "#0d0d0d",
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const totalValue = breakdownItems.reduce((s, i) => s + i.value, 0);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%" as const,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 16,
          usePointStyle: true,
          pointStyle: "circle" as const,
          font: { size: 10 },
        },
      },
      tooltip: {
        backgroundColor: "#1a1a1a",
        titleColor: "#e0e0e0",
        bodyColor: "#a0a0a0",
        borderColor: "#333",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (ctx: any) => {
            const val = ctx.parsed;
            const pct = totalValue > 0 ? ((val / totalValue) * 100).toFixed(1) : 0;
            return `${ctx.label}: ${val.toLocaleString("ro-RO")} RON (${pct}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="flex flex-col items-center">
      <div className="h-56 w-56">
        <Doughnut data={chartData} options={options} />
      </div>
      <p className="mt-2 text-xs text-text-muted">
        Total active: {totalValue.toLocaleString("ro-RO")} RON
      </p>
    </div>
  );
}

// ── Main Component ─────────────────────────────

export default function FinancialCharts({ data }: Props) {
  if (!data || data.length < 1) return null;

  const years = [...new Set(data.map((d) => d.an))].sort((a, b) => b - a);
  const latestYear = years[0];

  // Need at least 2 data points for trend charts
  const hasTrend = data.length >= 2;

  return (
    <div className="mt-6 space-y-6">
      {/* Revenue & Profit Trend */}
      {hasTrend && (
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-5">
          <h4 className="mb-4 text-sm font-semibold text-text-primary">
            📈 Venituri & Profit
          </h4>
          <RevenueProfitChart data={data} />
        </div>
      )}

      {/* Assets vs Liabilities */}
      {hasTrend && (
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-5">
          <h4 className="mb-4 text-sm font-semibold text-text-primary">
            📊 Active, Datorii & Capitaluri
          </h4>
          <AssetsLiabilitiesChart data={data} />
        </div>
      )}

      {/* Structure doughnut */}
      <div className="rounded-xl border border-border-subtle bg-bg-surface p-5">
        <h4 className="mb-4 text-sm font-semibold text-text-primary">
          🧩 Structura Activelor ({latestYear})
        </h4>
        <StructureChart data={data} />
      </div>
    </div>
  );
}
