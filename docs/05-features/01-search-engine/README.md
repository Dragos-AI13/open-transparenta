# Motorul de Căutare — Arhitectură Generală

> Aplicabil la toate cele 17 domenii.  
> Un singur search engine, două moduri de utilizare.

---

## Cele Două Moduri de Căutare

### 1. Search Global — Pagina Principală

Un search bar pe tot ecranul care caută în **toate** seturile de date din **toate** domeniile.

```
┌──────────────────────────────────────────────┐
│  🇷🇴 Open Transparență                        │
│                                               │
│  ┌──────────────────────────────────────────┐│
│  │ 🔍  Caută în toate datele publice...     ││
│  └──────────────────────────────────────────┘│
│                                               │
│  🔥 Trending:  buget 2026  │  spitale  │  curs euro  │
│                                               │
│  Sau navighează pe domeniu:                   │
│  💰Buget  🏥Sănătate  🎓Educație  ⚖️Justiție  │
│  🏛️Admin  🏢Companii  📋Achiziții  🌳Mediu   │
│  🚗Transport  👥Social  🛡️Ordine  🌾Agricultură│
│  ⚡Energie  🏛️Cultură  📊Statistici  📡Telecom│
│  🌐Externe                                     │
└──────────────────────────────────────────────┘
```

### 2. Search Direcționat — În Interiorul unui Domeniu

Același search bar, dar pre-filtrează automat rezultatele doar în domeniul curent.

```
┌──────────────────────────────────────────────┐
│  💰 Buget și Finanțe                         │
│                                               │
│  ┌──────────────────────────────────────────┐│
│  │ 🔍  Caută în BUGET...     ← pre-filtrează││
│  └──────────────────────────────────────────┘│
│                                               │
│  Ai găsit 47 de rezultate în Buget            │
│                                               │
│  📋 Bugetul de stat 2026                     │
│  💳 TVA colectat 2026                        │
│  📈 Datoria publică 2026                     │
│  ...                                          │
└──────────────────────────────────────────────┘
```

### Diferența în Practică

| Cauți „spital" | În search GLOBAL | În direcționat Sănătate |
|---|---|---|
| 🏥 Paturi clinice | ✅ Da | ✅ Da |
| 💰 Bugetul MS | ✅ Da | ❌ Nu (e în Buget) |
| 🏢 Spitalul Privat X (ONRC) | ✅ Da | ❌ Nu (e în Companii) |
| 📋 Licitație echipamente spital | ✅ Da | ❌ Nu (e în Achiziții) |
| 👥 Angajări spital (ANOFM) | ✅ Da | ❌ Nu (e în Social) |

**Când folosești global:** Când nu știi exact unde e informația.  
**Când folosești direcționat:** Când știi exact în ce domeniu cauți.

---

## Implementarea Tehnică

### Un Singur Index Meilisearch

Nu avem un index separat per domeniu. E un singur index, iar filtrarea se face printr-un parametru.

```
Index Meilisearch: "open-transparenta"
───────────────────────────────────────
Document 1: { titlu, descriere, domeniu: "buget", ... }
Document 2: { titlu, descriere, domeniu: "sanatate", ... }
Document 3: { titlu, descriere, domeniu: "educatie", ... }
...
```

### API Calls

```javascript
// Search global — fără filtru
GET /api/search?q=spital
→ Meilisearch: index.search("spital")

// Search direcționat — cu filtru pe domeniu
GET /api/search?q=spital&domeniu=sanatate
→ Meilisearch: index.search("spital", { filter: "domeniu = sanatate" })

// Search și mai fin — pe instituție
GET /api/search?q=paturi&institutie=ministerul-sanatatii
→ Meilisearch: index.search("paturi", { filter: "institutie_slug = ministerul-sanatatii" })
```

### Structura URL-urilor

| URL | Rezultat |
|---|---|
| `/` | Pagina principală + search global |
| `/search?q=spital` | Rezultate globale |
| `/domeniu/sanatate` | Pagina domeniului + search direcționat |
| `/domeniu/sanatate?q=paturi` | Search doar în sănătate |
| `/institutie/ministerul-sanatatii` | Pagina instituției |
| `/institutie/ministerul-sanatatii?q=paturi` | Search doar în MS |
| `/set/paturi-clinice-2024` | Pagina setului de date |

### În Frontend — o singură componentă SearchBar

```jsx
// components/SearchBar.jsx
function SearchBar({ domeniu, institutie, placeholder }) {
  // Dacă e pe o pagină de domeniu, adaugă automat filter
  // Dacă e pe pagina principală, nu filtrează
  // Aceeași componentă, același comportament, peste tot
}
```

---

## Lazy Parsing + Search — Cum Se Îmbină

