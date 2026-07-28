# Parsarea Datelor — Lazy Parsing (La Cerere)

> **Aproach:** Nu parsăm totul dinainte. Parsezi DOAR ce caută cetățenii.
> **Aplicabil:** Tuturor celor 17 domenii.

---

## Problema

Statul român publică **peste 5.192 de seturi de date** în formate greu accesibile:

| Format | Cât reprezintă | Problema |
|---|---|---|
| XLSX | ~60% | Necesită Excel |
| XLS | ~13% | Necesită Office mai vechi |
| PDF | ~10% | 100+ pagini, cauți manual |
| CSV | ~11% | Util pentru developeri, ilegibil pentru cetățeni |

Dacă am parsa manual fiecare set de date la cel mai mic nivel:
> **5.192 seturi × 30 minute = ~2.600 ore de muncă**  
> = 1 an de lucru pentru o persoană

**Nu merită.** 90% din seturi poate nu sunt accesate niciodată.

---

## Soluția — Lazy Parsing

### Principiul

```
Parsezi UN SET DOAR atunci când un cetățean îl accesează prima dată.
Apoi salvezi rezultatul în cache pentru toți ceilalți.
```

### Fluxul

```
1. Căutare: Cetățeanul scrie „paturi spitale cluj"
       ↓ instant (căutare în Meilisearch — doar metadata)
2. Rezultate: 5 seturi găsite, cu linkuri și descrieri
       ↓
3. Click pe un set: „Paturi clinice în spitale 2024"
       ↓
   ┌──────────────────────────────────────────────────────────┐
   │  4. Serverul verifică CACHE-ul                           │
   │     ├── Dacă există: RETURnează instant datele parsate  │
   │     └── Dacă NU există:                                  │
   │          5. Descarcă fișierul original (PDF/XLSX/CSV)   │
   │          6. Identifică formatul                           │
   │          7. Aplică parserul corespunzător                 │
   │          8. Extrage tabelele + textul                     │
   │          9. Salvează în cache (24h)                       │
   │          10. RETURnează datele structurate                │
   └──────────────────────────────────────────────────────────┘
       ↓
11. Utilizatorul vede:
    ┌─────────────────────────────────────────────┐
    │ 📊 Tabel sortabil + 📈 Grafic + 🔍 Căutare   │
    │ 📥 Export CSV/JSON + 🔗 Link sursă           │
    └─────────────────────────────────────────────┘
```

---

## Arhitectura Lazy Parser

```
┌──────────────────────────────────────────────────────────────┐
│  Next.js API Route: /api/dataset/{id}/preview                │
│                                                              │
│  1. Verifică cache (Redis / fișier JSON pe disc)            │
│  2. Dacă NU în cache → declanșează parsarea                 │
│  3. Returnează {columns, rows, summary, charts}              │
└──────────────────────┬───────────────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────────────┐
│  Parser Engine (Python, apelat ca subproces sau API intern)  │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │ CSV Parser  │  │ EXCEL       │  │ PDF Parser  │          │
│  │ (pandas)    │  │ Parser      │  │ (marker-pdf │          │
│  │             │  │ (openpyxl + │  │  + pdfplum- │          │
│  │ 0.1 sec     │  │  pandas)    │  │  ber)       │          │
│  │             │  │             │  │             │          │
│  │ 100%        │  │ 1-3 sec     │  │ 2-8 sec     │          │
│  │ acuratețe   │  │ 95-99%      │  │ 80-95%      │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │ PDF TEXT    │  │ DOCX        │  │ XML         │          │
│  │ (pymupdf)   │  │ Parser      │  │ Parser      │          │
│  │             │  │ (python-    │  │ (Element-   │          │
│  │ text brut   │  │  docx)      │  │  Tree)      │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
│                                                              │
│  Output standardizat:                                         │
│  {                                                            │
│    "sheets": [           // foi (dacă XLSX cu mai multe)     │
│      {                                                        │
│        "name": "Sheet1",                                      │
│        "rows": [...],                                         │
│        "cols": ["Județ", "Total", "Public", "Privat"],       │
│        "total_rows": 42                                      │
│      }                                                        │
│    ],                                                         │
│    "summary": {            // cifre cheie extrase automat    │
│      "total_paturi": 132540,                                  │
│      "judet_maxim": "București",                              │
│      "trend": "↑ 3.2%"                                       │
│    },                                                         │
│    "charts": [           // sugestii de grafice              │
│      {"type": "bar", "x": "judet", "y": "total"},            │
│      {"type": "pie", "labels": "tip", "values": "count"}     │
│    ]                                                          │
│  }                                                            │
└──────────────────────────────────────────────────────────────┘
```

---

## Cache

| Strategie | Detalii |
|---|---|
| **Durată** | 24 de ore (TTL) |
| **Stocare** | Fișiere JSON pe disc (/cache/parsed/) sau Redis |
| **Invalidare** | Automată la 24h. Dacă cineva mai cere, se re-parsează cu noua versiune a fișierului |
| **Dimensiune** | Un set parsat = 10-500KB JSON. 1.000 de seturi parsate = ~500MB |
| **Popularitate** | Dacă un set e cerut de 10+ ori/zi, rămâne permanent în cache |

### Exemplu cache

```bash
cache/parsed/
├── 2026-07-29/           # data parsării
│   ├── paturi-clinice-2024.json    ← accesat de 47 de ori azi
│   ├── buget-stat-2026.json        ← accesat de 23 de ori azi
│   ├── curs-bnr-22-07-2026.json    ← expiră mâine
│   └── onrc-firme-mai-2026.json    ← prima accesare acum 5 minute
└── ...
```

---

## Timpii de Încărcare

