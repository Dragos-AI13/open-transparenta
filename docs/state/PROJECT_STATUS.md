# PROJECT STATUS — Open Transparență

**Last updated:** 2026-08-01 (reconciliere cod ↔ docs)
**Status:** 🟢 Active Development

---

## Lifecycle

``` 
🔵 Vision → 🟢 Fundația → ✅ Registrul Comerțului → ✅ Situații Financiare → ✅ Întreprinderi Publice → ✅ PWA → ⏳ 16 domenii rămase
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

**Phase 5 — 🏛️ Întreprinderi Publice** (≈100% complete)
- ✅ TICKET-5.1–5.6 Crawler AMEPIP (1.259 firme, 17 indicatori, 2019-2023), API listă+detalii, pagina subdomeniului cu tabel live, card IP pe profil, navigare, QA

**Phase 6 — 🚧 Următorul**
- ⏳ 4.1 Deploy producție (VPS)
- ✅ 4.2 PWA manifest + service worker → **mutat în Phase 9 — Complet**
- ⏳ 4.3 Pagini pentru restul de 16 domenii (doar Companii e live)
- ⏳ 4.4 Header links reale (Domenii, Despre) în loc de `#`

**Phase 9 — 📱 PWA (Manifest + Service Worker)** (100% complete, 2026-08-01)
- ✅ TICKET-9.1 Manifest `app/manifest.ts` (Next 16 nativ) + iconițe 192/512/maskable generate cu Pillow
- ✅ TICKET-9.2 Service worker Serwist 9.5 (`@serwist/turbopack`): precache statici, runtime cache API NetworkFirst (1h) + statice CacheFirst (30 zile), offline App Shell
- ✅ TICKET-9.3 QA: SW activ + controller, test offline TRECUT (server oprit → pagina + date din cache), manifest valid, HTTPS

**Phase 10 — 🏗️ Investiții și Fonduri (MFE)** (2/3, 2026-08-01)
- ✅ TICKET-10.1 Crawler MFE: 17.879 proiecte europene pe 7 programe (POR 8040, POC 3403, POCU 2948, POIM 2388...) + 29 programe absorbție (29 mai 2026)
- ✅ TICKET-10.2 API + pagina `/buget-si-finante/investitii-si-fonduri`: carduri hero, bare absorbție, tabel cu filtre program/județ/căutare → **4/7 subdomenii live**
- ⏳ TICKET-10.3 QA + state docs

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
- Fără PWA (manifest/service worker) — ✅ REZOLVAT — **Phase 9 completă** (manifest + Serwist SW + offline)
- Fără deploy producție — TICKET-4.1
- Administratori/Acționari pe profil firmă: ✅ REZOLVAT — 3.68M reprezentanți indexați, card live (TICKET-4.5)
- Telefon/Email pe profil firmă: `—` (ONRC nu publică aceste date în open data)

## Session 2026-08-01 (rezumat)

- **Phase 9 — 📱 PWA completă (3/3 tickete)**: manifest `app/manifest.ts` (Next 16 nativ) + iconițe Pillow (192/512/maskable/favicon), service worker **Serwist 9.5** (`@serwist/turbopack`): precache statici build, runtime cache API NetworkFirst (1h) + statice CacheFirst (30 zile), offline App Shell funcțional
- **QA TICKET-9.3**: SW activ + controller, precache 34 entry-uri, **test offline TRECUT** (server oprit → pagina Curs Valutar + 37 valute din cache), manifest valid, HTTPS pass
- **Notă Lighthouse**: categoria PWA a fost eliminată din Lighthouse 12+ — scorul „PWA > 90” nu mai există în LH 13; verificare manuală completă în loc (manifest + SW + offline + HTTPS)
- **Reconciliere cod ↔ docs**: Feature 3 (Situații Financiare) marcat done (era „planificat" în docs, codul era complet de pe 29.07); 2.10–2.12 promovate la done; TICKET_INDEX rescris ca hartă Phase 1–4
- **Fix hydration dev**: `allowedDevOrigins` adăugat în next.config.ts + cache `.next` șters → React hidratează corect în dev, cele 3 grafice Chart.js se desenează (line/bar/donut), filtrele funcționează
- **Verificat live**: homepage → căutare „Autonom" (958 firme, 7 filtre) → profil firmă (stare, CAEN, adresă) → grafice financiare pe firme cu bilanț depus
- **TICKET-4.5 — Administratori și Acționari**: crawler ONRC reprezentanți legali — 3.68M înregistrări indexate, API + card cu badge-uri pe profil
- **Phase 5 — Întreprinderi Publice (AMEPIP)**: 1.259 firme cu capital de stat, 17 indicatori pe an (2019-2023), pagina subdomeniului cu tabel live, card IP pe profil cu mini-chart, navigare completă — 6/6 tickete done
- **Phase 6 — Concurență (CC)**: 2.380 decizii, pagină subdomeniu + filtre + PDF
- **Phase 7 — Buget și Finanțe**: Curs Valutar BNR (37 valute) + Bugetul de Stat (480 rânduri) + pagina domeniului — 2 domenii live
- **Phase 8 — Taxe și Impozite (ANAF)**: 125 indicatori fiscali, 6 trimestre, evoluții ▲/▼ — 3/7 subdomenii live
