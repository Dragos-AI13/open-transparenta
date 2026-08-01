# CHANGELOG — Open Transparență

**Format:** Based on [Keep a Changelog](https://keepachangelog.com/).

---

## [2026-08-01] — Reconciliere cod ↔ docs

### Changed
- TICKET_INDEX.md rescris ca hartă de ansamblu (era în urmă cu structura veche Phase 1/2/3)
- Feature 3 (Situații Financiare) marcat ✅ done în TICKET_INDEX-F2.md — codul era complet de pe 29.07, docs ziceau „planificat”
- NEXT_ACTIONS.md: 2.10–2.12 + 3.1–3.5 promovate la done; next real = PWA, deploy
- PROJECT_STATUS.md: Phase 2+3 complete, secțiune de reconcilere adăugată

### Verified
- `npx next build` — compilează curat; rutele `/companii/cauta`, `/companii/firma/[cui]`, `/api/companies/search`, `/api/companies/[cui]`, `/api/financiar/[cui]` toate prezente în build
- Rutele există: 3 API routes + 2 pagini dinamice + pagina domeniu + 9 sub-categorii SSG

---

## [2026-07-29] — TICKET-2.9: API Routes + Stare Parser

### Added
- `GET /api/companies/search?q=...` — search endpoint with filters (judet, localitate, forma_juridica, stare), pagination, Cache-Control headers, facet distribution
- `GET /api/companies/{cui}` — company detail endpoint, searches by CUI field
- `crawler/parse_stare_firma.py` — downloads OD_STARE_FIRMA.CSV + N_STARE_FIRMA.CSV nomenclator, maps COD→stare, populates 4.2M companies in Meilisearch (75k docs/sec)
- Search Results Page (`/companii/cauta`) cu filtre complete: județ, localitate, formă juridică, stare, secțiune CAEN, website, sortare, paginare
- CompanyCard, SearchFilters, Pagination, SearchBar componente
- CAEN Parser: 2.8M firme populate cu cod CAEN + denumire + secțiune
- Unicode normalization în toate scripturile (prevenire `ț`/`ţ` encoding issues)

### Fixed
- Gramatica românească: "958 de firme găsite" (era "958 firmăi găsităe")
- Encoding stare: normalizează diacriticele românești (ț/ș cu virgulă vs cedilă vs `?`)
- Search bar activat pe homepage + pagina de căutare + pagina companii (era `disabled`)
- Search bar adăugat și pe pagina de rezultate
- CAEN section adăugat în CompanyDoc type
- Diacritice matching în CKAN dataset title detection

### Changed
- Updated TICKET-2.9 status: pending → done
- State docs: PROJECT_STATUS, NEXT_ACTIONS updated

### Verified
- `npm run build` — compiles cleanly, no warnings
- `curl /api/companies/search?q=Autonom` — returns hits with facetDistribution
- `curl /api/companies/RO10654053` — returns company by CUI (not just document ID)
- Crawler ONRC: 4,201,586 firme already indexed from real data.gov.ro data
- Stare parser: 4,197,473 firme updated with stare values in ~56s (75k docs/s)

### Added
- Repository bootstrapped with Next.js 16 + Tailwind v4 + TypeScript
- Design tokens: bg layers, text hierarchy, 17 domain colors, status colors, border tokens, shadows, animations
- Layout components: Header (logo + nav), Footer (sources + license)
- Homepage: hero section with search bar placeholder, domain grid (17 domains with color dots)
- Meilisearch v1.12.8 running in Docker on port 7700
- State files: PROJECT_STATUS.md, NEXT_ACTIONS.md, CHANGELOG.md

### Changed
- Replaced default Next.js template with custom dark theme
- layout.tsx: Inter + JetBrains Mono fonts, viewport config

### Fixed
- themeColor warning (moved from metadata to viewport export)

### Verified
- `npm run build` — compiles cleanly, no warnings
- Dev server — http://localhost:3000 responds 200
- Meilisearch — health check returns `{"status":"available"}`
