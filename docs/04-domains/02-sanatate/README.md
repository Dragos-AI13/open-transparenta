# 🏥 Domeniul 2 — Sănătate

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

Date despre sistemul medical românesc: spitale și paturi, personal medical, medicamente și prețuri,
boli și prevenție, vaccinări, finanțarea sănătății și achiziții sanitare.

**Pentru cetățean:** „Cum e sistemul medical în orașul meu?"

---

## Instituții

### A. Pe data.gov.ro

| # | Instituție | Tip | Seturi | Cod organizație |
|---|---|---|---|---|
| 1 | **Ministerul Sănătății (MS)** | Minister | **111** | `ms` |
| 2 | **CNAS — Casa Națională de Asigurări de Sănătate** | Casă | **32** | `casa-nationala-de-asigurari-de-sanatate` |
| 3 | **INSP — Institutul Național de Sănătate Publică** | Institut | **14** | `institutul-national-de-sanatate-publica` |
| 4 | **ANAD — Agenția Națională Anti-Doping** | Agenție | **12** | `agentia-nationala-anti-doping` |
| 5 | **ANA — Agenția Națională Antidrog** | Agenție | **10** | `agentia-nationala-antidrog` |
| 6 | **ANMCS — Autoritatea Națională de Management al Calității în Sănătate** | Autoritate | **7** | `autoritatea-nationala-de-managament-al-calitatii-in-sanatate` |

### B. În afara data.gov.ro

| # | Instituție | Tip | Date disponibile | Acces |
|---|---|---|---|---|
| 7 | **ANMDMR — Agenția Națională a Medicamentului** | Agenție | **Nomenclator complet medicamente** (XLSX) | nomenclator.anm.ro + anm.ro |
| 8 | **OAMGMAMR — Ordinul Asistenților Medicali** | Ordin | Registrul asistenților medicali | oammr.ro |

---

## Arborele Complet

