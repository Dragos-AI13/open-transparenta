# TICKET INDEX — Open Transparență

**Ultima actualizare:** 2026-08-01 (reconciliere cod ↔ docs)

Indexul detaliat per domeniu trăiește în `tickets/companii-si-comert/` (TICKET_INDEX.md = Feature 1, TICKET_INDEX-F2.md = Feature 2 + 3). Acest fișier e harta de ansamblu a tuturor fazelor.

---

## Phase 1 — 🏗️ Fundația

| ID | Ticket | Status | Depends On |
|----|--------|--------|------------|
| 1.1 | Meilisearch install (Docker) | ✅ **done** | — |
| 1.2 | Next.js + Tailwind init | ✅ **done** | — |
| 1.3 | Design tokens + theme config | ✅ **done** | 1.2 |
| 1.4 | Base layout (Header, Footer, Search, Domain Grid) | ✅ **done** | 1.3 |
| 1.5 | PWA manifest + service worker | ⏳ pending | 1.4 |
| 1.6 | Deploy scripts | ⏳ pending | 1.1, 1.4 |

## Phase 2 — 🏢 Registrul Comerțului (ONRC) — ✅ Complet

| ID | Ticket | Status | Depends On |
|----|--------|--------|------------|
| 2.1 | Domain Design Tokens + Constants | ✅ **done** | — |
| 2.2 | Domain Layout (Sidebar + Breadcrumb) | ✅ **done** | 2.1 |
| 2.3 | Route Group + Domain Homepage | ✅ **done** | 2.2 |
| 2.4 | Sub-Category Pages (8 sub-categorii) | ✅ **done** | 2.3 |
| 2.5 | Domain Search Bar + Global Nav Update | ✅ **done** | 2.3 |
| 2.6 | Mobile Responsive + Navigation State | ✅ **done** | 2.4, 2.5 |
| 2.7 | Meilisearch Index Config + API Client | ✅ **done** | 1.1 |
| 2.8 | Crawler ONRC (4.2M firme reale) | ✅ **done** | 2.7 |
| 2.9 | API Routes: Search + Company Detail + Stare Parser | ✅ **done** | 2.8 |
| 2.10 | Search Results Page (/companii/cauta) cu filtre complete | ✅ **done** | 2.9 |
| 2.11 | Company Profile Page (/companii/firma/[cui]) | ✅ **done** | 2.9 |
| 2.12 | Connect Search Bar + Navigation Flow | ✅ **done** | 2.10, 2.11 |

## Phase 3 — 📊 Situații Financiare — ✅ Complet

| ID | Ticket | Status | Depends On |
|----|--------|--------|------------|
| 3.1 | Research + Crawler situații financiare (MF, 1.7M doc) | ✅ **done** | — |
| 3.2 | Index Meilisearch + API Routes | ✅ **done** | 3.1 |
| 3.3 | UI — Tabel indicatori pe profil firmă | ✅ **done** | 3.2 |
| 3.4 | UI — Grafice evoluție (Chart.js) | ✅ **done** | 3.3 |
| 3.5 | Integrare sidebar + feature flags | ✅ **done** | 3.3, 3.4 |

## Phase 4 — 🚧 Următorul (propuneri)

| ID | Ticket | Status |
|----|--------|--------|
| 4.1 | Deploy producție (VPS) — incl. Docker compose prod | ⏳ pending |
| 4.2 | PWA manifest + service worker | ⏳ pending |
| 4.3 | Pagini pentru restul de 16 domenii (doar Companii e live) | ⏳ pending |
| 4.4 | Header links reale (Domenii, Despre) în loc de `#` | ⏳ pending |
| 4.5 | Administratori și Acționari — crawler ONRC reprezentanți legali | ✅ **done** |

## Phase 5 — 🏛️ Întreprinderi Publice (AMEPIP) — ✅ Complet

| ID | Ticket | Status |
|----|--------|--------|
| 5.1 | Crawler AMEPIP: CSV 2023 + XLSX 2024 → Meilisearch | ✅ **done** |
| 5.2 | API Routes: listă + detalii | ✅ **done** |
| 5.3 | Sub-category page `/companii/intreprinderi-publice` | ✅ **done** |
| 5.4 | Card „🏛️ Întreprindere publică" pe profil firmă | ✅ **done** |
| 5.5 | Integrare sidebar + navigare cap-coadă | ✅ **done** |
| 5.6 | QA complet + state docs + README | ✅ **done** |

## Phase 6 — 🔒 Concurență (Consiliul Concurenței) — ✅ Complet

| ID | Ticket | Status |
|----|--------|--------|
| 6.1 | Spike + Crawler decizii CC (HTML scraping) | ✅ **done** |
| 6.2 | API Routes + pagina `/companii/concurenta` (tabel decizii) | ✅ **done** |
| 6.3 | QA + state docs + README | ✅ **done** |

## Phase 7 — 💰 Buget și Finanțe — ✅ Complet (7.1-7.4) + 📋 planificat (7.5-7.7)

| ID | Ticket | Status |
|----|--------|--------|
| 7.1 | Spike + Crawler BNR curs valutar (XML live + istoric) | ✅ **done** |
| 7.2 | API + pagina subdomeniului `/buget-si-finante/curs-valutar` | ✅ **done** |
| 7.3 | Pagina principală a domeniului `/buget-si-finante` + link homepage | ✅ **done** |
| 7.4 | QA + state docs + README | ✅ **done** |
| 7.5 | Crawler Bugetul de Stat (XML MF 2023-2025) | 📋 ready (ticket scris) |
| 7.6 | API + pagina `/buget-si-finante/bugetul-de-stat` | 📋 ready (ticket scris) |
| 7.7 | QA + state docs + README | 📋 ready (ticket scris) |

---

## Legendă

- ✅ **done** — implementat și verificat (build trece)
- ⏳ pending — de făcut
- Detalii per ticket: `tickets/companii-si-comert/TICKET-*.md`
