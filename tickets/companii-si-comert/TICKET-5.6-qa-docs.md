# Ticket 5.6 — QA complet subdomeniu + state docs + README

**ID:** TICKET-5.6
**Status:** 📋 ready
**Feature:** 5 — 🏛️ Întreprinderi Publice
**Dependențe:** TICKET-5.3, 5.4, 5.5

## Descriere

Verificare finală a întregului subdomeniu, actualizarea tuturor documentelor de stare și asigurarea că totul e coerent și push-uit.

## Cerințe

- [ ] QA complet în browser (flow cap-coadă, toate stările componentelor):
  - Tabel: loading, succes, gol (căutare fără rezultate), eroare (API down)
  - Card IP pe profil: loading, cu date, ascuns (firmă normală)
  - Responsive: tabelul arată ok pe mobil (max 400px)
  - Diacritice corecte (ș/ț, ă/â) în tot textul nou
- [ ] `npm run build` — curat, zero warnings noi
- [ ] State docs actualizate:
  - `TICKET_INDEX.md` (root) — Phase 5 adăugată, toate ✅ done
  - `TICKET_INDEX-IP.md` — toate ✅ done
  - `NEXT_ACTIONS.md` — 5.1-5.6 marcate, next promovat
  - `PROJECT_STATUS.md` — Phase 5 completă, Last Session Summary
  - `CHANGELOG_WORKING.md` — entry datat cu Added/Verified
  - `README.md` — status bars (dacă e cazul)
- [ ] Commit + push pe main

## Fișiere

| Acțiune | Fișier |
|---------|--------|
| 🔧 Editează | `TICKET_INDEX.md` |
| 🔧 Editează | `tickets/companii-si-comert/TICKET_INDEX-IP.md` |
| 🔧 Editează | `docs/state/NEXT_ACTIONS.md`, `PROJECT_STATUS.md`, `CHANGELOG_WORKING.md` |
| 🔧 Editează | `README.md` (dacă e cazul) |

## Acceptance criteria

- [ ] Toate cele 6 tickete marcate done în ambele index-uri
- [ ] State docs coerente (verificare: NEXT_ACTIONS reflectă exact un next)
- [ ] Totul push-uit pe GitHub

## Security

- **Impact:** none

## Verification

```bash
cd frontend && npm run build
git status  # curat
git log --oneline -5  # ultimele commit-uri
```