```
🏥 SĂNĂTATE
│
├── 🏥 SPITALE
│   ├── Unități sanitare și paturi
│   │   ├── Paturi clinice în spitale (2015-2024, MS + INSP)
│   │   ├── Paturi de spital pentru copii (MS)
│   │   ├── Lista unităților cu paturi publice
│   │   ├── Unități sanitare și paturi (2015, 2016, MS)
│   │   └── Indicatori sintetici (unități, paturi, personal)
│   │
│   ├── Personal medical
│   │   ├── Personal medico-sanitar în România (2015-2024, MS)
│   │   ├── Personalul medico-sanitar (INSP)
│   │   └── Resurse în cadrul sistemului de sănătate
│   │
│   ├── Finanțare spitale
│   │   ├── Monitorizarea execuției bugetare a spitalelor (2017-2025, MS)
│   │   ├── Cheltuieli în spitale (2015, 2018, MS)
│   │   ├── Cheltuieli sanitare (2015, MS)
│   │   └── Achiziții derulate de unitățile sanitare (2021-2026, MS)
│   │
│   ├── Acreditări ANMCS
│   │   ├── Unități acreditate (2020-2025)
│   │   └── Unități în curs de acreditare
│   │
│   └── Consilii etice
│       └── Activitatea consiliilor etice (2016-2023, MS)
│
├── 💊 MEDICAMENTE ȘI FARMACII
│   ├── Catalogul Național al Prețurilor Medicamentelor (MS)
│   ├── Consum medicamente suportate din FNUASS și Buget MS (CNAS)
│   ├── TOP 10 medicamente după DCI (CNAS)
│   ├── Situația farmaciilor din România (2016-2022, MS)
│   └── Autorizații tratament planificat în UE (CNAS)
│
├── 🦠 BOLI ȘI MORBIDITATE
│   ├── Boli infecțioase și parazitare (2018+)
│   ├── Infecții interioare (2018+)
│   ├── Morbiditate generală (2015-2017+)
│   ├── Evidența bolnavilor (2018)
│   ├── Cancer
│   ├── Diabet
│   ├── Boli cardiovasculare
│   ├── Tuberculoză
│   ├── Hepatite
│   └── HIV
│
├── 👶 MATERNITATE ȘI COPII
│   ├── Evidența gravidelor (2018)
│   ├── Paturi de spital pentru copii
│   ├── Morbiditate (pediatrie)
│   └── Demografie (nașteri, mortalitate infantilă)
│
├── 💉 VACCINĂRI
│   ├── Vaccinări 2016-2018 (INSP)
│   ├── Transparență COVID-19 (MS)
│   └── Situație vaccinări 2016, 2017 (INSP)
│
├── 📊 STATISTICI SANITARE
│   ├── Mortalitate (MS)
│   ├── Speranța de viață
│   ├── Date demografice (MS, INSP)
│   ├── Principalii indicatori ai stării de sănătate (2015)
│   ├── Statistică internațională HFA (2014)
│   ├── Ancheta medicală a stării de sănătate (1997!)
│   └── Date statistice CNAS
│
├── 💰 FINANȚARE SĂNĂTATE
│   ├── Buget venituri-cheltuieli CNAS
│   ├── Cheltuieli sanitare (2015)
│   ├── Cheltuieli în spitale
│   ├── Sistemul asigurărilor sociale de sănătate (2016)
│   └── Achiziții publice în sistemul sanitar (2016-2026, MS)
│
├── 🧪 CALITATEA APEI ȘI MEDIU
│   ├── Calitatea apei potabile (INSP)
│   ├── Calitatea apei de îmbăiere (INSP)
│   └── Deșeuri medicale (2015, MS)
│
├── 👥 PACIENT ȘI ACCES LA SERVICII
│   ├── Mecanismul de Feedback al Pacientului (2017-2026, MS)
│   ├── Lista spitalelor publice (MS)
│   ├── Lista furnizori servicii medicale (CNAS)
│   ├── Denumire furnizori pe specialități și județe
│   ├── Număr de puncte (CNAS)
│   ├── Valoarea punctelor și numărul de puncte
│   └── Raport privind mobilitatea pacientului
│
├── 🔬 INDICATORI PROGRAME NAȚIONALE DE SĂNĂTATE
│   ├── Indicatori PNS (2021-2026, CNAS)
│   ├── Indicatori programe de sănătate (2021)
│   └── Programa Națională de Oncologie
│
├── 💪 DOPING ȘI DROGURI
│   ├── Statistici testări doping (2013-2024, ANAD)
│   └── Consum de droguri în România (2014-2023, ANA)
│
└── 🏛️ MEDICAMENTE AUTORIZATE (ANMDMR — sursă externă)
    ├── Medicamente autorizate
    ├── Prospecte
    └── Dispozitive medicale
```

---

## Inventar Complet

### A1. Ministerul Sănătății (MS) — 111 seturi

#### Spitale și Paturi
| Set | Format | Ani |
|---|---|---|
| Paturi clinice în spitale | XLS | 2024 |
| Paturi în spitale | XLS | 2023+ |
| Spitale (unități-paturi) | XLS | multipli |
| Paturi de spital pentru copii | XLSX | curent |
| Unități sanitare și paturi | XLS | 2015, 2016 |
| Lista unităților cu paturi publice | XLS | curent |
| Indicatori sintetici (unități, paturi, personal) | XLS | multipli |

#### Personal Medical
| Set | Format | Ani |
|---|---|---|
| Personal medico-sanitar în România | XLS, XLSX | 2015-2024 |
| Personal sanitar 2018 | XLS | 2018 |
| Resurse în cadrul sistemului de sănătate | XLS | curent |

#### Finanțe Spitale
| Set | Format | Ani |
|---|---|---|
| Monitorizare execuție bugetară spitale (Formulare 1-5) | XLS, XLSX | 2017-2025 |
| Cheltuieli în spitale | XLS | 2018 |
| Cheltuieli sanitare | XLS, XLSX | 2015 |
| Achiziții derulate de unitățile sanitare | XLS | 2021-2026 |

