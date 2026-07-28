# PLANUL PROIECTULUI — Open Transparență
> Documentul fundațional. Tot ce am decis înainte de prima linie de cod.

---

## 1. Viziune

**Un motor de căutare + ghid al datelor publice din România.**  
Orice cetățean intră, caută sau navighează, găsește instant orice informație publică.

Fără conturi. Fără autentificare. Fără birocrație.

---

## 2. Nume

**Open Transparență** — domeniu recomandat: `open-transparenta.ro`

---

## 3. Filosofia Produsului

| Principiu | De ce |
|---|---|
| **Zero auth** | Cetățeanul nu trebuie să-și facă cont să acceseze date publice |
| **Gratuit pentru cetățeni** | Datele sunt plătite din taxele lui. Nu plătește din nou. |
| **Plătit pentru business** | API, export bulk, rapoarte — așa se susține proiectul |
| **Navigare + Search** | Două moduri de a găsi date — fiecare cum preferă |
| **Open-source** | Codul e public. Oricine poate verifica, contribui, fork-ui |
| **Licențe respectate** | Menționăm sursa pentru fiecare set de date |

---

## 4. Tehnologia Aleasă — Opțiunea 1 (Stack Simplu)

| Componentă | Alegere | Motiv |
|---|---|---|
| **Frontend** | Next.js + Tailwind CSS (PWA) | SSR, SEO, PWA built-in, un singur proiect |
| **Motor căutare** | Meilisearch | Sub 50ms, typo-tolerant, instalare 5 minute, 100MB RAM |
| **Crawler** | Python + Scrapy | CKAN API, CSV, XLSX, XML — Python e rege la procesat date |
| **Hosting** | Acest VPS (Hetzner) | Deja plătit, funcționează, €4.50/lună |
| **Database** | Nimic — doar Meilisearch index | Nu avem utilizatori, nu avem conturi, nimic de stocat |
| **Backend API** | Next.js API Routes | Nu trebuie server separat. Next.js face și frontend și API. |

**De ce nu ElasticSearch:** E ca un tir să muți o canapea. Pentru 5.192 de seturi + metadata, Meilisearch e identic ca viteză, dar se instalează în 5 minute nu în 2 zile.

**De ce nu Varianta Zero-Admin:** Plătești €29/lună pentru un serviciu pe care-l rulezi singur cu €4.50.

---

## 5. Arhitectura Sistemului

```
┌─────────────────────────────────────────────────────────┐
│  Browser (orice telefon / PC)                           │
│  PWA instalabil pe home screen                          │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS
┌──────────────────────▼──────────────────────────────────┐
│  Next.js (Frontend + API Routes)                        │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Pagina principală → Search bar + Domenii        │   │
│  │  Pagina domeniu  → Instituții + subcategorii     │   │
│  │  Pagina instituție → Seturi de date + filtre     │   │
│  │  Pagina set date  → Detalii + link sursă         │   │
│  │  API search → proxy către Meilisearch            │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP (localhost)
┌──────────────────────▼──────────────────────────────────┐
│  Meilisearch (motor căutare)                            │
│  Index: "date-publice"                                  │
│  Documente: ~5.192+ (fiecare = un set de date)         │
│  Câmpuri: titlu, descriere, sursă, format, link,       │
│           domeniu, instituție, an, județ               │
└──────────────────────┬──────────────────────────────────┘
                       │ (alimentat de crawler)
┌──────────────────────▼──────────────────────────────────┐
│  Crawler Python (rulează zilnic la 3:00 AM via cron)    │
│                                                          │
│  🔄 data.gov.ro → CKAN API → Meilisearch               │
│  🔄 ONRC → dumps CSV → Meilisearch                     │
│  🔄 BNR → API XML → Meilisearch                        │
│  🔄 SEAP → data.gov.ro mirror → Meilisearch            │
│  🔄 ... (100+ surse)                                    │
└─────────────────────────────────────────────────────────┘
```

---

## 6. Structura Datelor — Organizare Ierarhică

Fiecare set de date este organizat pe 3 nivele:

```
Domeniu (ex: Sănătate)
  └── Instituție (ex: Ministerul Sănătății)
        └── Categorie (ex: Spitale)
              ├── Set de date (ex: Paturi clinice în spitale 2024)
              │     ├── Titlu, descriere, an
              │     ├── Format (XLSX, CSV, PDF...)
              │     ├── Link descărcare direct
              │     ├── Licență
              │     └── Data actualizării
              ├── Set de date 2
              └── Set de date 3
```

### Schema unui document în Meilisearch

