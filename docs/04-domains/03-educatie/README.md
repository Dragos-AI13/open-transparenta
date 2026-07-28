# 🎓 Domeniul 3 — Educație

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

Date despre sistemul de învățământ românesc: rețea școlară (toate unitățile de învățământ din România),
elevi și studenți înmatriculați, cadre didactice, rezultate la examenele naționale (Evaluare Națională,
Bacalaureat), și date despre învățământul superior.

**Pentru cetățean:** „Ce școală e în zona mea și cum se descurcă elevii?"

---

## Instituții

### A. Pe data.gov.ro

| # | Instituție | Tip | Seturi | Cod organizație |
|---|---|---|---|---|
| 1 | **Ministerul Educației (MEN)** | Minister | **92** | `ministerul-educatiei` |

### B. În afara data.gov.ro

| # | Instituție | Tip | Date disponibile | Acces |
|---|---|---|---|---|
| 2 | **Ministerul Educației — site propriu** | Minister | Rezultate examene (comunicate de presă), noutăți legislative | edu.ro |
| 3 | **ARACIP** | Agenție | Acreditări școli, rapoarte de evaluare | aracip.ro |
| 4 | **ARACIS** | Agenție | Acreditări universități, programe de studii | aracis.ro |
| 5 | **UEFISCDI** | Agenție | Registrul studiilor universitare, cercetare | uefiscdi.ro |
| 6 | **INS** (TEMPO Online) | Institut | Statistici educaționale detaliate (abandon, absolvenți, tranziție) | insse.ro |

---

## Arborele Complet

```
🎓 EDUCAȚIE
│
├── 🏫 REȚEA ȘCOLARĂ
│   ├── Rețeaua școlară a unităților de învățământ (2013-2026, anual)
│   │   ├── Toate unitățile de învățământ preuniversitar
│   │   ├── Stat / privat, rural / urban
│   │   └── Coordonate geografice (geocodare)
│   │
│   ├── Rețea școlară specializări (2013-2020)
│   └── Circumscripții școlare (București + Ilfov, 2022-2024)
│       └── Pe școli de cartier
│
├── 👨‍🎓 ELEVI
│   ├── Elevi înmatriculați (2015-2026, anual)
│   │   ├── Învățământ primar
│   │   ├── Gimnazial
│   │   ├── Liceal (filieră teoretică, vocațională, tehnologică)
│   │   └── Profesional / dual
│   │
│   ├── Înscrierea în învățământul primar (2014)
│   └── Situația conectării elevilor la internet (2020-2021)
│
├── 👨‍🏫 CADRE DIDACTICE
│   ├── Număr cadre didactice pe grade didactice (2019-2025)
│   ├── Număr cadre didactice cu contracte active (2021)
│   ├── Număr norme didactice pe limbi străine
│   └── Număr posturi în învățământul preuniversitar de stat (2020-2021)
│
├── 📝 EXAMENE NAȚIONALE
│   ├── Evaluare Națională (2014-2025, anual)
│   │   ├── Pe județe, pe școli
│   │   ├── Rezultate inițiale + după contestații
│   │   └── Medii, note, rate de promovare
│   │
│   ├── Bacalaureat (2014-2025, anual — sesiunile I și II)
│   │   ├── Pe județe, pe licee
│   │   ├── Rezultate inițiale + după contestații
│   │   └── Medii, note, rate de promovare
│   │
│   └── Titularizare (2014, date limitate)
│
├── 🏛️ ÎNVĂȚĂMÂNT SUPERIOR
│   ├── Rețeaua unităților de învățământ universitar (2020-2021)
│   ├── Studenți înmatriculați la licență
│   ├── Studenți înmatriculați la master
│   ├── Studenți înmatriculați la studii universitare (pe domenii)
│   └── Acreditări programe de studii (ARACIS — sursă externă)
│
├── 🌐 LIMBI STRĂINE
│   ├── Unități de învățământ per limbi străine
│   ├── Elevi care studiază limbi străine
│   └── Norme didactice per limbi străine
│
├── 🔬 CERCETARE
│   ├── Proiecte de cercetare finanțate (UEFISCDI — sursă externă)
│   └── Brevete și inovații
│
├── 📊 STATISTICI EDUCAȚIONALE
│   ├── Rata de participare școlară (INS — TEMPO)
│   ├── Abandon școlar (INS — TEMPO)
│   ├── Absolvenți pe niveluri de educație (INS — TEMPO)
│   ├── Tranziția de la un nivel la altul (INS — TEMPO)
│   └── Rata de analfabetism
│
├── 💰 FINANȚARE EDUCAȚIE
│   ├── Salarii în educație (date limitate pe data.gov.ro)
│   └── Cheltuieli per elev (INS — TEMPO)
│
└── 📋 EXAMENE PROFESORI
    ├── Titularizare (2014)
    ├── Definitivat (comunicate edu.ro)
    └── Formare profesională continuă
```

