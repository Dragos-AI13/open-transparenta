# Ticket 10.3 — QA + state docs

**ID:** TICKET-10.3
**Status:** ✅ done
**Feature:** 10 — 🏗️ Investiții și Fonduri (MFE)
**Dependențe:** TICKET-10.2

## Descriere

Verificare finală a subdomeniului Investiții și Fonduri: QA browser (filtre, căutare, flow cap-coadă), build curat, actualizare docs. Pattern identic cu fazele anterioare.

## Cerințe

- [x] QA browser (dev server):
  - Homepage → „💰 Buget și Finanțe" → „🏗️ Investiții și Fonduri" (Live) → tabel proiecte
  - Căutare „oradea" → 67 rezultate Bihor; filtru program (POR → 8040 exact); paginare
  - Cardurile hero (17.879 proiecte, 165,36 mld RON, absorbție 29 programe) afișează date reale
  - Flow cap-coadă: homepage → domeniu → subdomeniu → înapoi
- [x] `npm run build` — curat
- [x] State docs:
  - `TICKET_INDEX.md` (root) — Phase 10, 10.1-10.2 ✅ done
  - `tickets/buget-si-finante/TICKET_INDEX.md` — 10.1-10.2 ✅ done
  - `NEXT_ACTIONS.md` — Phase 10 în lucru (2/3), next promovat
  - `PROJECT_STATUS.md`, `CHANGELOG_WORKING.md`, `README.md`
- [x] Commit + push (`83feffd` + `f66ac9e`)

## Fișiere

| Acțiune | Fișier |
|---------|--------|
| 🔧 Editează | `TICKET_INDEX.md`, `tickets/buget-si-finante/TICKET_INDEX.md` |
| 🔧 Editează | `docs/state/NEXT_ACTIONS.md`, `PROJECT_STATUS.md`, `CHANGELOG_WORKING.md` |
| 🔧 Editează | `README.md` |

## Acceptance criteria

- [ ] Pagina cu date reale MFE, filtre funcționale
- [ ] Cardul din pagina domeniului → Live (4/7)
- [ ] State docs coerente
- [ ] Push pe GitHub

## Security

- **Impact:** none

## Verification

```bash
cd frontend && npm run build
# Browser: /buget-si-finante/investitii-si-fonduri
```
