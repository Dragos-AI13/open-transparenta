# Ticket 7.6 — API + pagina subdomeniului `/buget-si-finante/bugetul-de-stat`

**ID:** TICKET-7.6
**Status:** 📋 ready
**Feature:** 7 — 💰 Buget și Finanțe (subdomeniul: 📋 Bugetul de Stat)
**Dependențe:** TICKET-7.5

## Descriere

Pagina subdomeniului cu bugetul de stat: venituri și cheltuieli pe capitole, comparație pe ani (2023-2025 + estimări), căutare. Răspunde la întrebarea „pe ce se duc banii?"

## Cerințe

- [ ] `GET /api/buget-stat?q=&tip=&an=&page=&limit=` — listă:
  - Căutare pe denumire (ex. „educație", „sănătate", „transport")
  - Filtru `tip` (venituri/cheltuieli), filtru `an`
  - Răspuns: `{ hits, total, page, totalPages }`
  - Total exact: pattern-ul IP (stats când nu sunt filtre)
- [ ] `GET /api/buget-stat/rezumat` — totaluri pe an:
  - Venituri totale + cheltuieli totale per an (2023-2025)
  - Pentru header/hero: „Buget 2025: 357 mld lei venituri"
- [ ] Pagină dedicată `app/buget-si-finante/bugetul-de-stat/page.tsx`:
  - Hero: titlu „📋 Bugetul de Stat", descriere
  - **Carduri de top**: Venituri totale, Cheltuieli totale, Deficit/Excedent pe an selectat (comparație pe ani)
  - Tabel: Denumire (capitol), Tip (badge venituri/cheltuieli), An, Valoare (mii lei → format RON: 357,35 mld lei)
  - Selector de an (2023/2024/2025)
  - Căutare + paginare
  - Stări: skeleton, eroare, gol, cu date
  - Responsive
- [ ] Tip `BugetStatDoc` + `BugetRezumat` în `lib/meilisearch.ts`
- [ ] Update `lib/buget-domains.ts`: „Bugetul de Stat" → `status: "live"` + href

## Fișiere

| Acțiune | Fișier |
|---------|--------|
| ➕ Creează | `frontend/src/app/api/buget-stat/route.ts` |
| ➕ Creează | `frontend/src/app/api/buget-stat/rezumat/route.ts` |
| ➕ Creează | `frontend/src/app/buget-si-finante/bugetul-de-stat/page.tsx` |
| ➕ Creează | `frontend/src/components/buget/BugetStatTable.tsx` |
| 🔧 Editează | `frontend/src/lib/meilisearch.ts`, `frontend/src/lib/buget-domains.ts` |

## Detalii formatare

- Valorile sunt în **mii lei** → afișare: `formatLei(valoare * 1000)` → „357,35 mld lei" / „357.353.033.000 lei"
- Format scurt: mii → „M", milioane → „Mrd"... de fapt: `1.000.000` = 1 mil = „1 M"; `1.000.000.000` = 1 mld = „1 mld"
- Diacritice: „VENITURI - TOTAL" afișat ca atare (sursa)

## Acceptance criteria

- [ ] `/buget-si-finante/bugetul-de-stat` afișează bugetul real (venituri totale 2025 ≈ 357 mld lei)
- [ ] Cardul „📋 Bugetul de Stat" din pagina domeniului devine **Live**
- [ ] Selector de an + căutare funcționale
- [ ] `npm run build` trece

## Security

- **Impact:** none

## Verification

```bash
curl "http://localhost:3000/api/buget-stat/rezumat"
curl "http://localhost:3000/api/buget-stat?tip=cheltuieli&an=2025&limit=5"
# Browser: /buget-si-finante/bugetul-de-stat
```
