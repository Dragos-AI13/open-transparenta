# ⚖️ Domeniul 4 — Justiție

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

Date despre sistemul judiciar românesc: instanțe și dosare, registre profesionale (notari, executori,
traducători, experți), penitenciare și deținuți, anticorupție, trafic de persoane, ONG-uri,
legislație și proprietate intelectuală.

**Pentru cetățean:** „Cum funcționează justiția în România?"

---

## Instituții

### A. Pe data.gov.ro

| # | Instituție | Tip | Seturi | Cod organizație |
|---|---|---|---|---|
| 1 | **Ministerul Justiției (MJ)** | Minister | **81** | `mj` |
| 2 | **DGA — Direcția Generală Anticorupție** | Direcție | **74** | `directia-generala-anticoruptie` |
| 3 | **ANP — Administrația Națională a Penitenciarelor** | Administrație | **32** | `anp` |
| 4 | **ANITP — Agenția Națională împotriva Traficului de Persoane** | Agenție | **19** | `agentia-nationala-impotriva-traficului-de-persoane` |
| 5 | **ORDA — Oficiul Român pentru Drepturile de Autor** | Oficiu | **8** | `oficiul-roman-pentru-drepturile-de-autor` |
| 6 | **CSM — Consiliul Superior al Magistraturii** | Consiliu | **1** | `consiliul-superior-al-magistraturii` |

### B. În afara data.gov.ro

| # | Instituție | Tip | Date disponibile | Acces |
|---|---|---|---|---|
| 7 | **Portal Just** | Platformă | Dosare, termene, soluții instanțe | portal.just.ro 🔴 (SSL BROKEN) |
| 8 | **Legislație** | Platformă | Toate actele normative (legi, OUG, HG) | legislatie.just.ro 🔴 (PROTOCOL ERROR) |
| 9 | **ReJust** | Platformă | 7+ registre profesionale (.NET 8 Blazor) | rejust.ro 🟢 |
| 10 | **BPI — Buletinul Insolvenței** | Buletin | Insolvențe, falimente, reorganizări | bpi.ro 🔴 (timeout) |
| 11 | **ICCJ — Înalta Curte de Casație** | Instanță | Decizii, jurisprudență, RIL | iccj.ro |
| 12 | **CCR — Curtea Constituțională** | Curte | Decizii CCR | ccr.ro |
| 13 | **CSM — site propriu** | Consiliu | Hotărâri CSM, inspecție judiciară | csm1909.ro |
| 14 | **CNSC** | Consiliu | Decizii contestații achiziții | cnsc.ro |

---

## Arborele Complet

```
⚖️ JUSTIȚIE
│
├── 🏛️ INSTANȚE ȘI DOSARE
│   ├── Dosare, termene, soluții (portal.just.ro — 🔴 indisponibil)
│   ├── Jurisprudență ICCJ (decizii, RIL — iccj.ro)
│   ├── Decizii Curtea Constituțională (ccr.ro)
│   └── Statistici instanțe (raportări periodice)
│
├── 📚 LEGISLAȚIE
│   ├── Legi, OUG, HG, Ordine (legislatie.just.ro — 🔴 indisponibil)
│   ├── Acte normative oficiale
│   └── Monitorul Oficial (părțile I-VII)
│
├── 🧑‍⚖️ REGISTRE PROFESIONALE
│   ├── Notari publici (MJ)
│   ├── Executori judecătorești (MJ)
│   ├── Traducători și interpreți (MJ)
│   ├── Experți judiciari (MJ)
│   ├── Mediatorii (ReJust — platformă separată)
│   ├── Administratori judiciari / insolvență (ReJust)
│   └── Registrul Național ONG (MJ, 2025-2026)
│
├── 🔒 PENITENCIARE ȘI DEȚINUȚI
│   ├── Capacitatea de cazare a penitenciarelor
│   ├── Efective de deținuți (per unitate)
│   ├── Situația infracțiunilor în penitenciare
│   ├── Analiza semestrială a liberării condiționate
│   ├── Programe educative și de asistență psihologică
│   └── Cariera în sistemul penitenciar
│
├── 🛡️ ANTICORUPȚIE (DGA)
│   ├── Rapoarte de activitate (anuale)
│   ├── Execuție bugetară
│   ├── Activități de prevenire
│   ├── Activități de combatere
│   ├── Proiecte cu finanțare externă
│   └── Legislație relevantă
│
├── 👤 TRAFIC DE PERSOANE (ANITP)
│   ├── Date statistice victime (2015-2025)
│   ├── Acțiuni de prevenire și informare
│   └── Date deschise trafic de persoane
│
├── 🏛️ CSM — CONSILIUL SUPERIOR AL MAGISTRATURII
│   ├── Date statistice instanțe (2015)
│   └── Hotărâri CSM (csm1909.ro — sursă externă)
│
├── 💎 DREPTURI DE AUTOR (ORDA)
│   ├── Marcaje holografice (fonograme, videograme)
│   ├── Produse pirat (distrugeri)
│   ├── Reprezentare internațională
│   └── Top societăți beneficiare marcaje
│
├── 💼 INSOLVENȚĂ (BPI)
│   ├── Deschideri de insolvență
│   ├── Falimente
│   ├── Reorganizări
│   └── Tabele de creanțe
│
├── 📊 STATISTICI JUSTIȚIE
│   ├── Rapoarte statistice MJ (2016-2024)
│   ├── Date statistice CSM (2015)
│   ├── Probațiune (statistici)
│   └── Bugete și plăți MJ + DGA + ANP
│
└── 🏛️ CONTESTAȚII ACHIZIȚII (CNSC)
    └── Decizii CNSC (cnsc.ro — sursă externă)
```

