# Ticket 7.3 — Pagina principală a domeniului `/buget-si-finante` + link homepage

**ID:** TICKET-7.3
**Status:** ✅ Done
**Feature:** 7 — 💰 Buget și Finanțe
**Dependențe:** TICKET-7.2

## Descriere

Creează pagina principală a domeniului „Buget și Finanțe" — hub-ul cu toate subdomeniile (curs valutar acum, buget de stat, taxe, datorie publică etc. pe viitor) — și leagă cardul „💰 Buget și Finanțe" din homepage la ea.

**Asta face domeniul vizibil din homepage** — pattern-ul pe care îl vom repeta pentru fiecare domeniu nou (Sănătate, Educație, etc.).

## Cerințe

- [ ] Pagină `app/buget-si-finante/page.tsx`:
  - Hero: „💰 Buget și Finanțe", descriere („Banii publici ai României — de unde vin, unde se duc"), iconiță, culoare domeniu (`#f59e0b` sau ce e în docs)
  - Grid de subdomenii (carduri):
    - **💱 Curs Valutar** (✅ live — link la `/buget-si-finante/curs-valutar`)
    - 📋 Bugetul de Stat (🔜)
    - 🏘️ Bugete Locale (🔜)
    - 📈 Datoria Publică (🔜)
    - 💳 Taxe și Impozite (🔜)
    - 🏗️ Investiții și Fonduri (🔜)
    - 🗳️ Finanțare Partide (🔜)
  - Fiecare card: iconiță, nume, descriere scurtă, badge „Live" / „În pregătire"
  - Notă sursă: instituțiile din domeniu (MF, ANAF, AEP, BNR, CNI, MFE...)
- [ ] `DomainGrid.tsx` (homepage): adaugă `href: "/buget-si-finante"` la `{ name: "Buget și Finanțe", slug: "buget" }` — cardul devine clickabil (nu mai e `#`)
- [ ] Breadcrumb/navigare: homepage → Buget și Finanțe → Curs Valutar

## Fișiere

| Acțiune | Fișier |
|---------|--------|
| ➕ Creează | `frontend/src/app/buget-si-finante/page.tsx` |
| ➕ Creează | `frontend/src/lib/buget-domains.ts` (datele subdomeniilor domeniului — pattern `companii-domains.ts`) |
| 🔧 Editează | `frontend/src/components/DomainGrid.tsx` |

## Acceptance criteria

- [ ] `/buget-si-finante` afișează pagina domeniului cu toate cardurile de subdomenii
- [ ] Cardul „💰 Buget și Finanțe" din homepage e clickabil → duce la pagina domeniului
- [ ] „💱 Curs Valutar" e marcat Live și duce la pagina subdomeniului
- [ ] Ceilalți subdomenii sunt „În pregătire" (fără dead link — nu `href="#"`)
- [ ] `npm run build` trece

## Security

- **Impact:** none

## Verification

```bash
# Browser:
#   homepage → click „💰 Buget și Finanțe" → /buget-si-finante
#   → click „💱 Curs Valutar" → /buget-si-finante/curs-valutar
```
