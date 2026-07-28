# 💰 Domeniul 1 — Buget și Finanțe

> Dosar complet: date, structură, analiză, propunere de prezentare.

---

## Cuprins

1. [Descrierea domeniului](#descriere)
2. [Instituții și surse](#instituții)
3. [Arborele complet al datelor](#arborele-complet)
4. [Inventarul seturilor de date reale](#inventar)
5. [Povestea datelor — propunere de prezentare](#prezentare)
6. [Întrebări pe care le răspunde domeniul](#întrebări)

---

## Descriere

Acest domeniu cuprinde **toate datele despre banii publici din România**:
banii pe care statul îi încasează (taxe, impozite, contribuții), banii pe care
îi cheltuiește (bugete, salarii, investiții), datoria publică, bugetele locale
și indicatorii financiari (curs valutar, inflație, dobânzi).

**Pentru cetățean:** „Unde se duc banii mei?"

---

## Instituții

| Instituție | Tip | Seturi pe data.gov.ro | Alte date disponibile | Acces |
|---|---|---|---|---|
| **Ministerul Finanțelor (MFP)** | Minister | ~109 | Bugetul de stat, execuție, datorie publică pe site propriu (Liferay SPA) | data.gov.ro + mfinante.gov.ro (SPA) |
| **ANAF** | Agenție | ~49 | Registrul plătitorilor TVA (API REST), Buletine statistice fiscale, e-Factura, e-Transport | data.gov.ro + anaf.ro + API |
| **BNR** | Bancă centrală | — | Curs valutar zilnic (API XML gratuit), dobânzi, inflație, indicatori monetari | bnr.ro/nbrfxrates.xml |
| **AEP** | Autoritate | ~24 | Finanțarea partidelor politice, cheltuieli campanie | data.gov.ro + roaep.ro |
| **Consilii Județene** | Administrație locală | ~200+ | Bugete și execuții locale, fiecare județ | data.gov.ro |
| **Primării** | Administrație locală | ~50+ | Bugete locale, taxe și impozite locale | data.gov.ro |
| **AAAS** | Agenție | 1 | Administrarea activelor statului | data.gov.ro |
| **Ministerul Finanțelor Publice** | Minister | — | Clasificații bugetare, rectificări | data.gov.ro |

---

## Arborele Complet

```
💰 BUGET ȘI FINANȚE
│
├── 📋 BUGETUL DE STAT
│   ├── Bugetul anual (2014-2026)
│   │   ├── Legea bugetului de stat (anual, PDF/DOC)
│   │   ├── Sinteză bugetară (venituri + cheltuieli)
│   │   └── Clasificații bugetare (coduri, indicatori)
│   │
│   ├── Execuția bugetară
│   │   ├── Venituri realizate vs. estimate
│   │   ├── Cheltuieli efectuate vs. planificate
│   │   ├── Deficit / excedent bugetar
│   │   └── Pe capitole bugetare + ministere
│   │
│   ├── Rectificări bugetare
│   │   └── Modificări ale bugetului pe parcursul anului
│   │
│   └── Fondul de rezervă al Guvernului
│       └── Alocări din fondul de rezervă
│
├── 🏘️ BUGETE LOCALE
│   ├── Bugete consilii județene
│   │   ├── Venituri proprii (pe județ)
│   │   └── Cheltuieli (pe categorii)
│   │
│   ├── Bugete primării
│   │   ├── Venituri din taxe și impozite locale
│   │   ├── Cheltuieli de funcționare
│   │   └── Cheltuieli de investiții
│   │
│   ├── Bugete instituții publice
│   │   └── Spitale, școli, teatre, muzee etc.
│   │
│   └── Echilibrare bugete locale
│       └── Sume primite de la bugetul de stat
│
├── 📈 DATORIA PUBLICĂ
│   ├── Datorie internă (guvernamentală)
│   ├── Datorie externă
│   ├── Serviciul datoriei (dobânzi + rambursări)
│   └── Deficit bugetar (anual/lunar)
│
├── 💳 TAXE ȘI IMPOZITE
│   ├── Impozit pe venit
│   ├── TVA (Taxa pe Valoare Adăugată)
│   ├── Impozit pe profit
│   ├── Contribuții sociale (CAS, CASS)
│   ├── Accize
│   └── Taxe locale (clădiri, teren, mașini)
│
├── 💱 INDICATORI FINANCIARI
│   ├── Curs valutar BNR (zilnic, 36 valute + aur)
│   ├── Dobânda de politică monetară BNR
│   ├── ROBOR / IRCC (indicatori de piață)
│   ├── Inflație (IPC, medie anuală)
│   └── Indicatori monetari (M2, credite, depozite)
│
├── 🏛️ BUGETE INSTITUȚII PUBLICE
│   ├── Ministere (fiecare minister are buget propriu)
│   ├── Agenții naționale
│   ├── Companii de stat
│   └── Acțiuni deținute de stat la companii
│
├── 💼 SITUAȚII FINANCIARE
│   ├── Situații financiare anuale (companii, 2008-2022)
│   ├── Bilanțuri contabile
│   └── Dări de seamă contabile
│
├── 📊 BULETINE STATISTICE FISCALE
│   ├── Buletin statistic fiscal ANAF (trimestrial)
│   ├── Statistici privind colectarea taxelor
│   └── Registrul plătitorilor de TVA
│
├── 🏗️ SUBVENȚII ȘI FONDURI
│   ├── Subvenții de la bugetul de stat
│   ├── Fonduri europene nerambursabile
│   ├── Programul Anghel Saligny (investiții locale)
│   └── Fonduri externe
│
├── 🧾 ACHIZIȚII PUBLICE (financiar)
│   ├── Bugete de achiziții per instituție
│   └── Contracte și plăți
│
└── 🗳️ FINANȚARE PARTIDE POLITICE
    ├── Venituri partide (subvenții, donații)
    ├── Cheltuieli partide (campanie, funcționare)
    └── Chetuieli electorale
```

---

## Inventar

### A. Bugetul de Stat — Seturi Principale

| Set | Instituție | Format | Ani disponibili | Actualizare |
|---|---|---|---|---|
| Bugetul de stat | MFP | DOC, XLS | 2014-2026 | Anual |
| Sinteză bugetară | MFP | XLS | 2014-2026 | Anual |
| Clasificații bugetare | MFP | XLS | 2020+ | Anual |
| Rectificări bugetare | MFP | XLS | 2024 | Anual |
| Execuția bugetară | SGG | XLSX | 2022+ | Anual |

### B. ANAF — Date Fiscale

| Set | Instituție | Format | Ani | Actualizare |
|---|---|---|---|---|
| Buletin statistic fiscal | ANAF | PDF | 2013-2026 (trimestrial) | Trimestrial |
| Situații financiare (companii) | ANAF/MFP | CSV | 2008-2022 | Anual |
| Registrul plătitorilor TVA | ANAF | API JSON | curent | Continuu |
| Datoriile către bugetul de stat | ANAF | XLSX, PDF | 2023+ | Periodic |
| Lista entităților publice | ANAF/MFP | XLS | curent | Periodic |
| Organisme sector public | ANAF/MFP | XLS, XLSX | curent | Periodic |
| Achiziții ANAF | ANAF | XML, PDF | 2017-2026 | Anual |
| Bugetul de cheltuieli ANAF | ANAF | XML, PDF | 2023-2026 | Anual |
| Raport de performanță ANAF | ANAF | XML, PDF | 2025+ | Anual |

### C. BNR — Indicatori Financiari

| Set | URL | Format | Actualizare |
|---|---|---|---|
| Curs valutar zilnic | bnr.ro/nbrfxrates.xml | XML API | Zilnic |
| Dobânda cheie | bnr.ro | HTML | Periodic |
| Inflație | bnr.ro | PDF | Trimestrial |
| Indicatori monetari | bnr.ro | HTML, PDF | Periodic |

### D. Bugete Locale (exemple)

| Set | Instituție | Ani |
|---|---|---|
| Bugete Consiliul Județean Braila | CJ Braila | 2020-2025 |
| Bugete Consiliul Județean Vrancea | CJ Vrancea | 2021-2025 |
| Bugete Consiliul Județean Cluj | CJ Cluj | 2022-2025 |
| Bugete Primăria Călărași | Primăria Călărași | 2023-2025 |
| Bugete Primăria Cluj-Napoca | Primăria Cluj | 2022+ |
| Buget local jud. Bistrița-Năsăud | CJ BN | 2022+ |
| Bugete Primăria Săliștea AB | Primăria Săliștea | 2023-2025 |
| + încă ~200 de seturi de bugete locale | Diverse primării | 2015-2026 |

### E. Subvenții și Fonduri

| Set | Instituție | Ani |
|---|---|---|
| Subvenții de la bugetul de stat | ONRC/MFP | 2020-2026 |
| Plăți fonduri externe | MDRAP | 2007-2023 |
| Fondul de rezervă al Guvernului | Guvern | 2023+ |
| Plăți Programul Anghel Saligny | MDRAP | 2022+ |
| Plăți AFIR (fonduri agricole) | AFIR | 2020-2023 |

### F. Finanțare Partide

| Set | Instituție | Ani |
|---|---|---|
| Alegeri parlamentare 2016 + 2020 | AEP | 2016, 2020 |
| Alegeri locale 2012, 2014, 2020 | AEP | 2012-2020 |
| Alegeri prezidențiale 2009, 2014 | AEP | 2009, 2014 |
| Alegeri europarlamentare 2009, 2014 | AEP | 2009, 2014 |

---

## Prezentare

### Pagina Principală a Domeniului

```
┌──────────────────────────────────────────────────────────────┐
│ 💰 Buget și Finanțe                                           │
│                                                               │
│ Banii publici ai României — de unde vin și unde se duc.       │
│                                                               │
│ ┌──────────────────────────────────────────────────────┐      │
│ │ 📊 ÎN CIFRE                                            │      │
│ │                                                        │      │
│ │   Buget de stat 2026      Datorie publică    Curs euro │      │
│ │   ┌──────────────┐       ┌──────────────┐  ┌─────────┐│      │
│ │   │  ~686 mld lei│       │  ~580 mld lei│  │  5.23   ││      │
│ │   │  (+8% vs 25) │       │  (52% din PIB)│  │  RON    ││      │
│ │   └──────────────┘       └──────────────┘  └─────────┘│      │
│ │                                                        │      │
│ │   Deficit      TVA colectat  Cheltuieli cu personalul  │      │
│ │   ┌──────────┐ ┌──────────┐  ┌────────────────────┐   │      │
│ │   │  ~5.6%   │ │  ~15%    │  │  ~180 mld lei      │   │      │
│ │   │  din PIB │ │  din PIB │  │  (cel mai mare cap)│   │      │
│ │   └──────────┘ └──────────┘  └────────────────────┘   │      │
│ └──────────────────────────────────────────────────────┘      │
│                                                               │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│ │ 📋       │ │ 🏘️       │ │ 📈       │ │ 💳       │          │
│ │ Buget    │ │ Bugete   │ │ Datorie  │ │ Taxe     │          │
│ │ de Stat  │ │ Locale   │ │ Publică  │ │ Impozite │          │
│ │ 6 seturi │ │ 200+ set │ │ 3 seturi │ │ 6+ seturi│          │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│ │ 💱       │ │ 📊       │ │ 🏗️       │ │ 🗳️       │          │
│ │ Curs     │ │ Situații │ │ Fonduri  │ │ Partide  │          │
│ │ Valutar  │ │ Financi- │ │ Subvenții│ │ 6 seturi │          │
│ │ (API live│ │ are      │ │ 73+ set  │ └──────────┘          │
│ │ zilnic)  │ │ 30 set   │ └──────────┘                       │
│ └──────────┘ └──────────┘                                     │
└──────────────────────────────────────────────────────────────┘
```

### Pagina Subdomeniu: Bugetul de Stat

```
┌──────────────────────────────────────────────────────────────┐
│ 💰 Buget → 📋 Bugetul de Stat                                │
│                                                               │
│ ┌──────────────────────────────────────────────────────┐      │
│ │ 📊 EVOLUȚIA BUGETULUI DE STAT (2014-2026)            │      │
│ │                                                        │      │
│ │ 📈 Venituri ↗  Cheltuieli ↗  Deficit ↘                 │      │
│ │                                                        │      │
│ │  2014 ████████████████  = 220 mld                      │      │
│ │  2015 █████████████████ = 240 mld                      │      │
│ │  ...                                                    │      │
│ │  2026 ██████████████████████████████ = 686 mld         │      │
│ │                                                        │      │
│ │  📥 Descarcă toate datele (CSV)                        │      │
│ └──────────────────────────────────────────────────────┘      │
│                                                               │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│ │ Legea    │ │ Execuția │ │ Rectifi- │ │ Clasifi- │          │
│ │ Bugetară │ │ Bugetară │ │ cări     │ │ cații    │          │
│ │ anual    │ │ lunară   │ │           │ │ Bugetare │          │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
│                                                               │
│ ──────────────────────────────────────────────────────       │
│ 💡 Știai că? Cel mai mare capitol bugetar este               │
│     „Asistența socială" (~180 mld lei), urmat de             │
│     „Sănătate" și „Educație".                                │
└──────────────────────────────────────────────────────────────┘
```

### Pagina Detaliu: Bugetul pe un An

```
┌──────────────────────────────────────────────────────────────┐
│ 💰 Buget → 📋 Bugetul de Stat → 2026                          │
│                                                               │
│ Bugetul de Stat 2026                                          │
│ ════════════════════════                                      │
│                                                               │
│ 📄 Legea bugetară: Legea nr. .../2026                        │
│ 📅 Adoptat: Decembrie 2025                                   │
│                                                               │
│ ┌─────── VENITURI (total: 624 mld lei) ───────┐              │
│ │                                                │              │
│ │ 💳 TVA                    ████████████████  31% │              │
│ │ 💳 Contribuții sociale    ██████████████    29% │              │
│ │ 💳 Impozit pe venit       ████████          17% │              │
│ │ 💳 Accize                 ████              8%  │              │
│ │ 💳 Impozit pe profit      ███               6%  │              │
│ │ 💳 Alte venituri          ████              9%  │              │
│ └────────────────────────────────────────────────┘              │
│                                                               │
│ ┌─────── CHELTUIELI (total: 686 mld lei) ──────┐              │
│ │                                                │              │
│ │ 👥 Asistență socială   █████████████████████ 26% │              │
│ │ 🏥 Sănătate           ██████████████        16% │              │
│ │ 🎓 Educație           ████████████          15% │              │
│ │ 🛡️ Apărare + Ordine  █████████             11% │              │
│ │ 🏗️ Investiții         ███████               9%  │              │
│ │ 💰 Dobânzi datorie    █████                 6%  │              │
│ │ 🌾 Agricultură        ████                  5%  │              │
│ │ 🏛️ Cultură + justiție ███                   4%  │              │
│ │ 🌐 Altele             ████████             12%  │              │
│ └────────────────────────────────────────────────┘              │
│                                                               │
│ 📊 📈 Compară cu 2025 | 2024 | 2023...                       │
│                                                               │
│ 📥 [DOC original] [XLS original] [CSV] [JSON]                │
│ 🔗 Sursa: Ministerul Finanțelor — data.gov.ro                │
│                                                               │
│ ───────────────────────────────────────────────────────       │
│ 🌍 Vezi și:                                                    │
│   📈 Datoria publică — cât datorează statul                   │
│   🏘️ Bugetul local al județului tău                          │
│   📊 Execuția bugetară — cât s-a cheltuit efectiv             │
└──────────────────────────────────────────────────────────────┘
```

### Cardul Rezumat (pentru pagina principală a site-ului)

```
┌──────────────────────────────────────────────────────────────┐
│ 💰 Buget și Finanțe  ▸                                        │
│                                                               │
│ Banii publici ai României.                                    │
│                                                               │
│ 📋 Buget de stat (686 mld lei în 2026)                       │
│ 🏘️ Bugete locale (200+ seturi per județ)                    │
│ 📈 Datorie publică (52% din PIB)                             │
│ 💳 Taxe (TVA 31% din venituri)                               │
│ 💱 Curs valutar BNR (API live zilnic)                        │
│                                                               │
│ > 300 de seturi de date                                      │
└──────────────────────────────────────────────────────────────┘
```

---

## Întrebări

| Întrebare | Răspuns | Subdomeniu |
|---|---|---|
| **„Cât a cheltuit guvernul anul trecut?"** | 686 mld lei (2026) | Buget de Stat |
| **„Pe ce se duc cei mai mulți bani?"** | Asistență socială (26%) | Buget de Stat |
| **„Cât e datoria publică a României?"** | ~580 mld lei (52% PIB) | Datorie Publică |
| **„Ce salariu are primarul meu?"** | Vezi bugetul local → cheltuieli de personal | Bugete Locale |
| **„Cât e cursul euro azi?"** | 5.2356 RON (BNR, zilnic) | Curs Valutar |
| **„Câți bani a primit partidul X?"** | Subvenții + donații (AEP) | Finanțare Partide |
| **„Cât TVA s-a colectat luna trecută?"** | Vezi Buletinul Statistic Fiscal | Taxe |
| **„Ce firme au primit subvenții?"** | Subvenții de la buget | Subvenții |
| **„Cât plătește statul pe dobânzi la datorie?"** | ~6% din cheltuieli | Datorie Publică |
| **„Cum evoluează deficitul bugetar?"** | Creștere/scădere pe ani | Buget de Stat |
| **„Ce buget are ministerul X?"** | Fiecare minister are alocare proprie | Bugete Instituții |
| **„Cât a costat Programul Anghel Saligny?"** | Vezi plățile | Subvenții |
