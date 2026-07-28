# Ticket #1.4 — Base Layout Components

**ID:** TICKET-1.4
**Status:** ✅ Done
**Feature:** 1 — 🏗️ Fundația
**Dependențe:** TICKET-1.3 (design tokens)

## Descriere

Componentele de bază ale layout-ului: Header, Footer, main wrapper,
și pagina principală placeholder cu search bar + grila domeniilor (placeholder vizual).

## Cerințe

- [ ] `components/layout/Header.tsx` — logo + trending + about link
- [ ] `components/layout/Footer.tsx` — surse, licență, link GitHub
- [ ] `components/layout/MainLayout.tsx` — wrapper cu header + footer
- [ ] `app/layout.tsx` — updated să folosească MainLayout
- [ ] `app/page.tsx` — search bar centrat + titlu
- [ ] Toate componentele respectă dark design system
- [ ] Responsive: header colapsează pe mobil

## Detalii tehnice

```
Header:
├── Logo „Open Transparență" (stânga)
├── Trending tags (centru, opțional, ascuns pe mobil)
└── Link About (dreapta)

Footer:
├── Text: Date preluate de la 100+ instituții publice
├── Link GitHub
└── Licență MIT
```

## Acceptanță

- [ ] Pagina principală arată search bar centrat
- [ ] Header + footer se văd pe toate paginile
- [ ] Arată bine pe mobile (max 400px)
- [ ] Fundal dark, text alb, fără scroll bar inutil
