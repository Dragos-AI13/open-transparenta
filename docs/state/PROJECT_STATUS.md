# PROJECT STATUS — Open Transparență

**Last updated:** 2026-07-28
**Status:** 🟢 Active Development

---

## Lifecycle

```
🔵 Vision → 🟢 Fundația → 🟡 Motor Căutare → ⏳ Crawler → ⏳ PWA → ⏳ Deploy
               ↑ (we are here)
```

## Current Phase

**Phase 1 — 🏗️ Fundația** (≈90% complete)
- ✅ TICKET-1.1 Meilisearch install (Docker, local)
- ✅ TICKET-1.2 Next.js + Tailwind init
- ✅ TICKET-1.3 Design tokens + theme config
- ✅ TICKET-1.4 Base layout (Header, Footer, Search, Domain Grid)
- ⏳ TICKET-1.5 PWA manifest + service worker
- ⏳ TICKET-1.6 Deploy scripts

**Phase 2 — 🎯 Motor de Căutare** (≈20% complete)
- ✅ TICKET-2.7 Meilisearch Index Config + API Client (companii)
- ✅ TICKET-2.8 Crawler ONRC — 4.2M firme indexate cu date reale
- ✅ TICKET-2.9 API Routes search + detail + stare parser (4.2M stare populată)
- ⏳ TICKET-2.10 Search Results Page (/companii/cauta)
- ⏳ TICKET-2.11 Company Profile Page (/companii/firma/[cui])
- ⏳ TICKET-2.12 Connect Search Flow (legare tot)

---

## Stack Status

| Component | Version | Status |
|-----------|---------|--------|
| Next.js | 16.2.12 | ✅ Dev server running (:3000) |
| Tailwind CSS | v4 | ✅ Design tokens active |
| TypeScript | 5.x | ✅ |
| Meilisearch | 1.12.8 | ✅ Docker (:7700) |
| Python/Scrapy | — | 📦 Requirements installed (no code yet) |
| Fonts | Inter + JetBrains Mono | ✅ |

## Hosting

- **Dev:** http://localhost:3000
- **Meilisearch:** http://localhost:7700
- **Production:** Not deployed yet

---

## Last Session Summary

- Cloned repo to local, installed npm deps
- Started Meilisearch in Docker
- Implemented design tokens (Tailwind v4 `@theme` in globals.css): bg layers, text hierarchy, 17 domain colors, status colors, shadows, animations
- Built base layout: Header (logo + nav), Footer (sources + license), DomainGrid (17 domains with color dots)
- Created homepage: hero section with search bar placeholder + domain grid
- Dev server starts and renders correctly

## Known Issues

- Search bar is decorative only (no Meilisearch query yet)
- Domain grid items are not clickable (no routing yet)
- No crawler code exists
