# 🏢 Companii și Comerț — Feature Breakdown

> Domeniu complet: 4+ instituții pe data.gov.ro, 4+ surse externe, 87+ seturi de date.
> 8 sub-categorii, fiecare cu crawler + API + UI propriu.

---

## Arhitectura generală

```
Browser                        Next.js (App Router)           Meilisearch              Crawler (Python)
──────                         ─────────────────────          ───────────              ───────────────
                               pages/companii/                                            crawler_onrc.py
Pagina domeniu ──────────────> layout (sidebar + breadcrumb)                              crawler_financiar.py
                               ├── page.tsx (prezentare)                                  crawler_amepip.py
Cautare firma ───────────────> /cauta?q=X ────────────> POST /api/search ──> GET /indexes ──┘
                               │                                                          crawler_asf.py
Profil firma ────────────────> /firma/[cui]                                                crawler_bvb.py
                               │                                                          crawler_anpc.py
Situatii Financiare ─────────> /firma/[cui]/financiar ──> /api/companies/[cui]/financial   crawler_concurenta.py
                               │                                                          crawler_orda.py
Sub-categorii ───────────────> /pensii, /asigurari, etc.
```

Fiecare sub-categorie urmează același pattern:
```
Sursă (API/CSV/PDF) → Crawler Python → Meilisearch Index → Next.js API Route → UI Page
```

---

## Feature Index

| # | Feature | Sub-categorii | Surse | Status |
|---|---------|---------------|-------|--------|
| 1 | 🏗️ Arhitectura Domeniului | Toate | — | ⏳ planificat |
| 2 | 🏢 Registrul Comerțului | Căutare firmă + Profil | ONRC (CSV) | ⏳ planificat |
| 3 | 📊 Situații Financiare | Evoluție financiară + Grafice | Ministerul Finanțelor (CSV) | ⏳ planificat |
| 4 | 🏛️ Întreprinderi Publice | Listă + Indicatori | AMEPIP (CSV) | ⏳ planificat |
| 5 | 📈 Piață de Capital | Cotații + Emitenți | ASF + BVB | ⏳ planificat |
| 6 | 💰 Pensii Private | Fonduri Pilon II+III | ASF | ⏳ planificat |
| 7 | 🛡️ Asigurări | Prime + Daune + Intermediari | ASF | ⏳ planificat |
| 8 | ⚖️ Protecția Consumatorului | Amenzi + Controale | ANPC | ⏳ planificat |
| 9 | 🔒 Concurență | Decizii + Concentrări | Consiliul Concurenței | ⏳ planificat |
| 10 | 💎 Drepturi de Autor | Marcaje + Topuri | ORDA | ⏳ planificat |

---

## Feature 1 — 🏗️ Arhitectura Domeniului (scheletul)

**Scop:** Pagina principală a domeniului cu toate sub-categoriile, navigare, layout.

**Cuprinde:**
- Pagina `/companii` cu prezentarea domeniului
- Sidebar cu cele 8 sub-categorii
- Fiecare sub-categorie ca pagină separată cu descriere + link căutare
- Breadcrumb navigation
- Search bar specific domeniului (caută doar în indexul de companii)

**Nu include:** crawler, date reale — doar UI-ul gol cu placeholder-uri

---

## Feature 2 — 🏢 Registrul Comerțului (ONRC)

**Scop:** Căutarea oricărei firme din România + pagină de profil.

### Crawler — `crawler_onrc.py`
| Sursă | Format | URL | Frecvență |
|-------|--------|-----|-----------|
| Firme înregistrate (Registrul Comerțului) | CSV lunar | data.gov.ro/onrc | Lunar |
| Situații financiare (date identificare plătitori) | CSV trimestrial | data.gov.ro/mfp | Trimestrial |
| Nomenclatoare (stare firmă, CAEN, formă juridică) | CSV | data.gov.ro/onrc | La cerere |

**Arbore index Meilisearch:**
```
companies
├── cui (unique ID)
├── denumire
├── forma_juridica
├── stare (activa/dizolvata/inactiva)
├── adresa (localitate, judet, strada)
├── cod_caen (clasa + denumire)
├── telefon
├── email
├── website
└── data_infiintare
```

### Pagini UI
| Rută | Descriere |
|------|-----------|
| `/companii` | Prezentare domeniu + search bar |
| `/companii/cauta?q=X` | Rezultate căutare cu filtre |
| `/companii/firma/[cui]` | Profil firmă (date generale, status, reprezentanți) |

### API Routes
| Endpoint | Input | Output |
|----------|-------|--------|
| `GET /api/companies/search?q=&page=&filters=` | query string | Listă firme cu match |
| `GET /api/companies/[cui]` | CUI | Date complete firmă |

### Acceptanță
- [ ] Scriu "Autonom Service" în search → apare firma
- [ ] Click pe firmă → profil cu toate datele
- [ ] Filtrare după județ, formă juridică, stare
- [ ] 50+ firme sample în index