---

## Inventar Complet

### A1. Ministerul Justiției (MJ) — 81 seturi

#### Registre Profesionale
| Set | Format | Ani |
|---|---|---|
| Notari publici | XLSX | 2025, curent |
| Executori judecătorești | XLSX | 2021-2024, 2025 |
| Traducători și interpreți | XLSX | 2025 |
| Experți judiciari | XLSX | 2025, curent |

#### Registrul ONG
| Set | Format | Ani |
|---|---|---|
| Registrul Național ONG | XLSX | curent, 2025, 2026 |

#### Bugete și Plăți
| Set | Format | Ani |
|---|---|---|
| Buget | XLSX, XLS | multipli |
| Bilant | XLSX | multipli |
| Situație plăți (pe titluri) | XLSX, XLS | 2012-2023 |
| Plăți DNP (Direcția Națională de Probațiune) | XLSX | 2021-2022 |
| Situația contractelor | XLSX | curent |

#### Statistici
| Set | Format | Ani |
|---|---|---|
| Rapoarte statistice MJ | XLSX | 2016-2024 |

### A2. DGA — Direcția Generală Anticorupție — 74 seturi

| Set | Format | Ani |
|---|---|---|
| Raport privind execuția bugetară | PDF, XLSX | 2024 |
| Buget financiar DGA | XLSX, XLS, XPS, PDF | 2014-2025 |
| Bilanț financiar contabil | XLS, XPS | 2013-2020 |
| Activitate de prevenire | XLS, XLSX, XPS | 2015-2024 |
| Activitate de combatere | XLS | 2015 |
| Proiecte finanțare externă | XLSX, XML | 2015-2018 |
| Raport evaluare Legea 544 | PDF, XPS, XLS | 2013-2024 |
| Deplasări personal | XLSX, XPS | 2015-2019 |
| Achiziții DGA | XLSX | 2018-2020 |
| Date de contact structuri DGA | XLS | curent |
| Acte normative DGA | XLS | curent |
| Buletin informativ 544 | PDF, XPS | 2016-2024 |

### A3. ANP — Administrația Națională a Penitenciarelor — 32 seturi

| Set | Format | Ani |
|---|---|---|
| Capacitatea de cazare a penitenciarelor | XLSX, XLS | 2016-2017 |
| Efective deținuți (per unitate) | XLSX | multipli |
| Situația infracțiunilor în penitenciare | XLS, ODT | 2016 |
| Analiza semestrială liberare condiționată | ODT | curent |
| Programe educative | ODS | 2016-2017 |
| Programe asistență psihologică | ODS | 2016-2017 |
| Instruire școlară | ODS | 2016-2017 |
| Cariera în sistemul penitenciar | ODT | 2017 |
| Situația drepturilor salariale | XLSX | curent |
| Bilanțuri contabile | XLSX | 2018-2019 |
| Buget ANP | XLSX | 2016-2020 |
| Plăți ANP (pe titluri) | XLSX | 2017 |
| Achiziții publice ANP | XLSX | 2017 |
| Contracte ANP | XLSX | 2016 |
| Rapoarte statistice ANP | XLSX | 2019 |

### A4. ANITP — Agenția împotriva Traficului de Persoane — 19 seturi

| Set | Format | Ani |
|---|---|---|
| Victime trafic de persoane | XLSX, XLS, CSV | 2015-2025 |
| Demersuri/acțiuni de informare și prevenire | XLSX, CSV | 2021-2025 |
| Date deschise situația victimelor | XLSX | 2020+ |

### A5. ORDA — 8 seturi

| Set | Format | Ani |
|---|---|---|
| Top societăți marcaje holografice fonograme | CSV | curent |
| Top societăți marcaje holografice videograme | CSV, XLSX | curent |
| Marcaje holografice fonograme | XLS | 2009-2014 |
| Marcaje holografice videograme | XLS | 2009-2014 |
| Distrugeri produse pirat | XLS | 2009-2017 |
| Reprezentare internațională ORDA | XLS | 2009-2017 |
| Raport statistico-analitic | ODT | 2016 |

### A6. CSM — 1 set

| Set | Format | Ani |
|---|---|---|
| Date statistice | XLS | 2015 |

---

## Surse Externe

