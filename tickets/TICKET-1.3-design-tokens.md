# Ticket #1.3 — Design Tokens + Theme Config

**ID:** TICKET-1.3
**Status:** ⏳ Pending
**Feature:** 1 — 🏗️ Fundația
**Dependențe:** TICKET-1.2 (are nevoie de Next.js + Tailwind)

## Descriere

Configurare design tokens în Tailwind: culori per domeniu, background layers,
text hierarchy, status colors, breakpoints, animații. Totul în `tailwind.config.ts`.

## Cerințe

- [ ] Culori per domeniu (17 culori) în `tailwind.config.ts` → `colors.domain.*`
- [ ] Background layers: `bg-deep`, `bg-surface`, `bg-elevated`, `bg-input`
- [ ] Text hierarchy: `text-primary`, `text-secondary`, `text-muted`
- [ ] Status colors: `status-online`, `status-warning`, `status-error`, `status-archived`
- [ ] Border tokens: `border-subtle`, `border-default`
- [ ] Extend: borderRadius, fontFamily, boxShadow, animation
- [ ] Variabile CSS corespunzătoare în `globals.css`
- [ ] Fișier separat `lib/design-tokens.ts` cu constantele (opțional)

## Detalii tehnice

```typescript
// tailwind.config.ts — exemplu
colors: {
  'bg-deep': '#08090b',
  'bg-surface': '#121317',
  'bg-elevated': '#1a1c23',
  'bg-input': '#1e2030',
  'text-primary': '#f0f1f5',
  'text-secondary': '#a0a5b5',
  'text-muted': '#6b7084',
  domain: {
    buget: '#10b981',
    sanatate: '#f43f5e',
    // ... toate 17
  }
}
```

## Acceptanță

- [ ] Clase Tailwind `bg-bg-deep`, `text-text-primary`, `border-border-subtle` funcționează
- [ ] Clase `text-domain-sanatate` etc. funcționează per domeniu
- [ ] Dark mode aplicat default în `globals.css`
