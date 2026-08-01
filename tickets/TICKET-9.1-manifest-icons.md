# Ticket 9.1 — Manifest PWA + iconițe (app/manifest.ts + public/icons)

**ID:** TICKET-9.1
**Status:** 📋 ready
**Feature:** 9 — 📱 PWA
**Dependențe:** —

## Descriere

Manifest PWA valid + iconițe instalabile. Folosim suportul nativ Next.js 16: `app/manifest.ts` (manifest dinamic, tipat) + `public/icons/` generate.

## Cerințe

- [ ] `src/app/manifest.ts` — export `MetadataRoute.Manifest`:
  ```ts
  import type { MetadataRoute } from "next";

  export default function manifest(): MetadataRoute.Manifest {
    return {
      name: "Open Transparență — Caută orice dată publică din România",
      short_name: "OpenTransp",
      description: "Motor de căutare pentru toate datele publice din România. Instant. Gratuit. Open-source.",
      start_url: "/",
      display: "standalone",
      background_color: "#08090b",
      theme_color: "#08090b",
      icons: [
        { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
        { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      ],
    };
  }
  ```
- [ ] `public/icons/` — generare iconițe (Pillow/script Python sau sharp):
  - `icon-192.png`, `icon-512.png` (cu fundal #08090b + simbol, ex. 🔎 sau "OT" stilizat)
  - `maskable-512.png` (purpose maskable — padding 20% safe zone)
- [ ] `src/app/icon.tsx` (opțional) — favicon dinamic Next.js 16, sau `public/favicon.ico` clasic
- [ ] `<meta name="apple-mobile-web-app-capable">` + `apple-touch-icon` în `layout.tsx` (iOS instalare)

## Fișiere

| Acțiune | Fișier |
|---------|--------|
| ➕ Creează | `frontend/src/app/manifest.ts` |
| ➕ Creează | `frontend/public/icons/icon-192.png`, `icon-512.png`, `maskable-512.png` |
| ➕ Creează | `frontend/scripts/generate_icons.py` (reproducibil) |
| 🔧 Editează | `frontend/src/app/layout.tsx` (meta iOS + apple-touch-icon) |

## Detalii tehnice

- Generare iconițe: script Python cu Pillow — fundal `#08090b`, gradient subtil, simbol „OT" (font bold) sau lupă; raza colțurilor pentru non-maskable
- `maskable-512` = iconița pe fundal plin #08090b cu simbolul în centru (safe zone 80%)
- Manifest-ul trebuie să aibă `name` + `short_name` diferite (cerință Lighthouse)

## Acceptance criteria

- [ ] `/manifest.json` → 200, JSON valid, toate câmpurile
- [ ] Iconițele există și au dimensiunile corecte (192/512)
- [ ] `npm run build` trece (manifest.ts tipat)
- [ ] Lighthouse Manifest OK

## Security

- **Impact:** none — fișiere statice publice

## Verification

```bash
curl -s http://localhost:3000/manifest.json | python -m json.tool | head
ls -la public/icons/
```
