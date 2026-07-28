# Ticket 2.6 — Mobile Responsive + Navigation State

**ID:** TICKET-2.6
**Status:** ✅ Done
**Feature:** 1 — 🏗️ Arhitectura Domeniului (Companii și Comerț)
**Dependențe:** TICKET-2.4, TICKET-2.5 (sub-category pages + search)

## Descriere

Finisarea layout-ului pentru mobile și desktop: sidebar colapsabil pe mobil, grid responsive, tranziții și stări vizuale pentru navigare.

## Cerințe

- [ ] Sidebar-ul se ascunde pe mobil (< 768px) și apare printr-un toggle button
- [ ] Toggle button: ☰ în stânga sus, lângă breadcrumb
- [ ] Animație de slide-in/out pentru sidebar pe mobil
- [ ] Grid-ul de carduri de pe homepage: 2 coloane pe mobil, 3 pe tabletă, 4 pe desktop
- [ ] Cardurile au hover state consistent (border + bg change)
- [ ] Link-ul activ din sidebar are un indicator (linie colorată în stânga + text bold)
- [ ] Sidebar-ul e sticky pe desktop (scroll cu pagina)
- [ ] Tranziții smooth pe toate interactiunile
- [ ] Testat la 400px lățime (mobile)

## Fișiere

| Acțiune | Fișier |
|---------|--------|
| 🔧 Editează | `src/components/companii/DomainLayout.tsx` |
| 🔧 Editează | `src/components/companii/DomainSidebar.tsx` |
| 🔧 Editează | `src/app/companii/page.tsx` |
| 🔧 Editează | `src/app/companii/[slug]/page.tsx` |

## Detalii tehnice

### Mobile sidebar behavior
```
Desktop:                           Mobile:
┌─────────┬──────────────────┐     ┌──────────────────┐
│ Sidebar │ Content          │     │ ☰ Companii › ... │ ← toggle + breadcrumb
│ (250px) │                  │     │──────────────────│
│         │                  │     │                  │
│ 🏢 Reg. │                  │     │ Content          │
│ 📊 Sit. │                  │     │                  │
│ ...     │                  │     │                  │
└─────────┴──────────────────┘     └──────────────────┘
                                        ↓ (tap ☰)
                                   ┌──────────────────┐
                                   │ ☒ Sidebar        │ ← overlay
                                   │ 🏢 Registrul     │
                                   │ 📊 Situații      │
                                   │ ...              │
                                   └──────────────────┘
```

### Card grid breakpoints
```css
grid-cols-2 sm:grid-cols-3 lg:grid-cols-4
```

### Active link indicator
```css
/* În sidebar: link-ul activ are o bordură colorată în stânga */
border-l-2 border-category-{slug}
```

## Acceptanță

- [ ] Pe mobil (< 768px), sidebar-ul e ascuns inițial
- [ ] Tap pe ☰ → sidebar-ul apare cu animație
- [ ] Grid-ul se adaptează: 2 col → 3 col → 4 col
- [ ] Link-ul activ din sidebar e evident (border stânga colorat + text bold)
- [ ] Hover pe carduri: border + bg se schimbă
- [ ] Sidebar-ul e sticky pe desktop
- [ ] Totul arată bine la 400px lățime
- [ ] `npm run build` trece
