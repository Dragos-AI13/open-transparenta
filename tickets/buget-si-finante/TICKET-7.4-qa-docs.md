# Ticket 7.4 — QA complet + state docs + README

**ID:** TICKET-7.4
**Status:** ✅ Done
**Feature:** 7 — 💰 Buget și Finanțe
**Dependențe:** TICKET-7.2, 7.3

## Descriere

Verificare finală a primului subdomeniu BNR + paginii principale a domeniului, actualizarea documentelor de stare — pattern identic cu fazele anterioare.

## Cerințe

- [ ] QA browser:
  - Flow cap-coadă: homepage → card „💰 Buget și Finanțe" → `/buget-si-finante` → „💱 Curs Valutar" → tabel cursuri → înapoi
  - Căutare valută + paginare
  - Stări: skeleton, gol, eroare, cu date
  - Responsive (tabel → carduri pe mobil)
  - Diacritice corecte
- [ ] `npm run build` — curat
- [ ] State docs:
  - `TICKET_INDEX.md` (root) — Phase 7, toate ✅ done
  - `tickets/buget-si-finante/TICKET_INDEX.md` — toate ✅ done
  - `NEXT_ACTIONS.md` — 7.1-7.4 done, next promovat
  - `PROJECT_STATUS.md` — Phase 7, Last Session Summary
  - `CHANGELOG_WORKING.md` — entry datat
  - `README.md` — status bars
- [ ] Commit + push

## Fișiere

| Acțiune | Fișier |
|---------|--------|
| 🔧 Editează | `TICKET_INDEX.md`, `tickets/buget-si-finante/TICKET_INDEX.md` |
| 🔧 Editează | `docs/state/NEXT_ACTIONS.md`, `PROJECT_STATUS.md`, `CHANGELOG_WORKING.md` |
| 🔧 Editează | `README.md` |

## Acceptance criteria

- [ ] Domeniul „Buget și Finanțe" e vizibil și funcțional din homepage
- [ ] Cursul valutar BNR live
- [ ] Toate state docs coerente
- [ ] Push pe GitHub

## Security

- **Impact:** none

## Verification

```bash
cd frontend && npm run build
git status  # curat
git log --oneline -5
```
