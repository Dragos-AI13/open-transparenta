# Ticket 7.5 — Crawler Bugetul de Stat (XML MF 2023-2025 → Meilisearch)

**ID:** TICKET-7.5
**Status:** ✅ Done
**Feature:** 7 — 💰 Buget și Finanțe (subdomeniul: 📋 Bugetul de Stat)
**Dependențe:** —

## Rezultat implementare (2026-08-01)

- **480 documente indexate** (2023: 159, 2024: 159, 2025: 162)
- **Venituri totale** (mii lei): 2023 = 275.364.504, 2024 = 308.204.963, 2025 = 357.353.033 (~357 mld lei)
- **Cheltuieli totale**: 2025 = 499.582.980 (~499,6 mld) — pe funcțiuni: Asigurări sociale 76,98 mld, Servicii publice 67,68 mld, Învățământ 60,30 mld, Transporturi 42,38 mld, Apărare 27,33 mld, Sănătate 24,21 mld
- **Deficit**: 2023 = -77,95 mld, 2024 = -96,03 mld, 2025 = -142,23 mld lei
- Bug-uri rezolvate: coloanele XML depind de an (PROGRAM_2024 ≠ PROGRAM_2025), id-uri unice pe ierarhie+denumire (nu doar capitol), sort pe `valoare` configurat, `wait_for_task` înainte de swap

## Context (investigație făcută)

- Sursa: **Ministerul Finanțelor pe data.gov.ro** — pachete „Bugetul de stat {an}" (2023, 2024, 2025 — actualizate 2026-03)
- Fișierul principal: **Anexa 1 — sinteza** (`anexa1_bs_{an}.xml`, ~888KB pentru 2025)
- Structură XML (verificat live):
  ```xml
  <MODULE12>
    <LIST_G_TITLU_RAPORT>
      <G_TITLU_RAPORT>
        <TITLU_RAPORT>BUGETUL DE STAT</TITLU_RAPORT>
        <ANEXA>Anexa nr.1</ANEXA>
        <COD_ORDONATOR>00</COD_ORDONATOR>
        <ORDONATOR>Total</ORDONATOR>
        <CAPITOL>0001</CAPITOL>
        <SUBCAPITOL>01</SUBCAPITOL>
        <DENUMIRE>VENITURI - TOTAL</DENUMIRE>
        <PROGRAM_2025>357.353.033</PROGRAM_2025>
        <ESTIMARI2026>349.169.360</ESTIMARI2026>
        <ESTIMARI2027>349.399.128</ESTIMARI2027>
        <ESTIMARI2028>367.798.364</ESTIMARI2028>
      </G_TITLU_RAPORT>
      ...
  ```
- **Encoding: ISO-8859-2** (NU UTF-8!) — trebuie `bytes.decode("iso-8859-2")`
- Valori în **mii lei** (357.353.033 = ~357 mld lei venituri totale buget 2025)
- Alte resurse utile în pachet: `anexa2_bs_{an}.xml` (cheltuieli pe surse de finanțare, capitole, subcapitole — 3.5MB), `f02_bs_{an}.xml` (buget pe capitole/titluri — 9.6MB)

## Cerințe

- [ ] `crawler/crawler_buget.py`:
  - Găsește pachetele „Bugetul de stat" prin CKAN API (`q=Bugetul+de+stat`, sort metadata_modified desc)
  - Pentru anii 2023, 2024, 2025: descarcă `anexa1_bs_{an}.xml` (sinteza venituri+cheltuieli)
  - Parsează cu ElementTree, decodează ISO-8859-2, curăță valorile (puncte → numere)
  - Documente în Meilisearch, index `buget_stat`, primary key `id`:
    ```ts
    interface BugetStatDoc {
      id: string;              // "capitol_2025" (capitol + an)
      an: number;              // 2025
      denumire: string;        // "VENITURI - TOTAL", "I. VENITURI CURENTE"...
      capitol: string;         // "0001"
      subcapitol: string;      // "01"
      program_an: number | null;   // PROGRAM_2025 (mii lei)
      estimari_1: number | null;   // ESTIMARI2026
      estimari_2: number | null;   // ESTIMARI2027
      estimari_3: number | null;   // ESTIMARI2028
      tip: string;             // "venituri" | "cheltuieli" (dedus din denumire)
    }
    ```
  - Normalizare: elimină rândurile cu `DENUMIRE` gol; `tip` dedus (denumire începe cu „V." / conține „VENITURI" → venituri, altfel cheltuieli)
  - Idempotent (upsert pe id), `--dry-run`, `--max`, state file, `crawl:buget` în package.json
- [ ] Opțional (dacă timp): `anexa2` — cheltuieli pe capitole (ordonator de credite) pentru vizualizare pe ministere

## Fișiere

| Acțiune | Fișier |
|---------|--------|
| ➕ Creează | `crawler/crawler_buget.py` |
| 🔧 Editează | `frontend/package.json` — `"crawl:buget"` |

## Acceptance criteria

- [ ] Index `buget_stat` populat: 3 ani × (venituri + cheltuieli pe capitole)
- [ ] Valori corecte: venituri totale 2025 ≈ 357.353.033 mii lei (~357 mld lei)
- [ ] Diacritice corecte (ISO-8859-2 decodat)
- [ ] `--dry-run` + `--max` funcționale
- [ ] Idempotent

## Security

- **Impact:** none — date publice MF

## Verification

```bash
cd crawler && python crawler_buget.py --dry-run --max=5
cd crawler && python crawler_buget.py
curl -H "Authorization: Bearer $KEY" "http://localhost:7700/indexes/buget_stat/stats"
# Search: "VENITURI - TOTAL" 2025 → 357353033
```
