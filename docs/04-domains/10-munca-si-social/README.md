# 👥 Domeniul 10 — Muncă și Social

> Dosar complet: toate instituțiile, toate seturile de date, toate sursele.
> Verificat pe data.gov.ro + surse proprii, Iulie 2026.

---

## Cuprins

1. [Descriere](#descriere)
2. [Instituții și surse](#instituții)
3. [Arborele complet](#arborele-complet)
4. [Inventar complet — toate seturile de date](#inventar-complet)
5. [Prezentare propusă](#prezentare)
6. [Întrebări frecvente](#întrebări)

---

## Descriere

Date despre piața muncii și protecția socială în România: șomaj, ocupare, pensii,
alocații și ajutoare sociale, protecția copilului, persoane cu dizabilități,
egalitate de șanse, violență domestică, condiții de muncă.

**Pentru cetățean:** „Ce ajutoare sociale există și câți șomeri sunt?"

---

## Instituții

### A. Pe data.gov.ro

| # | Instituție | Tip | Seturi | Cod organizație |
|---|---|---|---|---|
| 1 | **ANOFM — Ocuparea Forței de Muncă** | Agenție | **184** | `agentia-nationala-pentru-ocuparea-fortei-de-munca` |
| 2 | **MMFPSPV — Ministerul Muncii** | Minister | **10** | `mmfpspv` |
| 3 | **ANPIS — Plăți și Inspecție Socială** | Agenție | **6** | `agentia-nationala-pentru-plati-si-inspectie-sociala` |
| 4 | **ANES — Egalitate de Șanse** | Agenție | **5** | `agentia-nationala-pentru-egalitatea-de-sanse-intre-femei-si-barbati` |
| 5 | **ANPDCA — Protecția Copilului** | Autoritate | **2** | `autoritatea-nationala-pentru-protectia-drepturilor-copilului-si-adoptie` |
| 6 | **Consultare Publică** | Minister | **18** | `ministerul-pentru-consultare-publica-si-dialog-civic` |

### B. În afara data.gov.ro

| # | Instituție | Date disponibile | Acces |
|---|---|---|---|
| 7 | **CNPP — Casa Națională de Pensii Publice** | Pensii, pensionari, punct de pensie | cnpp.ro |
| 8 | **Inspecția Muncii** | Accidente muncă, contracte muncă, amenzi | inspectiamuncii.ro |

---

## Arborele Complet

```
👥 MUNCĂ ȘI SOCIAL
│
├── 📊 ȘOMAJ ȘI OCUPARE (ANOFM)
│   ├── Şomajul înregistrat (lunar, 184 seturi)
│   │   ├── Rata șomajului
│   │   ├── Șomeri pe categorii, vârstă, sex
│   │   └── Pe județe
│   └── Programul Național de Ocupare a Forței de Muncă (lunar)
│       ├── Locuri de muncă vacante
│       ├── Formare profesională
│       └── Măsuri active de ocupare
│
├── 💰 PENSII (CNPP + MMFPSPV)
│   ├── Pensii și asigurări sociale de stat (MMFPSPV)
│   ├── Număr pensionari
│   ├── Pensie medie
│   └── Punct de pensie
│
├── 👶 ALOCAȚII ȘI AJUTOARE (ANPIS)
│   ├── Alocația de stat pentru copii
│   ├── Indemnizația de creștere a copilului
│   ├── Alocația pentru susținerea familiei
│   ├── Ajutor social — Venit Minim Garantat
│   └── Venitul Minim de Incluziune (VMI)
│
├── 🛡️ ASISTENȚĂ SOCIALĂ (MMFPSPV)
│   ├── Asistența socială — date generale
│   ├── Servicii sociale licențiate
│   ├── Furnizori de servicii sociale acreditați
│   ├── Protecția drepturilor copilului
│   └── Persoane cu dizabilități
│
├── 👤 PROTECȚIA COPILULUI (ANPDCA)
│   ├── Organisme Private Autorizate
│   └── Cabinete/societăți profesionale
│
├── ♿ PERSOANE CU DIZABILITĂȚI (MMFPSPV)
│   └── Protecția persoanelor cu dizabilități
│
├── 👩 EGALITATE DE ȘANSE (ANES)
│   ├── Participare politică și decizională
│   ├── Date statistice violență domestică (2021-2024)
│   └── Egalitate de gen
│
├── 🏭 CONDIȚII DE MUNCĂ (MMFPSPV)
│   ├── Condiții de muncă
│   └── Accidente de muncă (Inspecția Muncii — sursă externă)
│
├── 📋 CLASIFICAȚII
│   ├── Clasificarea Ocupațiilor din România (COR)
│   └── Ocuparea, șomajul și protecția socială
│
└── 📊 STATISTICI SOCIALE
    ├── Date demografice sociale
    └── Incluziune socială
```

---

## Inventar Complet

### ANOFM — 184 seturi (lunare)

| Set | Frecvență |
|---|---|
| Şomajul înregistrat | **Lunar** (serie continuă) |
| Programul Național de Ocupare a Forței de Muncă | **Lunar** (serie continuă) |

### MMFPSPV — 10 seturi

| Set | Format |
|---|---|
| Asistența socială | XML |
| Condiții de muncă | XML |
| Protecția persoanelor cu dizabilități | XML |
| Pensii și asigurări sociale de stat | XML |
| Ocuparea, șomajul și protecția socială | XML |
| Clasificarea Ocupațiilor din România (COR) | XML |
| Furnizori de servicii sociale acreditați | XML |
| Servicii sociale licențiate | XML |
| Protecția drepturilor copilului | XML |
| Pensii și asigurări sociale | XML |

### ANPIS — 6 seturi

| Set | Format |
|---|---|
| Raport privind venitul minim de incluziune — VMI | CSV |
| Raport privind alocația de stat pentru copii | CSV |
| Raport privind indemnizația de creștere a copilului | CSV |
| Raport privind alocația pentru susținerea familiei | CSV, TXT |
| Raport privind ajutorul social — Venitul Minim Garantat | CSV, TXT |
| Raport alocație de stat copii | CSV |

### ANES — 5 seturi

| Set | Ani |
|---|---|
| Date statistice violență domestică | 2021-2024 |
| Participare politică și decizională | curent |

### ANPDCA — 2 seturi

| Set | Format |
|---|---|
| Lista Organisme Private Autorizate | XML |
| Listă cabinete/societăți profesionale | XML |

---

## Prezentare Propusă

### Card Rezumat

```
┌──────────────────────────────────────────────────────────────┐
│ 👥 Muncă și Social  ▸                                       │
│                                                               │
│ 5+ instituții · ~207+ seturi de date                         │
│                                                               │
│ 📊 Șomaj și Ocupare      💰 Pensii                          │
│ 👶 Alocații și Ajutoare   🛡️ Asistență Socială             │
│ 👤 Protecția Copilului    ♿ Dizabilități                    │
│ 👩 Egalitate de Șanse    🏭 Condiții de Muncă              │
└──────────────────────────────────────────────────────────────┘
```

---

## Întrebări Frecvente

| Întrebare | Răspuns rapid | Unde găsești |
|---|---|---|
| „Câți șomeri sunt în România?" | ANOFM — șomaj înregistrat (lunar) | Șomaj |
| „Care e rata șomajului în județul meu?" | ANOFM — date lunare pe județe | Șomaj |
| „Cât e pensia medie?" | CNPP — statistici | Pensii |
| „Cât e alocația pentru copii?" | ANPIS — alocație de stat | Alocații |
| „Cât e indemnizația de creștere a copilului?" | ANPIS | Alocații |
| „Cât e ajutorul social (VMG/VMI)?" | ANPIS — VMI | Alocații |
| „Câte cazuri de violență domestică?" | ANES — date statistice | Egalitate |
| „Ce servicii sociale există în orașul meu?" | Furnizori acreditați | Asistență Socială |
| „Câte persoane cu dizabilități sunt?" | MMFPSPV | Dizabilități |
| „Ce ocupații există în România?" | COR — Clasificarea Ocupațiilor | Clasificații |
