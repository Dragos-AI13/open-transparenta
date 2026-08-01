# CHANGELOG — Open Transparență

**Format:** Based on [Keep a Changelog](https://keepachangelog.com/).

---

## [2026-08-01] — TICKET-11.3: Bacalaureat live (ME) — 1.382 școli, rată națională 32%

### Added
- `crawler/crawler_educatie_bac.py` — descoperă pachetul `Rezultate Bacalaureat` (cea mai recentă sesiune — fallback pe an pentru „sesiunea 2- 2025"), parsează candidații (30.279, anonimizați), **join local cu rețeaua școlară** (SIIIR → județ/denumire, 97% mapate), agreghează pe școală
- **1.382 școli** indexate (`bacalaureat`): candidati/prezenti/promovati/rata_promovare + județ din rețea
- `GET /api/bacalaureat` (q, judet, sesiune, **minCand**, sort, paginare) + `rezumat` (rata națională + top județe)
- Pagină `/educatie/bacalaureat` — carduri hero (**32% național**, 25.665 prezenți/8.202 promovați, top Caraș-Severin 41,6%), tabel (denumire școală, badge județ, candidați/prezenți/promovați, rată colorată), filtre județ + **min candidați** (elimină zgomotul școlilor mici cu 100% pe 1-2 candidați), stări complete, responsive
- Tip `BacalaureatDoc` în lib; cardul → **Live (2/3 Educație)**; npm `crawl:educatie-bac`

### Fixed
- `parse_report_date` fără lună („sesiunea 2- 2025") → fallback pe an (comparat numeric)
- **Rezumat subestima**: search cu `limit: 1000` nu aducea toate școlile (cap Meilisearch) → `getDocuments` paginat (fără cap)
- **Filtru minCand client rupea paginarea** (elimina toate hit-urile din pagina 1 sortată după rată) → mutat în API ca filtru Meilisearch `candidati >= N`; `candidati` adăugat la filterableAttributes

### Verified
- Rata națională 32% = 8.202/25.665 (identic calculului direct pe fișier); top: Caraș-Severin 41,6%, Olt 38,7%
- minCand: 10 → 912 școli, 50 → 140; `?q=oradea` → colegii din Bihor
- Browser: carduri hero, tabel colegii naționale (S. Haret Tulcea 90,9%, Cuza Vodă 88,9%), filtre + paginare
- Cardul Educație → Bacalaureat **Live**; `npm run build` — curat

---

## [2026-08-01] — TICKET-11.2: Rețea școlară live (ME) — 18.022 unități de învățământ

### Added
- `crawler/crawler_educatie_retea.py` — descoperă pachetul `Rețea scolară 2025-2026` (data.gov.ro, org `ministerul-educatiei`), parsează XLSX (header detectat dinamic, mapare coloane după nume, normalizare diacritice), indexează în Meilisearch
- **18.022 unități** indexate (`retea_scolara`): 42 județe, mediu rural 11.160 / urban 6.862, cu denumire, adresă, telefon, email
- `GET /api/retea-scolara` (q, judet, mediu, tip, sort, paginare) — facet județ/mediu, total exact (facet pentru județe mari)
- `GET /api/retea-scolara/rezumat` — total unități, județe, urban/rural
- Pagină `/educatie/retea-scolara` — carduri hero (18.022 unități, 38,1% urban), tabel (denumire+adresă, badge județ, localitate, mediu colorat, tip, email mailto + telefon), filtre județ (din facet, sortat desc) + mediu + căutare, stări complete, responsive
- Tip `ReteaScolaraDoc` în lib; cardul din pagina domeniului → **Live** (1/3 Educație)
- Comandă npm: `crawl:educatie-retea`

### Fixed
- **Performanță openpyxl**: `ws.cell(row, col)` pe read_only e FOARTE lent (~15s/500 rânduri) → `iter_rows(values_only=True)` (~0.1s/1000); 18k rânduri parsen în 2.7s

### Verified
- `?q=oradea` → 131 unități Bihor; județe distincte 42; mediu rural 62%
- Browser: carduri hero corecte, tabel cu unități reale (Casa Corpului Didactic, CȘEI, cluburi sportive școlare), email-uri link-uite, filtre + paginare
- Cardul Educație → Rețea Școlară **Live**; `npm run build` — curat

---

## [2026-08-01] — TICKET-10.1 + 10.2: Investiții și Fonduri live (MFE) — 17.879 proiecte europene

### Added
- `crawler/crawler_mfe.py` — descoperă pachetele MFE de pe data.gov.ro (Proiecte contractate: 119 XLSX, 7 programe; Stadiul absorbției 2014-2020 + 2021-2027 lunar), ia cea mai recentă resursă per program (comparație dată numerică, nu lexicografică), parsează XLSX cu header detectat dinamic + mapare coloane după nume (robust la structuri diferite: POIM/POC/POR), normalizează diacriticele
- **17.879 proiecte** indexate (`proiecte_fonduri`): POR 8040, POC 3403, POCU 2948, POIM 2388, POCA 904, POAT 160, POAD 36
- **29 programe absorbție** indexate (`absorbtie_fonduri`), perioada 29 mai 2026, cu % absorbție
- `GET /api/proiecte-fonduri` (q, program, judet, stadiu, sort, paginare) — **facet program pentru total exact** pe programe mari (POR 8040 > capul 1000 Meilisearch)
- `GET /api/proiecte-fonduri/rezumat` — total proiecte, valoare, plăți + absorbție pe programe
- Pagină `/buget-si-finante/investitii-si-fonduri` — carduri hero (17.879 proiecte, 165,36 mld RON, raportare 29 mai 2026), bare absorbție, tabel (titlu, badge program, beneficiar, județ, valoare, stadiu colorat), filtre program + județ + căutare, stări complete, responsive
- Tip `ProiectFondDoc` + `AbsorbtieFondDoc` în lib; cardul din pagina domeniului → **Live (4/7 subdomenii)**
- Comandă npm: `crawl:mfe`

### Fixed
- Mapare coloane beneficiar: „Plăţi către beneficiari" (conține „beneficiar") suprascria „Denumire beneficiar" → verificare `plati` înainte + excludere „tip beneficiar"; normalizare ASCII pentru matching („Plăţi"→„plati")
- Comparație dată resurse: lexicografică („martie" > „august") alegea fișiere vechi → `parse_report_date` numeric (an, lună, zi)
- id proiect: include județ+valoare în hash (același SMIS cu defalcări multiple, ex. 125325)

### Verified
- `?q=oradea` → 67 proiecte Bihor; `program=POR` → 8040 exact; `judet=Bihor` → 560; `POIM+Bihor` → 134
- Beneficiari reali: CFR, METROREX, CNAIR, MINISTERUL ECONOMIEI, MINISTERUL SANATATII (fix mapare)
- Browser: carduri hero, bare absorbție (Politica de Coeziune 111,8%), tabel 50 rânduri, filtre + paginare
- `npm run build` — curat

---

## [2026-08-01] — TICKET-9.1 + 9.2 + 9.3: Phase 9 PWA completă — instalabil + offline

### Added
- `app/manifest.ts` — manifest PWA (Next 16 nativ, `MetadataRoute.Manifest`): name/short_name/description, `display: standalone`, theme_color + background `#08090b`, iconițe 192/512/maskable
- `scripts/generate_icons.py` — iconițe generate cu Pillow (gradient dark + „OT" amber): `public/icons/icon-192.png`, `icon-512.png`, `maskable-512.png` (safe zone 80%) + `favicon.ico`
- **Service worker Serwist 9.5** (`@serwist/turbopack` + `app/sw.ts`): precache statici build (`__SW_MANIFEST`), runtime cache — API **NetworkFirst** (1h, niciodată CacheFirst pe date), statice **CacheFirst** (30 zile), `skipWaiting` + `clientsClaim` + `navigationPreload`
- Site-ul e **instalabil** ca PWA (standalone) + funcțional **offline** (App Shell + date din cache)

### Verified
- Build: `/sw/sw.js` generat (precache manifest), `/manifest.webmanifest` valid, iconițe 200
- Browser: SW **activated** + controller, precache 34 entry-uri, cache-uri `serwist-precache` + `api-cache` + `static-assets`
- **Test offline TRECUT**: server oprit → `/buget-si-finante/curs-valutar` s-a încărcat complet din cache (37 valute)
- HTTPS pass; nota: categoria PWA eliminată din Lighthouse 12+ (scorul „>90" nu mai există în LH 13) — verificare manuală completă în loc
- `npm run build` — curat

---

## [2026-08-01] — TICKET-8.1 + 8.2: Taxe și Impozite live (Buletin Statistic Fiscal ANAF)

### Added
- `crawler/crawler_anaf.py` — descoperă buletinele ANAF (CKAN), parsează XLSX openpyxl: cap. 4.1 venituri bugetare + cap. 2.2 contribuabili activi
- **125 docs** — 6 trimestre (2024 T4, 2025 T1-T4, 2026 T1) × 2 secțiuni; TVA 2026 T1 = 29.177,8 mil lei (+17,9%)
- `GET /api/taxe-impozite` (q, sectiune, an, trimestru) + `GET /api/taxe-impozite/rezumat` (total + TVA pe trimestre)
- Pagină `/buget-si-finante/taxe-si-impozite` — carduri (venituri T1 2026: 119.228 mil lei ▲9,4%; TVA 29.177,8), tabel cu evoluții ▲/▼ verde/roșu, selector secțiune + an, căutare; badge → **Live** (3/7 subdomenii live)
- Tip `TaxaImpozitDoc` în lib

### Fixed
- `trimestru` lipsea din sortableAttributes (sort an+trimestru dădea eroare)

### Verified
- Rezumat: 2026 T1 total 119.228 mil lei (▲9,4%), 2025 T4 136.512 mil lei; TVA pe 4 trimestre 2025 (24.737,9 → 34.350,3)
- Browser: tabel complet (Impozit profit ▲22,2%, TVA ▲17,9%, Accize ▲4,5%, Alte venituri ▼15,2%), carduri corecte
- `npm run build` — curat

---

## [2026-08-01] — TICKET-7.5 + 7.6: Bugetul de Stat live (480 rânduri, 3 ani)

### Added
- `crawler/crawler_buget.py` — XML MF (anexa1_bs_{an}.xml, ISO-8859-2): venituri pe capitole + cheltuieli pe funcțiuni + deficit, 2023-2025
- **480 docs** — Venituri: 275,4 / 308,2 / 357,4 mld lei; Cheltuieli 2025: 499,6 mld (Învățământ 60,3 / Sănătate 24,2 / Apărare 27,3 mld); Deficit: -77,9 / -96,0 / -142,2 mld
- `GET /api/buget-stat` (q, tip, an, nivel, sort valoare) + `GET /api/buget-stat/rezumat` (totaluri pe ani)
- Pagină `/buget-si-finante/bugetul-de-stat` — carduri top (venituri/cheltuieli/deficit), tabel pe funcțiuni, selector an + tip, căutare; badge-ul din pagina domeniului → **Live**
- Tip `BugetStatDoc` în lib

### Fixed
- Coloanele XML depind de an (`PROGRAM_2024` ≠ `PROGRAM_2025`) → nume dinamice
- Id-uri unice pe ierarhie+denumire (același capitol apare de mai multe ori)
- Denumirile funcțiunilor (ÎNVĂȚĂMÂNT, SĂNĂTATE) capturate din rândurile fără valoare
- `VENITURI - TOTAL` are SUBCAPITOL=01 → nivel „total" și pe rândurile cu „TOTAL"
- Sort pe `valoare` configurat + `wait_for_task` înainte de swap (race condition)

### Verified
- Browser: carduri 357,35 / 499,58 / -142,23 mld ✓; tabel 22 funcțiuni ✓; căutare „sanatate" → 24,21 mld ✓
- Pagina domeniului: 2 subdomenii LIVE (Curs Valutar + Bugetul de Stat)
- `npm run build` — curat

---

## [2026-08-01] — TICKET-7.3: Pagina principală a domeniului Buget și Finanțe

### Added
- `/buget-si-finante` — pagina principală a domeniului: hero, grid 7 subdomenii (💱 Curs Valutar **Live** + 6 „În pregătire" fără dead link), badge-uri, instituțiile din domeniu (MF, ANAF, BNR, AEP, Energie, CNI, MFE)
- `lib/buget-domains.ts` — datele subdomeniilor (pattern `companii-domains.ts`)
- **Homepage DomainGrid: „💰 Buget și Finanțe" devine clickabil** (`href: "/buget-si-finante"`) — primul domeniu nou din grid după Companii și Comerț

### Verified
- Browser: homepage → card „Buget și Finanțe" (fără 🔜) → pagina domeniului → „💱 Curs Valutar" (LIVE) → tabel 37 valute → înapoi
- Subdomeniile „În pregătire" NU sunt link-uri (zero dead link)
- `npm run build` — curat

---

## [2026-08-01] — TICKET-7.1 + 7.2: Curs Valutar BNR live

### Added
- `crawler/crawler_bnr.py` — XML BNR public (nbrfxrates.xml), 37 valute, multiplier aplicat (HUF ×100 = 144.20), denumiri oficiale; istoric acumulat prin re-rulări zilnice (id `{VALUTA}_{DATA}`, upsert idempotent) — BNR nu mai expune istoric via API (`?data=` ignorat, fișiere anuale 502)
- Index Meilisearch `curs_valutar` (37 docs, 2026-07-31)
- `GET /api/curs-valutar?q=&data=&page=&limit=` — fără filtre → cea mai recentă zi, sortat desc după rată; `q` caută pe valută/denumire
- Pagină `/buget-si-finante/curs-valutar` — tabel: Valută (badge amber), Denumire, Rată (4 zecimale, format RO), Multiplier; căutare; stări complete; responsive; notă sursă BNR
- Tip `CursValutarDoc` în lib

### Verified
- API: latestDate 2026-07-31, total 37; `?q=EUR` → Euro 5.2473
- Browser: 37 valute afișate (XAU 594,63; EUR 5,2473; USD 4,5595; CHF 5,6420; GBP 6,1332), multiplier ×100 vizibil (HUF 144,20; JPY 285,14)
- Căutare „dolar" → 6 rezultate (american, canadian, australian, neo-zeelandez, Hong Kong, Singapore)
- `npm run build` — curat

---

## [2026-08-01] — TICKET-6.1 + 6.2: Concurență live (2.380 decizii CC)

### Added
- `crawler/crawler_concurenta.py` — HTML scraping consiliulconcurentei.ro: lista principală (241 pagini) + 8 subcategorii, rate limiting 0.6s, robots.txt respectat, dedupe pe id
- **2.380 decizii unice indexate** (număr, an, categorie, URL PDF direct)
- `GET /api/decizii-concurenta?q=&categorie=&an=&page=&limit=` — căutare număr, filtru categorie/an, paginare, total exact din stats
- Pagină dedicată `/companii/concurenta` — tabel: Decizie (link PDF), Categorie (badge amber), An, PDF ↗; căutare + filtru + paginare; stări complete (skeleton/eroare/gol/date); responsive
- Tip `DecizieConcurentaDoc` în lib

### Verified
- Index: 2.380 docs; API total corect
- `?q=44` → 20 decizii (44/2026...44/2019); `?categorie=Servicii` → 686; `?categorie=Carteluri` funcțional
- Browser: `/companii/concurenta` → 2.380 decizii, badge-uri, PDF link, paginare
- Notă: căutarea full-text pe cuvinte (ex. „concentrare") → 0 — titlul descriptiv e doar în PDF, nu în listă; căutarea funcționează pe număr + filtru categorie
- `npm run build` — curat

---

## [2026-08-01] — Sidebar curat: eliminate subdomeniile fără date reale

### Changed
- `DomainSidebar`: afișează doar categoriile cu `showInSidebar: true` — Registrul Comerțului, Situații Financiare, Întreprinderi Publice, Concurență (sursă confirmată: WordPress REST API Consiliul Concurenței)
- Eliminate din sidebar: Piață de Capital, Pensii Private, Asigurări, Protecția Consumatorului, Drepturi de Autor (fără sursă de date viabilă — verificat: data.gov.ro gol sau vechi, ASF blochează botii, BVB fără API)
- Paginile rămân accesibile direct din URL (doar nu mai apar în sidebar) — reversibil oricând
- Homepage/grid-ul de 17 domenii: **neatins** (decizie explicită user — site-ul e în dev)

### Verified
- Sidebar: 6 itemi (Toate datele, Căutare firmă, 4 categorii live) — verificat în browser
- `/companii/piata-de-capital` și `/companii/concurenta` → 200 direct din URL
- `npm run build` — curat

---

## [2026-08-01] — TICKET-5.6: QA complet Phase 5 (Întreprinderi Publice)

### Fixed
- `IntreprinderiPubliceTable`: `?q=apa` din URL nu era citit la mount (arăta toate cele 1259 în loc de 144 filtrate) → lazy init din `window.location.search` (client-safe, cu guard SSR)

### Verified
- Build curat; rutele Phase 5 în build: 2 API + pagina statică `/companii/intreprinderi-publice` + `[slug]` SSG
- QA browser: tabel (desktop) + căutare „apa" → 144 rezultate corecte + paginare + sortare + 404 pe firme normale
- Flow cap-coadă complet verificat (homepage → Companii → IP → profil → înapoi)
- Toate state docs actualizate: TICKET_INDEX (Phase 5 ✅ Complet), TICKET_INDEX-IP, NEXT_ACTIONS, PROJECT_STATUS, CHANGELOG

---

## [2026-08-01] — TICKET-5.5: Integrare sidebar + navigare cap-coadă

### Verified
- Sidebar „🏛️ Întreprinderi Publice" → `/companii/intreprinderi-publice` (link dinamic `/companii/${slug}` — deja corect, verificat)
- Grid `/companii` → card „Întreprinderi Publice" (2 seturi · AMEPIP) → pagina dedicată cu tabel
- Breadcrumb: „Companii și Comerț › Întreprinderi Publice"
- Sub-categoriile generice (`[slug]`) încă funcționează: `/companii/registrul-comertului` → pagina informativă normală
- Profil firmă → card IP (5.4) + „Înapoi la căutare"
- Flow cap-coadă complet: homepage → Companii → Întreprinderi Publice → profil firmă → înapoi
- `npm run build` — curat

### Changed
- Niciun cod necesar — navigarea era deja dinamică (linkurile sidebar/grid folosesc slug-ul); TICKET-5.5 a fost în principal QA + confirmare

---

## [2026-08-01] — TICKET-5.4: Card „Întreprindere publică" pe profil firmă

### Added
- `IntreprinderePublicaCard.tsx` — card pe profil firmă, apare DOAR dacă firma e în lista AMEPIP (404 → ascuns, zero impact pe firme normale)
- Tabel indicatori pe ani: ROE, ROA, EBITDA, Marja profit net, Lichiditate curentă, Datorii totale, Cota de piață (doar cei disponibili, trenduri ascunse pentru valori insuficiente)
- Mini-chart Chart.js line cu două axe (ROE % stânga + EBITDA RON dreapta)
- Badge „Capital de stat", notă sursă „AMEPIP (OUG 109/2011) · data.gov.ro"
- Stări: skeleton, ascuns (404), cu date; eroare → ascuns (non-critic)

### Verified
- RO54760 (COMPANIA DE APĂ ORADEA SA) → card complet: 7 indicatori × 5 ani + chart desenat
- RO28397 (ANAGIANI IMPEX, firmă normală) → card absent (verificat în browser)
- `npm run build` — curat

---

## [2026-08-01] — TICKET-5.3: Pagina subdomeniului Întreprinderi Publice

### Added
- `app/companii/intreprinderi-publice/page.tsx` — pagină dedicată (prioritate peste `/companii/[slug]`) cu hero (nume, descriere, iconiță) + tabel live
- `IntreprinderiPubliceTable.tsx` — tabel: Denumire (link → profil), CUI, CAEN, ROE (colorat verde/roșu), EBITDA, Lichiditate, Ani; căutare full-text, sortare A-Z/Z-A, paginare
- 4 stări: loading skeleton, eroare (cu retry), gol (cu reset căutare), cu date
- Responsive: tabel pe desktop, carduri pe mobil

### Verified
- `/companii/intreprinderi-publice` → 200, „1.259 întreprinderi publice"
- Căutare „oradea" → 7 rezultate (COMPANIA DE APĂ ORADEA, ORADEA TRANSPORT LOCAL, AEROPORTUL ORADEA, TERMOFICARE...)
- Click pe COMPANIA DE APĂ ORADEA → profil `/companii/firma/RO54760` funcțional
- `npm run build` — curat, pagina statică (○)

---

## [2026-08-01] — TICKET-5.2: API Routes întreprinderi publice

### Added
- `GET /api/intreprinderi-publice?q=&page=&limit=&caen=&sort=` — listă cu căutare full-text, filtru CAEN, sortare denumire asc/desc, paginare; `total` exact din `stats.numberOfDocuments` când nu sunt filtre (Meilisearch 1.12 capătă totalHits la 1000)
- `GET /api/intreprinderi-publice/{cui}` — detalii complete cu indicatorii pe ani; 404 cu mesaj clar dacă firma nu e întreprindere publică
- Tip `IntreprinderePublicaDoc` în `lib/meilisearch.ts`
- Cache-Control: `public, max-age=60, stale-while-revalidate=300`

### Verified
- Lista generală: total 1259, paginare corectă (page 2 → 20 hit-uri)
- `?q=apa` → 144 rezultate; `?caen=3600` → 294; `?sort=denumire:desc` → ZONE VERZI SRL primul
- `RO54760` → COMPANIA DE APĂ ORADEA SA cu indicatori 2019-2023 (ROE 10.74, EBITDA 30.5M)
- `RO28397` (firmă normală) → 404 corect
- `npm run build` — curat

---

## [2026-08-01] — TICKET-5.1: Crawler AMEPIP (întreprinderi publice)

### Added
- `crawler/crawler_amepip.py` — descarcă `data_2023.csv` (AMEPIP, data.gov.ro), agregă pe CUI, indexează în Meilisearch (index `intreprinderi_publice`, primary key `cui`, swap atomic)
- **1.259 firme cu capital de stat** indexate: COMPANIA DE APĂ ORADEA SA, TRANSELECTRICA, POSTA ROMÂNĂ, LOTERIA ROMÂNĂ etc.
- **17 indicatori AMEPIP pe firmă, ani 2019-2023**: ROE, ROA, EBITDA, marje, lichidități, datorii, cota de piață
- Normalizare CUI (`54760` → `RO54760`), split CAEN (cod + descriere)
- `--include-2024` opțional: XLSX-ul ian 2026 e format pivot fără mapare CUI directă → fallback elegant (se sare, se folosește CSV)
- Comandă npm: `crawl:amepip`

### Verified
- Index: 1.259 documente, `searchableAttributes` + `filterableAttributes` configurate
- Search „COMPANIA DE APA ORADEA" → RO54760, ani [2019-2023], ROE/EBITDA/lichiditate populați pe toți anii
- `--dry-run` + `--max` funcționale; `--include-2024` sare elegant (pivot nemapabil)
- Build frontend neafectat

---

## [2026-08-01] — TICKET-4.5: Administratori și Acționari (reprezentanți legali ONRC)

### Added
- `crawler/crawler_reprezentanti.py` — descarcă `OD_REPREZENTANTI_LEGALI.CSV` (335 MB, dataset ONRC lunar), parsează `^` delimiter, indexează în Meilisearch (index `reprezentanti`) cu swap atomic
- **3,679,100 reprezentanți indexați** în ~80s (46k docs/s)
- `GET /api/companies/{cui}/reprezentanti` — caută firma după CUI, filtrează reprezentanții după `cod_inmatriculare`, sortează (administratori → asociați → directori → restul)
- `RepresentativesCard.tsx` — card pe profil firmă cu nume + badge de funcție colorat (indigo=administrator, verde=asociat, cyan=director, orange=lichidator), 4 stări: loading skeleton, eroare, gol, cu date
- Comandă npm: `crawl:reprezentanti`

### Verified
- API: `RO28397` → ARGINTARU MIHAIL (administrator) ✅
- API: `RO10654053` → STRNAD EUGEN + STRNAD GABRIELA (2 administratori, sortare ok) ✅
- UI: card afișat pe profil firmă, badge corect, verificat vizual în browser ✅
- `npm run build` — compilează curat, ruta `/api/companies/[cui]/reprezentanti` prezentă

---

## [2026-08-01] — UI: monedă pe grafice + fallback-uri elegante

### Added
- Axa Y a graficelor Chart.js afișează acum moneda: `18k RON`, `1,1M RON` (era doar `18k`)
- Mesaj fallback pentru „Structura Activelor" când datele sunt insuficiente (sub 2 componente) — în loc de card gol
- Text explicativ pentru „Administratori și Acționari" (menționează sursa ONRC și planul de indexare)

### Fixed
- Anul din titlul „Structura Activelor (YYYY)" folosea ultimul an din array în loc de cel mai recent — inconsecvent cu mesajul interior

### Verified
- Firma fără structură detaliată (RO28397 ANAGIANI IMPEX): fallback afișat corect, an 2025 în titlu și mesaj
- Firma cu date complete (RO25629090): donut-ul se desenează normal
- RON vizibil pe axa Y la ambele grafice trend

---

## [2026-08-01] — Fix: grafice financiare goale în dev mode

### Fixed
- **Hydration rupt în dev mode**: HMR era blocat cross-origin (lipsea `allowedDevOrigins` în next.config.ts) → React nu hidrata → toate componentele client moarte (grafice goale, filtre nefuncționale)
- **Cache `.next` corupt**: erori „Jest worker exceeded retry limit" → 500 pe `/companii/firma/[cui]`; rezolvat prin ștergere cache + restart
- Verificat: cele 3 grafice Chart.js (line/bar/donut) se desenează corect, React hidratat, pagina firmei 200

### Verified
- `npx next build` + `next start` (producție) — grafice desenate, zero erori
- Dev: `/companii/firma/RO25629090` — 200, 3 canvas-uri desenate, `__reactFiber` prezent
- API financiar: `RO25629090` → 2 ani (2024+2025), 20 indicatori

### Known (data coverage)
- Administratori/Acționari: placeholder — ONRC publică dataset separat (persoane cu funcții), nu e încă crawl-uit
- Telefon/Email: `—` pe profil — ONRC nu publică aceste date în datele deschise

---

## [2026-08-01] — Reconciliere cod ↔ docs

### Changed
- TICKET_INDEX.md rescris ca hartă de ansamblu (era în urmă cu structura veche Phase 1/2/3)
- Feature 3 (Situații Financiare) marcat ✅ done în TICKET_INDEX-F2.md — codul era complet de pe 29.07, docs ziceau „planificat”
- NEXT_ACTIONS.md: 2.10–2.12 + 3.1–3.5 promovate la done; next real = PWA, deploy
- PROJECT_STATUS.md: Phase 2+3 complete, secțiune de reconcilere adăugată

### Verified
- `npx next build` — compilează curat; rutele `/companii/cauta`, `/companii/firma/[cui]`, `/api/companies/search`, `/api/companies/[cui]`, `/api/financiar/[cui]` toate prezente în build
- Rutele există: 3 API routes + 2 pagini dinamice + pagina domeniu + 9 sub-categorii SSG

---

## [2026-07-29] — TICKET-2.9: API Routes + Stare Parser

### Added
- `GET /api/companies/search?q=...` — search endpoint with filters (judet, localitate, forma_juridica, stare), pagination, Cache-Control headers, facet distribution
- `GET /api/companies/{cui}` — company detail endpoint, searches by CUI field
- `crawler/parse_stare_firma.py` — downloads OD_STARE_FIRMA.CSV + N_STARE_FIRMA.CSV nomenclator, maps COD→stare, populates 4.2M companies in Meilisearch (75k docs/sec)
- Search Results Page (`/companii/cauta`) cu filtre complete: județ, localitate, formă juridică, stare, secțiune CAEN, website, sortare, paginare
- CompanyCard, SearchFilters, Pagination, SearchBar componente
- CAEN Parser: 2.8M firme populate cu cod CAEN + denumire + secțiune
- Unicode normalization în toate scripturile (prevenire `ț`/`ţ` encoding issues)

### Fixed
- Gramatica românească: "958 de firme găsite" (era "958 firmăi găsităe")
- Encoding stare: normalizează diacriticele românești (ț/ș cu virgulă vs cedilă vs `?`)
- Search bar activat pe homepage + pagina de căutare + pagina companii (era `disabled`)
- Search bar adăugat și pe pagina de rezultate
- CAEN section adăugat în CompanyDoc type
- Diacritice matching în CKAN dataset title detection

### Changed
- Updated TICKET-2.9 status: pending → done
- State docs: PROJECT_STATUS, NEXT_ACTIONS updated

### Verified
- `npm run build` — compiles cleanly, no warnings
- `curl /api/companies/search?q=Autonom` — returns hits with facetDistribution
- `curl /api/companies/RO10654053` — returns company by CUI (not just document ID)
- Crawler ONRC: 4,201,586 firme already indexed from real data.gov.ro data
- Stare parser: 4,197,473 firme updated with stare values in ~56s (75k docs/s)

### Added
- Repository bootstrapped with Next.js 16 + Tailwind v4 + TypeScript
- Design tokens: bg layers, text hierarchy, 17 domain colors, status colors, border tokens, shadows, animations
- Layout components: Header (logo + nav), Footer (sources + license)
- Homepage: hero section with search bar placeholder, domain grid (17 domains with color dots)
- Meilisearch v1.12.8 running in Docker on port 7700
- State files: PROJECT_STATUS.md, NEXT_ACTIONS.md, CHANGELOG.md

### Changed
- Replaced default Next.js template with custom dark theme
- layout.tsx: Inter + JetBrains Mono fonts, viewport config

### Fixed
- themeColor warning (moved from metadata to viewport export)

### Verified
- `npm run build` — compiles cleanly, no warnings
- Dev server — http://localhost:3000 responds 200
- Meilisearch — health check returns `{"status":"available"}`
