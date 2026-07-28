# Ticket 2.12 — Connect Search Bar + Navigation Flow

**ID:** TICKET-2.12
**Status:** ⏳ Pending
**Feature:** 2 — 🏢 Registrul Comerțului (ONRC)
**Dependențe:** TICKET-2.10, TICKET-2.11 (search results + profile page)

## Descriere

Conectarea tuturor pieselor și lustruirea flow-ului de navigare pentru Feature 2: search bar-ul de pe `/companii` devine funcțional, link-urile din grid-ul de pe homepage și din sidebar duc la căutare, și întregul flow e smooth.

## Cerințe

- [ ] Search bar-ul de pe `/companii` nu mai e disabled — scriu și apas Enter → mă duce la `/companii/cauta?q=termen`
- [ ] După search, focus pe input-ul din pagina de căutare
- [ ] Link-ul „Companii și Comerț" din grid-ul de domenii de pe homepage duce la `/companii`
- [ ] Buton „Caută în registrul comerțului" pe pagina sub-categoriei `registrul-comertului`
- [ ] Sidebar-ul are link „Căutare firmă" evidențiat când ești pe `/companii/cauta`
- [ ] Link-urile din cardurile de pe `/companii` duc corect
- [ ] Loading state la căutare (spinner sau schelet)
- [ ] Submit cu Enter + buton de căutare în search bar

## Fișiere

| Acțiune | Fișier |
|---------|--------|
| 🔧 Editează | `src/components/companii/DomainSearch.tsx` |
| 🔧 Editează | `src/components/companii/DomainSidebar.tsx` |
| 🔧 Editează | `src/app/companii/page.tsx` |
| 🔧 Editează | `src/app/companii/registrul-comertului/page.tsx` |

## Detalii tehnice

### DomainSearch activ
```tsx
// În loc de disabled, face navigate la search
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (query.trim()) {
    router.push(`/companii/cauta?q=${encodeURIComponent(query.trim())}`);
  }
};
```
- Input controlat (useState)
- Submit pe Enter + buton
- Debounce nu e necesar (facem navigare, nu căutare live)

### Sidebar actualizat
Adăugăm intrare separată „🔍 Căutare firmă" în sidebar, deasupra categoriilor, care e activă când pathname e `/companii/cauta`.

### Sidebar update
```
📋 Toate datele
🔍 Căutare firmă        ← nou
────────────────────
🏢 Registrul Comerțului
📊 Situații Financiare
...
```

## Acceptanță

- [ ] Scriu „Autonom" în search bar, Enter → navighez la `/companii/cauta?q=Autonom`
- [ ] Input-ul din search page e focusat automat
- [ ] Sidebar-ul arată „🔍 Căutare firmă" și e activ când sunt pe search
- [ ] Click pe „Companii și Comerț" pe homepage → duc la `/companii`
- [ ] Loading state apare în timpul căutării
- [ ] `npm run build` trece
