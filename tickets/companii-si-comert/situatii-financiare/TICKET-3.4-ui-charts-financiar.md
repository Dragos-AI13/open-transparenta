# Ticket 3.4 — UI: Grafice Evoluție Financiară (Chart.js)

**ID:** F3.4
**Status:** ⏳ Pending
**Feature:** 3 — 📊 Situații Financiare
**Dependențe:** F3.3 (tabel)

## Descriere

Grafice interactive care arată evoluția indicatorilor financiari în timp, implementate cu Chart.js. Se afișează sub tabelul de pe profilul firmei.

## Cerințe

- [ ] Instalare chart.js + react-chartjs-2
- [ ] Componentă `FinancialCharts` în `src/components/companii/FinancialCharts.tsx`
- [ ] Primul grafic: **Cifra de afaceri + Profit net** (lines, același chart, 2 culori)
- [ ] Al doilea grafic: **Active vs Datorii** (bar chart, per an)
- [ ] Dark theme: fundal transparent, text gri, grid subtil
- [ ] Tooltip cu valori formatate
- [ ] Responsive (se redimensionează automat)
- [ ] Dacă un singur an → mesaj "Date insuficiente pentru grafic"
- [ ] Lazy load — graficele se încarcă doar când sunt în viewport

## Design propus

```
┌────────────────────────────────────────────┐
│ 📈 Evoluție Cifra de Afaceri & Profit      │
│                                            │
│ 2.0M ┤                                    │
│ 1.5M ┤      ─── Cifra de afaceri          │
│ 1.0M ┤  ─── Profit net                    │
│ 0.5M ┤                                    │
│      └──────┬──────┬──────┬──────         │
│            2022   2023   2024              │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ 📊 Active vs Datorii                       │
│                                            │
│ 3.0M ┤  ████  ████  ████                  │
│ 2.0M ┤  ████  ████  ████  ██ Active       │
│ 1.0M ┤  ████  ████  ████  ██ Datorii     │
│      └──────┬──────┬──────┬──────         │
│            2022   2023   2024              │
└────────────────────────────────────────────┘
```

### Configurare Chart.js
```typescript
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#a0a0a0' } },
    tooltip: {
      callbacks: {
        label: (ctx) => `${ctx.dataset.label}: ${formatRON(ctx.parsed.y)} RON`
      }
    }
  },
  scales: {
    x: { ticks: { color: '#707070' }, grid: { color: '#1e1e1e' } },
    y: { ticks: { color: '#707070' }, grid: { color: '#1e1e1e' } }
  }
};
```

## Fișiere

| Acțiune | Fișier |
|---------|--------|
| ➕ Creează | `src/components/companii/FinancialCharts.tsx` |
| 🔧 Editează | `src/app/companii/firma/[cui]/page.tsx` | (adaugă FinancialCharts după tabel)

## Acceptanță

- [ ] Graficul cifră de afaceri + profit se afișează cu date reale
- [ ] Graficul active vs datorii se afișează
- [ ] Dark theme — se vede bine pe fundal #08090b
- [ ] Tooltip-urile ar valori formatate
- [ ] Un singur an → mesaj, nu crash
- [ ] `npm run build` trece
