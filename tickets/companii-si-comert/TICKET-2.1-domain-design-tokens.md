# Ticket 2.1 — Domain Design Tokens + Constants

**ID:** TICKET-2.1
**Status:** ✅ Done
**Feature:** 1 — 🏗️ Arhitectura Domeniului (Companii și Comerț)
**Dependențe:** TICKET-1.3 (design tokens globale)

## Descriere

Adăugare culori specifice pentru cele 8 sub-categorii ale domeniului Companii în sistemul de design, plus fișier de constante cu metadatele fiecărei sub-categorii (nume, slug, culoare, iconiță, descriere).

## Sub-categorii

| # | Sub-categorie | Slug | Culoare |
|---|---------------|------|---------|
| 1 | Registrul Comerțului | registrul-comertului | `#f97316` (portocaliu) |
| 2 | Situații Financiare | situatii-financiare | `#10b981` (verde) |
| 3 | Întreprinderi Publice | intreprinderi-publice | `#3b82f6` (albastru) |
| 4 | Piață de Capital | piata-de-capital | `#8b5cf6` (violet) |
| 5 | Pensii Private | pensii-private | `#ec4899` (roz) |
| 6 | Asigurări | asigurari | `#06b6d4` (cyan) |
| 7 | Protecția Consumatorului | protectia-consumatorului | `#ef4444` (roșu) |
| 8 | Concurență | concurenta | `#f59e0b` (galben) |
| 9 | Drepturi de Autor | drepturi-de-autor | `#84cc16` (lime) |

## Cerințe

- [ ] Culori adăugate în `globals.css` → `--color-category-{slug}`
- [ ] Fișier `lib/companii-domains.ts` cu array de obiecte (toate cele 8+)
- [ ] Fiecare obiect conține: `{ slug, name, color, icon, shortDesc, fullDesc, sourceCount }`

## Fișiere

| Acțiune | Fișier |
|---------|--------|
| 🔧 Editează | `src/app/globals.css` |
| ➕ Creează | `src/lib/companii-domains.ts` |

## Detalii tehnice

### globals.css — adăugat în blocul `@theme`
```css
--color-category-registrul-comertului: #f97316;
--color-category-situatii-financiare: #10b981;
--color-category-intreprinderi-publice: #3b82f6;
--color-category-piata-de-capital: #8b5cf6;
--color-category-pensii-private: #ec4899;
--color-category-asigurari: #06b6d4;
--color-category-protectia-consumatorului: #ef4444;
--color-category-concurenta: #f59e0b;
--color-category-drepturi-de-autor: #84cc16;
```

### lib/companii-domains.ts
```typescript
export interface CompaniiCategory {
  slug: string;
  name: string;
  color: string;
  icon: string; // emoji
  shortDesc: string;
  fullDesc: string;
  sourceCount: number;
}

export const companiiCategories: CompaniiCategory[] = [
  {
    slug: "registrul-comertului",
    name: "Registrul Comerțului",
    color: "#f97316",
    icon: "🏢",
    shortDesc: "Toate firmele din România",
    fullDesc: "...",
    sourceCount: 76,
  },
  // ... restul
];
```

## Acceptanță

- [ ] `npm run build` trece fără erori
- [ ] Clasele `bg-category-registrul-comertului` etc. funcționează
- [ ] Array-ul `companiiCategories` e importabil și complet
