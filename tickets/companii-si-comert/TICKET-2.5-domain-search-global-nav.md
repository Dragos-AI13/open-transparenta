# Ticket 2.5 — Domain Search Bar + Global Nav Update

**ID:** TICKET-2.5
**Status:** ✅ Done
**Feature:** 1 — 🏗️ Arhitectura Domeniului (Companii și Comerț)
**Dependențe:** TICKET-2.3 (route group + homepage)

## Descriere

Adăugarea unui search bar specific domeniului pe pagina principală `/companii` (UI-only, fără backend încă) și actualizarea header-ului global cu un link „Companii" care devine activ când utilizatorul e pe orice pagină `/companii/*`.

## Cerințe

- [ ] `components/companii/DomainSearch.tsx` — search bar cu placeholder specific
- [ ] Search bar-ul e integrat în `/companii/page.tsx` (sub hero)
- [ ] Input-ul e decorativ (disabled sau cu notificare „în curând")
- [ ] Header-ul global are link „Companii" în navigare
- [ ] Link-ul „Companii" e evidențiat (active) când userul e pe `/companii/*`
- [ ] Link-ul „Domenii" din header duce la `/companii` (sau la un dropdown în viitor)

## Fișiere

| Acțiune | Fișier |
|---------|--------|
| ➕ Creează | `src/components/companii/DomainSearch.tsx` |
| 🔧 Editează | `src/components/layout/Header.tsx` |
| 🔧 Editează | `src/app/companii/page.tsx` |

## Detalii tehnice

### DomainSearch
```tsx
// Search bar placeholder, disabled până avem backend
<DomainSearch
  placeholder="Caută o firmă după nume, CUI sau domeniu..."
  onSearch={() => {}}
/>
```

Stil: similar cu search bar-ul de pe pagina principală, dar mai compact.

### Header — active link
Folosește `usePathname()`:
- `/companii` sau `/companii/*` → link „Companii" e `text-text-primary` + `bg-bg-elevated`
- Alte rute → link normal `text-text-secondary`

### Header — navigare actualizată
```
[OT Open Transparență]  [Companii] [Domenii] [Despre] [GitHub]
```

## Acceptanță

- [ ] Search bar-ul apare pe `/companii` și arată placeholder-ul corect
- [ ] Link „Companii" apare în header
- [ ] Când ești pe `/companii/*`, link-ul e evidențiat
- [ ] `npm run build` trece
