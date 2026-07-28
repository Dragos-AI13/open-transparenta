# 💰 Domeniul 1 — Buget și Finanțe

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

Date despre **banii publici ai României**: ce încasează statul (taxe, impozite, contribuții), ce cheltuiește (bugete, salarii, investiții), cât datorează (datorie publică), și cum se gospodăresc autoritățile locale (bugete locale, consilii județene, primării).

Include și **indicatorii financiari** (curs valutar, inflație, dobânzi) și **fondurile europene**.

**Pentru cetățean:** „Unde se duc banii mei?"

---

## Instituții

### A. Pe data.gov.ro

| # | Instituție | Tip | Seturi | Cod organizație |
|---|---|---|---|---|
| 1 | **Ministerul Finanțelor** | Minister | **109** | `mfp` |
| 2 | **ANAF** | Agenție | **49** | `agentia-nationala-de-administrare-fiscala` |
| 3 | **AEP — Autoritatea Electorală Permanentă** | Autoritate | **24** | `autoritatea-electorala-permanenta` |
| 4 | **Ministerul Energiei** | Minister | **21** | `ministerul-energiei` |
| 5 | **CNI — Compania Națională de Investiții** | Companie de stat | **17** | `compania-nationala-de-investitii` |
| 6 | **MFE — Ministerul Investițiilor Europene** | Minister | **6** | `mfe` |
| 7 | **AMEPIP — Agenția pentru Monitorizarea Întreprinderilor Publice** | Agenție | **2** | `agentia-pentru-monitorizarea-si-evaluarea-performantelor-intreprinderilor-publice` |
| 8 | **AAAS — Administrația Activelor Statului** | Agenție | **1** | `aaas` |
| 9 | **MDRAP** (PNRR — 50 seturi, bugete locale) | Minister | ~50+ | `mdrap` |
| 10 | **Consilii Județene** (~20) | CJ | ~200+ | fiecare CJ |
| 11 | **Primării** (~30) | Primărie | ~50+ | fiecare primărie |
| 12 | **ONRC** (date firme relevante financiar) | Oficiu | 76 | `onrc` |

### B. În afara data.gov.ro

| # | Instituție | Tip | Date disponibile | Acces |
|---|---|---|---|---|
| 12 | **BNR — Banca Națională a României** | Bancă centrală | Curs valutar zilnic, dobânzi, inflație, indicatori monetari, rapoarte stabilitate financiară | bnr.ro/nbrfxrates.xml (API XML gratuit) |
| 13 | **ASF — Autoritatea de Supraveghere Financiară** | Autoritate | Piață de capital, fonduri de pensii, asigurări, emitenți | asfromania.ro |
| 14 | **Curtea de Conturi a României** | Instituție supremă de audit | Rapoarte de audit public, datorie publică, cheltuieli bugetare | curteadeconturi.ro |
| 15 | **Consiliul Fiscal** | Autoritate independentă | Opinii privind bugetul, sustenabilitate fiscală, prognoze | consiliulfiscal.ro |
| 16 | **FGDB — Fondul de Garantare a Depozitelor Bancare** | Fond de garantare | Depozite garantate, instituții membre, statistici | fgdb.ro |
| 17 | **BVB — Bursa de Valori București** | Piață de capital | Cotații, indici bursieri, emitenți, dividende, rapoarte | bvb.ro |

---

## Arborele Complet

