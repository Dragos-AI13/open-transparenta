# TICKET INDEX — Open Transparență

## Phase 1 — 🏗️ Fundația

| ID | Ticket | Status | Depends On |
|----|--------|--------|------------|
| 1.1 | Meilisearch install (Docker) | ✅ **done** | — |
| 1.2 | Next.js + Tailwind init | ✅ **done** | — |
| 1.3 | Design tokens + theme config | ✅ **done** | 1.2 |
| 1.4 | Base layout (Header, Footer, Search, Domain Grid) | ✅ **done** | 1.3 |
| 1.5 | PWA manifest + service worker | ⏳ pending | 1.4 |
| 1.6 | Deploy scripts | ⏳ pending | 1.1, 1.4 |

## Phase 2 — 🎯 Motor de Căutare (planned)

| ID | Ticket | Status | Depends On |
|----|--------|--------|------------|
| 2.1 | API route Meilisearch query | ⏳ pending | 1.1 |
| 2.2 | Search bar functional + autocomplete | ⏳ pending | 2.1 |
| 2.3 | Results page | ⏳ pending | 2.2 |
| 2.4 | Seed data from data.gov.ro | ⏳ pending | 2.1 |
| 2.5 | Filters (category, institution, format, county) | ⏳ pending | 2.3 |

## Phase 3 — 🕷️ Crawler (planned)

| ID | Ticket | Status | Depends On |
|----|--------|--------|------------|
| 3.1 | Crawler data.gov.ro (CKAN API) | ⏳ pending | 1.1 |
| 3.2 | Crawler ONRC firme | ⏳ pending | 3.1 |
| 3.3 | Crawler BNR curs valutar | ⏳ pending | 3.1 |
| 3.4 | Cron scheduling | ⏳ pending | 3.1–3.3 |
