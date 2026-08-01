# Ticket 5.5 — Integrare sidebar + navigare cap-coadă

**ID:** TICKET-5.5
**Status:** 📋 ready
**Feature:** 5 — 🏛️ Întreprinderi Publice
**Dependențe:** TICKET-5.3, TICKET-5.4

## Descriere

Face subdomeniul „Întreprinderi Publice" complet funcțional în navigație: sidebar-ul are deja link-ul „🏛️ Întreprinderi Publice" (din Feature 2) — verifică că duce la pagina nouă și că toate căile de navigare funcționează cap-coadă.

## Cerințe

- [ ] Link-ul sidebar „🏛️ Întreprinderi Publice" → `/companii/intreprinderi-publice` (verifică dacă deja e, dacă nu, adaugă)
- [ ] Sub-category page din `/companii` (grid-ul de sub-categorii) → link corect
- [ ] Breadcrumb: Companii și Comerț › Întreprinderi Publice (și înapoi)
- [ ] Flow cap-coadă verificat în browser:
  - Homepage → Companii → Întreprinderi Publice → tabel → click firmă → profil → Înapoi la căutare
  - Sidebar → Întreprinderi Publice → profil → înapoi
- [ ] Header-ul „Companii" (nav globală) funcțional

## Fișiere

| Acțiune | Fișier |
|---------|--------|
| 🔧 Editează | `frontend/src/components/companii/DomainSidebar.tsx` (dacă e nevoie) |
| 🔧 Editează | `frontend/src/lib/companii-domains.ts` (dacă sub-categoria există ca date statice) |

## Acceptance criteria

- [ ] Toate linkurile/butoanele din flow funcționează (fără dead links)
- [ ] Verificat manual în browser, cap-coadă
- [ ] `npm run build` trece

## Security

- **Impact:** none

## Verification

```bash
# Browser manual — toate rutele:
/companii → /companii/intreprinderi-publice → /companii/firma/RO54760 → înapoi
```
