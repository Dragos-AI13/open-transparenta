# 🏛️ Domeniul 5 — Administrație

> Dosar complet: toate instituțiile, toate seturile de date, toate sursele.
> Verificat pe data.gov.ro + surse proprii, Iulie 2026.
> **Acesta este cel mai mare domeniu** — ~1.600+ seturi de date.

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

Date despre administrația publică centrală și locală: ministere, agenții, funcționari publici,
bugete administrative, investiții publice, dezvoltare regională, locuințe, urbanism și cetățenie.

**Pentru cetățean:** „Cum funcționează statul și pe ce se cheltuie banii?"

---

## Instituții

### A. Pe data.gov.ro

| # | Instituție | Tip | Seturi | Cod |
|---|---|---|---|---|
| 1 | **MDRAP / MDLPA — Dezvoltare, Lucrări Publice** | Minister | **1.452** | `mdrap` |
| 2 | **DEPABD — Evidența Persoanelor** | Direcție | **85** | `directia-evidenta-persoanelor-admin-baze-de-date` |
| 3 | **INA — Institutul Național de Administrație** | Institut | **167** | `institutul-national-de-administratie` |
| 4 | **ANFP — Funcționari Publici** | Agenție | **140** | `agentia-nationala-a-functionarilor-publici` |
| 5 | **ANC — Autoritatea pentru Cetățenie** | Autoritate | **38** | `autoritatea-nationala-pentru-cetatenie` |
| 6 | **ADR — Digitalizare României** | Autoritate | **16** | `agentia-pentru-agenda-digitala-a-romaniei` |
| 7 | **SGG — Secretariatul General al Guvernului** | Secret. | **13** | `secretariatul-general-al-guvernului` |
| 8 | **ANRSC — Utilități Publice** | Autoritate | **3** | `autoritatea-nationala-de-reglementare-pentru-serviciile-comunitare-de-utilitati-publice` |
| 9 | **Cancelaria Prim-Ministrului** | Cancelarie | **2** | `cancelaria-prim-ministrului` |
| 10 | **Guvernul României** | Guvern | **0** | `guvernul-romaniei` |
| 11 | **Primării** (~30) | Primărie | ~50+ | fiecare |
| 12 | **Consilii Județene** (~20) | CJ | ~200+ | fiecare |
| 13 | **Poliții Locale** (~2) | Poliție | ~12 | `politia-locala-iasi`, `politia-locala-ploiesti` |

### B. În afara data.gov.ro

| # | Instituție | Date disponibile | Acces |
|---|---|---|---|
| 12 | **gov.ro** | Știri, comunicate, acte normative | gov.ro |
| 13 | **Primăria București** | Buget, hotărâri, urbanism | pmb.ro |

---

## Arborele Complet

