# CHANGELOG — Open Transparență

**Format:** Based on [Keep a Changelog](https://keepachangelog.com/).

---

## [2026-07-28] — Initial Setup + Frontend Foundation

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