```
💰 BUGET ȘI FINANȚE
│
├── 📋 BUGETUL DE STAT
│   ├── Legea bugetară anuală (2014-2026)
│   │   ├── Bugetul de stat — legea (DOC, XLS)
│   │   ├── Sinteză bugetară (venituri + cheltuieli)
│   │   └── Clasificații bugetare (coduri, indicatori)
│   │
│   ├── Execuția bugetară
│   │   ├── Execuții lunare (2016, 2017, 2018, 2024+)
│   │   ├── Venituri realizate vs. estimate
│   │   ├── Cheltuieli efectuate vs. planificate
│   │   ├── Deficit / excedent bugetar
│   │   └── Pe capitole bugetare + ministere
│   │
│   ├── Rectificări bugetare
│   └── Fondul de rezervă al Guvernului
│
├── 🏘️ BUGETE LOCALE
│   ├── Consilii Județene (20+ județe)
│   │   ├── Venituri proprii (pe județ)
│   │   └── Cheltuieli (pe categorii)
│   │
│   ├── Primării (30+)
│   │   ├── Bugete anuale + rectificări
│   │   ├── Venituri din taxe și impozite locale
│   │   ├── Cheltuieli de funcționare
│   │   └── Cheltuieli de investiții
│   │
│   ├── Instituții publice subordonate
│   │   └── Spitale, școli, muzee, teatre
│   │
│   └── Echilibrare bugete locale
│       └── Sume primite de la bugetul de stat
│
├── 📈 DATORIA PUBLICĂ
│   ├── Datorie guvernamentală (2020-2025)
│   ├── Datorie internă
│   ├── Datorie externă
│   ├── Serviciul datoriei (dobânzi + rambursări)
│   ├── Titluri de stat emise
│   ├── Garanții de stat (OUG 64/2007)
│   └── Datorie publică locală (evidențe consilii județene)
│
├── 💳 TAXE ȘI IMPOZITE
│   ├── Buletin statistic fiscal ANAF (trimestrial, 2013-2026)
│   │   ├── TVA colectat
│   │   ├── Impozit pe venit
│   │   ├── Impozit pe profit
│   │   ├── Contribuții sociale (CAS, CASS)
│   │   └── Accize
│   │
│   ├── Datoriile către bugetul de stat
│   ├── Registrul plătitorilor de TVA (API REST ANAF)
│   ├── Calendarul obligațiilor fiscale (2021-2026)
│   └── Arierate (datorii restante)
│
├── 🏢 ÎNTREPRINDERI PUBLICE
│   ├── Indicatori financiari, nefinanciari și de guvernanță
│   ├── Lista întreprinderilor publice monitorizate
│   ├── Număr salariați bugetari
│   └── Acțiuni deținute de stat la companii
│       ├── Ministerul Energiei — portofoliu
│       └── Statul român — participații
│
├── 💱 INDICATORI FINANCIARI (BNR)
│   ├── Curs valutar zilnic (36 valute + aur, API XML)
│   ├── Dobânda de politică monetară
│   ├── ROBOR / IRCC (indicatori de piață)
│   ├── Inflație (IPC, medie anuală)
│   └── Indicatori monetari (M2, credite, depozite)
│
├── 💼 SITUAȚII FINANCIARE
│   ├── Situații financiare anuale ale companiilor (2008-2025, CSV)
│   ├── Date de identificare plătitori (2020-2026, actualizat trimestrial)
│   ├── Bilanțuri contabile
│   └── Dări de seamă contabile
│
├── 🏗️ INVESTIȚII ȘI FONDURI
│   ├── CNI — Obiective de investiții recepționate (2002-2020)
│   ├── PNRR — Plăți din Planul Național de Redresare și Reziliență (50 seturi lunare, 2022-2026, MDRAP)
│   ├── Fonduri europene
│   │   ├── Proiecte contractate (fonduri europene)
│   │   ├── Stadiul absorbției 2014-2020
│   │   ├── Stadiul absorbției 2021-2027
│   │   └── SMIS — date proiecte
│   │
│   ├── Subvenții de la bugetul de stat
│   ├── Programul Anghel Saligny
│   └── Plăți AFIR (fonduri agricole)
│
├── 🏛️ BUGETE INSTITUȚII PUBLICE
│   ├── Bugetul ANAF (2022-2026)
│   ├── Bugetul AEP (2018)
│   ├── Bugetul ONRC (2013)
│   ├── Bugetul ANCPI
│   ├── Bugetul Ministerului Energiei
│   └── + fiecare minister are buget propriu
│
├── 📊 LISTE ȘI NOMENCLATOARE
│   ├── Lista entităților publice (toate instituțiile din RO)
│   ├── Lista organismelor din sectorul public
│   ├── Lista întreprinderilor publice
│   └── Nomenclatoare geografice (străzi, localități)
│
├── 🗳️ FINANȚARE PARTIDE POLITICE (AEP)
│   ├── Alegeri parlamentare 2012, 2016, 2020
│   ├── Alegeri locale 2012, 2016, 2020
│   ├── Alegeri prezidențiale 2009, 2014
│   ├── Alegeri europarlamentare 2009, 2014, 2019
│   ├── Referendumuri (2009, 2012, 2018, 2019)
│   ├── Venituri + cheltuieli partide
│   └── Buget AEP, bilanț AEP, plăți AEP
│
└── 🏛️ ASF — PIAȚA FINANCIARĂ (site propriu)
    ├── Piața de capital
    ├── Fonduri de pensii private
    ├── Asigurări
    └── Emitenți și valori mobiliare
```

