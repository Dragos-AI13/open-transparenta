# Ticket 6.2 — API Routes + pagina `/companii/concurenta` (tabel decizii)

**ID:** TICKET-6.2
**Status:** ✅ Done
**Feature:** 6 — 🔒 Concurență
**Dependențe:** TICKET-6.1

## Descriere

Transformă pagina informativă `/companii/concurenta` în pagină cu date live: tabel cu deciziile Consiliului Concurenței, căutare, filtru pe categorie. Sidebar-ul are deja link-ul (din `showInSidebar: true`) — doar pagina devine live.

## Cerințe

- [ ] `GET /api/decizii-concurenta?q=&categorie=&page=&limit=` — listă cu:
  - Căutare full-text pe titlu
  - Filtru pe categorie
  - Paginare (page/limit, default 20)
  - Răspuns: `{ hits, total, page, totalPages }`
  - Total exact: pattern-ul de la IP (`stats.numberOfDocuments` când nu sunt filtre — Meilisearch 1.12 capătă totalHits la 1000)
- [ ] Pagină dedicată `app/companii/concurenta/page.tsx` (prioritate peste `[slug]`, ca la IP):
  - Hero: titlu „🔒 Concurență", descriere, iconiță (reutilizează din `companii-domains.ts`)
  - Tabel: Titlu (link → PDF, target blank), Categorie (badge), Dată
  - Search bar + dropdown categorie + paginare
  - Stări: skeleton, eroare (retry), gol (reset), cu date
  - Responsive: tabel desktop + carduri mobil
- [ ] Tip `DecizieConcurentaDoc` în `lib/meilisearch.ts`

## Fișiere

| Acțiune | Fișier |
|---------|--------|
| ➕ Creează | `frontend/src/app/api/decizii-concurenta/route.ts` |
| ➕ Creează | `frontend/src/app/companii/concurenta/page.tsx` |
| ➕ Creează | `frontend/src/components/companii/DeciziiConcurentaTable.tsx` |
| 🔧 Editează | `frontend/src/lib/meilisearch.ts` |

## Acceptance criteria

- [ ] `/companii/concurenta` afișează deciziile reale (verificat în browser)
- [ ] Căutare + filtru categorie funcționale
- [ ] Click pe decizie → PDF-ul se deschide în tab nou
- [ ] Stare gol + eroare testate
- [ ] `npm run build` trece

## Security

- **Impact:** none — date publice

## Verification

```bash
curl "http://localhost:3000/api/decizii-concurenta?limit=5"
curl "http://localhost:3000/api/decizii-concurenta?q=concentrare"
# Browser: /companii/concurenta → tabel + click PDF
```
