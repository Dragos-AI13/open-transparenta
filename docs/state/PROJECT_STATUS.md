# PROJECT STATUS — Open Transparență

**Last updated:** 2026-08-01 (reconciliere cod ↔ docs)
**Status:** 🟢 Active Development

---

## Lifecycle

```
🔵 Vision → 🟢 Fundația → ✅ Registrul Comerțului → ✅ Situații Financiare → ⏳ Deploy/PWA → ⏳ 16 domenii rămase
                                                                         ↑ (we are here)
```

## Current Phase

**Phase 1 — 🏗️ Fundația** (≈100% complete, 1.5/1.6 mutate în Phase 4)
- ✅ TICKET-1.1 Meilisearch install (Docker, local)
- ✅ TICKET-1.2 Next.js + Tailwind init
- ✅ TICKET-1.3 Design tokens + theme config
- ✅ TICKET-1.4 Base layout (Header, Footer, Search, Domain Grid)

**Phase 2 — 🏢 Registrul Comerțului** (≈100% complete)
- ✅ TICKET-2.1–2.6 Arhitectura domeniului (tokens, layout, homepage, sub-categorii, search bar, mobile)
- ✅ TICKET-2.7 Meilisearch Index Config + API Client (companii)
- ✅ TICKET-2.8 Crawler ONRC — 4.2M firme indexate cu date reale
- ✅ TICKET-2.9 API Routes search + detail + stare parser
- ✅ TICKET-2.10 Search Results Page (/companii/cauta) — 7 filtre, paginare
- ✅ TICKET-2.11 Company Profile Page (/companii/firma/[cui])
- ✅ TICKET-2.12 Connect Search Flow (homepage → căutare → profil)

**Phase 3 — 📊 Situații Financiare** (≈100% complete)
- ✅ TICKET-3.1–3.5 Crawler MF (1.7M doc), API `/api/financiar/{cui}`, tabel indicatori, grafice Chart.js, integrare profil

**Phase 4 — 🚧 Următorul**
- ⏳ 4.1 Deploy producție (VPS)
- ⏳ 4.2 PWA manifest + service worker
- ⏳ 4.3 Pagini pentru restul de 16 domenii (doar Companii e live)
- ⏳ 4.4 Header links reale (Domenii, Despre) în loc de `#`

---

## Stack Status

| Component | Version | Status |
|-----------|---------|--------|
| Next.js | 16.2.12 | ✅ Build curat (verificat 2026-08-01) |
| Tailwind CSS | v4 | ✅ Design tokens active |
| TypeScript | 5.x | ✅ |
| Meilisearch | 1.12.8 | ✅ Docker (:7700) |
| Chart.js | 4.5.1 | ✅ Grafice financiare |
| Fonts | Inter + JetBrains Mono | ✅ |

## Hosting

- **Dev:** http://localhost:3000
- **Meilisearch:** http://localhost:7700
- **Production:** Not deployed yet (TICKET-4.1)

---

## Reconciliere 2026-08-01

Docs-urile de stare erau în urmă cu 2 faze față de cod. Corectat:

- **Feature 3 (Situații Financiare)** era marcat „planificat”, dar codul e complet: crawler MF (1.7M doc), API, tabel + 3 grafice Chart.js pe profil firmă → marcat **done**
- **2.10 / 2.11 / 2.12** erau marcate „next” în NEXT_ACTIONS, dar deja implementate (paginile `/companii/cauta` și `/companii/firma/[cui]` există, build trece, flow-ul homepage → căutare → profil e conectat)
- **TICKET_INDEX.md** rescris ca hartă de ansamblu (era în urmă cu structura veche)
- Rămase real: PWA (4.2), deploy (4.1), 16 domenii fără pagină (4.3), linkuri header moarte (4.4)

## Last Session Summary (2026-07-29)

- Feature 2 complet: Registrul Comerțului — crawler ONRC real (4.2M firme), search full-text cu 7 filtre, profil firmă cu stare
- Feature 3 complet: Situații Financiare — crawler Ministerul Finanțelor (1.7M doc), 20 indicatori/firmă/an, tabel trenduri + 3 grafice Chart.js
- Sidebar cu Căutare firmă + Situații Financiare, DomainGrid cu linkuri funcționale, breadcrumb dinamic
- Diacritice normalizate, gramatică românească corectă
- Push pe GitHub (38 fișiere, ~4.000 linii)

## Known Issues

- 16 din 17 domenii din DomainGrid au `href="#"` (doar Companii e live) — TICKET-4.3
- Header: linkurile „Domenii” și „Despre” sunt `#` — TICKET-4.4
- Fără PWA (manifest/service worker) — TICKET-4.2
- Fără deploy producție — TICKET-4.1
- Administratori/Acționari pe profil firmă: ✅ REZOLVAT — 3.68M reprezentanți indexați, card live (TICKET-4.5)
- Telefon/Email pe profil firmă: `—` (ONRC nu publică aceste date în open data)

## Session 2026-08-01 (rezumat)

- **Reconciliere cod ↔ docs**: Feature 3 (Situații Financiare) marcat done (era „planificat" în docs, codul era complet de pe 29.07); 2.10–2.12 promovate la done; TICKET_INDEX rescris ca hartă Phase 1–4
- **Fix hydration dev**: `allowedDevOrigins` adăugat în next.config.ts + cache `.next` șters → React hidratează corect în dev, cele 3 grafice Chart.js se desenează (line/bar/donut), filtrele funcționează
- **Verificat live**: homepage → căutare „Autonom" (958 firme, 7 filtre) → profil firmă (stare, CAEN, adresă) → grafice financiare pe firme cu bilanț depus
