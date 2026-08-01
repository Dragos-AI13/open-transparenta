# Ticket 5.4 — Card „🏛️ Întreprindere publică" pe profil firmă

**ID:** TICKET-5.4
**Status:** 📋 ready
**Feature:** 5 — 🏛️ Întreprinderi Publice
**Dependențe:** TICKET-5.2

## Descriere

Pe pagina profilului firmei (`/companii/firma/[cui]`), dacă firma e în indexul `intreprinderi_publice`, afișează un card dedicat cu indicatorii AMEPIP (ROE, EBITDA, lichidități, marje) și istoric pe ani. Dacă nu e întreprindere publică, cardul nu apare deloc (zero impact pe firmele normale).

## Cerințe

- [ ] Componenta `IntreprinderePublicaCard` (client component, fetch pe `GET /api/intreprinderi-publice/{cui}`):
  - Apare doar dacă API-ul răspunde 200 (firma e întreprindere publică)
  - Header: „🏛️ Întreprindere publică" + badge (ex. „Capital de stat")
  - Tabel indicatori pe ani: ROE, ROA, EBITDA, Marja profit net, Lichiditate curentă, Datorii totale, Cota de piață (doar indicatorii disponibili)
  - Mini-chart (Chart.js line) pentru 2-3 indicatori cheie pe ani (ROE + EBITDA) — reutilizează pattern-ul FinancialCharts
  - Trend ▲/▼ colorat (verde/roșu) ca în FinancialTable
- [ ] Stări: skeleton (loading), ascuns (404 — nu e IP), cu date
- [ ] Notă sursă: „Date AMEPIP (OUG 109/2011), data.gov.ro"
- [ ] Integrare în `app/companii/firma/[cui]/page.tsx` după cardul „Administratori și Acționari"

## Fișiere

| Acțiune | Fișier |
|---------|--------|
| ➕ Creează | `frontend/src/components/companii/IntreprinderePublicaCard.tsx` |
| 🔧 Editează | `frontend/src/app/companii/firma/[cui]/page.tsx` |

## Acceptance criteria

- [ ] `RO54760` (COMPANIA DE APĂ ORADEA SA) → card cu indicatori + chart
- [ ] `RO28397` (ANAGIANI IMPEX, firmă normală) → fără card
- [ ] Verificat vizual în browser (dark theme, consistență cu FinancialCharts)
- [ ] `npm run build` trece

## Security

- **Impact:** none

## Verification

```bash
curl -s "http://localhost:3000/api/intreprinderi-publice/RO54760" | head -c 500
# Browser: /companii/firma/RO54760 → card IP; /companii/firma/RO28397 → fără card
```