---

## Inventar Complet

### A1. Ministerul Educației — 92 seturi

#### Rețea Școlară
| Set | Format | Ani |
|---|---|---|
| Rețeaua școlară a unităților de învățământ | XLSX, ODS, CSV, PDF | 2013-2026 |
| Rețea școlară specializări | ODS, CSV, PDF, XLS | 2013-2020 |
| Circumscripții școlare București | XLSX | 2022-2024 |
| Circumscripții școlare Ilfov | XLSX | 2022-2024 |
| Coordonate geografice unități de învățământ (geocodare) | XLSX | curent |
| Rețeaua unităților de învățământ universitar | XLSX | 2020-2021 |

#### Elevi
| Set | Format | Ani |
|---|---|---|
| Elevi înmatriculați | XLS, XLSX | 2015-2026 |
| Elevi înmatriculați învățământ profesional și tehnic | XLS, XLSX | 2016-2019 |
| Înscrierea în învățământul primar | ODS, CSV | 2014 |
| Situația conectării elevilor la internet | XLSX | 2020-2021 |

#### Cadre Didactice
| Set | Format | Ani |
|---|---|---|
| Număr cadre didactice pe grade didactice | XLSX | 2019-2025 |
| Număr cadre didactice cu contracte active | XLSX | 2021 |
| Număr posturi în învățământ preuniversitar de stat | XLSX | 2020-2021 |
| Norme didactice per limbi străine | XLS | curent |
| Elevi care studiază limbi străine | XLSX | curent |
| Număr unități per limbi străine | XLSX | curent |
| Situația conectării cadrelor didactice la internet | XLSX | 2020-2021 |

#### Examene Naționale — Evaluare Națională
| Set | Format | Ani |
|---|---|---|
| Rezultate Evaluare Națională | XLSX, ODS, CSV | 2014-2025 |

#### Examene Naționale — Bacalaureat
| Set | Format | Ani |
|---|---|---|
| Rezultate Bacalaureat Sesiunea I | XLSX, ODS, CSV | 2014-2025 |
| Rezultate Bacalaureat Sesiunea II | XLSX, ODS, CSV | 2014-2025 |
| Rezultate Bacalaureat per liceu (Botoșani) | XLSX | 2014-2020 |

#### Examene și Concursuri
| Set | Format | Ani |
|---|---|---|
| Rezultate Titularizare | ODS, CSV | 2014 |

#### Învățământ Superior
| Set | Format | Ani |
|---|---|---|
| Studenți înmatriculați la licență | XLS, XLSX | 2019-2021 |
| Studenți înmatriculați la master | XLSX | 2020-2021 |
| Număr studenți pe domenii | XLS | curent |

#### Seturi de Date Suplimentare
| Set | Format |
|---|---|
| Situație statistică norme didactice per limbi străine | XLS |
| Seturi de date privind învățământul profesional și tehnic | XLSX |
| Rezultate Bacalaureat pentru liceele din Botoșani | XLSX |