---

## Inventar Complet

### A1. Ministerul Finanțelor (MFP) — 109 seturi

#### Bugetul de Stat
| Set | Format | Ani | Actualizare |
|---|---|---|---|
| Bugetul de stat | DOC, XML | 2014-2026 | Anual |
| Sinteză bugetară | XLS | anual | Anual |
| Clasificații bugetare | XLS | 2020+ | Anual |
| Rectificări bugetare | XLS | 2024 | Periodic |
| Execuții bugetare lunare | XLS, XLSX | 2016-2018, 2024+ | Lunar |
| Rapoarte trimestriale | XLS | 2024+ | Trimestrial |
| Rapoarte semestriale | XLS | 2024+ | Semestrial |

#### Datorie Publică
| Set | Format | Ani |
|---|---|---|
| Datoria guvernamentală 2025 | XLS | 2025 |
| Datoria guvernamentală 2020-2024 | XLS | 2020-2024 |
| Titluri de stat | — | curent |

#### Situații Financiare (companii)
| Set | Format | Ani | Actualizare |
|---|---|---|---|
| Situații financiare | CSV, TXT | 2008-2025 | Anual |
| Date de identificare plătitori | CSV, TXT, ZIP | 2018-2026 | Trimestrial |
| Arierate | XLS | curent | Periodic |

#### Liste și Nomenclatoare
| Set | Format |
|---|---|
| Lista entităților publice | XLS |
| Lista organismelor din sectorul public | XLSX, XLS |
| Lista întreprinderilor publice monitorizate | XLSX |
| Indicatori întreprinderi publice | PDF, XLSX, XLS |
| Număr salariați bugetari | XLS |
| Nomenclatoare geografice (străzi, 42 județe) | XML |

### A2. ANAF — 49 seturi

#### Buletine Statistice Fiscale
| Set | Format | Ani | Actualizare |
|---|---|---|---|
| Buletin statistic fiscal | XLS, XLSX | 2013-2026 | Trimestrial (nr. 1-4) |
| Datoriile către bugetul de stat | PDF, CSV | curent | Periodic |

#### Buget și Achiziții ANAF
| Set | Format | Ani |
|---|---|---|
| Bugetul de cheltuieli ANAF | XML, PDF | 2022-2026 |
| Programul anual al achizițiilor publice | XML, XLS | 2021-2025 |
| Situația executării contractelor | XML | 2025 |
| Raport de performanță ANAF | XML | 2021-2025 |
| Plan Strategic ANAF 2025-2028 | XML | 2025-2028 |
| Strategia ANAF 2021-2024 | XML | 2021-2024 |
| Calendarul obligațiilor fiscale | XML | 2021-2026 |

### A3. AEP — Autoritatea Electorală Permanentă — 24 seturi

| Set | Format | An |
|---|---|---|
| Alegeri parlamentare | CSV, TXT | 2012, 2016, 2020 |
| Alegeri locale | CSV, TXT, XLS | 2012, 2016, 2020 |
| Alegeri prezidențiale | XLS | 2009, 2014 |
| Alegeri europarlamentare | CSV, XLS | 2009, 2014, 2019 |
| Referendumuri | XLS, XLSX | 2009, 2012, 2018, 2019 |
| Salarii AEP | XLSX | 2018 |
| Plăți AEP | XLSX | 2017, 2018 |
| Bilanț AEP | XLSX | 2017, 2018 |
| Bugetul AEP | XLSX | 2018 |

### A4. Ministerul Energiei — 21 seturi

| Set | Format | Ani |
|---|---|---|
| Execuție bugetară | XLS | 2016-2019 |
| Bilanțuri | XLS | 2015-2016 |
| Acțiuni deținute de stat la companii | XLS, XLSX | curent |
| Portofoliul operatorilor economici | XLS, ODS | 2018 |
| Contracte de concesiune | XML, ODS | 2017-2018 |
| Contracte de achiziții publice | XML | 2016 |
| Drepturi salariale | XML | curent |
| Plăți salarii | XLS | 2016 |

