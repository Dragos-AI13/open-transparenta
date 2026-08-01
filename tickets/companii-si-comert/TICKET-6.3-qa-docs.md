# Ticket 6.3 — QA complet + state docs + README

**ID:** TICKET-6.3
**Status:** 📋 ready
**Feature:** 6 — 🔒 Concurență
**Dependențe:** TICKET-6.2

## Descriere

Verificare finală a subdomeniului Concurență + actualizarea documentelor de stare, identic cu pattern-ul Phase 5.

## Cerințe

- [ ] QA browser:
  - Flow: sidebar „🔒 Concurență" → tabel cu decizii → click PDF (tab nou)
  - Căutare + filtru categorie + paginare
  - Stări: skeleton, gol (căutare fără rezultate), eroare, cu date
  - Responsive (tabel → carduri pe mobil)
  - Diacritice corecte
- [ ] `npm run build` — curat
- [ ] State docs:
  - `TICKET_INDEX.md` (root) — Phase 6, toate ✅ done
  - `TICKET_INDEX-CC.md` — toate ✅ done
  - `NEXT_ACTIONS.md` — 6.1-6.3 done, next promovat (4.2 PWA)
  - `PROJECT_STATUS.md` — Phase 6 completă, Last Session Summary
  - `CHANGELOG_WORKING.md` — entry datat
  - `README.md` — status bars (dacă e cazul)
- [ ] Commit + push

## Fișiere

| Acțiune | Fișier |
|---------|--------|
| 🔧 Editează | `TICKET_INDEX.md`, `TICKET_INDEX-CC.md` |
| 🔧 Editează | `docs/state/NEXT_ACTIONS.md`, `PROJECT_STATUS.md`, `CHANGELOG_WORKING.md` |
| 🔧 Editează | `README.md` (dacă e cazul) |

## Acceptance criteria

- [ ] Sidebar-ul „🔒 Concurență" e 100% funcțional cu date live
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
