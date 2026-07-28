# 🌾 Domeniul 12 — Agricultură

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

Date despre agricultura României: culturi, efective de animale, terenuri agricole,
plăți și subvenții agricole, dezvoltare rurală, fonduri europene agricole,
siguranță alimentară, produse tradiționale, silvicultură și pescuit.

**Pentru cetățean:** „Ce se cultivă în România și ce subvenții primesc fermierii?"

---

## Instituții

### A. Pe data.gov.ro

| # | Instituție | Tip | Seturi | Cod |
|---|---|---|---|---|
| 1 | **MADR — Agricultură** | Minister | **18** | `madr` |
| 2 | **AChR — Chinologică** | Asociație | **4** | `asociatia-chinologica-romana` |
| 3 | **APIA — Plăți Intervenție** | Agenție | **3** | `agentia-de-plati-si-interventie-pentru-agricultura` |
| 4 | **AFIR — Finanțare Rurală** | Agenție | **3** | `agentia-pentru-finantarea-investitiilor-rurale` |
| 5 | **ANSVSA — Sanitară Veterinară** | Autoritate | **2** | `autoritatea-nationala-sanitara-veterinara-si-pentru-siguranta-alimentelor` |

### B. În afara data.gov.ro

| # | Instituție | Date disponibile | Acces |
|---|---|---|---|
| 6 | **INS — TEMPO Online** | Producție agricolă, suprafețe, efective (statistici detaliate) | insse.ro |
| 7 | **APIA — hărți LPIS** | Parcele de referință, blocuri fizice (GIS) | apia.org.ro |

---

## Arborele Complet

```
🌾 AGRICULTURĂ
│
├── 🌱 CULTURI
│   ├── Producții agricole (MADR)
│   │   ├── Efective și producții animale
│   │   │   ├── Bovine
│   │   │   ├── Porcine
│   │   │   ├── Ovine și caprine
│   │   │   └── Albine
│   │   └── Culturi vegetale (INS — TEMPO)
│   │
│   └── Parcele agricole (APIA)
│       ├── Parcele de referință — blocuri fizice (GIS)
│       └── Parcele declarate de fermieri (cereri unice)
│
├── 🐄 EFECTIVE ANIMALE
│   ├── Bovine — efective și producții (MADR)
│   ├── Porcine — efective și producții (MADR)
│   ├── Ovine și caprine (ANSVSA)
│   ├── Albine — efective și producții (MADR)
│   └── Câini pericul/o agresivi/utilitari (AChR)
│
├── 🧑‍🌾 SUBVENȚII ȘI PLĂȚI
│   ├── Plăți agricole APIA
│   ├── Proiecte PNDR (AFIR)
│   └── Contracte AFIR
│
├── 🌿 PRODUSE TRADIȚIONALE
│   ├── Catalogul Produselor și Activităților Certificate (CPAC)
│   ├── Produse montane
│   ├── Indicații Geografice Protejate (IGP)
│   ├── Denumiri de Origine (DOC)
│   └── Specialități tradiționale
│
├── 🌲 SILVICULTURĂ
│   ├── Fond cinegetic / vânătoare
│   └── Păduri și amenajamente silvice (ANPM/Apele Române — alte domenii)
│
├── 🐟 PESCUIT ȘI ACVACULTURĂ
│   ├── Pescuit și acvacultură (MADR)
│   └── Delta Dunării
│
├── 📊 STATISTICI AGRICOLE (INS — TEMPO)
│   ├── Producția vegetală
│   ├── Producția animală
│   ├── Suprafețe cultivate
│   ├── Efective animale
│   └── Prețuri agricole
│
└── 🔬 SIGURANȚĂ ALIMENTARĂ (ANSVSA)
    └── Controale și inspecții veterinare
```

---

## Card Rezumat

```
┌──────────────────────────────────────────────────────────────┐
│ 🌾 Agricultură  ▸                                            │
│                                                               │
│ 5+ instituții · ~30+ seturi de date                          │
│                                                               │
│ 🌱 Culturi și Producții   🐄 Efective Animale               │
│ 🧑‍🌾 Subvenții APIA/AFIR   🌿 Produse Tradiționale          │
│ 🌲 Silvicultură           🐟 Pescuit                        │
│ 🔬 Siguranță Alimentară   📊 Statistici Agricole            │
└──────────────────────────────────────────────────────────────┘
```

---

## Întrebări Frecvente

| Întrebare | Răspuns rapid | Unde găsești |
|---|---|---|
| „Câte bovine sunt în România?" | MADR — efective bovine | Efective |
| „Cât porumb se cultivă în România?" | INS — TEMPO / MADR | Culturi |
| „Ce subvenții primesc fermierii?" | APIA — plăți | Subvenții |
| „Câți câini periculoși sunt înregistrați?" | AChR | Efective |
| „Ce produse tradiționale există?" | CPAC / AFIR | Tradiționale |
| „Câte proiecte PNDR s-au finanțat?" | AFIR — contracte | Subvenții |