### A5. CNI — Compania Națională de Investiții — 17 seturi

| Set | Ani |
|---|---|
| Obiective CNI recepționate | 2002-2020 (anual) |

**Notă:** Fiecare set conține lista obiectivelor de investiții finanțate de stat în acel an.

### A6. MFE — Ministerul Investițiilor Europene — 6 seturi

| Set | Format |
|---|---|
| Proiecte contractate (fonduri europene) | XLSX |
| Stadiul absorbției 2014-2020 | XLSX |
| Stadiul absorbției 2021-2027 | XLSX |
| Transparentizare SMIS 2007-2013 | XLS, ODT, CSV |
| Informații fonduri europene din SMIS | CSV, XLSX, XLS |
| Informații SMIS CSNR | XML |

### A7. AMEPIP — 2 seturi

| Set | Format |
|---|---|
| Indicatori financiari, nefinanciari și de guvernanță corporativă | XLSX |
| Export date indicatori financiari | CSV |

### A8. AAAS — 1 set

| Set | Format |
|---|---|
| Plan anual de achiziții | XLS |

### A9. Consilii Județene — ~200+ seturi

Bugete locale și execuții de la: Brăila, Vrancea, Cluj, Bistrița-Năsăud, Mureș, Tulcea, Argeș, Suceava și altele. Formate: XLS, XLSX.

### A10. Primării — ~50+ seturi

Bugete locale de la: Cluj-Napoca, Călărași, Brașov, Craiova, Alba Iulia, Timișoara, Sebeș, Câmpia Turzii, Gherla, Odorheiu Secuiesc, Copșa Mică, Luduș, Sector 2, Sector 4, Sector 6 București + comune (Bolintin Deal, Bobicești, Berceni, Puiești, Călinești, Găgești, Joița, Săliștea, Ariceștii Rahtivani).

### A11. ONRC — 76 seturi (relevante financiar: situații și date firme)

| Set | Format | Ani |
|---|---|---|
| Firme înregistrate (dumps lunare CSV) | CSV | 2013-2026 (lunar) |
| Nomenclatoare (cod stare, CAEN, etc.) | CSV | curent |
| Activități autorizate | CSV | 2025 |
| Buget ONRC 2013 | XLS | 2013 |

---

## Surse Externe

### BNR — Banca Națională a României (nu e pe data.gov.ro)

| Date | URL | Format | Acces |
|---|---|---|---|
| Curs valutar zilnic | bnr.ro/nbrfxrates.xml | XML API | Gratuit, fără auth |
| Dobânda de politică monetară | bnr.ro | HTML | Gratuit |
| Raport asupra inflației | bnr.ro | PDF | Trimestrial |
| Raport de stabilitate financiară | bnr.ro | PDF | Anual |
| Balanța de plăți | bnr.ro | PDF | Lunar |
| Indicatori monetari | bnr.ro | HTML, PDF | Periodic |

### ASF — Autoritatea de Supraveghere Financiară (nu e pe data.gov.ro)

| Date | URL |
|---|---|
| Piața de capital — rapoarte emitenți | asfromania.ro |
| Fonduri de pensii private — active, contribuții | asfromania.ro |
| Piața de asigurări — prime, daune | asfromania.ro |
| Intermediari autorizați | asfromania.ro |
| Rapoarte anuale | asfromania.ro |

### Alte surse externe relevante

| Instituție | Date publice | URL |
|---|---|---|
| **Curtea de Conturi a României** | Rapoarte de audit public, datorie publică, cheltuieli bugetare | curteadeconturi.ro |
| **Consiliul Fiscal** | Opinii privind bugetul, sustenabilitate fiscală | consiliulfiscal.ro |
| **FGDB — Fondul de Garantare a Depozitelor Bancare** | Date despre depozite garantate, instituții membre | fgdb.ro |
| **BVB — Bursa de Valori București** | Cotații, indici, emitenți, dividende | bvb.ro |
| **FNGCIMM — Fondul Național de Garantare** | Garanții credite IMM, Prima Casă / Noua Casă | fnGCimm.ro |

---

## Prezentare Proposată

### Pagina Principală a Domeniului

