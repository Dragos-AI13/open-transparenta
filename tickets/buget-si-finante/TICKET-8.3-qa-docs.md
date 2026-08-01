# Ticket 8.3 — QA complet + state docs + README

**ID:** TICKET-8.3
**Status:** 📋 ready
**Feature:** 8 — 💳 Taxe și Impozite (ANAF)
**Dependențe:** TICKET-8.2

## Descriere

Verificare finală a subdomeniului Taxe și Impozite + actualizarea documentelor de stare — pattern identic cu fazele anterioare.

## Cerințe

- [ ] QA browser:
  - Flow: homepage → „💰 Buget și Finanțe" → „💳 Taxe și Impozite" (Live) → tabel
  - Căutare (ex. „TVA"), filtru secțiune, selector an
  - Verifică numerele: impozit pe profit 2026 ≈ 852.408 mii lei
  - Stări: skeleton, gol, eroare, cu date
  - Responsive + diacritice
- [ ] `npm run build` — curat
- [ ] State docs:
  - `TICKET_INDEX.md` (root) — Phase 8, toate ✅ done
  - `tickets/buget-si-finante/TICKET_INDEX-8-taxe.md` — toate ✅ done
  - `NEXT_ACTIONS.md` — 8.1-8.3 done, next promovat
  - `PROJECT_STATUS.md`, `CHANGELOG_WORKING.md`, `README.md`
- [ ] Commit + push

## Acceptance criteria

- [ ] Subdomeniul „Taxe și Impozite" e live (badge verde în pagina domeniului)
- [ ] 3/7 subdomenii live în Buget și Finanțe
- [ ] State docs coerente
- [ ] Push pe GitHub

## Verification

```bash
cd frontend && npm run build
git status  # curat
```