---

## Surse Externe

| Instituție | Date publice | URL |
|---|---|---|
| **edu.ro** (Ministerul Educației) | Rezultate examene (Definitivat, Titularizare) publicate ca **comunicate de presă**; noutăți, acte normative | edu.ro |
| **ARACIP** | Acreditări școli, rapoarte de evaluare externă | aracip.ro |
| **ARACIS** | Acreditări universități, programe de studii superioare | aracis.ro |
| **UEFISCDI** | Registrul studiilor universitare, proiecte de cercetare finanțate | uefiscdi.ro |
| **INS — TEMPO Online** | Statistici educaționale detaliate: abandon școlar, absolvenți, tranziție, rate de participare — 1.700+ indicatori | insse.ro |

---

## Prezentare Propusă

### Pagina Principală a Domeniului

```
┌──────────────────────────────────────────────────────────────┐
│ 🎓 Educație                                                  │
│                                                               │
│ Datele sistemului de învățământ românesc.                    │
│                                                               │
│ 📊 INSTITUȚII ÎN ACEST DOMENIU                                │
│                                                               │
│ 🏛️ Ministerul Educației (92 seturi)                          │
│   🏫 Școli · 👨‍🎓 Elevi · 👨‍🏫 Profesori · 📝 Examene         │
│                                                               │
│ 🏛️ ARACIP — Acreditări școli                                 │
│ 🏛️ ARACIS — Acreditări universități                         │
│ 🏛️ UEFISCDI — Registru universități + cercetare             │
│ 📊 INS — Statistici educaționale în TEMPO Online             │
└──────────────────────────────────────────────────────────────┘
```

### Card Rezumat (pentru pagina principală a site-ului)

```
┌──────────────────────────────────────────────────────────────┐
│ 🎓 Educație  ▸                                               │
│                                                               │
│ 1+ instituții · 92+ seturi de date                           │
│                                                               │
│ 🏫 Școli și Rețea Școlară   👨‍🎓 Elevi înmatriculați         │
│ 👨‍🏫 Cadre Didactice         📝 Evaluare Națională            │
│ 📜 Bacalaureat              🏛️ Învățământ Superior           │
│ 🌐 Limbi Străine            💰 Finanțare Educație           │
└──────────────────────────────────────────────────────────────┘
```

---

## Întrebări Frecvente

| Întrebare | Răspuns rapid | Unde găsești |
|---|---|---|
| „Ce școli sunt în zona mea?" | Rețeaua școlară + geocodare | Rețea Școlară |
| „În ce școală trebuie să înscriu copilul?" | Circumscripții școlare | Rețea Școlară |
| „Câți elevi sunt în România?" | Elevi înmatriculați (anual) | Elevi |
| „Câți profesori sunt în România?" | Cadre didactice pe grade | Cadre Didactice |
| „Care e rata de promovare la BAC în județul meu?" | Rezultate Bacalaureat | Examene |
| „Cât e media la Evaluarea Națională pe țară?" | Rezultate Evaluare Națională | Examene |
| „Câte universități sunt în România?" | Rețea universitară | Învățământ Superior |
| „Câți studenți sunt în România?" | Studenți înmatriculați | Învățământ Superior |
| „Câți copii studiază o limbă străină?" | Elevi care studiază limbi străine | Limbi Străine |
| „Câte școli sunt conectate la internet?" | Situație conectare elevi la internet | Elevi |
| „Câți copii abandonează școala?" | Statistici INS — TEMPO | Surse externe |
| „Câte școli sunt acreditate?" | ARACIP | Surse externe |
| „Câți profesori s-au titularizat?" | Rezultate Titularizare | Examene Profesori |
| „Ce școli sunt în rural?" | Rețea școlară (filtru rural/urban) | Rețea Școlară |
