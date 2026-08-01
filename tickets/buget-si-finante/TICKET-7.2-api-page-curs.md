# Ticket 7.2 — API + pagina subdomeniului `/buget-si-finante/curs-valutar`

**ID:** TICKET-7.2
**Status:** ✅ Done
**Feature:** 7 — 💰 Buget și Finanțe (subdomeniul: 💱 Indicatori Financiari)
**Dependențe:** TICKET-7.1

## Descriere

Pagina subdomeniului cu cursul valutar BNR: tabel cu toate valutele, cursul zilei, căutare, eventual istoric pe valută (dacă spike-ul confirmă date istorice).

**Notă de arhitectură:** acesta e primul subdomeniu din afara domeniului Companii și Comerț. Rutele noi:
- `/buget-si-finante` — pagina principală a domeniului (ticket 7.3)
- `/buget-si-finante/curs-valutar` — pagina subdomeniului (acest ticket)

Nu folosim pattern-ul `[slug]` al companiilor — domeniile noi au rute proprii explicite.

## Cerințe

- [ ] `GET /api/curs-valutar?q=&data=&page=&limit=` — listă:
  - Căutare pe valută (EUR, USD...)
  - Filtru pe dată (opțional, dacă există istoric)
  - Paginare
  - Răspuns: `{ hits, total, page, totalPages }`
  - Total exact: pattern-ul IP (stats când nu sunt filtre)
- [ ] `GET /api/curs-valutar/istoric?valuta=EUR` (opțional, dacă istoricul există) — seria completă pentru o valută
- [ ] Pagină dedicată `app/buget-si-finante/curs-valutar/page.tsx`:
  - Hero: titlu „💱 Curs Valutar BNR", descriere, dată publicare
  - Tabel: Valută (cod + denumire), Rată (formatată cu 4 zecimale), Multiplier (dacă ≠ 1), trend vs. ziua precedentă (dacă există istoric)
  - Căutare + paginare
  - Stări: skeleton, eroare (retry), gol, cu date
  - Responsive
- [ ] Tip `CursValutarDoc` în `lib/meilisearch.ts`

## Fișiere

| Acțiune | Fișier |
|---------|--------|
| ➕ Creează | `frontend/src/app/api/curs-valutar/route.ts` |
| ➕ Creează | `frontend/src/app/api/curs-valutar/istoric/route.ts` (dacă istoricul există) |
| ➕ Creează | `frontend/src/app/buget-si-finante/curs-valutar/page.tsx` |
| ➕ Creează | `frontend/src/components/buget/CursValutarTable.tsx` |
| 🔧 Editează | `frontend/src/lib/meilisearch.ts` |

## Acceptance criteria

- [ ] `/buget-si-finante/curs-valutar` afișează cursul zilnic (EUR, USD, CHF, GBP + toate)
- [ ] Căutare „EUR" → rezultat corect
- [ ] Dată de publicare afișată clar
- [ ] Stări complete testate
- [ ] `npm run build` trece

## Security

- **Impact:** none

## Verification

```bash
curl "http://localhost:3000/api/curs-valutar?limit=5"
curl "http://localhost:3000/api/curs-valutar?q=EUR"
# Browser: /buget-si-finante/curs-valutar
```
