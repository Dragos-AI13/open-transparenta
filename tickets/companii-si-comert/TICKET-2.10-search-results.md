# Ticket 2.10 — Search Results Page (/companii/cauta)

**ID:** TICKET-2.10
**Status:** ⏳ Pending
**Feature:** 2 — 🏢 Registrul Comerțului (ONRC)
**Dependențe:** TICKET-2.9 (API routes)

## Descriere

Pagina de rezultate a căutării la `/companii/cauta?q=...` care afișează firmele găsite, cu filtre laterale (județ, formă juridică, stare) și paginare.

## Cerințe

- [ ] Rută: `app/companii/cauta/page.tsx` (sau `/cauta` ca rută dinamică)
- [ ] Citește `q`, `page`, `judet`, `forma_juridica`, `stare` din search params
- [ ] Fetch date de la `/api/companies/search` pe server (SSR/SSG) sau client
- [ ] Afișează:
  - Numărul total de rezultate + textul căutat
  - Listă de carduri firmă (denumire, CUI, județ, formă juridică, stare, CAEN)
  - Sidebar/pane cu filtre: județ (dropdown), formă juridică (checkbox), stare (radio)
  - Paginare (← 1 2 3 ... →)
- [ ] La schimbare filtru, se face navigate la `?q=...&judet=...&page=1`
- [ ] Dacă `q` e gol, arată un mesaj „Introdu un termen de căutare"
- [ ] Dacă n-ai rezultate, arată „Nicio firmă găsită"

## Fișiere

| Acțiune | Fișier |
|---------|--------|
| ➕ Creează | `src/app/companii/cauta/page.tsx` |
| ➕ Creează | `src/components/companii/SearchFilters.tsx` |
| ➕ Creează | `src/components/companii/CompanyCard.tsx` |
| ➕ Creează | `src/components/companii/Pagination.tsx` |

## Detalii tehnice

### CompanyCard
```
┌─────────────────────────────────────┐
│ AUTONOM SERVICE SRL                 │
│ RO12345678 · București · Activă     │
│ 📁 6201 — Software la comandă       │
└─────────────────────────────────────┘
```
- Link către `/companii/firma/{cui}`
- Starea e colorată: verde (Activă), roșu (Dizolvată), gri (Inactivată)

### SearchFilters
- Dropdown județ (toate județele din care avem firme)
- Checkbox-uri formă juridică
- Radio buttons stare (Toate, Activă, Dizolvată, Inactivată)
- Buton „Resetează filtre"

### Pagination
- `← Următoarea · Pagina X din Y · Precedenta →`
- Ascunde când e o singură pagină

## Acceptanță

- [ ] `/companii/cauta?q=Autonom` — apare cardul firmei
- [ ] Click pe card → duce la `/companii/firma/{cui}`
- [ ] Schimb filtru → URL se actualizează, rezultatele se reîncarcă
- [ ] Paginarea funcționează
- [ ] 0 rezultate → mesaj prietenos
- [ ] `npm run build` trece
