# Ticket 2.3 — Route Group + Domain Homepage

**ID:** TICKET-2.3
**Status:** ✅ Done
**Feature:** 1 — 🏗️ Arhitectura Domeniului (Companii și Comerț)
**Dependențe:** TICKET-2.2 (domain layout)

## Descriere

Crearea rutei `/companii` cu layout-ul specific domeniului și pagina principală care prezintă toate cele 8 sub-categorii sub formă de carduri.

## Cerințe

- [ ] Director `app/companii/` cu propriul `layout.tsx`
- [ ] Layout folosește `DomainLayout` (sidebar + breadcrumb)
- [ ] Metadata specifică domeniului (title, description)
- [ ] `page.tsx` cu hero section + grilă de carduri pentru fiecare sub-categorie
- [ ] Fiecare card arată: iconiță, nume, descriere scurtă, număr surse, culoare
- [ ] Cardurile sunt linkuri către `/companii/[slug]`

## Fișiere

| Acțiune | Fișier |
|---------|--------|
| ➕ Creează | `src/app/companii/layout.tsx` |
| ➕ Creează | `src/app/companii/page.tsx` |

## Detalii tehnice

### layout.tsx
```tsx
import { DomainLayout } from "@/components/companii/DomainLayout";

export const metadata = {
  title: "Companii și Comerț — Open Transparență",
  description: "...",
};

export default function CompaniiLayout({ children }: { children: React.ReactNode }) {
  return <DomainLayout>{children}</DomainLayout>;
}
```

### page.tsx — Card Grid
```
┌─────────────────────────────────────────────────┐
│ 🏢 Companii și Comerț                           │
│ Toate datele publice despre firme din România   │
│                                                  │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐            │
│ │🏢    │ │📊    │ │🏛️    │ │📈    │            │
│ │Reg.  │ │Sit.  │ │Într. │ │Piață │            │
│ │Com.  │ │Fin.  │ │Pub.  │ │Cap.  │            │
│ └──────┘ └──────┘ └──────┘ └──────┘            │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐            │
│ │💰    │ │🛡️    │ │⚖️    │ │💎    │            │
│ │Pensii│ │Asig. │ │ANPC  │ │ORDA  │            │
│ └──────┘ └──────┘ └──────┘ └──────┘            │
└─────────────────────────────────────────────────┘
```

Grid: 2 col pe mobil, 3 col pe tabletă, 4 col pe desktop.

## Acceptanță

- [ ] `/companii` răspunde 200 și arată pagina cu carduri
- [ ] Fiecare card are iconița, numele, descrierea, numărul de surse
- [ ] Click pe card duce la `/companii/[slug]` (chiar dacă pagina e 404 momentan)
- [ ] Sidebar-ul se vede cu companii în context
- [ ] `npm run build` trece