#### Boli și Morbiditate
| Set | Format | Ani |
|---|---|---|
| Boli infecțioase și parazitare | XLS, XLSX | 2018+ |
| Infecții interioare | XLS | 2018 |
| Morbiditate | XLS, XLSX | 2015-2017+ |
| Evidența bolnavilor | XLS | 2018 |
| Principalii indicatori ai stării de sănătate | XLSX | 2015 |

#### Vaccinări
| Set | Format | Ani |
|---|---|---|
| Vaccinări | XLS | 2018 |
| Transparență COVID-19 | XLSX | 2020+ |

#### Farmacii și Medicamente
| Set | Format | Ani |
|---|---|---|
| Situația farmaciilor din România | XLS, XLSX | 2016-2022 |
| Catalogul Național al Prețurilor Medicamentelor | XLS | 2015+ |

#### Pacient
| Set | Format | Ani |
|---|---|---|
| Mecanismul de Feedback al Pacientului | XLS, XLSX | 2017-2026 |
| Chestionar încredere pacienți | XLS | 2015, 2016 |
| Lista spitalelor publice | XLS | curent |

#### Altele
| Set | Format | Ani |
|---|---|---|
| Activitatea consiliilor etice | XLS, XLSX | 2016-2023 |
| Date demografice | XLS, XLSX | 2015, 2024+ |
| Statistică internațională HFA | XLS | 2014 |
| Demografie | XLS | 2015+ |
| Deșeuri medicale | XLS | 2015 |
| Sistemul asigurărilor sociale de sănătate | XLSX | 2016 |
| Bolnavi externați din violență domestică | XLSX | 2015+ |
| Ancheta medicală a stării de sănătate | XLS | 1997 |
| Mortalitate | XLS | curent |
| Evidența gravidelor | XLS | 2018 |
| Situația financiară | XLS | curent |

### A2. CNAS — 32 seturi

| Set | Format | Ani |
|---|---|---|
| Indicatori PNS | XLSX, XLS | 2021-2026 |
| Date statistice CNAS | XLSX | curent |
| Consum medicamente suportate din FNUASS | XLSX | curent |
| TOP 10 medicamente după DCI | XLSX | curent |
| Lista furnizori servicii medicale | XLSX, XLS | curent |
| Denumire furnizori pe specialități și județe | XLS | curent |
| Număr de puncte | XLSX | curent |
| Valoarea punctelor | XLSX | curent |
| Raport mobilitate pacient | XLSX | curent |
| Buget venituri-cheltuieli | XLSX, PDF | 2020+ |
| Autorizații tratament planificat UE | PDF | curent |
| Seturi de date furnizate de CNAS | XLSX, DOCX | curent |
| Plan de publicare CNAS | XLSX | 2022 |
| Indicatori programe de sănătate (inclusiv Oncologie) | XLSX | 2021 |

### A3. INSP — 14 seturi

| Set | Format |
|---|---|
| Unități cu paturi | CSV, XLS, XLSX |
| Personalul medico-sanitar | CSV |
| Morbiditate | CSV, XLSX |
| Infecții interioare | CSV |
| Cheltuieli în spitale | CSV |
| Demografie | CSV |
| Boli infecțioase și parazitare | CSV |
| Vaccinări | CSV |
| Evidența gravidelor | CSV |
| Calitatea apei potabile | XLSX |
| Calitatea apei de îmbăiere | XLSX |
| Situație vaccinări | CSV | 2016, 2017 |

### A4. ANAD — 12 seturi

| Set | Format | Ani |
|---|---|---|
| Statistică testări doping | XLS, XLSX | 2013-2024 (anual) |

### A5. ANA — 10 seturi

| Set | Format | Ani |
|---|---|---|
| Date statistice consum droguri | XLS, XLSX | 2014-2023 (anual) |

### A6. ANMCS — 7 seturi

| Set | Format | Ani |
|---|---|---|
| Acreditarea unităților sanitare | **CSV, XLSX, JSON, XML** | 2020-2025 |

---

## Surse Externe

