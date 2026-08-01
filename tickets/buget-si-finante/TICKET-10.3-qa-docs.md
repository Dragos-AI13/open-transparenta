# Ticket 10.3 — QA + state docs

**ID:** TICKET-10.3
**Status:** 📋 ready
**Feature:** 10 — 🏗️ Investiții și Fonduri (MFE)
**Dependențe:** TICKET-10.2

## Descriere

Verificare finală a subdomeniului Investiții și Fonduri: QA browser (filtre, căutare, flow cap-coadă), build curat, actualizare docs. Pattern identic cu fazele anterioare.

## Cerințe

- [ ] QA browser (dev server):
  - Homepage → „💰 Buget și Finanțe" → „🏗️ Investiții și Fonduri" (Live) → tabel proiecte
  - Căutare „oradea" → rezultate Bihor; filtru program; paginare
  - Cardurile hero (total proiecte, valoare, absorbție) afișează date reale
  - Flow cap-coadă: homepage → domeniu → subdomeniu → înapoi
- [ ] `npm run build` — curat
- [ ] State docs:
  - `TICKET_INDEX.md` (root) — Phase 10, toate ✅ done
  - `tickets/buget-si-finante/TICKET_INDEX.md` — 10.1-10.3 ✅ done
  - `NEXT_ACTIONS.md` — 10.x done, next promovat (domeniu nou Sănătate/Educație)
  - `PROJECT_STATUS.md`, `CHANGELOG_WORKING.md`, `README.md`
- [ ] Commit + push

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