```
🏛️ ADMINISTRAȚIE
│
├── 🏛️ DEZVOLTARE REGIONALĂ (MDRAP)
│   ├── PNDL — Programul Național de Dezvoltare Locală
│   ├── Anghel Saligny — Investiții locale
│   ├── PNRR — Plăți (50+ seturi lunare)
│   ├── PUG — Planuri Urbanistice Generale
│   ├── Consolidare clădiri risc seismic
│   ├── Reabilitare termică
│   ├── Termoficare
│   ├── Locuințe sociale
│   ├── Școli sigure și sănătoase
│   ├── PCTE — Cooperare Teritorială Europeană
│   ├── Achiziții publice MDRAP
│   └── Plăți activitate curentă
│
├── 👥 FUNCȚIONARI PUBLICI (ANFP)
│   ├── Structura funcționarilor publici
│   │   ├── Pe grade profesionale
│   │   ├── Pe grupe de vârstă
│   │   └── Pe gen
│   ├── Mobilitate în funcții publice
│   ├── Instituții care raportează către ANFP
│   ├── Lista partenerilor de formare
│   └── Achiziții ANFP
│
├── 🎓 FORMARE ADMINISTRAȚIE (INA)
│   ├── Participanți la programe de formare
│   ├── Analiza nevoilor de formare
│   ├── Lista funcțiilor INA
│   ├── Bugete și execuții INA
│   └── Achiziții INA
│
├── 🛂 CETĂȚENIE (ANC)
│   ├── Date statistice activitate (lunare, 2017-2018)
│   └── Cereri de cetățenie
│
├── 📋 TRANSPARENȚĂ (SGG)
│   ├── Registrul Unic al Transparenței Intereselor
│   ├── Utilitate publică — persoane juridice
│   └── Buget SGG
│
├── 🆔 EVIDENȚA PERSOANELOR (DEPABD)
│   ├── Acte de naștere (semestrial, 2014-2023, 85 seturi)
│   ├── Acte de căsătorie (semestrial)
│   ├── Acte de deces (semestrial)
│   ├── Acte de identitate / Cărți de identitate (semestrial)
│   └── Furnizări de date din Registrul Național de Evidență a Persoanelor
│
├── 🏙️ URBANISM ȘI CONSTRUCȚII
│   ├── Certificate de urbanism (CJ Vrancea, CJ Mureș, Primăria Cluj)
│   ├── Autorizații de construire (CJ Vrancea, CJ Mureș, etc.)
│   ├── PUG — Planuri Urbanistice Generale
│   ├── RLU — Regulamente Locale de Urbanism
│   └── Arhitectură, urbanism, amenajarea teritoriului
│
├── 🏘️ LOCUINȚE
│   ├── Locuințe sociale
│   ├── ANL — Locuințe pentru tineret
│   └── Programe de reabilitare termică
│
├── 💡 UTILITĂȚI PUBLICE (ANRSC)
│   ├── Licențe ANRSC
│   ├── Starea serviciilor de energie termică
│   └── Autorizări
│
├── 🏛️ BUGETE ADMINISTRATIVE
│   ├── Bugete ministere
│   ├── Bugete consilii județene
│   ├── Bugete primării
│   ├── Bugete instituții publice
│   └── Execuții bugetare
│
└── 🏙️ ADMINISTRAȚIE LOCALĂ
    ├── Date primării (bugete, organigrame, achiziții)
    └── Date consilii județene (bugete, investiții)
```

---

## Prezentare Propusă

### Card Rezumat

```
┌──────────────────────────────────────────────────────────────┐
│ 🏛️ Administrație  ▸                                         │
│                                                               │
│ 11+ instituții · ~1.600+ seturi de date                      │
│                                                               │
│ 🏛️ Dezvoltare Regională   👥 Funcționari Publici           │
│ 🎓 INA — Formare           🆔 Evidența Persoanelor        │
│ 🛂 Cetățenie                🏙️ Urbanism                   │
│ 🏘️ Locuințe                💡 Utilități Publice           │
│ 🏛️ Bugete Locale           📊 Statistici Funcții Publice │
└──────────────────────────────────────────────────────────────┘
```

---

## Întrebări Frecvente

| Întrebare | Răspuns rapid | Unde găsești |
|---|---|---|
| „Câți funcționari publici sunt în România?" | ANFP — structură funcționari | Funcționari Publici |
| „Câte nașteri s-au înregistrat anul trecut?" | DEPABD — acte de naștere | Evidența Persoanelor |
| „Câte căsătorii s-au înregistrat?" | DEPABD — acte de căsătorie | Evidența Persoanelor |
| „Câte decese s-au înregistrat?" | DEPABD — acte de deces | Evidența Persoanelor |
| „Câte cărți de identitate s-au eliberat?" | DEPABD — cărți de identitate | Evidența Persoanelor |
| „Ce proiecte se finanțează prin PNDL?" | MDRAP — PNDL | Dezvoltare Regională |
| „Ce investiții se fac prin Anghel Saligny?" | Plăți PNIAS | Dezvoltare Regională |
| „Cum obțin cetățenia română?" | ANC — date statistice | Cetățenie |
| „Cine e declarant în Registrul de Transparență?" | SGG — RUTI | Transparență |
| „Ce primării din România publică date?" | 30+ primării pe data.gov.ro | Administrație Locală |