---

## Feature 3 — 📊 Situații Financiare

**Scop:** Evoluția financiară a fiecărei firme, cu tabele și grafice.

### Crawler — `crawler_financiar.py`
| Sursă | Format | URL | Frecvență |
|-------|--------|-----|-----------|
| Situații financiare anuale | CSV | data.gov.ro/mfp | Anual (2008-2025) |

**Arbore index Meilisearch:**
```
financial_statements
├── cui
├── anul
├── cifra_de_afaceri
├── profit_net
├── pierdere_neta
├── active_imobilizate
├── active_circulante
├── datorii
├── capitaluri_proprii
└── numar_angajati
```

### Pagini UI
| Rută | Descriere |
|------|-----------|
| `/companii/firma/[cui]/financiar` | Tabel cu evoluția pe ani |
| `/companii/firma/[cui]/financiar#grafice` | Grafice (Line chart: cifră afaceri, profit, active) |

### API Routes
| Endpoint | Output |
|----------|--------|
| `GET /api/companies/[cui]/financial` | Array de situații pe ani |

### Acceptanță
- [ ] Profil firmă arată cifra de afaceri la zi
- [ ] Graficul evoluează pe ani
- [ ] Comparație între 2 ani

---

## Feature 4 — 🏛️ Întreprinderi Publice (AMEPIP)

**Scop:** Lista și indicatorii întreprinderilor publice din România.

**Crawler:** `crawler_amepip.py` → 2 seturi (indicatori financiari + export CSV)

**Pagini:**
- `/companii/întreprinderi-publice` — listă + filtre
- `/companii/firma/[cui]` — tag „Întreprindere Publică" pe profil

---

## Feature 5 — 📈 Piață de Capital (ASF + BVB)

**Scop:** Cotații bursiere, emitenți, dividende.

**Crawler:** `crawler_asf.py` + `crawler_bvb.py`

**Pagini:**
- `/companii/piata-de-capital` — dashboard cu indici, top emitenți
- `/companii/piata-de-capital/[simbol]` — pagină emitent (preț, dividende, grafic)

---

## Feature 6 — 💰 Pensii Private (ASF)

**Scop:** Statistici fonduri de pensii Pilon II și III.

**Crawler:** `crawler_asf.py` (extins)

**Pagini:**
- `/companii/pensii-private` — active, contribuții, randamente, participanți per fond
- Comparație între fonduri

---

## Feature 7 — 🛡️ Asigurări (ASF)

**Scop:** Date despre piața de asigurări: prime, daune, intermediari.

**Crawler:** `crawler_asf.py` (extins)

**Pagini:**
- `/companii/asigurari` — statistici piață
- `/companii/asigurari/companii` — listă asigurători

---

## Feature 8 — ⚖️ Protecția Consumatorului (ANPC)

**Scop:** Amenzi, controale, reclamații OPC.

**Crawler:** `crawler_anpc.py` → site ANPC

**Pagini:**
- `/companii/protectia-consumatorului` — amenzi recente, statistici
- `/companii/protectia-consumatorului/cauta?q=X` — caută firmă în amenzi

---

## Feature 9 — 🔒 Concurență (Consiliul Concurenței)

**Scop:** Decizii, avize, concentrări economice.

**Crawler:** `crawler_concurenta.py`

**Pagini:**
- `/companii/concurenta` — decizii recente
- `/companii/concurenta/cauta` — căutare în decizii

---

## Feature 10 — 💎 Drepturi de Autor (ORDA)

**Scop:** Statistici marcaje holografice, top societăți.

**Crawler:** `crawler_orda.py`

**Pagini:**
- `/companii/drepturi-de-autor` — statistici, topuri
- `/companii/drepturi-de-autor/cauta` — caută marcaj

---

## Matrice priorizare

| Feature | Efort | Impact cetățean | Data availability | Complexitate tehnică |
|---------|-------|-----------------|-------------------|---------------------|
| 1. Arhitectura domeniului | Mic | Mediu | — | Scăzută |
| 2. Registrul Comerțului | Mediu | Foarte mare | CSV structurat | Medie |
| 3. Situații Financiare | Mediu | Mare | CSV structurat | Medie |
| 4. Întreprinderi Publice | Mic | Mediu | CSV | Scăzută |
| 5–7. ASF + BVB | Mare | Mediu | Site propriu (scraping) | Mare |
| 8. ANPC | Mediu | Mare | Site propriu | Medie |
| 9. Concurență | Mediu | Mediu | Site propriu | Medie |
| 10. ORDA | Mic | Scăzut | CSV | Scăzută |

**Recomandare ordine:** 1 → 2 → 3 → 4 → 8 → 10 → 9 → 5 → 6 → 7
(Aș începe cu ce e mai structurat și mai util, las ASF/BVB la urmă că necesită scraping mai complex)