| Tip fișier | Prima dată (parsare) | A doua oară (cache) |
|---|---|---|
| CSV | < 1 secundă | instant |
| XLSX simplu (1 foaie, 1000 rânduri) | 1-2 secunde | instant |
| XLSX complex (10 foi, 50.000 rânduri) | 3-5 secunde | instant |
| PDF cu tabele bine structurate | 3-6 secunde | instant |
| PDF text (fără tabele) | 2-4 secunde | instant |
| PDF scanat (OCR, 50 pagini) | 15-30 secunde | instant |
| DOCX | 1-3 secunde | instant |
| XML | < 1 secundă | instant |

**Pentru 90% din cazuri, prima încărcare e sub 3 secunde.**  
**Pentru 100% din cazuri, din cache e INSTANT.**

---

## Ce Se Întâmplă Când Parsarea Eșuează?

| Eșec | Cauză | Acțiune |
|---|---|---|
| PDF scanat de slabă calitate | OCR nu recunoaște textul | Arătăm PDF-ul embedat + link de descărcare |
| Format necunoscut | .prn, .dwg, .dat | Arătăm link de descărcare |
| XLSX corupt | Fișier stricat | Arătăm link de descărcare |
| PDF protejat cu parolă | Set restricționat | Arătăm link de descărcare + notă |

**În orice caz:** Utilizatorul poate oricând **descărca fișierul original**. Parsarea e un bonus, nu unicul mod de acces.

---

## Tehnologiile

| Componentă | Tehnologie | Alternativă |
|---|---|---|
| **Parsare CSV** | pandas.read_csv() | csv.DictReader |
| **Parsare XLSX/XLS** | openpyxl + pandas | xlrd |
| **Parsare PDF (tabele)** | **marker-pdf** (AI-based) | pdfplumber, camelot, tabula-py |
| **Parsare PDF (text)** | pymupdf (fitz) | pdfminer.six |
| **Parsare DOCX** | python-docx | — |
| **Parsare XML** | xml.etree.ElementTree | lxml |
| **Cache** | Redis (dacă e disponibil) | JSON pe disc |
| **Frontend tabele** | @tanstack/react-table | react-data-grid |
| **Frontend grafice** | recharts | chart.js, nivo |
| **Frontend PDF fallback** | react-pdf | iframe embed |

---

## Cum Se Integrează în Frontend

### Pagina unui Set de Date (cu lazy parsing)

```
┌──────────────────────────────────────────────────────────────┐
│ 📊 Paturi clinice în spitale 2024                           │
│    Ministerul Sănătății · XLSX · 1.2 MB                      │
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ ✅ Date disponibile — încărcate din cache                │ │
│ │    (prima încărcare acum 3 ore, 47 de persoane au văzut) │ │
│ │                                                          │ │
│ │ ┌──────┬────────┬───────────────────────┐               │ │
│ │ │ Județ│ Total  │ La 1000 de locuitori  │               │ │
│ │ │──────┼────────┼───────────────────────│               │ │
│ │ │ Buc. │ 12.450 │         6.8           │               │ │
│ │ │ Cluj │ 5.230  │         7.2           │               │ │
│ │ │ ...  │        │                       │               │ │
│ │ │ ▲sort│ ▲sort  │     ▲sort             │               │ │
│ │ └──────┴────────┴───────────────────────┘               │ │
│ │                                                          │ │
│ │ 📈 Grafic pe județe    📉 Evoluție în timp              │ │
│ │                                                          │ │
│ │ 🔍 Caută în acest tabel: [______________]              │ │
│ │                                                          │ │
│ │ 📥 [Export CSV] [Export JSON] [↓ XLSX original]         │ │
│ │ 🔗 Sursa: data.gov.ro / Ministerul Sănătății           │ │
│ └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### Stările Posibile

| Stare | Ce vede utilizatorul |
|---|---|
| **Neaccesat încă** | 📥 „Încarcă datele" — buton, nu se parsează automat până nu dă click |
| **Se parsează** (prima dată) | 🔄 „Se încarcă..." cu progres (descărcare → parsare → gata) |
| **În cache** | ✅ Instant, cu mențiunea „Date din cache" și de cât timp |
| **Eroare la parsare** | ⚠️ „Acest set nu poate fi previzualizat" + link descărcare |
| **Expirat** | Se re-parsează automat la click |

---

## Implementare — Efort Estimat

| Componentă | Timp |
|---|---|
| Parser CSV | 1-2 ore |
| Parser XLSX | 3-4 ore |
| Parser PDF (marker-pdf) | 4-6 ore |
| Cache layer | 2-3 ore |
| Frontend tabel + grafice | 4-6 ore |
| Buton export CSV/JSON | 1-2 ore |
| **Total lazy parsing** | **~3-4 zile** |

Apoi se aplică AUTOMAT la toate cele 17 domenii. Nu trebuie să scriem cod diferit pentru fiecare domeniu — același parser funcționează pentru orice XLSX, indiferent dacă e din Sănătate, Buget sau Educație.

---

## Concluzie

| Abordare | Efort | Rezultat |
|---|---|---|
| **Manual** (desfacem fiecare set) | ~2.600 ore ❌ | 100% control, dar imposibil |
| **Lazy parsing** (la cerere) | **~3-4 zile cod** ✅ | 90% din același rezultat, fără muncă inutilă |
| **Doar linkuri** (nimic parsăm) | 0 ore ⚠️ | 10% din oameni mai ajung la date |

**Lazy parsing e echilibrul perfect.**  
Parsezi doar ce se cere. Pentru restul, ai link către original.  
Aplicabil la toate cele 17 domenii — același cod, aceeași logică, aceleași componente vizuale.
