# Ticket 9.3 — QA + Lighthouse + state docs

**ID:** TICKET-9.3
**Status:** ✅ done
**Feature:** 9 — 📱 PWA
**Dependențe:** TICKET-9.2

## Descriere

Verificare finală PWA: instalabilitate, offline, Lighthouse > 90, actualizare docs. Pattern identic cu fazele anterioare.

## Cerințe

- [x] QA browser (pe build de producție, port 3010):
  - Chrome DevTools → Application → Manifest: valid, iconițe OK, theme_color
  - Service Workers: `sw.js` activ, `activated and running`, no errors
  - **Instalare**: butonul „Install" din browser (sau prompt) funcționează
  - **Offline**: Network → Offline → reload → pagina se încarcă (App Shell + date din cache sau mesaj elegant)
  - Flow normal cap-coadă încă funcționează (homepage → domeniu → subdomeniu → date)
- [x] **Lighthouse** (npx lighthouse http://localhost:3010) → PWA score > 90 (instalable + offline check) — **n/a: categoria PWA eliminată din Lighthouse 12+**; verificare manuală completă în loc
- [x] State docs:
  - `TICKET_INDEX.md` (root) — Phase 9, toate ✅ done
  - `tickets/TICKET_INDEX-9-pwa.md` — toate ✅ done
  - `NEXT_ACTIONS.md` — 9.1-9.3 done, next promovat (Datoria Publică sau domeniu nou)
  - `PROJECT_STATUS.md`, `CHANGELOG_WORKING.md`, `README.md`
- [x] Commit + push

## Fișiere

| Acțiune | Fișier |
|---------|--------|
| 🔧 Editează | `TICKET_INDEX.md`, `tickets/TICKET_INDEX-9-pwa.md` |
| 🔧 Editează | `docs/state/NEXT_ACTIONS.md`, `PROJECT_STATUS.md`, `CHANGELOG_WORKING.md` |
| 🔧 Editează | `README.md` |

## Acceptance criteria

- [ ] Site-ul e **instalabil** (Chrome prompt apare)
- [ ] **Offline**: pagina se încarcă fără internet
- [ ] Lighthouse PWA > 90
- [ ] State docs coerente
- [ ] Push pe GitHub

## Security

- **Impact:** none

## Verification

```bash
cd frontend && npm run build && npm run start -- -p 3010 &
npx lighthouse http://localhost:3010 --only-categories=pwa --output=json | grep -E "score|pwa"
```
