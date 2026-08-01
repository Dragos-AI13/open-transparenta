# TICKET INDEX — Phase 9: 📱 PWA (Manifest + Service Worker)

**Feature:** Configurare PWA (Progressive Web App) — site-ul devine instalabil pe telefon/desktop, cu suport offline. Completează fundația (era TICKET-1.5/4.2 în planurile vechi, niciodată implementat).

**Context tehnic (verificat 2026-08-01):**
- Next.js **16.2.12** (Turbopack) — suport nativ: `app/manifest.ts` (manifest dinamic), `app/icon.tsx` (iconițe generate)
- **Serwist 9.5.12** disponibil (`@serwist/next`, peer: next >= 14) — standardul modern pentru service worker pe App Router
- `next-pwa` 5.6.0 e vechi (nu suportă bine App Router) → **folosim Serwist**
- `public/` are doar iconițele default Next.js (vercel.svg etc.) — fără favicon custom, fără iconițe PWA
- `layout.tsx` are deja `viewport: { themeColor: "#08090b" }`
- Nu există `manifest.json`, nici service worker

**Status:** 📋 Planificat

---

| ID | Ticket | Status | Depends On | Efort |
|----|--------|--------|------------|-------|
| 9.1 | Manifest PWA + iconițe (app/manifest.ts + icons) | ⏳ pending | — | ~25 min |
| 9.2 | Service worker Serwist (cache runtime + offline) | ⏳ pending | 9.1 | ~30 min |
| 9.3 | QA + Lighthouse + state docs | ⏳ pending | 9.2 | ~20 min |

**Total efort estimat:** ~75 minute

---

## Dependency Graph

```
9.1 → 9.2 → 9.3
```

## Verification (end of feature)

- [ ] `/manifest.json` → manifest valid (nume, iconițe, theme_color)
- [ ] Chrome DevTools → Application → Manifest OK; Service Worker activ
- [ ] Site-ul se poate **instala** (prompt Chrome / desktop)
- [ ] Reload offline (Workbox precache) → pagina se încarcă
- [ ] Lighthouse PWA score > 90
- [ ] State docs actualizate
