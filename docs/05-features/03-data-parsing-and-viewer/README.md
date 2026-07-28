# Parsare Date + Vizualizare

> **Transformăm documentele oficiale (PDF, XLSX, CSV) în date vizibile direct pe site.**

## Problema

Majoritatea datelor publice sunt publicate în formate care fac aproape imposibilă consultarea de către un cetățean obișnuit:

| Format | % pe data.gov.ro | Problema |
|---|---|---|
| **XLSX** | ~60% | Necesită Excel sau OpenOffice. Majoritatea oamenilor nu au sau nu știu să folosească. |
| **XLS** | ~13% | Aceeași problemă, versiune mai veche. |
| **PDF** | ~10% | 200 de pagini de tipărit. Cauți manual. |
| **CSV** | ~11% | Util pentru developeri, inaccesibil pentru cetățeanul obișnuit. |

**Rezultat:** 90% din cetățeni renunță înainte să vadă datele.

## Soluția — Flow-ul de Parsare

```
Document oficial (PDF / XLSX / CSV / XML)
       ↓
  1. Descărcare (crawler-ul ia fișierul)
       ↓
  2. Identificare format + structură
       ↓
  3. Extragere date
       ├── Tabele → array de randuri + coloane
       ├── Serii temporale → date + valori
       └── Text → titlu, descriere, observații
       ↓
  4. Normalizare (aceeași structură indiferent de format)
       ↓
  5. Indexare în Meilisearch + stocare cache
       ↓
  6. Disponibil în frontend pentru afișare
```

## Ce Afișăm pe Site

Pentru fiecare set de date care poate fi parsat:

```
┌──────────────────────────────────────────────────────────┐
│ 📊 [Numele setului de date]                             │
│    Ministerul Sănătății · XLSX · Actualizat: 2024        │
│                                                          │
│ ┌────────────────────────────────────────────────────┐   │
│ │ Județ   │ Total │ Public │ Privat │ La 1000 loc.   │   │
│ │─────────┼───────┼────────┼────────┼────────────────│   │
│ │ Cluj    │ 5,230 │ 3,800  │ 1,430  │ 7.2            │   │
│ │ ...     │       │        │        │                │   │
│ │ ▲ sor.  │ ▲     │ ▲      │ ▲      │ ▲              │   │
│ └────────────────────────────────────────────────────┘   │
│                                                          │
│ 📈 [Grafic pe județe]   📉 [Evoluție în timp]           │
│                                                          │
│ 🔍 [Caută în acest tabel...]                             │
│                                                          │
│ 📥 [XLSX original]  [Export CSV]  [Export JSON]         │
│ 🔗 Sursa: data.gov.ro / Ministerul Sănătății            │
└──────────────────────────────────────────────────────────┘
```

## Tehnologiile de Parsare

| Format | Tool Python | Ce face |
|---|---|---|
| **CSV** | `pandas.read_csv()` | Direct, 0 efort. Detectează delimitatorul automat. |
| **XLSX / XLS** | `openpyxl` + `pandas` | Citește foi, extrage tabele, păstrează tipurile de date. |
| **PDF cu tabele** | **`marker-pdf`** (recomandat) sau `pdfplumber` / `camelot` | Extrage tabelele ca array-uri. Marker-pdf e cel mai avansat (AI-based). |
| **PDF text** | `pymupdf` (fitz) | Extrage textul curat, păstrează structura pe pagini. |
| **DOCX** | `python-docx` | Extrage tabele + text din documente Word. |
| **XML** | `xml.etree.ElementTree` | Parsează structuri XML (ex: BNR curs valutar). |
| **HTML** | `BeautifulSoup` | Extrage tabele din pagini web. |
| **JSON** | `json.loads()` | Direct, 0 efort. |

## Cât de Bine Funcționează

| Format | Acoperire | Precizie | Viteză |
|---|---|---|---|
| CSV | 100% | 100% | 0.1s |
| XLSX (curat) | 95% | 99% | 0.5s |
| XLSX (complex, formate condiționale) | 80% | 90% | 1-2s |
| PDF cu tabele bine structurate | 90% | 95% | 2-5s |
| PDF cu tabele neregulate | 60% | 75% | 5-10s |
| PDF scanat (imagine) | 40% | 60-80% | 10-30s (OCR) |

**Ce facem când parsarea eșuează:** Arătăm linkul original și un mesaj: „Acest set de date nu poate fi previzualizat. Poți descărca fișierul original."

## Arhitectura în Crawler

```
crawler/
├── parsers/
│   ├── __init__.py
│   ├── base.py          ← Clasa abstractă Parser
│   ├── csv_parser.py    ← CSV
│   ├── excel_parser.py  ← XLSX, XLS (openpyxl + pandas)
│   ├── pdf_parser.py    ← PDF (marker-pdf, pdfplumber, pymupdf)
│   ├── xml_parser.py    ← XML (ElementTree)
│   └── html_parser.py   ← HTML (BeautifulSoup)
│
├── models/
│   ├── dataset.py       ← Modelul unui set de date
│   └── table.py         ← Modelul unui tabel extras
│
└── storage/
    ├── meilisearch.py   ← Indexare în Meilisearch
    └── cache.py         ← Cache local pentru fișiere parsate
```

## Cazuri de Utilizare

| Set de date | Format | Rezultat parsare |
|---|---|---|
| Buletin Statistic Fiscal ANAF | PDF (200 pagini) | Tabel cu venituri/lună → grafic evoluție |
| Paturi clinice în spitale | XLS | Tabel județe → hartă + sortare |
| Bugetul de stat 2026 | PDF | Tabel ministere + sume → grafic comparație |
| Catalog prețuri medicamente | XLSX | Tabel denumire + preț → search + filtru |
| BNR curs valutar | XML | Tabel 36 valute → actualizare zilnică |
| ONRC firme | CSV | Search firmă → date firmă + bilanț |

## Legal — Parsarea Documentelor

| Operațiune | Legal |
|---|---|
| Descărcarea unui document public | ✅ Da — Legea 544/2001 + Legea 109/2007 |
| Extragerea tabelelor din document | ✅ Da — Transformarea formatului e permisă de OGL-ROU-1.0 și CC-BY-4.0 |
| Afișarea datelor extrase pe site | ✅ Da — Datele sunt publice, le prezentăm în alt format |
| Neatribuirea sursei | ❌ Nu — Licențele obligă la menționarea sursei |
| Modificarea / inventarea de date | ❌ Nu — Nu interpretăm, nu adăugăm, nu modificăm valorile |
