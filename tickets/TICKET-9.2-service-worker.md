# Ticket 9.2 — Service worker Serwist (cache runtime + offline)

**ID:** TICKET-9.2
**Status:** ✅ Done
**Feature:** 9 — 📱 PWA
**Dependențe:** TICKET-9.1

## Rezultat implementare (2026-08-01)

- **Serwist 9.5.12 cu `@serwist/turbopack`** (NU `@serwist/next` — nu suportă Turbopack din Next 16)
- Pattern-ul turbopack (diferit de cel clasic):
  - `next.config.ts` → `withSerwist(nextConfig)` simplu (doar adaugă serverExternalPackages)
  - `src/app/sw.ts` → service worker (clasa `Serwist` din serwist 9.5: `precacheEntries` + `runtimeCaching`)
  - `src/app/sw/[path]/route.ts` → `createSerwistRoute` (route handler DINAMIC — cheia `[path]`)
  - `SerwistProvider` în layout cu `swUrl="/sw/sw.js"`
- **Verificat live:** SW activ pe producție (port 3011), precache 34 entries, **test offline TRECUT** (server oprit → pagina s-a încărcat din precache)
- API-uri: NetworkFirst (1h cache) · statici: CacheFirst (30 zile) · navigație: precache
- Erori rezolvate: API-ul 9.5 nu mai are `precacheAndRoute`/`registerRoute` (acum clasa `Serwist`), importurile din root (`serwist/expiration` nu există), `__SW_MANIFEST` tipizat, swSrc cale relativă `src/app/sw.ts`

## Descriere

Service worker cu Serwist (@serwist/next + @serwist/cli) — precache-ul staticelor (workbox) + cache runtime pentru API-uri. Site-ul funcționează offline și se încarcă instant la re-vizită.

## Cerințe

- [ ] Instalare:
  ```bash
  npm install @serwist/next@9.5.12 @serwist/cli@9.5.12
  ```
- [ ] `frontend/sw.ts` — service worker:
  - `precacheAndRoute(self.__SW_MANIFEST)` — staticile build-ului (JS/CSS/HTML)
  - Runtime caching:
    - `/api/*` → `NetworkFirst` cu `cacheName: "api-cache"`, expiration 1h, maxEntries 100
    - `/icons/*`, `/*.png`, `/*.svg` → `CacheFirst` cu `cacheName: "static-assets"`
    - `/` + pagini → `NetworkFirst` cu `cacheName: "pages"`
  - Navigație offline: fallback la `index.html` (App Shell)
- [ ] `next.config.ts` — wrap cu Serwist:
  ```ts
  import withSerwistInit from "@serwist/next";
  const withSerwist = withSerwistInit({
    swSrc: "sw.ts",
    swDest: "public/sw.js",
    disable: process.env.NODE_ENV === "development",
  });
  const nextConfig: NextConfig = { allowedDevOrigins: [...] };
  export default withSerwist(nextConfig);
  ```
- [ ] `sw.ts` cu `declare const self: ServiceWorkerGlobalScope;` (TS tipat)
- [ ] Opțional: `registerSW()` client — Serwist injectează registrarea automat (nu e nevoie manual)

## Fișiere

| Acțiune | Fișier |
|---------|--------|
| ➕ Creează | `frontend/sw.ts` |
| 🔧 Editează | `frontend/next.config.ts` (wrap withSerwist) |
| 🔧 Editează | `frontend/package.json` (dependințe + script `build` intact) |

## Detalii tehnice

- **De ce Serwist și nu next-pwa:** next-pwa 5.6 nu suportă corect App Router/Turbopack; Serwist 9.5.12 e standardul modern (peer next >= 14)
- **Dezactivat în dev** (`disable: NODE_ENV === "development"`) — service worker-ul interferează cu HMR/Turbopack; testăm pe build de producție
- **Precache automat**: Serwist generează `self.__SW_MANIFEST` la build (toate staticile din `.next/static` + `public/`)
- API caching: NetworkFirst cu timeout — datele proaspete online, cache la offline; NICIODATĂ CacheFirst pe API (risc date vechi)

## Acceptance criteria

- [ ] `npm run build` → `public/sw.js` generat + manifest în SW
- [ ] Chrome DevTools → Application → Service Workers: **activated and running**
- [ ] Reload offline (Network tab → Offline) → pagina se încarcă din precache
- [ ] `/api/curs-valutar` funcționează offline (din cache) sau eșuează elegant (fără crash)
- [ ] Fără erori în consolă la navigare normală

## Security

- **Impact:** none — service worker local, doar caching; nu interceptează cereri cross-origin

## Verification

```bash
cd frontend && npm run build
ls -la public/sw.js
# Chrome: DevTools → Application → Service Workers → inspect + offline test
```
