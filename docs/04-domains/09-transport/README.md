# 🚗 Domeniul 9 — Transport

> Dosar complet: toate instituțiile, toate seturile de date, toate sursele.
> Verificat pe data.gov.ro + surse proprii, Iulie 2026.

---

## Cuprins

1. [Descriere](#descriere)
2. [Instituții și surse](#instituții)
3. [Arborele complet](#arborele-complet)
4. [Inventar complet — toate seturile de date](#inventar-complet)
5. [Surse din afara data.gov.ro](#surse-externe)
6. [Prezentare propusă](#prezentare)
7. [Întrebări frecvente](#întrebări)

---

## Descriere

Date despre transportul în România: rutier, feroviar, aerian, naval, transport public județean,
mersul trenurilor, parc auto, permise de conducere și înmatriculări, operatori de transport,
aeroporturi, porturi și metrou.

**Pentru cetățean:** „Cum circulă trenurile și câte mașini sunt în România?"

---

## Instituții

### A. Pe data.gov.ro

| # | Instituție | Tip | Seturi | Cod |
|---|---|---|---|---|
| 1 | **Ministerul Transporturilor (MT)** | Minister | **16** | `mt` |
| 2 | **Informatică Feroviară** | Companie | **9** | `sc-informatica-feroviara-sa` |
| 3 | **DRPCIV — Permise și Înmatriculări** | Direcție | **9** | `directia-permise-inmatriculari` |
| 4 | **METROREX** | Companie | **1** | `metrorex-s-a` |
| 5 | **AFDJ — Administrația Fluvială Dunării** | Administrație | **1** | `administratia-fluviala-a-dunarii-de-jos-galati` |

### B. În afara data.gov.ro

| # | Instituție | Date disponibile | Acces |
|---|---|---|---|
| 6 | **CNAIR — Drumuri Naționale** | Restricții trafic, lucrări, situație drumuri | cnadnir.ro |
| 7 | **ARR — Autoritatea Rutieră** | Autorizații transport marfă/persoane | arr.ro |
| 8 | **AFER — Autoritatea Feroviară** | Licențe feroviare, siguranță | afer.ro |

---

## Arborele Complet

```
🚗 TRANSPORT
│
├── 🚗 PARC AUTO ȘI PERMISE (DRPCIV)
│   ├── Parc auto România (anual)
│   ├── Deținători permise de conducere (2013-2016, anual)
│   ├── Promovabilitate prima examinare (2013-2016)
│   └── Statistici deținători permise
│
├── 🚲 MOBILITATE URBANĂ
│   └── ClujBike — situația bicicletelor din stații (Primăria Cluj, JSON, live)
│
├── 🚂 TRANSPORT FEROVIAR
│   ├── Mersul trenurilor (9 companii: CFR Călători, Regio, Softrans, Interregional, Astra Trans Carpatic, Transferoviar, FEROTRAFIC, Calea Ferată Moldova, Regiotrans Brașov)
│   └── Licențe feroviare (AFER — sursă externă)
│
├── 🚌 TRANSPORT PUBLIC
│   ├── Programe județene transport persoane
│   │   ├── Județul Cluj (2021)
│   │   ├── Județul Brăila (2014-2019)
│   │   ├── Județul Vrancea
│   │   ├── Județul Argeș
│   │   └── Alte județe
│   └── Transport județean persoane
│
├── 🚇 METROU (METROREX)
│   └── Date METROREX (1 set)
│
├── ✈️ TRANSPORT AERIAN
│   ├── Lista aeroporturilor din România (MT)
│   └── Lista transportatorilor aerieni cu licență (MT)
│
├── ⚓ TRANSPORT NAVAL
│   ├── Raport Naval (MT)
│   └── Administrația Fluvială Dunării de Jos
│
├── 👷 TRANSPORT MARFĂ ȘI PERSOANE
│   ├── Situația operatorilor de transport (MT)
│   ├── Autorizații transport marfă (ARR — sursă externă)
│   └── Autorizații transport persoane (ARR — sursă externă)
│
├── 🛣️ DRUMURI ȘI INFRASTRUCTURĂ
│   ├── Restricții și lucrări (CNAIR — sursă externă)
│   ├── Hărți de zgomot drumuri principale
│   └── Hărți de zgomot căi ferate principale
│
└── 📊 STATISTICI TRANSPORT
    ├── Buget MT
    ├── Achiziții MT
    ├── Rapoarte de activitate MT
    └── Centre de pregătire
```

---

## Inventar Complet

### MT — Ministerul Transporturilor — 16 seturi

| Set | Format |
|---|---|
| Situația cheltuielilor salariale | XLS, PDF |
| Privatizare | HTML, DOC |
| Buget — Situația cheltuielilor de capital | PDF |
| Buget — Bilanț contabil | PDF |
| Buget — Cont execuție | PDF |
| Buget — Sinteză | PDF |
| Achiziții | PDF |
| Medical | XLS, RAR, ZIP, PDF |
| Raport Legea 52/2003 | PDF, DOC |
| Raport activitate MT | RAR, PDF |
| Raport Legea 544/2001 | PDF, DOC |
| Centre de pregătire | XML, DOCX |
| Situația operatorilor de transport | XLS |
| Raport Naval | PDF |
| Lista aeroporturilor din România | PDF |
| Lista transportatorilor aerieni cu licență | XML, DOC |

### Informatică Feroviară — 9 seturi

| Set |
|---|
| Mers tren — Astra Trans Carpatic |
| Mers tren — Interregional Călători |
| Mers tren — Regio Călători |
| Mers tren — CFR Călători |
| Mers tren — Softrans |
| Mers tren — Transferoviar Călători |
| Mers tren — FEROTRAFIC |
| Mers tren — Calea Ferată Moldova |
| Mers tren — Regiotrans Brașov |

### DRPCIV — 9 seturi

| Set | Ani |
|---|---|
| Parc auto România (anual) | curent |
| Statistică deținători permis conducere | curent |
| Promovabilitate prima examinare | 2013, 2015, 2016 |
| Deținători permise conducere | 2013, 2015, 2016 |

### METROREX — 1 set

| Set |
|---|
| Activitate METROREX |

### AFDJ — 1 set

| Set |
|---|
| Date AFDJ |

---

## Surse Externe

| Instituție | Date publice | URL |
|---|---|---|
| **CNAIR** | Restricții trafic, situație drumuri naționale, lucrări | cnadnir.ro |
| **ARR** | Autorizații transport marfă, persoane, școli de șoferi | arr.ro |
| **AFER** | Licențe feroviare, siguranță, autorizări | afer.ro |

---

## Prezentare Propusă

### Card Rezumat

```
┌──────────────────────────────────────────────────────────────┐
│ 🚗 Transport  ▸                                              │
│                                                               │
│ 5+ instituții · ~36+ seturi de date                          │
│                                                               │
│ 🚗 Parc Auto și Permise   🚂 Trenuri (mersul trenurilor)    │
│ 🚌 Transport Public        🚲 Mobilitate Urbană            │
│ ✈️ Aeroporturi             🛣️ Drumuri (CNAIR)             │
│ ⚓ Transport Naval         🚇 Metrou                       │
└──────────────────────────────────────────────────────────────┘
```

---

## Întrebări Frecvente

| Întrebare | Răspuns rapid | Unde găsești |
|---|---|---|
| „Câte mașini sunt înmatriculate în România?" | Parc auto — DRPCIV | Parc Auto |
| „Câți șoferi sunt în România?" | Deținători permise (DRPCIV) | Permise |
| „Când pleacă trenul de la X la Y?" | Mers tren (9 companii) | Trenuri |
| „Ce aeroporturi sunt în România?" | Lista aeroporturilor (MT) | Aerian |
| „Care e transportul public în județul meu?" | Programe județene | Transport Public |
| „Ce drumuri sunt blocate/în lucru?" | CNAIR (sursă externă) | Drumuri |
| „Câți operatori de transport sunt?" | Situația operatorilor (MT) | Marfă/Persoane |
| „Cum ajung cu metroul?" | METROREX | Metrou |
| „Unde pot închiria o bicicletă în Cluj?" | ClujBike — stații live (JSON) | Mobilitate Urbană |