```
┌──────────────────────────────────────────────────────────────┐
│ 💰 Buget și Finanțe                                           │
│                                                               │
│ Banii publici ai României — de unde vin, unde se duc.         │
│                                                               │
│ 📊 INSTITUȚII ÎN ACEST DOMENIU                                │
│                                                               │
│ 🏛️ Ministerul Finanțelor (109 seturi)                        │
│   📋 Bugetul de Stat · 📈 Datorie Publică · 💼 Situații Fin. │
│                                                               │
│ 💳 ANAF (49 seturi)                                           │
│   📊 Buletine Fiscale · 💰 Buget ANAF · 📅 Obligații Taxe    │
│                                                               │
│ 🏛️ AEP (24 seturi)                                           │
│   🗳️ Alegeri · 💰 Finanțare Partide                          │
│                                                               │
│ ⚡ Ministerul Energiei (21 seturi)                            │
│   📋 Execuții · 📊 Acțiuni Stat · 🏗️ Concesiuni             │
│                                                               │
│ 🏗️ CNI (17 seturi)                                           │
│   🏘️ Investiții Publice                                      │
│                                                               │
│ 🌐 MFE (6 seturi)                                             │
│   💶 Fonduri Europene · Absorbție                             │
│                                                               │
│ 🏛️ BNR (API live)                                            │
│   💱 Curs Valutar Zilnic · 📈 Dobânzi · 📉 Inflație          │
│                                                               │
│ 🏛️ ASF                                                        │
│   📊 Piață Capital · Pensii · Asigurări                       │
│                                                               │
│ + AMEPIP, AAAS, Consilii Județene, Primării, ONRC             │
└──────────────────────────────────────────────────────────────┘
```

### Card Rezumat (pentru pagina principală a site-ului)

```
┌──────────────────────────────────────────────────────────────┐
│ 💰 Buget și Finanțe  ▸                                        │
│                                                               │
│ 12 instituții · ~500+ seturi de date                          │
│                                                               │
│ 📋 Bugetul de Stat        🏘️ Bugete Locale                   │
│ 📈 Datorie Publică         💳 Taxe și Impozite                │
│ 💱 Curs Valutar (live)    💼 Situații Financiare              │
│ 🏗️ Fonduri Europene       🗳️ Finanțare Partide              │
└──────────────────────────────────────────────────────────────┘
```

---

## Întrebări Frecvente

| Întrebare | Răspuns rapid | Unde găsești |
|---|---|---|
| „Cât e bugetul pe 2026?" | ~686 mld lei | Bugetul de Stat |
| „Pe ce se duc banii?" | Asistență socială (26%) | Bugetul de Stat → Cheltuieli |
| „Cât e datoria publică?" | ~580 mld lei (52% PIB) | Datorie Publică |
| „Câte garanții a emis statul?" | Garanții de stat (OUG 64/2007) | Datorie Publică |
| „Cât e cursul euro azi?" | BNR, zilnic | Curs Valutar (API live) |
| „Câte firme s-au înființat luna asta?" | ONRC, CSV lunar | Situații Financiare |
| „Cât TVA s-a colectat?" | Vezi Buletinul Statistic Fiscal | Taxe |
| „Câți bani a primit partidul X?" | AEP — venituri + subvenții | Finanțare Partide |
| „Ce investiții a făcut statul în orașul meu?" | CNI + PNRR + MDRAP | Investiții |
| „Câți bani europeni a absorbit România?" | MFE — stadiu absorbție | Fonduri Europene |
| „Câți bani a primit România din PNRR?" | Plăți PNRR lunare (MDRAP) | Investiții → PNRR |
| „Ce buget are ministerul Sănătății?" | Bugetul de Stat | Bugetul de Stat |
| „Ce salarii sunt la bugetari?" | Număr salariați + indicatori | Întreprinderi Publice |
| „Câte firme au datorii la stat?" | Arierate + Datorii buget | Taxe |
| „Ce spune Curtea de Conturi despre buget?" | Rapoarte de audit | Curtea de Conturi (sursă externă) |
| „Cum vede Consiliul Fiscal bugetul?" | Opinii și prognoze | Consiliul Fiscal (sursă externă) |
| „Cât valorează acțiunile pe Bursă?" | Cotații BVB | BVB (sursă externă) |
| „Ce depozite sunt garantate?" | FGDB — plafon 100.000 EUR | FGDB (sursă externă) |
