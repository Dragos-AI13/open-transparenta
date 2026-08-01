# Ticket 11.2 — Crawler ME + Rețea școlară live

**ID:** TICKET-11.2
**Status:** ✅ done
**Feature:** 11 — 🎓 Educație
**Dependențe:** TICKET-11.1

## Descriere

Crawler pentru rețeaua școlară a României + API + pagina subdomeniului `/educatie/retea-scolara`. Răspunde la „ce școli sunt în județul meu și unde?".

## Context tehnic (verificat 2026-08-01 pe fișier real, 3MB)

- **Sursă:** data.gov.ro, pkg `Rețea scolară 2025-2026` (org `ministerul-educatiei`), resursă XLSX `101_Retea scolara 2025-2026...xlsx`
- **Structură:** sheet `Export`, **18.026 rânduri × 26 coloane**, header la **rândul 4** (r1-r3 = titlu/generat la/gol)
- **Coloane:** `An` (2025-2026), `Judet PJ` (cod AB), `Localitate PJ`, `Cod SIRUTA PJ`, `Mediu loc. PJ` (URBAN/RURAL), `Cod SIIIR PJ`, `Denumire PJ`, `Localitate unitate`, `Mediu loc. unitate`, `Cod SIRUES`, `Cod SIIIR unitate`, `Denumire scurta unitate`, `Denumire lunga unitate`, `Tip unitate` (Unitate de învățământ), `Statut unitate` (PJ), `Cod fiscal`, `Mod functionare` (Două schimburi/zi), `Forma finantare` (Buget), `Forma proprietate`, `Strada`, `Numar`, `Cod postal`, `Telefon`, `Fax`, `Email`
- **Notă:** aceeași unitate poate apărea de mai multe ori (r5 = r6 identice) → id unic pe `Cod SIIIR unitate` + hash pentru a păstra rândurile distincte

## Cerințe

- [x] `crawler/crawler_educatie_retea.py`:
  - Descoperă pachetul CKAN (q=`Rețea scolară`, org `ministerul-educatiei`), ia cel mai recent XLSX
  - Parsează: header detectat dinamic, mapare coloane după nume (normalizare ASCII)
  - Normalizează diacriticele; id = `{cod_siiir}_{hash(denumire|localitate|strada)}` (aceeași unitate apare de mai multe ori)
  - Index Meilisearch `retea_scolara` — searchable: denumire, localitate, judet_nume, email; filterable: judet, judet_nume, mediu, tip; sortable: denumire
  - `--dry-run`, `--max`, `--force`, state hash, staging + swap atomic, wait_for_task
  - Comandă npm: `crawl:educatie-retea` (ACELAȘI commit)
- [x] `GET /api/retea-scolara?q=&judet=&mediu=&tip=&page=&limit=` — listă `{hits, total, page, totalPages, facetJudete, facetMediu}`; total exact (stats fără filtre, facet judet pentru județe mari)
- [x] Pagina `/educatie/retea-scolara`:
  - Hero: 🏫 Rețea Școlară + descriere
  - Carduri hero: **18.022 unități**, urban 6.862 (38,1%), rural 11.160, 42 județe
  - Tabel: Denumire + adresă, Județ (badge), Localitate, Mediu (colorat), Tip, Email (mailto) + Telefon
  - Filtre: județ (select din facet, sortat desc după număr), mediu (Urban/Rural), căutare
  - Stări: skeleton, eroare, gol, cu date; responsive
- [x] Update `lib/educatie-domains.ts`: Rețea Școlară → `live` + href

## Fișiere

| Acțiune | Fișier |
|---------|--------|
| ➕ Creează | `crawler/crawler_educatie_retea.py` |
| ➕ Creează | `frontend/src/app/api/retea-scolara/route.ts` + `rezumat/route.ts` |
| ➕ Creează | `frontend/src/app/educatie/retea-scolara/page.tsx` + `components/educatie/ReteaScolaraTable.tsx` |
| 🔧 Editează | `frontend/src/lib/meilisearch.ts`, `educatie-domains.ts`, `package.json` |

## Acceptance criteria

- [x] Index cu unități reale — **18.022 rânduri** (2025-2026), 42 județe, mediu: rural 11.160 / urban 6.862
- [x] `/educatie/retea-scolara` — tabel + filtre funcționale („oradea" → 131 hit-uri Bihor)
- [x] Cardul Rețea Școlară → **Live**
- [x] `npm run build` trece

## Security

- **Impact:** none (date publice ME; telefon/email instituționale, nu personale)

## Verification

```bash
cd crawler && python crawler_educatie_retea.py --dry-run --max 100
python crawler_educatie_retea.py
# Browser: /educatie/retea-scolara
```
