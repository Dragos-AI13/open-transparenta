# Ticket 10.1 — Crawler MFE (Proiecte contractate + Stadiul absorbției)

**ID:** TICKET-10.1
**Status:** ✅ done
**Feature:** 10 — 🏗️ Investiții și Fonduri (MFE)
**Dependențe:** —

## Descriere

Crawler pentru datele MFE (Ministerul Investițiilor și Proiectelor Europene) de pe data.gov.ro: lista proiectelor contractate pe programe operaționale + stadiul absorbției fondurilor europene. Răspunde la întrebarea „ce proiecte europene sunt finanțate în județul meu și cât s-a absorbit?".

## Context tehnic (verificat 2026-08-01)

- **Sursă:** data.gov.ro CKAN (org `mfe`) — 3 pachete:
  1. **„Proiecte contractate"** — 119 resurse XLSX, 7 programe: POIM, POC, POCU, POR, POAT, POAD, POCA. Ultima actualizare: „31 august 2025" publicat 09.07.2026
  2. **„Stadiul absorbtiei fondurilor europene 2014-2020"** — XLSX lunar (29 mai 2026, 31 martie 2026, 27 feb 2026, 31 dec 2025...)
  3. **„Stadiul absorbției fonduri europene - Politica de Coeziune 2021-2027"** — XLSX lunar (29 mai 2026, 30 apr 2026...)
- **Format verificat (POIM real, 5.2MB):** sheet „Contracte semnate", 2554 rânduri × 57 coloane; header la rândul 5; coloane: `Nr. crt.`, `Axă prioritară`, `Titlu proiect`, `cod SMIS`, `Nr si data Contract de`, `Nume beneficiar`, `Rezumat proiect`, `Data de începere`, `Data de finalizare`, `Rata de cofinanțare UE`, `Regiune`, `Județ`, `Valoare totala eligibila`, `Cheltuieli neeligibile`, `Total valoare proiect`, `Stadiu proiect`, `PLATI (lei)`
- Primele 4 rânduri = titlu/note, header real la rândul 5

## Cerințe

- [x] `crawler/crawler_mfe.py`:
  - Descoperă resursele din pachetele CKAN (package_search + package_show) — programul din numele resursei (prefix `POIM -`, `POC -` etc.)
  - Filtrează cele mai recente N resurse per program (evită re-crawl la fiecare rulare — state hash per pachet)
  - Parsează XLSX (openpyxl): saltă primele 4 rânduri (titlu), header la rândul 5, mapează coloane după nume
  - Normalizează diacriticele (pattern-ul standard)
  - Index Meilisearch `proiecte_fonduri` (primary key: `{program}_{smis}_{titlu_hash}` — SMIS poate lipsi/repeta)
  - `--dry-run`, `--max`, `--force`, `.crawler_state.json`, staging + swap atomic, wait_for_task înainte de swap
  - Comandă npm: `crawl:mfe` (în ACELAȘI commit)
- [x] Datele din „Stadiul absorbției" (2014-2020 + 2021-2027) — index `absorbție_fonduri` (sau inclus în același index cu tip distinct): program, alocare, plăți, % absorbție, dată raportare

## Fișiere

| Acțiune | Fișier |
|---------|--------|
| ➕ Creează | `crawler/crawler_mfe.py` |
| 🔧 Editează | `frontend/package.json` (script `crawl:mfe`) |

## Verificare date (anchors)

- POIM: 2554 proiecte contractate (31 august 2025)
- `?q=oradea` → proiecte din județul Bihor
- Stadiul absorbției 2021-2027: data raportării 29 mai 2026 prezentă

## Acceptance criteria

- [x] Index Meilisearch cu proiecte reale MFE (POIM + minim 2 alte programe) — **16.979 proiecte, 7 programe: POR 8032, POC 3084, POCU 2933, POIM 1852, POCA 900, POAT 149, POAD 29**
- [x] `crawl:mfe` idempotent (re-rulare → zero duplicat) — verificat: 16.979 → 16.979 după re-rulare
- [x] Stadiul absorbției indexat cu % și dată raportare — **29 programe, perioada 29 mai 2026**

## Security

- **Impact:** none

## Verification

```bash
cd crawler && python crawler_mfe.py --dry-run --max 50
python crawler_mfe.py  # full run
curl "http://localhost:7700/indexes/proiecte_fonduri/stats"
```
