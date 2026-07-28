# Integritatea Datelor — Monitorizare, Actualizare și Fallback

> Ce se întâmplă când o sursă dispare, un link se strică sau datele se schimbă.
> Aplicabil la toate cele 17 domenii.

---

## Problema

Datele publice nu sunt statice. Se întâmplă des:

| Problemă | Frecvență | Exemplu real |
|---|---|---|
| Linkul original moare (404) | 🟡 Des | Linkuri vechi de pe data.gov.ro (SSL errors, URL-uri schimbate) |
| Sursa e offline temporar | 🔴 Des | ANCPI — atac cibernetic, portal.just.ro — SSL broken |
| Datele sunt actualizate | 🟢 Mereu | Bugetul 2026 înlocuiește 2025, curs BNR zilnic |
| Formatul se schimbă | 🟡 Odată | Instituția trece de la XLS la PDF |
| Setul dispare complet | 🟡 Rareori | Instituția nu mai publică acel raport |
| Sursa își schimbă URL-ul | 🟡 Odată | data.gov.ro migrează, ONRC mută portalul |

---

## Soluția — Trei Nivele de Protecție

### Nivel 1: Preventiv (Când Indexăm)

La fiecare crawl, verificăm că linkurile sunt în viață:

```
La crawl (zilnic, 3:00 AM):
  Pentru fiecare set de date din Meilisearch:
    1. HTTP HEAD la linkul original
       ├── 200 OK → totul ok, trecem mai departe
       ├── 301/302 → URL-ul s-a mutat, actualizăm linkul
       ├── 404     → marchem ca „Sursă indisponibilă"
       └── timeout → marchem ca „Offline temporar"
    2. Verificăm data ultimei modificări
       ├── Dacă fișierul e mai nou → re-parsez (invalidăm cache-ul)
       └── Dacă e același → lăsăm totul cum e
```

### Nivel 2: În Site — Badge-uri de Status

Fiecare set de date afișează un badge care arată starea lui curentă:

```
📊 Paturi clinice în spitale 2024
   Ministerul Sănătății · XLSX · Actualizat: 2024
   🟢 Disponibil                                           ← linkul funcționează

📊 Bugetul de stat 2026
   Ministerul Finanțelor · DOC · Actualizat: 2025
   🟡 Actualizat acum 2 zile                               ← date proaspete

📊 Date cadastrale
   ANCPI · XLSX
   🔴 Sursă temporar indisponibilă (atac cibernetic)       ← offline, dar sperăm că revine

📊 Raport activitate 2018
   Ministerul X · PDF
   ⚫ Setul nu mai este disponibil pe sursa originală       ← dispărut definitiv
```

### Nivel 3: Când Utilizatorul Dă Click

Dacă un utilizator dă click pe un set care e down:

```
Click pe un set cu badge 🔴
       ↓
┌──────────────────────────────────────────────────────┐
│ 🔗 Sursă temporar indisponibilă                       │
│                                                        │
│ Acest set face parte din: Ministerul Finanțelor        │
│ Link original: data.gov.ro/dataset/...                │
│                                                        │
│ ┌──────────────────────────────────────────────────┐   │
│ │ ❌ Am încercat să accesăm sursa, dar nu          │   │
│ │    răspunde.                                      │   │
│ │                                                    │   │
│ │ 💡 Poți încerca:                                   │   │
│ │   • Să verifici mai târziu                        │   │
│ │   • Să cauți același set pe site-ul instituției   │   │
│ │   • Să ne anunți dacă problema persistă           │   │
│ └──────────────────────────────────────────────────┘   │
│                                                        │
│ 📥 Ultima versiune salvată (cache): 2 Aprilie 2026    │
│    (datele pot să nu fie actualizate la zi)            │
└──────────────────────────────────────────────────────┘
```

---

## Arhitectura Monitorizării

