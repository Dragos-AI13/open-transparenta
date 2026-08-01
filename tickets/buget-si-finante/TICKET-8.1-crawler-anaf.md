# Ticket 8.1 — Spike + Crawler Buletin Statistic Fiscal ANAF (XLSX → Meilisearch)

**ID:** TICKET-8.1
**Status:** 📋 ready
**Feature:** 8 — 💳 Taxe și Impozite (ANAF)
**Dependențe:** —

## Context (investigație făcută)

- Sursa: ANAF pe data.gov.ro — pachete „Buletin statistic fiscal nr. {T} {AN}"
- Disponibile: **2021-2026** (trimestrial, ~24 buletine), structură uniformă
- Fișier: XLSX, ~31KB, un singur sheet, ~292 rânduri × 10 coloane (verificat cu openpyxl)
- Structură tabele (r86+):
  - `Total` contribuabili: 2.531.562 (2025) vs 2.531.562 (2026) — an curent vs anterior
  - Impozit pe profit: 764.766 (2025) vs 852.408 (2026)
  - Impozit pe venituri din salarii: 665.653 vs 653.983
  - TVA: 582.975 vs 615.795 · Accize: 4.227 vs 5.127 · Microîntreprinderi: 332.704 vs 263.787
  - Valorile pot fi **strings cu puncte** („2.531.562") sau numbers — normalizare necesară

## Cerințe

### Faza 1 — Spike (30 min max)
- [ ] Descarcă 2-3 buletine (ex. nr. 1/2026, nr. 4/2025, nr. 1/2024) și identifică structura EXACTĂ a tabelelor:
  - Unde începe fiecare capitol (rândul de start per capitol)
  - Pattern-ul etichetă+valoare (eticheta în coloana A, valorile în B/C...)
  - Cum se distinge „an curent" de „an anterior" (header-ul tabelelor)
- [ ] **Decizie de arhitectură:** ce capitole indexăm (recomandat: contribuabili înregistrați + venituri bugetare pe tipuri de impozite + arierate) — ce se potrivește unui tabel curat în UI
- [ ] Documentează constatările în ticket (secțiunea „Rezultat spike")

### Faza 2 — Crawler (dacă spike-ul reușește)
- [ ] `crawler/crawler_anaf.py`:
  - Găsește toate pachetele „Buletin statistic fiscal" prin CKAN API (`q=Buletin+statistic+fiscal`, sort desc)
  - Descarcă XLSX-urile, parsează cu openpyxl
  - Documente Meilisearch, index `taxe_impozite`, primary key `id`:
    ```ts
    interface TaxaImpozitDoc {
      id: string;           // "impozit_profit_2026_t1"
      indicator: string;    // "Impozit pe profit"
      sectiune: string;     // "Venituri bugetare" | "Contribuabili" | "Arierate"
      an: number;           // 2026
      trimestru: number;    // 1-4
      valoare_curent: number | null;    // anul curent (mii lei / număr)
      valoare_anterior: number | null;  // anul anterior
      unitate: string;      // "mii lei" | "număr" (dedus din capitol)
    }
    ```
  - Normalizare valori: „2.531.562" → 2531562
  - Idempotent, `--dry-run`, `--max`, state file, `wait_for_task` înainte de swap
  - `"crawl:anaf"` în package.json

## Fișiere

| Acțiune | Fișier |
|---------|--------|
| ➕ Creează | `crawler/crawler_anaf.py` |
| 🔧 Editează | `frontend/package.json` |

## Acceptance criteria

- [ ] Spike documentat: structura tabelelor identificată clar
- [ ] Index `taxe_impozite` populat (cel puțin buletinele 2024-2026)
- [ ] Impozit pe profit 2026 T1 = 852.408 (mii lei) — verificat
- [ ] `--dry-run` + `--max` funcționale, idempotent

## Security

- **Impact:** none — date publice ANAF

## Verification

```bash
cd crawler && python crawler_anaf.py --dry-run --max=1
cd crawler && python crawler_anaf.py
curl -H "Authorization: Bearer $KEY" "http://localhost:7700/indexes/taxe_impozite/stats"
```
