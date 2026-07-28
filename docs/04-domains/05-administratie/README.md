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
| 2 | **INA — Institutul Național de Administrație** | Institut | **167** | `institutul-national-de-administratie` |
| 3 | **ANFP — Funcționari Publici** | Agenție | **140** | `agentia-nationala-a-functionarilor-publici` |
| 4 | **ANC — Autoritatea pentru Cetățenie** | Autoritate | **38** | `autoritatea-nationala-pentru-cetatenie` |
| 5 | **ADR — Digitalizare României** | Autoritate | **16** | `agentia-pentru-agenda-digitala-a-romaniei` |
| 6 | **SGG — Secretariatul General al Guvernului** | Secret. | **13** | `secretariatul-general-al-guvernului` |
| 7 | **ANRSC — Utilități Publice** | Autoritate | **3** | `autoritatea-nationala-de-reglementare-pentru-serviciile-comunitare-de-utilitati-publice` |
| 8 | **Cancelaria Prim-Ministrului** | Cancelarie | **2** | `cancelaria-prim-ministrului` |
| 9 | **Guvernul României** | Guvern | **0** | `guvernul-romaniei` |
| 10 | **Primării** (~30) | Primărie | ~50+ | fiecare |
| 11 | **Consilii Județene** (~20) | CJ | ~200+ | fiecare |

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
├── 🏙️ URBANISM ȘI CONSTRUCȚII
│   ├── PUG — Planuri Urbanistice Generale
│   ├── Autorizații de construire
│   ├── Certificate de urbanism
│   └── RLU — Regulamente Locale de Urbanism
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
│ 🎓 INA — Formare           🛂 Cetățenie                     │
│ 📋 Transparență            🏙️ Urbanism                     │
│ 🏘️ Locuințe                💡 Utilități Publice            │
│ 🏛️ Bugete Locale           📊 Statistici Funcții Publice   │
└──────────────────────────────────────────────────────────────┘
```

---

## Întrebări Frecvente

| Întrebare | Răspuns rapid | Unde găsești |
|---|---|---|
| „Câți funcționari publici sunt în România?" | ANFP — structură funcționari | Funcționari Publici |
| „Ce proiecte se finanțează prin PNDL?" | MDRAP — PNDL | Dezvoltare Regională |
| „Ce investiții se fac prin Anghel Saligny?" | Plăți PNIAS | Dezvoltare Regională |
| „Cum obțin cetățenia română?" | ANC — date statistice | Cetățenie |
| „Cine e declarant în Registrul de Transparență?" | SGG — RUTI | Transparență |
| „Ce primării din România publică date?" | 30+ primării pe data.gov.ro | Administrație Locală |
