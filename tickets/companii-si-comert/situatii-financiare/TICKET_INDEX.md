# TICKET INDEX — Feature 3: 📊 Situații Financiare

**Feature:** Date financiare ale firmelor din România — bilanț, cont de profit și pierdere, indicatori economici.
**Sursă:** Ministerul Finanțelor (data.gov.ro) — dumps anuale
**Status:** ⏳ Planificat

---

| ID | Ticket | Status | Depends On | Efort |
|----|--------|--------|------------|-------|
| 3.1 | Research + Crawler situații financiare | ✅ **done** | — |
| 3.2 | Index Meilisearch + API Routes | ✅ **done** | 3.1 |
| 3.3 | UI — Tabel indicatori pe profil firmă | ✅ **done** | 3.2 |
| 3.4 | UI — Grafice evoluție (Chart.js) — 3 tipuri | ✅ **done** | 3.3 |
| 3.5 | Integrare sidebar + feature flags | ✅ **done** | 3.3, 3.4 |

**Total efort estimat:** ~85 minute

---

## Dependency Graph

```
3.1 → 3.2 → 3.3 → 3.4
               ↓
             3.5
```

## Date disponibile

| Fișier | Dimensiune | Conținut |
|--------|-----------|----------|
| `WEB_UU_AN2024.txt` + `AN2025.txt` | ~79 MB/an | Bilanț + Cont P&L pentru TOATE firmele |
| `WEB_BL_BS_SL_AN2025.txt` | ~8.6 MB | Situații financiare complete (variantă) |
| `WEB_ONG_AN2025.txt` | ~8.7 MB | Situații financiare ONG-uri |
| `WEB_IFN2025.txt` | ~22 KB | IFN-uri |
| Altele | mici | Brokeri, asigurări, pensii, instituții de credit |

## Indicatori (UU — toate firmele)

| Cod | Indicator | Tip |
|-----|-----------|-----|
| I1 | Active Imobilizate | Bilanț |
| I2 | Active Circulante | Bilanț |
| I3 | Stocuri | Bilanț |
| I4 | Creanțe | Bilanț |
| I5 | Numerar | Bilanț |
| I6 | Cheltuieli în avans | Bilanț |
| I7 | Datorii | Bilanț |
| I8 | Venituri în avans | Bilanț |
| I9 | Provizioane | Bilanț |
| I10 | Capitaluri proprii | Bilanț |
| I11 | Capital subscris vărsat | Bilanț |
| I12 | Patrimoniul regiei | Bilanț |
| **I13** | **Cifra de afaceri netă** | **P&L** |
| I14 | Venituri totale | P&L |
| I15 | Cheltuieli totale | P&L |
| I16 | Profit brut | P&L |
| I17 | Pierdere brută | P&L |
| **I18** | **Profit net** | **P&L** |
| I19 | Pierdere netă | P&L |
| **I20** | **Număr mediu de salariați** | Social |

## Arhitectură propusă

### Index Meilisearch
```
Index: "financial"
PrimaryKey: "id" (CUI_AN)
Document:
{
  id: "RO10654053_2024",
  cui: "RO10654053",
  an: 2024,
  caen: "1234",
  cifra_afaceri: 1500000,
  profit_net: 200000,
  active_totale: 2500000,
  datorii: 700000,
  numar_salariati: 12,
  ... (toți indicatorii)
}
```

### API
```
GET /api/financiar/{cui}?ani=2020-2025
→ { hits: [{ an, cifra_afaceri, profit_net, ... }], years: [2020...2025] }
```

### UI pe profil firmă
```
┌────────────────────────────────────────────┐
│ 📊 Situații Financiare                      │
│                                            │
│ Indicator          2022    2023    2024     │
│ Cifra de afaceri   1.2M   1.5M   1.8M ▲    │
│ Profit net         120k   145k   200k ▲    │
│ Active totale      2.1M   2.3M   2.5M ▲   │
│ Datorii            800k   750k   700k ▼   │
│ Salariați           12      14     16 ▲   │
│                                            │
│ ┌────────────────────────────────────────┐ │
│ │  📈 Grafic Cifra de Afaceri           │ │
│ │  [line chart, 3 ani, trend]           │ │
│ └────────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

## Acceptanță finală (tot Feature 3)

- [ ] Crawlerul descarcă și parsează datele Ministerului Finanțelor
- [ ] Index Meilisearch conține indicatori financiari pe ani
- [ ] `/api/financiar/{cui}` întoarce datele firmei
- [ ] Tabelul cu indicatori apare pe `/companii/firma/{cui}`
- [ ] Graficele se afișează corect (Chart.js responsive)
- [ ] Sidebar-ul arată "📊 Situații Financiare" ca link activ
- [ ] Datele sunt actualizate anual (crawler detectează fișiere noi)
- [ ] `npm run build` trece
