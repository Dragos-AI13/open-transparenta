# NEXT ACTIONS — Open Transparență

**Last updated:** 2026-08-01 (reconciliere cod ↔ docs)

---

## Active Feature

**Phase 2 + 3 — Registrul Comerțului + Situații Financiare** — ✅ Complet

- ✅ TICKET-2.7 — Meilisearch Index Config + API Client
- ✅ TICKET-2.8 — Crawler ONRC (4.2M firme)
- ✅ TICKET-2.9 — API Routes + Stare Parser
- ✅ TICKET-2.10 — Search Results Page (/companii/cauta) — era marcat „next”, de fapt deja implementat
- ✅ TICKET-2.11 — Company Profile Page (/companii/firma/[cui]) — deja implementat
- ✅ TICKET-2.12 — Connect Search Flow — deja implementat
- ✅ TICKET-3.1–3.5 — Situații Financiare (crawler MF 1.7M doc, API, tabel, grafice) — deja implementat, era nemarcat

**→ Next:** TICKET-4.5 — Administratori și Acționari (crawler ONRC reprezentanți legali) — ticket scris, gata de implementare
**→ După:** TICKET-4.2 — PWA manifest + service worker

---

## Phase 1 — 🏗️ Fundația (remaining)

- [ ] TICKET-1.5 — PWA manifest + service worker (→ redenumit 4.2 în indexul nou)
- [ ] TICKET-1.6 — Deploy scripts (→ redenumit 4.1 în indexul nou)

## Phase 4 — 🚧 Coadă propusă (neaprobată încă)

- [ ] 4.1 Deploy producție (VPS) — Docker compose prod, reverse proxy, TLS
- [ ] 4.2 PWA manifest + service worker
- [ ] 4.3 Pagini pentru restul de 16 domenii (doar Companii e live; restul sunt `href="#"`)
- [ ] 4.4 Header links reale (Domenii, Despre) în loc de `#`
