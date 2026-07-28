# 🌳 Domeniul 8 — Mediu

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

Date despre mediu și protecția mediului în România: calitatea aerului, apelor și solului,
arii protejate și biodiversitate, deșeuri și reciclare, emisii de gaze cu efect de seră,
meteorologie și climă, geologie și resurse naturale.

**Pentru cetățean:** „Cât de curat e aerul în orașul meu?"

---

## Instituții

### A. Pe data.gov.ro

| # | Instituție | Tip | Seturi | Cod |
|---|---|---|---|---|
| 1 | **ANPM — Protecția Mediului** | Agenție | **234** | `agentia-nationala-pentru-protectia-mediului` |
| 2 | **ANM — Meteorologie** | Administrație | **10** | `administratia-nationala-de-meteorologie` |
| 3 | **Apele Române** | Administrație | **9** | `administratia_nationala_apele_romane` |
| 4 | **Institutul Geologic** | Institut | **1** | `institutul-geologic-al-romaniei` |
| 5 | **ICPA — Pedologie** | Institut | **1** | `institutul-national-de-cercetare-dezvoltare-pentru-pedologie-agrochimie-si-protectia-mediului` |

### B. În afara data.gov.ro

| # | Instituție | Date disponibile | Acces |
|---|---|---|---|
| 6 | **Garda de Mediu** | Controale, sancțiuni, rapoarte | gnm.ro |
| 7 | **ANANP — Arii Naturale Protejate** | Arii protejate, administrare | ananp.gov.ro |
| 8 | **MMAP — Ministerul Mediului** | Legislație, strategii, rapoarte | mmediu.ro |

---

## Arborele Complet

```
🌳 MEDIU
│
├── 🌬️ CALITATEA AERULUI (ANPM)
│   ├── Zone și aglomerări
│   ├── Date de evaluare (validate + actualizate din modelare)
│   ├── Metode de evaluare
│   ├── Regimul de evaluare
│   ├── Măsurări de la stațiile de monitorizare (80+ stații, XML, per stație)
│   ├── Planuri privind calitatea aerului
│   ├── Atingerea obiectivelor de mediu
│   └── Repartizarea surselor de poluare
│
├── 💧 APA
│   ├── Calitatea apei potabile (INSP)
│   ├── Calitatea apei de îmbăiere (INSP)
│   ├── Apele Române — Directiva Cadru Apă (2000/60/CE)
│   ├── Apele Române — Directiva Inundații (2007/60/CE)
│   ├── Apele Române — Raportare Directiva 91/271 (epurare ape uzate)
│   ├── Ape de suprafață (ANPM)
│   ├── Ape subterane
│   └── Instalații de supraveghere a mediului
│
├── 🌿 ARII PROTEJATE ȘI BIODIVERSITATE
│   ├── Arii protejate de interes național (CDDA)
│   ├── Natura 2000 — specii (Art. 17 DH)
│   ├── Natura 2000 — habitate (Art. 17 DH)
│   ├── Areal specii Natura 2000
│   ├── Arii de protecție avifaunistică
│   ├── Rezervații naturale
│   ├── Monumente ale naturii
│   ├── Parcuri naționale și naturale
│   └── Zoo și acvarii
│
├── 🗑️ DEȘEURI
│   ├── Depozite de deșeuri municipale conforme
│   ├── Incinerarea deșeurilor periculoase și nepericuloase
│   ├── Operatori autorizați colectare și tratare deșeuri
│   ├── Operatori autorizați transport deșeuri
│   ├── Producători de baterii și acumulatori înregistrați
│   ├── Producători de echipamente electrice/electronice (DEEE)
│   ├── Deșeuri transferate
│   └── Deșeuri medicale (MS, 2015)
│
├── 🏭 POLUARE ȘI EMISII
│   ├── Registrul Poluanților (E-PRTR) — emisii în aer, apă, sol
│   ├── Gaze cu efect de seră — inventare naționale
│   ├── Emisii verificate ETS (Sistemul de Comercializare a Emisiilor)
│   ├── Emisii SO2, NOx (instalații LCP)
│   ├── Instalații IPPC — prevenirea poluării
│   ├── Instalații COV (compuși organici volatili)
│   ├── Amplasamente SEVESO (risc de accidente majore)
│   └── Instalații mari de ardere (LCP)
│
├── 🌡️ METEOROLOGIE ȘI CLIMĂ (ANM)
│   ├── Date meteorologice zilnice gridate
│   ├── Stații meteorologice esențiale
│   ├── Parametri măsurați la stații
│   ├── Date climatologice (RBSN — 23 de stații)
│   ├── Date radare meteorologice
│   ├── Prognoză numerică a vremii
│   ├── Prognoză meteo pe 5 zile
│   ├── Alerte meteorologice
│   ├── Hartă potențial eolian
│   └── Hartă potențial solar
│
├── 🔊 ZGOMOT
│   ├── Hărți de zgomot (aglomerări, aeroporturi, căi ferate, drumuri)
│   └── Măsurători zgomot
│
├── ⛰️ GEOLOGIE ȘI RESURSE
│   ├── Harta geologică a României 1:1.000.000
│   ├── Resurse minerale
│   └── Date geologice (Apele Române — Geologie)
│
├── 🌍 HIDROGRAFIE ȘI TEREN
│   ├── Acoperirea terenurilor
│   ├── Hidrografie (Apele Române)
│   ├── Zone de administrare / restricție (Apele Române)
│   └── Zone protejate (Apele Române)
│
├── 🌱 ENERGIE REGENERABILĂ
│   ├── Potențial eolian (ANM)
│   └── Potențial solar (ANM)
│
└── 📊 RAPOARTE ȘI BILANȚURI
    ├── Bilanț ANPM
    └── Raportări directive europene
```

