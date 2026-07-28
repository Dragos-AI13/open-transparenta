# Ticket #1.5 — PWA Manifest + Service Worker

**ID:** TICKET-1.5
**Status:** ⏳ Pending
**Feature:** 1 — 🏗️ Fundația
**Dependențe:** TICKET-1.4 (layout)

## Descriere

Configurare PWA (Progressive Web App) pentru instalare pe ecranul de pornire
al telefonului. Manifest, iconițe, service worker minimal.

## Cerințe

- [ ] `public/manifest.json` — nume, icon, theme_color, display standalone
- [ ] `public/icons/` — iconițe 192x192, 512x512 (generare automată sau manuală)
- [ ] `app/manifest.ts` — route API pentru manifest dinamic (opțional)
- [ ] `<meta name="theme-color">` setat la `#08090b`
- [ ] PWA testabil în Lighthouse (score > 90)

## Detalii tehnice

```json
{
  "name": "Open Transparență",
  "short_name": "OpenTransp",
  "description": "Caută orice dată publică din România",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#08090b",
  "theme_color": "#08090b",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

## Acceptanță

- [ ] `manifest.json` accesibil la `/manifest.json`
- [ ] Site-ul se poate instala pe telefon (Chrome prompt)
- [ ] Lighthouse PWA check > 90