| Instituție | Date publice | URL |
|---|---|---|
| **ANMDMR** | **Nomenclatorul medicamentelor** — listă completă medicamente autorizate în România (Denumire comercială, DCI, Formă farmaceutică, Cod ATC, Firmă deținătoare) — pagini web + **XLSX descărcabil** | nomenclator.anm.ro/medicamente + nomenclator.anm.ro/files/nomenclator.xlsx |
| **ANMDMR** | Medicamente autorizate, prospecte, dispozitive medicale | anm.ro |
| **OAMGMAMR** | Registrul asistenților medicali | oammr.ro |

---

## Prezentare Propusă

### Pagina Principală a Domeniului

```
┌──────────────────────────────────────────────────────────────┐
│ 🏥 Sănătate                                                   │
│                                                               │
│ Datele sistemului medical românesc.                           │
│                                                               │
│ 📊 INSTITUȚII ÎN ACEST DOMENIU                                │
│                                                               │
│ 🏛️ Ministerul Sănătății (111 seturi)                         │
│   🏥 Spitale · 💊 Medicamente · 🦠 Boli · 💰 Finanțare       │
│                                                               │
│ 🏛️ CNAS (32 seturi)                                          │
│   🩺 Asigurări · 📊 Indicatori · 💊 Medicamente              │
│                                                               │
│ 🏛️ INSP (14 seturi)                                          │
│   💧 Apă · 📈 Statistici · 💉 Vaccinări                      │
│                                                               │
│ 🏛️ ANMCS (7 seturi)                                          │
│   ✅ Acreditări spitale (CSV/JSON/XML)                        │
│                                                               │
│ 🏛️ ANAD (12 seturi) · Agenția Națională Anti-Doping          │
│ 🏛️ ANA (10 seturi) · Consum droguri                          │
│ 🏛️ ANMDMR · Medicamente autorizate (site propriu)            │
└──────────────────────────────────────────────────────────────┘
```

### Card Rezumat (pentru pagina principală a site-ului)

```
┌──────────────────────────────────────────────────────────────┐
│ 🏥 Sănătate  ▸                                               │
│                                                               │
│ 6+ instituții · ~186 seturi de date                           │
│                                                               │
│ 🏥 Spitale și Paturi     💊 Medicamente și Farmacii          │
│ 🦠 Boli și Morbiditate   💉 Vaccinări                       │
│ 💰 Finanțare Sănătate    📊 Statistici Sanitare             │
│ ✅ Acreditări spitale    🧪 Calitate Apă                    │
└──────────────────────────────────────────────────────────────┘
```

---

## Întrebări Frecvente

| Întrebare | Răspuns rapid | Unde găsești |
|---|---|---|
| „Câte paturi are spitalul din orașul meu?" | Paturi clinice pe județe | Spitale → Paturi |
| „Câți medici sunt în județul meu?" | Personal medico-sanitar | Spitale → Personal |
| „Cât cheltuiește statul pe spitalul X?" | Monitorizare execuție bugetară | Finanțare |
| „Ce medicamente sunt compensate?" | Catalog prețuri + CNAS | Medicamente |
| „Este spitalul acreditat?" | Acreditări ANMCS (CSV/JSON) | Acreditări |
| „Câte cazuri de cancer s-au înregistrat?" | Evidența bolnavi / Indicatori PNS | Boli |
| „Câți asistenți medicali sunt în România?" | Personal medico-sanitar | Spitale → Personal |
| „Ce achiziții face un spital?" | Achiziții unități sanitare | Finanțare |
| „Cât de curată e apa în orașul meu?" | Calitatea apei potabile | Calitate Apă |
| „Ce vaccinări se fac în România?" | Vaccinări (INSP + MS) | Vaccinări |
| „Câte testări doping s-au făcut?" | ANAD — statistici anuale | Doping |
| „Cât e bugetul CNAS?" | Buget venituri-cheltuieli | Finanțare |
| „Câți bani se dau pe medicamente?" | Consum medicamente suportate | Medicamente |
| „Ce spitale sunt acreditate?" | Acreditări ANMCS | Acreditări |
| „Cum evaluează pacienții spitalele?" | Mecanism Feedback Pacient | Pacient |
| „Ce droguri se consumă în România?" | ANA — statistici | Droguri |
| „Ce medicamente sunt autorizate?" | ANMDMR (site extern) | Surse externe |
