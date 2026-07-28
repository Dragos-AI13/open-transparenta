# Brainstorming — Arhitectura pe Domenii

> Data: 28 Iulie 2026
> Scop: Documentarea metodei de organizare a datelor în platforma Open Transparență

---

## Metodologia

### Principiu

**Site-ul NU e o unealtă pusă peste date. Site-ul ESTE datele.**  
Structura lui = structura datelor.

### Abordare

```
Nivel 1:  Domeniul        → "Despre ce e vorba?"
Nivel 2:  Subdomeniul     → "Ce anume din domeniu?"
Nivel 3:  Categoria       → "Ce tip de date?"
Nivel 4:  Subcategoria    → "Ce anume măsoară?"
Nivel 5:  Setul de date   → "Iată datele reale"
Nivel 6:  Valorile        → "Tabelul, graficul, comparația"
```

### Procesul pentru Fiecare din Cele 17 Domenii

```
1. Identificăm toate seturile de date reale (din catalogul de 5.192)
2. Le grupăm pe subdomenii + categorii + subcategorii
3. Construim arborele complet
4. Pentru fiecare frunză (set de date) notăm:
   - Ce întrebări răspunde
   - Ce poveste spune (trend, comparație, top)
   - La ce alte date se leagă
5. Designul site-ului = arborele ăsta
```

---

## Abordarea „Căsuțelor" (Cards)

Fiecare nivel al ierarhiei este o **„căsuță"** (card) care spune o poveste:

```
📊 Paturi clinice 2024
━━━━━━━━━━━━━━━━━
România are 132.540 paturi în spitale.
72% sunt publice, 28% private.

📈 +3.2% față de 2023
📍 Cele mai multe: București (12.450)
📍 Cele mai puține: Ialomița (890)
👉 Vezi datele complete →
```

Fiecare căsuță conține:
- O cifră cheie (summary)
- Un trend sau comparație
- Link către nivelul următor

---

## Exemplu Complet — Domeniul Sănătate

```
🏥 SĂNĂTATE
│
├── 🏥 SPITALE
│   ├── Paturi clinice
│   │   ├── Pe județe
│   │   ├── Pe specialități
│   │   ├── Pe tip proprietate (public/privat)
│   │   └── Evoluție în timp (2018-2024)
│   │
│   ├── Cheltuieli spitale
│   │   ├── Per spital
│   │   ├── Per județ
│   │   └── Pe categorii (salarii, medicamente, investiții)
│   │
│   ├── Personal medical
│   │   ├── Medici (total, pe specialități, pe județe)
│   │   ├── Asistenți
│   │   └── Personal auxiliar
│   │
│   ├── Acreditări
│   │   ├── Unități acreditate (2020-2025)
│   │   └── Unități în curs de acreditare
│   │
│   └── Consilii etice
│       └── Rapoarte de activitate
│
├── 💊 MEDICAMENTE
│   ├── Catalog național prețuri
│   │   ├── Medicamente autorizate
│   │   ├── Medicamente compensate (lista A, B, C)
│   │   └── Medicamente eliberare fără rețetă
│   │
│   └── Achiziții medicamentoase
│       └── Spitale + farmacii
│
├── 🦠 BOLI ȘI PREVENȚIE
│   ├── Boli infecțioase
│   │   ├── Gripă / SARS-CoV-2 / VRS
│   │   ├── Hepatite (A, B, C)
│   │   ├── Tuberculoză
│   │   ├── HIV / SIDA
│   │   └── Boli cu potențial epidemic
│   │
│   ├── Boli cronice
│   │   ├── Diabet
│   │   ├── Boli cardiovasculare
│   │   └── Cancer (incidență, prevalență, mortalitate)
│   │
│   └── Vaccinări
│       ├── Copii (scheme, acoperire vaccinală)
│       └── Adulți (gripă, COVID, HPV)
│
├── 👶 MATERNITATE ȘI COPII
│   ├── Nașteri (număr, tip, pe județe)
│   ├── Mortalitate infantilă
│   └── Protecția copilului
│       ├── Copii în sistem de protecție
│       └── Adopții
│
├── 📊 STATISTICI SANITARE
│   ├── Mortalitate
│   │   ├── Pe cauze de deces
│   │   └── Pe județe
│   ├── Speranța de viață
│   │   └── La naștere, la 65 ani, pe sexe
│   ├── Internări
│   │   └── Pe diagnostice, pe județe
│   ├── Consultații
│   │   ├── În spitale
│   │   └── În ambulator
│   └── Violență domestică
│       └── Cazuri înregistrate în spitale
│
└── 💰 FINANȚARE
    ├── Buget MS (anual, execuție)
    ├── Buget CNAS
    ├── Achiziții publice în sănătate
    │   ├── Pe ani
    │   ├── Pe tipuri (medicamente, aparatură, servicii)
    │   └── Per spital
    └── Decontări servicii medicale
```

**Notă:** Fiecare frunză din acest arbore corespunde unui set de date REAL care există pe data.gov.ro sau într-o altă sursă publică.

---

## Exemplu de Navigare — Utilizatorul Parcurge Povestea

```
🏥 Sănătate
  → Vezi cifrele cheie (132.540 paturi, 61.000 medici, 540 spitale)
  → Click pe 🏥 Spitale
    → Vezi sub-categoriile
    → Click pe 📊 Paturi clinice
      → Vezi aspectele disponibile
      → Click pe Pe județe
        → Tabel sortabil cu toate județele
        → Hartă România
        → Grafic evoluție 2018-2024
        → La sfârșit: "Vezi și..." (legături către alte domenii)
          → 🏢 Spitalele din județul tău (ONRC)
          → 💰 Bugetul pe sănătate al județului (MFP)
          → 📋 Achizițiile spitalelor (SEAP)
```

---

## Diferența Față de Abordarea Clasică

| Abordare tradițională (catalog) | Abordarea noastră (poveste) |
|---|---|
| Listă de linkuri către PDF-uri | Date vizibile direct pe site |
| Cauți manual (search) | Navighezi pe categorii naturale |
| Nu știi ce există | Vezi imediat „În cifre" summary |
| Fiecare set e izolat | Datele se leagă între ele (cross-linkuri) |
| Site-ul e o interfață peste date | Site-ul ESTE datele |

---

## Estimare Efort

| Activitate | Durată estimată |
|---|---|
| Analiză + documentare per domeniu | 30-60 minute |
| Total 17 domenii | ~10-15 ore |
| Se poate face în paralel | Documentație + verificare |
