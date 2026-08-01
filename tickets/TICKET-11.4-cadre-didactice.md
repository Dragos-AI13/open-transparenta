# Ticket 11.4 — Crawler ME + Cadre didactice live

**ID:** TICKET-11.4
**Status:** 📋 ready
**Feature:** 11 — 🎓 Educație
**Dependențe:** TICKET-11.1

## Descriere

Crawler pentru numărul de cadre didactice + API + pagina `/educatie/cadre-didactice`. Răspunde la „câți profesori sunt în județul meu și pe ce grade?".

## Context tehnic (verificat 2026-08-01 pe fișier real, 77KB)

- **Sursă:** data.gov.ro, pkg `Număr cadre didactice preuniversitar per grad didactic în anul școlar 2025-2026` (org `ministerul-educatiei`, actualizat 2026-04-27)
- **Structură:** sheet `Numar de persoane pe grade dida`, **220 rânduri × 76 coloane** — format **pivot pe vârstă**
- **Layout:**
  - r1: header multi-nivel „Vârstă" (r1) + grupe de vârstă (r2: 18, 19, 20...)
  - r3: header real `Judeţ | Grad Didactic`
  - r4+: date: `AB | Grad I | 0 0 0 0...` (număr per vârstă)
  - **Graduri:** Grad I, Grad II, Debutant, Definitiv, Fara Pregatire (variante posibile: Grad Didactic, Doctorat)
- **Notă pivot:** valorile sunt pe coloane de vârstă (18-70+) → crawler-ul face **unpivot** (județ × grad × vârstă → rând) sau agregă pe județ × grad (total pe toate vârstele) — decide la spike; agregat pe județ × grad e mai util pentru UI

## Cerințe

- [ ] `crawler/crawler_educatie_cadre.py`:
  - Descoperă pachetul (q=`cadre didactice preuniversitar per grad`), ia cel mai recent XLSX
  - Parsează: header r3 (Judeţ + Grad Didactic), coloane de vârstă din r1-r2 (header multi-nivel)
  - **Unpivot**: fie rând pe (județ, grad, vârstă, număr) — pentru analiză pe vârstă; fie agregat (județ, grad, total) — pentru UI simplu. Recomandat: **agregat pe (județ, grad) + total** în index, cu opțiunea de detaliat pe vârstă
  - Normalizează diacriticele; id = `{judet}_{grad}`
  - Index `cadre_didactice` — searchable: grad; filterable: judet, grad; sortable: total
  - `--dry-run`, `--max`, `--force`, state, staging + swap, wait_for_task; npm `crawl:educatie-cadre`
- [ ] `GET /api/cadre-didactice?q=&judet=&page=&limit=` + `rezumat` (total național, total pe grade)
- [ ] Pagina `/educatie/cadre-didactice`:
  - Hero: 👩🏫 Cadre Didactice + an școlar
  - Carduri hero: total cadre, pe grade principale (Grad I, Grad II, Debutant, Definitiv)
  - Tabel: Județ, Grad I, Grad II, Debutant, Definitiv, Total (pivot pe județ)
  - Filtre: județ, grad; stări complete; responsive
- [ ] Update `educatie-domains.ts`: Cadre Didactice → `live` + href

## Fișiere

| Acțiune | Fișier |
|---------|--------|
| ➕ Creează | `crawler/crawler_educatie_cadre.py` |
| ➕ Creează | `frontend/src/app/api/cadre-didactice/route.ts` + `rezumat/route.ts` |
| ➕ Creează | `frontend/src/app/educatie/cadre-didactice/page.tsx` + `components/educatie/CadreDidacticeTable.tsx` |
| 🔧 Editează | `frontend/src/lib/meilisearch.ts`, `educatie-domains.ts`, `package.json` |

## Acceptance criteria

- [ ] Index cu date reale (2025-2026, toate județele + grade)
- [ ] `/educatie/cadre-didactice` — tabel pivot pe județe + filtre
- [ ] Cardul Cadre Didactice → **Live** (3/3 subdomenii Educație live)
- [ ] `npm run build` trece

## Security

- **Impact:** none

## Verification

```bash
cd crawler && python crawler_educatie_cadre.py --dry-run
python crawler_educatie_cadre.py
# Browser: /educatie/cadre-didactice
```