| Instituție | Date publice | URL | Status |
|---|---|---|---|
| **Portal Just** | Dosare, termene, soluții — căutare publică | portal.just.ro | 🔴 EROARE SSL |
| **Legislație** | Toate actele normative românești | legislatie.just.ro | 🔴 PROTOCOL ERROR |
| **ReJust** | Registre profesionale (comerț, insolvență, mediatori, traducători, executori, notari, agenți imobiliari) | rejust.ro | 🟢 Funcțional (SPA) |
| **ICCJ** | Decizii, recursuri în interesul legii, jurisprudență | iccj.ro | 🟢 |
| **CCR** | Decizii Curtea Constituțională | ccr.ro | 🟢 |
| **CSM** | Hotărâri, inspecție judiciară, resurse umane | csm1909.ro | 🟢 |
| **BPI** | Buletinul Procedurilor de Insolvență | bpi.ro | 🔴 TIMEOUT |
| **CNSC** | Decizii contestații achiziții publice | cnsc.ro | 🟢 |
| **Monitorul Oficial** | Părțile I-VII — acte normative, anunțuri | monitoruloficial.ro | 🟢 (contra cost) |

---

## Prezentare Propusă

### Pagina Principală a Domeniului

```
┌──────────────────────────────────────────────────────────────┐
│ ⚖️ Justiție                                                   │
│                                                               │
│ Datele sistemului judiciar românesc.                          │
│                                                               │
│ 📊 INSTITUȚII ÎN ACEST DOMENIU                                │
│                                                               │
│ 🏛️ Ministerul Justiției (81 seturi)                           │
│   📚 Registre · 📊 Statistici · 💰 Bugete                    │
│                                                               │
│ 🛡️ DGA — Anticorupție (74 seturi)                            │
│   📋 Rapoarte · 📊 Statistici · 💰 Bugete                    │
│                                                               │
│ 🔒 ANP — Penitenciare (32 seturi)                             │
│   🏛️ Deținuți · 📋 Programe · 📊 Statistici                 │
│                                                               │
│ 👤 ANITP — Trafic de persoane (19 seturi)                     │
│   📊 Victime · 📋 Prevenire                                  │
│                                                               │
│ 🏛️ ORDA — Drepturi de autor (8 seturi)                       │
│ 💎 CSM — Consiliul Magistraturii (1 set)                      │
│                                                               │
│ 🌐 Surse externe: portal.just.ro, legislatie.just.ro,       │
│    ReJust, ICCJ, CCR, BPI, CNSC, Monitorul Oficial           │
└──────────────────────────────────────────────────────────────┘
```

### Card Rezumat (pentru pagina principală a site-ului)

```
┌──────────────────────────────────────────────────────────────┐
│ ⚖️ Justiție  ▸                                               │
│                                                               │
│ 6+ instituții · ~215+ seturi de date                         │
│                                                               │
│ 🏛️ Instanțe și Dosare   📚 Legislație Română                │
│ 🧑‍⚖️ Notari · Executori   🔒 Penitenciare și Deținuți       │
│ 🛡️ Anticorupție (DGA)    👤 Trafic de Persoane              │
│ 💎 Drepturi de Autor     📋 Registrul ONG                    │
│ ⚠️ portal.just.ro — CĂZUT (SSL)                             │
│ ⚠️ legislatie.just.ro — CĂZUT (HTTP error)                  │
└──────────────────────────────────────────────────────────────┘
```

---

## Întrebări Frecvente

| Întrebare | Răspuns rapid | Unde găsești |
|---|---|---|
| „Câți notari sunt în România?" | Lista notarilor publici (MJ) | Registre Profesionale |
| „Câți executori judecătorești sunt?" | Lista executorilor (MJ) | Registre Profesionale |
| „Câte ONG-uri sunt înregistrate?" | Registrul Național ONG | Registre Profesionale |
| „Câți deținuți sunt în România?" | Capacitate cazare + efective (ANP) | Penitenciare |
| „Câte cazuri de corupție s-au soluționat?" | Rapoarte DGA | Anticorupție |
| „Câte victime ale traficului de persoane?" | ANITP — statistici | Trafic de Persoane |
| „Unde găsesc un dosar de judecată?" | portal.just.ro (🔴 CĂZUT) | Surse externe |
| „Unde găsesc legislația?" | legislatie.just.ro (🔴 CĂZUT) | Surse externe |
| „Cum verific un ONG?" | Registrul Național ONG (MJ) | Registre Profesionale |
| „Cine sunt experții judiciari?" | Lista experților (MJ) | Registre Profesionale |
| „Câți traducători autorizați sunt?" | Lista traducătorilor (MJ) | Registre Profesionale |
| „Câte dosare s-au soluționat anul trecut?" | Rapoarte statistice MJ | Statistici |
| „Unde găsesc Monitorul Oficial?" | monitoruloficial.ro | Surse externe |
| „Unde contest o licitație publică?" | CNSC | Surse externe |