---

## Inventar Complet

### ANPM — 234 seturi

#### Aer
| Set | Format |
|---|---|
| Calitate aer — zone și aglomerări | XML |
| Calitate aer — date de evaluare primare validate | XML |
| Calitate aer — metode de evaluare | XML |
| Calitate aer — regim de evaluare | XML |
| Calitate aer — atingerea obiectivelor | XML |
| Calitate aer — informații măsuri | XML |
| Calitate aer — planuri de calitate | XML |
| Calitate aer — repartizare surse | XML |
| Calitate aer — scenariu realizare obiective | XML |
| Măsurări de la 80+ stații de monitorizare (per stație, XML) | XML |

#### Emisii și Poluare
| Set | Format |
|---|---|
| Inventare emisii poluanți atmosferici | XLSX |
| Emisii gaze cu efect de seră | XLSX |
| Emisii verificate ETS | XLSX |
| Registrul Poluanților — emisii în aer | XLS |
| Registrul Poluanților — emisii în apă | XLS |
| Registrul Poluanților — deșeuri transferate | XLS |
| Registrul Poluanților — complexe industriale | XLS |
| Emisii totale SO2 | XLS |
| Listă instalații LCP — emisii NOx | XLS |
| Listă instalații LCP — emisii SO2 | XLS |
| Energie generată de instalațiile LCP | XLS |
| Listă instalații COV | XLS |
| Listă instalații IPPC | XLS |
| Amplasamente SEVESO | XLS |

#### Deșeuri
| Set | Format |
|---|---|
| Lista depozitelor de deșeuri conforme | XLS |
| Incinerarea deșeurilor periculoase/nepericuloase | XLS |
| Operatori autorizați colectare și tratare | XLS |
| Operatori autorizați transport | XLS |
| Operatori autorizați coincinerare | XLS |
| Producători baterii și acumulatori | XLS |
| Producători echipamente electrice/electronice | XLS |
| Deșeuri transferate | XLS |

#### Arii Protejate și Biodiversitate
| Set | Format |
|---|---|
| Arii protejate de interes național (CDDA) | XLS |
| Specii Natura 2000 — distribuție | XLS |
| Habitate Natura 2000 — distribuție | XLS |
| Areal specii Natura 2000 | XLS |
| Zoo și acvarii | XLS |

#### Altele
| Set | Format |
|---|---|
| Transfer poluanți în apă (kg) | XLS |
| Listă măsurători necertificate (UTD) calitate aer | XML |
| Bilanț decembrie 2024 | XLSX |

### ANM — Meteorologie — 10 seturi

| Set | Format |
|---|---|
| Date meteorologice zilnice gridate | NetCDF |
| Stații meteorologice esențiale | — |
| Prognoză numerică a vremii | — |
| Date radare meteorologice | — |
| Alerte meteorologice | — |
| Parametri măsurați la stații | TXT? |
| Date climatologice (RBSN, 23 stații) | — |
| Prognoză 5 zile | — |
| Hartă potențial eolian | — |
| Hartă potențial solar | — |

### Apele Române — 9 seturi

| Set |
|---|
| Instalații de supraveghere a mediului |
| Zone de administrare / restricție |
| Geologie |
| Zone protejate |
| Hidrografie |
| Raportare Directiva 91/271 (ape uzate) |
| Directiva Cadru Apă 2000/60/CE |
| Raportare Directiva 91/676 (nitrați) |
| Directiva Inundații 2007/60/CE |

### Institutul Geologic — 1 set

| Set |
|---|
| Harta geologică a României 1:1.000.000 |

### ICPA — 1 set

| Set |
|---|
| Date pedologice / sol |

---

## Surse Externe

| Instituție | Date publice | URL |
|---|---|---|
| **Garda de Mediu** | Controale, sancțiuni, procese verbale | gnm.ro |
| **ANANP** | Arii protejate, planuri de management | ananp.gov.ro |
| **MMAP** | Legislație, strategii, rapoarte naționale | mmediu.ro |

---

## Prezentare Propusă

### Card Rezumat

```
┌──────────────────────────────────────────────────────────────┐
│ 🌳 Mediu  ▸                                                  │
│                                                               │
│ 5+ instituții · ~255+ seturi de date                         │
│                                                               │
│ 🌬️ Calitatea Aerului        💧 Apa                          │
│ 🌿 Arii Protejate           🗑️ Deșeuri                     │
│ 🏭 Emisii și Poluare        🌡️ Meteorologie               │
│ 🔊 Zgomot                   ⛰️ Geologie                    │
└──────────────────────────────────────────────────────────────┘
```

---

## Întrebări Frecvente

| Întrebare | Răspuns rapid | Unde găsești |
|---|---|---|
| „Cât de curat e aerul în orașul meu?" | Date de la stațiile de monitorizare (80+ stații) | Calitatea Aerului |
| „Ce arii protejate sunt în județul meu?" | Arii protejate CDDA + Natura 2000 | Arii Protejate |
| „Unde îmi duc deșeurile?" | Operatori autorizați | Deșeuri |
| „Câte emisii de CO2 produce România?" | Gaze cu efect de seră — inventar național | Emisii |
| „Cum e vremea mâine?" | Prognoză ANM 5 zile | Meteorologie |
| „Unde sunt stații de măsurare a aerului?" | Listă stații ANPM | Calitatea Aerului |
| „Cât de poluat e râul din orașul meu?" | Ape de suprafață + Directiva Cadru Apă | Apa |
| „Ce instalații poluează în zona mea?" | Registrul Poluanților (E-PRTR) | Poluare |
| „Unde sunt zone cu risc de inundații?" | Directiva Inundații (Apele Române) | Apa |
| „Cât de zgomotos e orașul meu?" | Hărți de zgomot | Zgomot |
