# Ticket 3.1 — Research + Crawler Situații Financiare

**ID:** F3.1
**Status:** ⏳ Pending
**Feature:** 3 — 📊 Situații Financiare
**Dependențe:** —

## Descriere

Crawler Python care descarcă, parsează și indexează datele financiare ale firmelor din România publicate de Ministerul Finanțelor pe data.gov.ro.

## Date sursă

**Dataset:** Situatii financiare [AN] (ex: 2024, 2025)
**URL:** data.gov.ro → Ministerul Finanțelor

### Fișiere principale

| Fișier | Mărime | Descriere |
|--------|--------|-----------|
| `WEB_UU_AN{AN}.txt` | ~79 MB | **Toate firmele** — bilanț + cont P&L |
| `WEB_BL_BS_SL_AN{AN}.txt` | ~8.6 MB | Situații financiare (variantă completă) |
| `WEB_ONG_AN{AN}.txt` | ~8.7 MB | ONG-uri |
| `WEB_UU_AN{AN}.csv` | ~500 B | Nomenclator coloane |

### Structură fișier UU
```
Format: CSV, delimitator ",", header: CUI,CAEN,I1,I2,...,I20
I1 = Active Imobilizate
I2 = Active Circulante
I3 = Stocuri
I4 = Creanțe
I5 = Numerar
I6 = Cheltuieli în avans
I7 = Datorii
I8 = Venituri în avans
I9 = Provizioane
I10 = Capitaluri proprii
I11 = Capital subscris vărsat
I12 = Patrimoniul regiei
I13 = Cifra de afaceri netă
I14 = Venituri totale
I15 = Cheltuieli totale
I16 = Profit brut
I17 = Pierdere brută
I18 = Profit net
I19 = Pierdere netă
I20 = Număr mediu de salariați
```

## Cerințe

- [ ] Script `crawler/crawler_financiar.py`
- [ ] Detectează automat cel mai recent an disponibil (2024, 2025, ...)
- [ ] Descarcă `WEB_UU_AN{AN}.txt` (79 MB/an)
- [ ] Parsează CSV: CUI, CAEN, I1-I20
- [ ] Normalizare CUI (adaugă prefix RO)
- [ ] Mapare I1-I20 la nume sugestive (vezi structura)
- [ ] Indexare în Meilisearch — index nou `financial`
- [ ] PrimaryKey: `{CUI}_{AN}` (ex: `RO10654053_2024`)
- [ ] Zero-downtime swap (ca la ONRC)
- [ ] State tracking (ultimul an procesat, hash)
- [ ] Suport multi-an: procesează toți anii disponibili (2020-2025)
- [ ] Argumente CLI: `--force`, `--dry-run`, `--max`, `--ani=2024,2025`

## Detalii tehnice

### Document Meilisearch
```json
{
  "id": "RO10654053_2024",
  "cui": "RO10654053",
  "an": 2024,
  "caen": "1234",
  "active_imobilizate": 1254618,
  "active_circulante": 1034770,
  "stocuri": 705371,
  "creante": 52091,
  "numerar": 174970,
  "cheltuieli_avans": 0,
  "datorii": 1321662,
  "venituri_avans": 0,
  "provizioane": 0,
  "capitaluri_proprii": 967726,
  "capital_subscris": 2200,
  "patrimoniu_regie": 0,
  "cifra_afaceri": 1081448,
  "venituri_totale": 977470,
  "cheltuieli_totale": 916347,
  "profit_brut": 61123,
  "pierdere_bruta": 0,
  "profit_net": 34283,
  "pierdere_neta": 0,
  "numar_salariati": 2
}
```

### Index settings
```json
{
  "searchableAttributes": ["cui"],
  "filterableAttributes": ["cui", "an"],
  "sortableAttributes": ["an", "cifra_afaceri", "profit_net", "numar_salariati"]
}
```

## Acceptanță

- [ ] `python crawler/crawler_financiar.py --dry-run` arată câți ani + firme
- [ ] Indexul `financial` e creat cu setările corecte
- [ ] Documentele conțin toți cei 20 de indicatori
- [ ] Se pot interoga datele per CUI + an
- [ ] Zero erori la indexare
- [ ] Cache + stare funcționează