### Flux Complet: De la Căutare la Date Vizibile

```
Etapa 1: CĂUTARE (instant — Meilisearch)
─────────────────────────────────────────
Utilizatorul tastează "paturi spitale cluj"
       ↓
Meilisearch returnează rezultate în < 50ms:
  • Paturi clinice în spitale 2024 — MS
  • Cheltuieli spitale județene 2024 — MS
  • Achiziții spital județean Cluj — SEAP
       ↓
Se afișează lista cu titlu, instituție, format, an
TOATE vizibile INSTANT — doar metadata

Etapa 2: ACCESARE SET (2-3s prima dată / instant după)
─────────────────────────────────────────────────────
Utilizatorul dă click pe "Paturi clinice în spitale 2024"
       ↓
Parserul verifică CACHE-ul
  ├── Dacă există deja → returnează INSTANT
  └── Dacă nu există → descarcă + parsează + pune în cache
       ↓
Se afișează tabelul sortabil + graficele

Etapa 3: EXPIRARE CACHE (după 24h)
─────────────────────────────────────
Dacă nimeni nu mai accesează setul 24h, cache-ul expiră.
La următorul click, se re-parsează (poate fi o versiune nouă).
```

### Timeline

```
Acțiune utilizator           │ Timp           │ Sursa
─────────────────────────────┼────────────────┼──────────────
Scrie „paturi"               │ < 50ms         │ Meilisearch (metadata)
Vezi sugestii autocomplete   │ < 100ms        │ Meilisearch
Vezi lista de rezultate      │ < 200ms        │ Meilisearch
Dai click pe un set          │                │
  • prima dată (parsez)      │ 2-5 secunde    │ Parser → Cache
  • a doua oară (oricine)    │ < 100ms        │ Cache
  • peste 24h                │ 2-5 secunde    │ Re-parsez
```

---

## Căutarea în Interiorul unui Set de Date Parsat

Odată ce un set e parsat și afișat ca tabel, utilizatorul poate căuta **în interiorul acelui tabel**:

```
┌──────────────────────────────────────────────────────────┐
│ 📊 Paturi clinice în spitale 2024                        │
│                                                           │
│ 🔍 [Caută în acest tabel... Cluj]                        │
│                                                           │
│ ┌───────┬────────┬──────────────────────┐                │
│ │ Județ │ Total  │ La 1000 de locuitori │                │
│ ├───────┼────────┼──────────────────────┤                │
│ │ CLUJ  │ 5.230  │        7.2           │ ← filtrat     │
│ └───────┴────────┴──────────────────────┘                │
└──────────────────────────────────────────────────────────┘
```

Asta e o căutare **client-side** (JavaScript pe tabel), nu trece prin Meilisearch. E instant indiferent de orice.

---

## Diagrama Generală

```
┌─────────────────────────────────────────────────────────────────────────┐
│  UTILIZATOR                                                             │
│  Scrie în search bar   sau   Navighează pe domenii / instituții        │
└────────────────────────┬────────────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────────────────┐
│  NEXT.JS                                                               │
│                                                                         │
│  /api/search?q=...                                                      │
│    ├── filter: domeniu → "buget" (dacă e search direcționat)           │
│    └── filter: instituție → "ms" (dacă e pe pagina instituției)       │
│                                                                         │
│  /api/dataset/.../preview                                               │
│    └── lazy parsing (descarcă → parsează → cache → returnează)         │
└────────────────────────┬────────────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────────────────┐
│  MEILISEARCH                      │  CACHE (Redis / JSON)              │
│  Index: "open-transparenta"       │  Date parsate, TTL 24h             │
│  Conține: metadata (titlu,        │  Expiră automat dacă nu sunt       │
│  descriere, domeniu, instituție,  │  accesate                          │
│  format, link, an, județ...)      │                                    │
│  Căutare: < 50ms                  │                                    │
└───────────────────────────────────┴────────────────────────────────────┘
```

---

## Concluzie

| Componentă | Comportament | Timp |
|---|---|---|
| **Search global** | Caută în toate domeniile simultan | < 50ms |
| **Search direcționat** | Pre-filtrează pe domeniu / instituție | < 50ms |
| **Lista de rezultate** | Metadata din Meilisearch | < 200ms |
| **Pagina instituție** | Toate seturile vizibile instant | < 200ms |
| **Prima accesare set** | Descărcare + parsare → cache | 2-5 secunde |
| **A doua accesare set** | Din cache | < 100ms |
| **Căutare în tabel** | Client-side, pe browser | instant |

**Aceeași implementare pentru toate cele 17 domenii.**  
Nu se scrie cod diferit pentru fiecare. O singură componentă SearchBar, o singură API route, același parser pentru orice format.
