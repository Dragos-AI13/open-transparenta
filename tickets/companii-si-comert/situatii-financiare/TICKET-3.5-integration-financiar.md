# Ticket 3.5 — Integrare Sidebar + Feature Flags + Naming

**ID:** F3.5
**Status:** ⏳ Pending
**Feature:** 3 — 📊 Situații Financiare
**Dependențe:** F3.3, F3.4

## Descriere

Integrarea finală a feature-ului în aplicație: sidebar, navigare, denumire corectă, feature flags pentru datele încă neimplementate.

## Cerințe

- [ ] Sidebar: link "📊 Situații Financiare" în `DomainSidebar.tsx`
  - Active când ești pe `/companii/situatii-financiare` (dacă există pagină dedicată)
  - Sau link direct către căutare cu filtru (?)
- [ ] Pagina `/companii/situatii-financiare` — landing page cu descrierea datelor
  - Similar cu `/companii/registrul-comertului`
  - Descrie ce indicatori sunt disponibili, ce ani, cum se folosesc
  - Link "🔍 Caută o firmă" → `/companii/cauta`
- [ ] Actualizare `companii-data.ts`:
  - Adăugare surse reale de date (Ministerul Finanțelor)
  - Feature link "Accesează →" pentru Situații Financiare
- [ ] În profilul firmei: secțiunea placeholder înlocuită cu date reale
  - F3.3 + F3.4 înlocuiesc cele 2 placeholder-uri
  - Dacă nu sunt date → "Date financiare indisponibile"
- [ ] Feature flags în config (opțional):
  - `features.financiar: true` în `.env`
  - Sidebar-ul arată link doar dacă feature-ul e activ

## Fișiere

| Acțiune | Fișier |
|---------|--------|
| 🔧 Editează | `src/components/companii/DomainSidebar.tsx` |
| ➕ Creează | `src/app/companii/situatii-financiare/page.tsx` |
| 🔧 Editează | `src/lib/companii-data.ts` |
| 🔧 Editează | `src/lib/companii-domains.ts` | (dacă e nevoie)

## Acceptanță

- [ ] Sidebar-ul arată "📊 Situații Financiare"
- [ ] Click pe Situații Financiare → landing page cu descriere
- [ ] Profilul firmei arată date financiare reale (nu placeholder)
- [ ] DomainGrid pe homepage are link funcțional
- [ ] `npm run build` trece
