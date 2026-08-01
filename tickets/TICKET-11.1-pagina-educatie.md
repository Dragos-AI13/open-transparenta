# Ticket 11.1 — Pagina principală a domeniului Educație

**ID:** TICKET-11.1
**Status:** ✅ done
**Feature:** 11 — 🎓 Educație
**Dependențe:** —

## Descriere

Pagina principală a domeniului **Educație** (`/educatie`) cu grid-ul tuturor subdomeniilor — exact pattern-ul de la Buget și Finanțe (`/buget-si-finante`). Doar subdomeniile cu sursă de date **verificată** apar în grid; cele fără sursă viabilă sunt ascunse (regula: zero dead links). Homepage DomainGrid: cardul „Educație" devine clickabil (pierde 🔜).

## Context tehnic (surse verificate 2026-08-01 pe data.gov.ro)

| Subdomeniu | Sursă | Format | Actualitate | Status |
|---|---|---|---|---|
| 🏫 Rețea școlară | `Rețea scolară 2025-2026` (org `ministerul-educatiei`) — numele unităților, adresa, tip, mediu, localizare, județ, email | XLSX 3MB | **feb 2026** | ✅ planned (candidat live) |
| 📝 Bacalaureat | `Rezultate Bacalaureat sesiunea 2-2025` (ME) + istoric sesiuni | XLSX 7MB | **apr 2026** | ✅ planned (candidat live) |
| 👩🏫 Cadre didactice | `Număr cadre didactice preuniversitar per grad didactic` (ME) | XLSX | **apr 2026** | ✅ planned (candidat live) |
| 🎓 Studenți | `Numărul de studenți înmatriculați la studii universitare` (ME) | XLSX | 2022 — **vechi** | ❌ hidden |
| 🏛️ Rețea universitară | `Rețeaua unităților de învățământ universitar` (ME) | XLSX | 2020-2021 — **vechi** | ❌ hidden |

**Notă:** `educatie` pe data.gov.ro = 178 seturi (majoritatea ANITP/MDRAP irelevante — filtrare pe org `ministerul-educatiei`). Burse/finanțare = 0 seturi.

## Cerințe

- [x] `lib/educatie-domains.ts` — `EducatieSubdomain[]` (pattern `buget-domains.ts`):
  - `{ slug, name, icon, shortDesc, status: "live"|"planned", href?, hidden? }`
  - 3 subdomenii `planned` (Rețea școlară, Bacalaureat, Cadre didactice) + 2 `hidden: true` (Studenți, Rețea universitară — date vechi)
  - Comentariu pe fiecare hidden cu motivul verificat
- [x] `app/educatie/page.tsx` — pagina principală (pattern `buget-si-finante/page.tsx`):
  - Hero: iconiță 🎓, titlu „Educație", subtitlu, descrierea domeniului
  - Grid subdomenii: **live = `<Link>` cu badge, planned = `<div>` (NU link, zero dead links)**, ascunse = filtrate `!hidden`
  - Secțiune „Instituții în acest domeniu": 🎓 Ministerul Educației, 🏛️ MEN, 📊 INS
  - Metadata (title + description)
- [x] `components/DomainGrid.tsx` — `{ name: "Educație", slug: "educatie", href: "/educatie" }` (pierde 🔜, devine clickabil)

## Fișiere

| Acțiune | Fișier |
|---------|--------|
| ➕ Creează | `frontend/src/lib/educatie-domains.ts` |
| ➕ Creează | `frontend/src/app/educatie/page.tsx` |
| 🔧 Editează | `frontend/src/components/DomainGrid.tsx` |

## Detalii

- Slug-ul domeniului: `educatie` (nu `invatamant`) — se potrivește cu `slug: "educatie"` din DomainGrid
- Culori: folosește culoarea domeniului Educație din `DomainGrid` (verifică `domainColors`/constante) pentru consistență
- Copy românesc, diacritice corecte, fără placeholdere „în curând"

## Acceptance criteria

- [x] `/educatie` afișează hero + grid cu **3 subdomenii** (Rețea școlară, Bacalaureat, Cadre didactice) — toate cu badge „În pregătire", zero link-uri moarte
- [x] Studenți + Rețea universitară **NU apar** în grid (hidden)
- [x] Homepage → cardul „🎓 Educație" fără 🔜, click → `/educatie`
- [x] `npm run build` trece

## Security

- **Impact:** none

## Verification

```bash
cd frontend && npm run build
# Browser: /educatie + homepage → card Educație clickabil
```
