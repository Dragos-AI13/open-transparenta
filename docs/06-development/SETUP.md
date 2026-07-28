# Setup — Dezvoltare Locală

## Prerequisites

- **Node.js** v20+ (recomandat: v22 LTS)
- **Python** 3.11+
- **Docker** (pentru Meilisearch local)
- **Git**

## 1. Clonează Repo-ul

```bash
git clone https://github.com/Dragos-AI13/open-transparenta.git
cd open-transparenta
```

## 2. Instalează Meilisearch (Local)

```bash
# Cu Docker (recomandat)
docker run -d -p 7700:7700 \
  -v $(pwd)/meili_data:/meili_data \
  getmeili/meilisearch:v1.12

# Sau direct (Linux/macOS)
curl -L https://install.meilisearch.com | sh
./meilisearch
```

Verifică: http://localhost:7700

## 3. Instalează Frontend-ul

```bash
cd frontend
npm install
```

## 4. Configurare

```bash
cp .env.example .env
# Editează .env — setează MEILISEARCH_HOST=http://localhost:7700
```

## 5. Rulează Crawler-ul (Populează Indexul)

```bash
cd crawler
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Crawler data.gov.ro
python crawl_data_gov.py

# Crawler BNR
python crawl_bnr.py

# Crawler ONRC
python crawl_onrc.py
```

## 6. Rulează Frontend-ul

```bash
cd frontend
npm run dev
```

Deschide http://localhost:3000

## Comenzi Utile

| Comandă | Ce face |
|---|---|
| `npm run dev` | Rulează frontend în development |
| `npm run build` | Build pentru producție |
| `npm start` | Rulează frontend în producție |
| `python crawl_data_gov.py` | Crawler data.gov.ro |
| `python crawl_bnr.py` | Crawler BNR curs valutar |
| `python crawl_onrc.py` | Crawler ONRC firme |

## Structura Proiectului

```
open-transparenta/
├── frontend/          ← Next.js app
│   ├── app/          ← Pages (App Router)
│   ├── components/   ← React components
│   ├── lib/          ← Utilitare
│   └── public/       ← Static assets
├── crawler/           ← Python scripts
│   ├── parsers/      ← PDF, XLSX, CSV parsers
│   └── crawl_*.py    ← One file per source
├── docs/             ← Documentație
├── scripts/          ← Bash scripts (deploy, pre-commit)
├── .env.example      ← Template config
└── PROJECT_PROFILE.yaml
```
