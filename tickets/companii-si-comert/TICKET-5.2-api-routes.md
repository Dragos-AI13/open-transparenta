# Ticket 5.2 — API Routes: listă + detalii întreprinderi publice

**ID:** TICKET-5.2
**Status:** ✅ Done
**Feature:** 5 — 🏛️ Întreprinderi Publice
**Dependențe:** TICKET-5.1

## Descriere

Două API route-uri care servesc datele întreprinderilor publice din Meilisearch (index `intreprinderi_publice`).

## Cerințe

- [ ] `GET /api/intreprinderi-publice?q=&page=&limit=&caen=&sort=` — listă cu:
  - Căutare full-text pe denumire/CUI (opțional `q`)
  - Filtru pe CAEN (opțional)
  - Sortare pe denumire sau pe un indicator (ex. `sort=EBITDA.desc` — extinde dacă Meilisearch permite; altfel sortare doar pe denumire)
  - Paginare (page/limit)
  - Răspuns: `{ hits, total, page, totalPages }`
- [ ] `GET /api/intreprinderi-publice/{cui}` — detalii complete:
  - Documentul din index (cu indicatorii pe ani)
  - Răspuns 404 dacă CUI-ul nu e întreprindere publică
- [ ] Cache-Control: `public, max-age=60, stale-while-revalidate=300` (pattern existent)
- [ ] Erori structurate: 400 (CUI lipsă), 404 (nu găsit), 500 (internal)

## Fișiere

| Acțiune | Fișier |
|---------|--------|
| ➕ Creează | `frontend/src/app/api/intreprinderi-publice/route.ts` |
| ➕ Creează | `frontend/src/app/api/intreprinderi-publice/[cui]/route.ts` |
| 🔧 Editează | `frontend/src/lib/meilisearch.ts` — adaugă tipul `IntreprinderePublicaDoc` |

## Acceptance criteria

- [ ] `curl /api/intreprinderi-publice` → 1.259 firme, paginat
- [ ] `curl /api/intreprinderi-publice/RO54760` → COMPANIA DE APĂ ORADEA SA cu indicatori
- [ ] `curl /api/intreprinderi-publice?q=apa` → filtrează corect
- [ ] `curl /api/intreprinderi-publice/RO99999999` → 404
- [ ] `npm run build` trece

## Security

- **Impact:** none — date publice

## Verification

```bash
curl "http://localhost:3000/api/intreprinderi-publice?page=1&limit=5"
curl "http://localhost:3000/api/intreprinderi-publice/RO54760"
curl "http://localhost:3000/api/intreprinderi-publice?q=apa"
```
