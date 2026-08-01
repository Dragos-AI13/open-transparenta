# Ticket 11.3 — Crawler ME + Bacalaureat live

**ID:** TICKET-11.3
**Status:** 📋 ready
**Feature:** 11 — 🎓 Educație
**Dependențe:** TICKET-11.1

## Descriere

Crawler pentru rezultatele la bacalaureat + API + pagina `/educatie/bacalaureat`. Răspunde la „cât e rata de promovare la bacalaureat în județul meu / la școala mea?".

## Context tehnic (verificat 2026-08-01 pe fișier real, 7MB)

- **Sursă:** data.gov.ro, pkg `Rezultate Bacalaureat sesiunea 2-2025` (org `ministerul-educatiei`) — pachete per sesiune (26 seturi, istoric)
- **Structură:** sheet `export`, **30.280 candidați × 52 coloane**, header la **rândul 1**
- **Coloane:** `Cod unic candidat` (anonimizat), `Sex` (F/M), `Specializare` (Științe ale Naturii), `Profil` (Real), `Fileira` (Teoretică), `Forma de învățământ` (Zi/Seral), `Mediu candidat` (RURAL), `Unitate (SIIIR)`, `Unitate (SIRUES)`, `Clasa`, `Promoție`, `NOTE_RECUN_A..D` (note recunoscute), `STATUS_A..ED` (Admis/Respins/…), `NOTA_EA..ED` (note probe), `CONTESTATIE_*`, `NOTA_CONTESTATIE_*`, `PUNCTAJ DIGITALE`, **`STATUS`** (final), **`Medie`**
- **Notă:** candidații sunt **anonimizați** (cod unic, nu nume) → GDPR ok; `Medie` e col52, `STATUS` col51 — verifică valorile la implementare (Admis/Respins/Absent)
- **Atenție sesiuni:** numele pachetelor variază (`Rezultate Bacalaureat sesiunea 2-2025`, `Sesiunea 2-2023`...) — crawler-ul ia cea mai recentă sesiune (comparație dată numerică)

## Cerințe

- [ ] `crawler/crawler_educatie_bac.py`:
  - Descoperă pachetele (q=`Rezultate Bacalaureat`), ia cel mai recent XLSX (parse_report_date pattern MFE)
  - Parsează: header r1, mapează coloane după nume; id = `{sesiune}_{cod_unic}`
  - **Agregare**: indexează pe candidat (30.280 docs) — pentru rata de promovare pe județ/școală se grupează în API; sau index separat agregat pe școală (`cod_siiir` + medie + status) — decide la spike, preferă agregat pe școală + raw pe candidat dacă volumul permite
  - Index `bacalaureat` — filterable: judet (dacă există în date — verifică dacă `Unitate (SIRUES)` mapează la județ), sesiune, profil, mediu; searchable: specializare
  - `--dry-run`, `--max`, `--force`, state, staging + swap, wait_for_task; npm `crawl:educatie-bac`
- [ ] `GET /api/bacalaureat?q=&judet=&sesiune=&page=&limit=` + `rezumat` (rata promovare totală + pe județ)
- [ ] Pagina `/educatie/bacalaureat`:
  - Hero: 📝 Bacalaureat + sesiunea curentă
  - Carduri hero: candidați, promovați, **rata de promovare %**
  - Tabel: Școală (SIIIR→denumire din rețea dacă se poate), Județ, Candidați, Promovați, Rată %
  - Filtre: județ, sesiune; stări complete; responsive
- [ ] Update `educatie-domains.ts`: Bacalaureat → `live` + href

## Fișiere

| Acțiune | Fișier |
|---------|--------|
| ➕ Creează | `crawler/crawler_educatie_bac.py` |
| ➕ Creează | `frontend/src/app/api/bacalaureat/route.ts` + `rezumat/route.ts` |
| ➕ Creează | `frontend/src/app/educatie/bacalaureat/page.tsx` + `components/educatie/BacalaureatTable.tsx` |
| 🔧 Editează | `frontend/src/lib/meilisearch.ts`, `educatie-domains.ts`, `package.json` |

## Acceptance criteria

- [ ] Index cu candidați reali (30.280, sesiunea 2-2025)
- [ ] `/educatie/bacalaureat` — rată promovare + tabel pe școli/județe
- [ ] Cardul Bacalaureat → **Live**
- [ ] `npm run build` trece

## Security

- **Impact:** none (candidați anonimizați — cod unic, fără nume)

## Verification

```bash
cd crawler && python crawler_educatie_bac.py --dry-run --max 500
python crawler_educatie_bac.py
# Browser: /educatie/bacalaureat
```
