# Ticket 3.3 — UI: Tabel Indicatori Financiari pe Profil Firmă

**ID:** F3.3
**Status:** ⏳ Pending
**Feature:** 3 — 📊 Situații Financiare
**Dependențe:** F3.2 (API)

## Descriere

Tabel cu indicatorii financiari afișat pe pagina de profil a firmei (`/companii/firma/{cui}`), înlocuind placeholder-ul "în curând" pentru Situații Financiare.

## Cerințe

- [ ] Componentă `FinancialTable` în `src/components/companii/FinancialTable.tsx`
- [ ] Fetch date de la `/api/financiar/{cui}` (server-side pe pagina de profil)
- [ ] Tabel cu ani pe coloane, indicatori pe rânduri
- [ ] Indicatori afișați (primii 8, suficienți pentru MVP):
  - Cifra de afaceri netă
  - Profit net / Pierdere netă
  - Active totale (I1 + I2)
  - Datorii
  - Capitaluri proprii
  - Număr salariați
- [ ] Formatare valori: 1.234.567 RON (separator mii, simbol货币)
- [ ] Trend: săgeți ▲/▼ după ultimii 2 ani
- [ ] Celule cu fundal verde pentru creștere, roșu pentru scădere
- [ ] Responsive: tabel horizontal pe desktop, carduri pe mobile
- [ ] Înlocuiește placeholder-ul "în curând" din profilul firmei
- [ ] Dacă nu sunt date financiare → mesaj „Date financiare indisponibile pentru această firmă"

## Design propus

```
📊 Situații Financiare

┌─────────────────────────────────────────────────┐
│ Indicator                2022      2023    2024  │
├─────────────────────────────────────────────────┤
│ Cifra de afaceri      1.200.000 1.500.000 1.8M ▲│
│ Profit net              120.000   145.000  200k ▲│
│ Active totale          2.100.000 2.300.000 2.5M ▲│
│ Datorii                 800.000   750.000  700k ▼│
│ Capitaluri proprii     1.300.000 1.550.000 1.8M ▲│
│ Nr. salariați                12        14    16 ▲│
└─────────────────────────────────────────────────┘
```

### Culori trend
- ▲ Verde: `text-green-400` — creștere față de anul precedent
- ▼ Roșu: `text-red-400` — scădere față de anul precedent
- ➡ Gri: `text-text-muted` — neschimbat

### Formatare numere
```typescript
function formatRON(value: number | undefined | null): string {
  if (value === null || value === undefined) return "—";
  // Sub 1.000: valoarea exactă
  // Sub 1.000.000: 120.000
  // Peste 1.000.000: 1,2M
}
```

## Fișiere

| Acțiune | Fișier |
|---------|--------|
| ➕ Creează | `src/components/companii/FinancialTable.tsx` |
| 🔧 Editează | `src/app/companii/firma/[cui]/page.tsx` | (import + afișare componentă)

## Acceptanță

- [ ] Tabelul apare pe profilul firmei, cu date reale
- [ ] Trendurile sunt corecte (▲/▼)
- [ ] Formatarea banilor e corectă
- [ ] Responsive (merge pe telefon)
- [ ] Fără date → mesaj prietenos
- [ ] `npm run build` trece
