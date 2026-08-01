# Ticket 5.1 — Crawler AMEPIP: CSV 2023 + XLSX 2024 → Meilisearch

**ID:** TICKET-5.1
**Status:** ✅ Done
**Feature:** 5 — 🏛️ Întreprinderi Publice
**Dependențe:** — (pattern: TICKET-4.5 crawler_reprezentanti.py)

## Descriere

Crawler Python care descarcă datele AMEPIP (întreprinderi publice) de pe data.gov.ro, le parsează și le indexează în Meilisearch. Datele sunt mici (1.7 MB) — indexare rapidă, fără swap staging obligatoriu dar recomandat (consistență cu pattern-ul existent).

**Sursa principală (obligatoriu):** `data_2023.csv` — curat, cu CUI + nume + 17 indicatori, ani 2019-2023.
**Sursa secundară (opțional, pentru anul 2024):** `datecompanii_ind-finnefin.xlsx` — format pivot cu coduri interne AMEPIP, necesită openpyxl + mapare.

## Cerințe

- [ ] Script Python `crawler/crawler_amepip.py`:
  - Găsește dataset-ul AMEPIP pe data.gov.ro (CKAN search: `q=AMEPIP&sort=metadata_modified+desc`)
  - Descarcă `data_2023.csv` (resursa „Indicatori financiari inclusiv_2023.csv")
  - Normalizează CUI: `54760` → `RO54760` (prefix RO + zero-pad la 8 cifre unde e cazul)
  - Indexează în Meilisearch, index `intreprinderi_publice`, primary key `cui`
  - **Opțional** (`--include-2024`): descarcă XLSX-ul ian 2026, parsează cu openpyxl, mapază codurile interne AMEPIP → CUI (verifică dacă există mapare în fișier; dacă nu, documentează și sari peste)
- [ ] Câmpurile indexate: `cui`, `denumire`, `numar_registru_comert`, `ticker_symbol`, `caen`, `caen_denumire`, `ani` (array de ani disponibili), `indicatori` (map: indicator → valoare pe an)
- [ ] Documentul e un singur doc per firmă (1.259 firme), cu indicatorii agregați pe ani
- [ ] Idempotent: rulează de 2x → aceleași date (upsert pe CUI)
- [ ] `--dry-run` și `--max` pentru testare
- [ ] Actualizează `.crawler_state.json` (hash dataset)
- [ ] Comandă npm: `"crawl:amepip"`

## Fișiere

| Acțiune | Fișier |
|---------|--------|
| ➕ Creează | `crawler/crawler_amepip.py` |
| ➕ Creează | `crawler/requirements.txt` (adaugă `openpyxl` dacă nu există) |
| 🔧 Editează | `frontend/package.json` |

## Detalii tehnice

### Structura document Meilisearch

```ts
interface IntreprinderePublicaDoc {
  cui: string;                    // RO54760
  denumire: string;               // COMPANIA DE APĂ ORADEA SA
  numar_registru_comert: string;  // J05/14/1991
  ticker_symbol?: string;         // ex. SNP (pentru cele listate)
  caen?: string;                  // 3600
  caen_denumire?: string;         // Captarea, tratarea si distributia apei
  ani: number[];                  // [2019, 2020, 2021, 2022, 2023]
  indicatori: Record<string, Record<number, number | null>>;  // indicator → an → valoare
}
```

### Indicatori CSV (17)

ROE, ROA, Rata de crestere a profitului net, Rata de crestere a cifrei de afaceri,
Marja de profit net, Marja de profit din exploatare, Viteza de rotatie a stocurilor,
Viteza de rotatie a creantelor, Viteza de rotatie a activelor, Datorie vs EBITDA,
Datorii totale, EBITDA, Levierul, Lichiditate imediată, Rata lichiditatii Curente,
Cota de piata.

### Config Meilisearch

- `searchableAttributes`: `["denumire", "cui", "caen_denumire"]`
- `filterableAttributes`: `["caen", "ani"]`
- `sortableAttributes`: `["denumire"]`

## Acceptance criteria

- [ ] Index `intreprinderi_publice` cu 1.259 documente
- [ ] `curl` search pe index: găsește „COMPANIA DE APĂ ORADEA SA" prin CUI RO54760 și prin nume
- [ ] Indicatorii sunt populați pentru 2019-2023 (ex. ROE + EBITDA + Lichiditate pe firmă)
- [ ] `npm run build` trece

## Security

- **Impact:** none — date publice AMEPIP, fără date personale

## Verification

```bash
cd crawler && python crawler_amepip.py --dry-run --max=10
cd crawler && python crawler_amepip.py
curl -H "Authorization: Bearer $KEY" "http://localhost:7700/indexes/intreprinderi_publice/stats"
curl -H "Authorization: Bearer $KEY" -X POST "http://localhost:7700/indexes/intreprinderi_publice/search" \
  -d '{"q":"COMPANIA DE APA ORADEA","limit":3}' -H "Content-Type: application/json"
```