```
┌──────────────────────────────────────────────────────────────────┐
│  CRAWLER ZILNIC (3:00 AM)                                        │
│                                                                   │
│  Pentru fiecare sursă:                                           │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ data.gov.ro → CKAN API → verifică seturi NOI + modificate  │  │
│  │ ONRC        → verifică dump nou CSV lunar                  │  │
│  │ BNR         → curs nou zilnic (se adaugă la index)          │  │
│  │ SEAP        → verifică seturi noi pe data.gov.ro            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  Pentru fiecare set DEJA indexat:                                │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ HEAD request → verifică dacă linkul e încă viu             │  │
│  │ ├── 200 OK → nimic de făcut                                │  │
│  │ ├── 404   → marchează 🔴 „indisponibil"                   │  │
│  │ ├── 301   → actualizează URL-ul + marchează 🟡             │  │
│  │ └── timeout → lasă statusul anterior, încearcă mâine       │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

### Health Dashboard (pentru administrator)

```
┌──────────────────────────────────────────────────────────────┐
│  🩺 Starea surselor — Open Transparență                      │
│                                                               │
│  Sursă                │ Status   │ Ultimul OK │ Seturi       │
│ ──────────────────────┼──────────┼────────────┼──────────────│
│ data.gov.ro           │ 🟢 ONLINE│ acum 2h    │ 5.192        │
│ ONRC (dump CSV)       │ 🟢 ONLINE│ acum 1 zi  │ 76           │
│ BNR (curs valutar)    │ 🟢 ONLINE│ acum 30min │ API live     │
│ SEAP / e-licitație    │ 🟢 ONLINE│ acum 3h    │ 171          │
│ INS TEMPO             │ 🟡 LENT  │ acum 12h   │ 20           │
│ ANCPI Geoportal       │ 🔴 DOWN  │ de 14 zile │ —            │
│ portal.just.ro        │ 🔴 DOWN  │ de 14 zile │ —            │
│ legislatie.just.ro    │ 🔴 DOWN  │ de 14 zile │ —            │
│ BPI (insolvență)      │ 🔴 DOWN  │ de 30 zile │ —            │
│ ...                   │          │            │              │
└──────────────────────────────────────────────────────────────┘
```

---

## Ce Faci Când un Set Dispare Definitiv

Nu ștergem nimic. Păstrăm în index cu statusul potrivit:

### Cazul 1: Sursa e temporar offline (ex: ANCPI)

```
Status în Meilisearch: "disponibil": false, "status": "temporar_indisponibil"
Badge pe site: 🔴 Sursă temporar indisponibilă
Fallback: Arătăm ultimul cache disponibil (dacă există)
Notă: Crawler-ul încearcă zilnic să vadă dacă a revenit
```

### Cazul 2: Setul nu mai e pe data.gov.ro (404)

```
Status: "disponibil": false, "status": "sursa_indisponibila"
Badge: ⚫ Nu mai este disponibil pe sursa originală
Fallback: Link archive.org + notă că datele sunt istorice
Notă: Păstrăm în index — poate revive, poate fi util ca referință
```

### Cazul 3: Setul e actualizat (versiune nouă)

```
Status: "disponibil": true, "status": "actualizat"
Acțiune: Invalidăm cache-ul de parsare (se re-parsează la următorul click)
Badge: 🟡 Actualizat [data]
Notă: Metadata se actualizează în Meilisearch
```

---

## În Indexul Meilisearch

Fiecare document are câmpuri de status:

```json
{
  "id": "paturi-clinice-2024",
  "titlu": "Paturi clinice în spitale 2024",
  "link_original": "https://data.gov.ro/dataset/...",
  "status_sursa": "disponibil",      // disponibil | temporar_indisponibil | sursa_indisponibila
  "status_verificat_la": "2026-07-29T03:00:00Z",
  "data_actualizare": "2024-06-15",
  "cache_disponibil": true,
  "cache_data": "2026-07-28",
  "an": 2024,
  ...
}
```

---

## Reguli pentru Toate Domeniile

| Regulă | Comportament |
|---|---|
| **Nu ștergem niciodată un set din index** | Păstrăm totul, chiar dacă sursa a dispărut. Marchem statusul. |
| **Verificăm linkurile zilnic** | Crawler-ul face HEAD request la fiecare link. |
| **Cache-ul expiră la 24h** | Dacă nimeni nu accesează, se eliberează. Dacă datele s-au schimbat, se re-parsează. |
| **Badge-uri vizibile** | Fiecare set arată clar dacă e disponibil, offline sau dispărut. |
| **Fallback la archive.org** | Dacă un set nu mai e pe sursă, sugerăm verificarea pe Wayback Machine. |
| **Dashboard pentru admin** | Vezi dintr-o privire ce surse sunt sus și care au căzut. |