```json
{
  "id": "uuid-sau-slug",
  "titlu": "Paturi clinice în spitale 2024",
  "descriere": "Numărul de paturi clinice în unitățile sanitare din România, defalcat pe județe și specialități.",
  "domeniu": "sanatate",
  "domeniu_ro": "Sănătate",
  "institutie": "Ministerul Sănătății",
  "institutie_slug": "ministerul-sanatatii",
  "categorie": "Spitale",
  "format": "XLSX",
  "an": 2024,
  "judet": "national",
  "sursa": "data.gov.ro",
  "link_original": "https://data.gov.ro/dataset/...",
  "link_descarcare": "https://...",
  "licenta": "OGL-ROU-1.0",
  "data_actualizare": "2024-06-15",
  "data_adaugare": "2026-07-28",
  "favorit": false
}
```

---

## 7. Cele 17 Domenii

| # | Domeniu | Icon | Instituții principale | Seturi estimate |
|---|---|---|---|---|
| 1 | Buget și Finanțe | 💰 | MFP, ANAF, BNR, AEP, Direcții fiscale locale | ~300 |
| 2 | Sănătate | 🏥 | MS, CNAS, ANMCS, INSP | ~150 |
| 3 | Educație | 🎓 | MEN, ARACIP, UEFISCDI | ~200 |
| 4 | Justiție | ⚖️ | MJ, portal.just, legislatie.just, ICCJ, CCR, CSM | ~100 |
| 5 | Administrație | 🏛️ | MDRAP, ANFP, INA, Primării, CJ-uri, Instituții Prefect | ~1.600 |
| 6 | Companii și Comerț | 🏢 | ONRC, ASF, BPI, ANPC | ~100 |
| 7 | Achiziții Publice | 📋 | SEAP, ANAP, CNSC | ~700 |
| 8 | Mediu | 🌳 | ANPM, ANANP, Apele Române, Garda de Mediu, ANM | ~500 |
| 9 | Transport | 🚗 | MT, ARR, CNAIR, METROREX, AFDJ | ~60 |
| 10 | Muncă și Social | 👥 | ANOFM, MMFPSPV, CNPP, ANES | ~250 |
| 11 | Siguranță și Ordine | 🛡️ | MAI, IGPR, IGPF, IGSU, DGA, IGI, ANP, Jandarmerie | ~700 |
| 12 | Agricultură | 🌾 | MADR, APIA, AFIR, ANSVSA | ~30 |
| 13 | Energie | ⚡ | ANRE, Ministerul Energiei | ~30 |
| 14 | Cultură și Patrimoniu | 🏛️ | MC, INP, Arhivele Naționale, Biblioteca Națională, CNSAS | ~100 |
| 15 | Statistici și Populație | 📊 | INS, DEPABD | ~200 |
| 16 | Telecomunicații | 📡 | ANCOM, MCSI | ~20 |
| 17 | Externe | 🌐 | MAE | ~5 |

---

## 8. Designul Interfeței

### Principii Vizuale

| Principiu | Detalii |
|---|---|
| **Stil** | Search bar central (ca Google) + domenii dedesubt |
| **Dark mode** | Da, ca default |
| **Mobile-first** | Touch targets ≥ 44px, bottom navigation |
| **PWA** | Instalabil pe home screen fără App Store |
| **Animații** | Minimale — spring physics, micro-interacțiuni |
| **Accent color** | Indigo-violet (`#5e6ad2`) |
| **Font** | Inter (Google Fonts) |

### Paginile Necesare

| Pagină | Ce conține |
|---|---|
| **Acasă** | Search bar + 17 domenii în grilă + ultimele date adăugate |
| **Căutare** | Search bar persistent + filtre + rezultate infinite scroll |
| **Domeniu** | Icon + titlu + descriere + lista instituțiilor din domeniu |
| **Instituție** | Nume + link site oficial + statistici + categorii + seturi de date |
| **Set de date** | Titlu + descriere + metadata completă + buton descărcare + link sursă |
| **Despre** | Ce e proiectul, legal, open-source, cum contribui |
| **Statistici** | Câte date sunt per domeniu, instituție, format, an |

---

## 9. Fluxul de Navigare

```
Acasă
├── Scrie în search bar → Rezultate filtrate
└── Click pe un domeniu
    └── Pagina domeniului
        ├── Listează instituțiile din domeniu
        ├── Click instituție
        │   └── Pagina instituției
        │       ├── Categorii (ex: Spitale, Medicamente...)
        │       ├── Click categorie → Seturi filtrate
        │       └── Click set de date
        │           └── Pagina setului → buton descărcare + link sursă
        └── Caută în interiorul domeniului
```

---

## 10. MVP — Prima Versiune

### Intră în MVP

- ✅ Search bar + căutare instantă
- ✅ 17 domenii pe pagina principală + navigare pe domenii
- ✅ Pagina fiecărui domeniu cu instituțiile aferente
- ✅ Pagina fiecărei instituții cu seturile de date
- ✅ Pagina detalii set de date (titlu, descriere, format, link descărcare)
- ✅ Filtre: categorie, format, an, județ
- ✅ PWA — instalabil pe telefon
- ✅ Crawler pentru data.gov.ro (5.192 seturi)
- ✅ Crawler pentru BNR (curs valutar zilnic)
- ✅ Funcționează pe mobile (responsive)

