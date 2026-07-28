# 🏥 Sănătate

### Descriere

Date despre sistemul medical românesc: spitale, paturi, personal, medicamente, boli, finanțare. Orice cetățean poate găsi informații despre spitalul din orașul lui, ce medicamente sunt compensate, sau câte cazuri de o boală s-au înregistrat.

### Instituții Principale

| Instituție | Seturi | Site |
|---|---|---|
| Ministerul Sănătății | 111 | ms.ro |
| CNAS — Casa Națională de Asigurări de Sănătate | 32 | cnas.ro |
| ANMCS — Autoritatea Națională de Management al Calității în Sănătate | 7 | anmcs.ro |
| INSP — Institutul Național de Sănătate Publică | 14 | insp.gov.ro |

### Subdomenii

```
🏥 Sănătate
├── 🏥 Spitale
│   ├── Paturi clinice
│   │   ├── Pe județe
│   │   ├── Pe specialități
│   │   └── Pe tip proprietate (public/privat)
│   ├── Cheltuieli spitale
│   ├── Personal medical
│   │   ├── Medici
│   │   ├── Asistenți
│   │   └── Personal auxiliar
│   ├── Acreditări unități sanitare
│   └── Dotări și aparatură
│
├── 💊 Medicamente
│   ├── Catalog național prețuri
│   ├── Medicamente compensate și gratuite
│   ├── Medicamente autorizate
│   └── Farmacii
│
├── 🦠 Boli și Prevenție
│   ├── Boli infecțioase
│   │   ├── Gripă / SARS-CoV-2 / VRS
│   │   ├── Hepatite virale
│   │   ├── Tuberculoză
│   │   ├── HIV / SIDA
│   │   └── Boli cu potențial epidemic
│   ├── Boli cronice
│   │   ├── Diabet
│   │   ├── Boli cardiovasculare
│   │   └── Cancer (incidență, prevalență)
│   ├── Vaccinări
│   │   ├── Copii (scheme de vaccinare)
│   │   └── Adulți (gripă, COVID-19)
│   └── Sănătate mintală
│
├── 📊 Statistici Sanitare
│   ├── Mortalitate
│   │   ├── Pe cauze de deces
│   │   └── Pe județe
│   ├── Speranța de viață
│   ├── Internări spitalicești
│   ├── Consultații medicale
│   └── Cheltuieli per capita
│
└── 💰 Finanțare Sănătate
    ├── Buget Ministerul Sănătății
    ├── Buget CNAS
    ├── Achiziții publice în sistemul sanitar
    ├── Decontări servicii medicale
    └── Cheltuieli cu medicamentele
```

### Exemple de Întrebări

1. **„Câte paturi are spitalul din orașul meu?"** → Paturi clinice → filtrează pe județ
2. **„Ce medicamente sunt compensate pentru diabet?"** → Medicamente compensate
3. **„Câte cazuri de cancer s-au înregistrat anul trecut?"** → Boli cronice → Cancer
4. **„Cât cheltuiește statul pe spitalul județean?"** → Cheltuieli spitale
5. **„Este spitalul din orașul meu acreditat?"** → Acreditări unități sanitare
6. **„Câți medici sunt în județul meu?"** → Personal medical → Medici
7. **„Cât a costat vaccinarea anti-COVID?"** → Buget MS / Achiziții

### Statistici

| Indicator | Valoare |
|---|---|
| Total seturi de date | ~150 |
| Instituții implicate | 4 principale |
| Formate dominante | XLSX, XLS, PDF |
| Actualizare | Anuală (majoritatea), trimestrial (achiziții) |

### Seturi de Date Notabile (pe data.gov.ro)

| Set | Instituție | Format | An |
|---|---|---|---|
| Paturi clinice în spitale | MS | XLS | 2018-2024 |
| Cheltuieli în spitale | MS | XLS | 2018 |
| Acreditarea unităților sanitare | MS | XLSX | 2020-2025 |
| Boli infecțioase și parazitare | MS | XLS | 2018+ |
| Boli infecțioase (anual) | MS | XLS | 2014+ |
| Catalogul național al prețurilor medicamentelor | MS | XLS | curent |
| Activitate sanitară | MS | XLS | 2015+ |
| Consilii etice în spitale | MS | XLSX | 2017-2022 |
| Achiziții publice în sistemul sanitar | MS/CNAS | XLSX | 2017-2026 |
| Bolnavi externați din violență domestică | MS | XLS | 2015+ |

### Riscuri Cunoscute

- Catalogul medicamentelor e uneori în PDF, dificil de extras tabelele
- Unele seturi sunt istorice (2015, 2018) — nu mai au actualizări
- Datele despre personal medical nu sunt defalcate suficient de granular
