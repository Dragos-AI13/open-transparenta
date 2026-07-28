# Arhitectura Sistemului

## Diagrama Arhitecturală

```
┌──────────────────────────────────────────────────────────────┐
│                        CLIENT                                │
│  Browser (mobil/desktop) · PWA instalabil pe home screen     │
└──────────────────────────┬───────────────────────────────────┘
                           │ HTTPS / DNS (Cloudflare)
┌──────────────────────────▼───────────────────────────────────┐
│                      NEXT.JS (VPS)                            │
│  ┌────────────────────────────────────────────────────┐      │
│  │  Pages:                                              │      │
│  │  /              ← Search bar + 17 domenii           │      │
│  │  /search?q=     ← Rezultate căutare                 │      │
│  │  /domeniu/      ← Instituții dintr-un domeniu       │      │
│  │  /institutie/   ← Seturi de date ale instituției    │      │
│  │  /set/          ← Detalii + date vizibile           │      │
│  │  /harta         ← Hartă geospațială                 │      │
│  │  /api/*         ← API Routes (proxy Meilisearch)    │      │
│  └────────────────────────────────────────────────────┘      │
│  PWA manifest · Service Worker · Offline fallback             │
└──────────────────────────┬───────────────────────────────────┘
                           │ HTTP (localhost:7700)
┌──────────────────────────▼───────────────────────────────────┐
│                     MEILISEARCH                               │
│  Index principal: "open-transparenta"                        │
│  Documente: ~5.192+ (fiecare = un set de date)               │
│  Câmpuri indexate: titlu, descriere, domeniu, instituție,    │
│                    categorie, format, an, județ, conținut     │
│  Typo tolerance: implicit                                    │
│  Ranking: relevanță → dată actualizare                        │
└──────────────────────────┬───────────────────────────────────┘
                           │ (alimentat de crawler)
┌──────────────────────────▼───────────────────────────────────┐
│                  CRAWLER ENGINE (Python)                      │
│  Rulează: cron zilnic 3:00 AM                                 │
│  Cod: /crawler/                                               │
│                                                               │
│  ├── data_gov.py       ← CKAN API (JSON)                     │
│  ├── onrc.py           ← Dumps CSV lunare                    │
│  ├── bnr.py            ← API XML curs valutar                │
│  ├── seap.py           ← data.gov.ro mirror                  │
│  ├── ins_tempo.py      ← TEMPO Online                        │
│  ├── anaf.py           ← Plătitori TVA + buletine fiscale    │
│  └── parser/           ← PDF · XLSX · CSV · XML · HTML       │
│      ├── pdf.py        ← extrage tabele din PDF              │
│      ├── excel.py      ← extrage foi din XLSX/XLS            │
│      ├── csv.py        ← parsează CSV direct                 │
│      └── html.py       ← extrage din pagini web              │
└──────────────────────────────────────────────────────────────┘
```

## Fluxul Datelor

```
Instituție publică
    ↓ (publică PDF / XLSX / CSV / API)
data.gov.ro + site-uri proprii
    ↓ (crawler)
OPEN TRANSPARENȚĂ
    ├── Index Meilisearch (metadata)
    ├── Date parsate (tabele extrase din documente)
    └── Cache pentru hărți
    ↓ (API)
Next.js → Browser
    ↓
Cetățeanul vede date frumoase, nu PDF-uri
```

## Tehnologiile

| Componentă | Tehnologie | Justificare |
|---|---|---|
| Frontend | Next.js 15 + Tailwind CSS | SSR, SEO, PWA, un singur proiect |
| Search | Meilisearch | Sub 50ms, typo-tolerant, 100MB RAM, 5 minute instalare |
| Crawler | Python 3 + Scrapy | CKAN, CSV, XLSX, PDF — Python e imbatabil la procesat date |
| Parsare PDF | marker-pdf + pymupdf | Extrage tabele și text din PDF-uri |
| Parsare Excel | openpyxl + pandas | Citește XLSX/XLS, extrage foi și tabele |
| Hosting | VPS Hetzner (2 vCPU, 4GB) | €4.50/lună, suficient pentru trafic RO |
| Monitorizare | Uptime Kuma | Verifică dacă site-ul și search-ul funcționează |

## Decizii Arhitecturale (ADR-uri)

Vezi `02-architecture/decisions/` pentru fiecare decizie majoră.