### Nu intră în MVP (Faza 2)

- ⬜ Crawler ONRC (toate firmele)
- ⬜ Crawler SEAP (achiziții publice)
- ⬜ Hartă (MapLibre) pentru date geospațiale
- ⬜ Statistici (grafice, topuri)
- ⬜ API public
- ⬜ Toate cele 100+ surse

---

## 11. Planul de Dezvoltare

| Fază | Ce facem | Durată |
|---|---|---|
| **0 — Setup** | Instalare Meilisearch, structură Next.js, deploy pe VPS | 1 zi |
| **1 — Crawler data.gov.ro** | Python script care ia 5.192 seturi din CKAN API și le indexează | 1 zi |
| **2 — Frontend: acasă + search** | Pagina principală + search bar + rezultate | 2 zile |
| **3 — Frontend: domenii + instituții** | Paginile de domeniu, instituție, set de date | 2 zile |
| **4 — Filtre + PWA** | Filtre, responsive, manifest PWA | 1 zi |
| **5 — Crawler BNR + ONRC** | Curs valutar zilnic + firme românești | 2 zile |
| **6 — Polisare + deploy final** | Testare, bugfix, optimizări | 1 zi |

**Total MVP: ~10 zile de lucru**

---

## 12. Monetizarea

| Ce | Gratuit | Plată |
|---|---|---|
| Căutare și navigare | ✅ Toți cetățenii | — |
| Vizualizare rezultate | ✅ Toți cetățenii | — |
| Descărcare fișiere individuale | ✅ Toți cetățenii | — |
| Hartă interactivă | ✅ Toți cetățenii | — |
| API pentru integrări | — | 💼 Abonament lunar |
| Export bulk date | — | 💼 Abonament lunar |
| Rapoarte personalizate | — | 💼 Per proiect |
| Monitorizare / alerte | — | 💼 Abonament lunar |

**Model de business:** Wikipedia + freemium. Gratis pentru oameni, plătit pentru business care are nevoie de acces programatic.

---

## 13. Legal

| Legea | Ce permite |
|---|---|
| **Legea 544/2001** | Accesul liber la informațiile de interes public |
| **Legea 109/2007** | Reutilizarea informațiilor publice în scop comercial |
| **OUG 118/2014** | Publicarea datelor în format deschis |
| **Directiva UE 2019/1024** | Datele sectorului public trebuie să fie reutilizabile |
| **Licența OGL-ROU-1.0** | Permite reutilizarea cu atribuirea sursei |
| **Licența CC-BY-4.0** | Permite reutilizarea cu atribuirea sursei |

**Singura obligație:** Menționăm sursa (data.gov.ro, ONRC, BNR etc.) pentru fiecare set de date.

---

## 14. Tehnologii Înlocuibile

Dacă pe parcurs decidem să schimbăm ceva, iată alternativele:

| Componentă | Acum | Alternativă | Când am schimba |
|---|---|---|---|
| Search | Meilisearch | ElasticSearch | Trafic > 1M query-uri/zi |
| Frontend | Next.js | Vite + React (SPA) | Dacă nu avem nevoie de SEO |
| Hosting | VPS (Hetzner) | Cloudflare Pages + Workers | Când VPS-ul devine bottleneck |
| Crawler | Python | Go | Când crawlăm 100+ surse și Python e prea lent |

---

## 15. Riscuri și Mitigări

| Risc | Probabilitate | Impact | Soluție |
|---|---|---|---|
| ANCPI offline (atac cibernetic) | 🔴 Temporar | ⚠️ Nu avem date cadastrale live | Așteptăm migrarea în Cloud Guvernamental |
| portal.just.ro / legislatie.just.ro căzute | 🔴 Prezent | ⚠️ Fără date justiție | Crawler alternativ via ReJust (funcțional) |
| BPI timeout | 🔴 Frecvent | ⚠️ Fără insolvențe live | Crawler cu retry + notificare când revine |
| data.gov.ro schimbă API-ul | 🟡 Scăzut | 🔴 Crawler-ul nu mai merge | Teste periodice + alertă |
| Costuri VPS cresc | 🟡 Scăzut | 🟢 €4 → €8/lună | Diferență neglijabilă |
| Cineva copiază ideea | 🟡 Posibil | 🟢 Concurență sănătoasă | E open-source. Oricine poate. |

---

> **Document creat:** 28 Iulie 2026
> **Status:** Final — aprobat de Dragos
> **Următorul pas:** Implementare (setup Meilisearch + crawler data.gov.ro)
