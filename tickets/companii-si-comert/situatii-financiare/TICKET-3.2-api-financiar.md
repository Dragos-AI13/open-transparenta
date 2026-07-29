# Ticket 3.2 — Index Meilisearch + API Routes Financiare

**ID:** F3.2
**Status:** ⏳ Pending
**Feature:** 3 — 📊 Situații Financiare
**Dependențe:** F3.1 (crawler)

## Descriere

API routes Next.js care expun datele financiare per companie, consumate de UI-ul de pe profilul firmei.

## Cerințe

- [ ] `frontend/src/lib/financiar.ts` — client API
  - `getFinancialData(cui: string)` → FinancialData[]
  - `FinancialData` interface cu toți cei 20 de indicatori
- [ ] `app/api/financiar/[cui]/route.ts` — GET
  - Input: `GET /api/financiar/RO10654053?ani=2020-2025`
  - Output: `{ hits: FinancialData[], years: number[] }`
- [ ] Opțional: `GET /api/financiar/[cui]/[an]` — un singur an
- [ ] Cache headers: `Cache-Control: public, max-age=3600` (datele nu se schimbă des)
- [ ] Dacă CUI nu are date financiare → `{ hits: [], years: [] }` (nu 404)
- [ ] Error handling standard

## Detalii tehnice

### Interfață TypeScript
```typescript
export interface FinancialData {
  id: string;            // "RO10654053_2024"
  cui: string;           // "RO10654053"
  an: number;            // 2024
  caen?: string;         // cod CAEN
  active_imobilizate?: number;
  active_circulante?: number;
  stocuri?: number;
  creante?: number;
  numerar?: number;
  cheltuieli_avans?: number;
  datorii?: number;
  venituri_avans?: number;
  provizioane?: number;
  capitaluri_proprii?: number;
  capital_subscris?: number;
  patrimoniu_regie?: number;
  cifra_afaceri?: number;
  venituri_totale?: number;
  cheltuieli_totale?: number;
  profit_brut?: number;
  pierdere_bruta?: number;
  profit_net?: number;
  pierdere_neta?: number;
  numar_salariati?: number;
}
```

### API Route
```typescript
// GET /api/financiar/RO10654053
{
  "cui": "RO10654053",
  "years": [2020, 2021, 2022, 2023, 2024],
  "hits": [
    {
      "an": 2024,
      "cifra_afaceri": 1800000,
      "profit_net": 200000,
      "active_imobilizate": 2500000,
      "datorii": 700000,
      "numar_salariati": 16
    },
    // ... per an
  ]
}
```

## Acceptanță

- [ ] `curl http://localhost:3000/api/financiar/RO10654053` → JSON cu date
- [ ] CUI fără date → `{ cui: "...", years: [], hits: [] }`
- [ ] Filtrare pe ani: `?ani=2023,2024`
- [ ] `npm run build` trece
