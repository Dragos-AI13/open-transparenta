# Ticket 2.2 — Domain Layout (Sidebar + Breadcrumb)

**ID:** TICKET-2.2
**Status:** ✅ Done
**Feature:** 1 — 🏗️ Arhitectura Domeniului (Companii și Comerț)
**Dependențe:** TICKET-2.1 (domain tokens + constants)

## Descriere

Crearea componentelor de layout pentru domeniul Companii: un sidebar cu lista sub-categoriilor, componentă breadcrumb pentru navigare ierarhică, și un wrapper care le combină.

## Cerințe

- [ ] `components/companii/DomainSidebar.tsx` — sidebar vertical cu toate sub-categoriile
- [ ] `components/companii/Breadcrumb.tsx` — breadcrumb care arată calea curentă
- [ ] `components/companii/DomainLayout.tsx` — wrapper care include sidebar + breadcrumb + content

## Fișiere

| Acțiune | Fișier |
|---------|--------|
| ➕ Creează | `src/components/companii/DomainSidebar.tsx` |
| ➕ Creează | `src/components/companii/Breadcrumb.tsx` |
| ➕ Creează | `src/components/companii/DomainLayout.tsx` |

## Detalii tehnice

### DomainSidebar
```
┌─────────────────┐
│ 🏢 Companii     │ ← titlu
│─────────────────│
│ 🏢 Registrul    │ ← link (active state)
│ 📊 Situații     │
│ 🏛️ Întreprinderi│
│ ...             │
└─────────────────┘
```
- Ascuns pe mobil (devine hamburger)
- Link-ul curent evidențiat cu culoarea categoriei
- Folosește `usePathname()` din `next/navigation` pentru active state

### Breadcrumb
```
Companii › Registrul Comerțului
```
- Array de segmente: `[{ label, href }]`
- Primește `segments` ca prop
- Ultimul segment e text (nu link)
- Separator: `›` cu text-muted

### DomainLayout
- Grid pe desktop: sidebar (250px) + content (flex-1)
- Stack pe mobil: sidebar ascuns + toggle
- Include breadcrumb deasupra conținutului

## Acceptanță

- [ ] Sidebar-ul afișează toate cele 8+ sub-categorii
- [ ] Breadcrumb-ul se vede deasupra conținutului
- [ ] `npm run build` trece fără erori
