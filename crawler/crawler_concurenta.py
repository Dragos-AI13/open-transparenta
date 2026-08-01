#!/usr/bin/env python3
"""
Crawler Consiliul Concurenței — decizii publice (HTML scraping).

Descarcă listele de decizii de pe consiliulconcurentei.ro (categoria principală
+ 8 subcategorii, cu paginare) și le indexează în Meilisearch.

Structura găsită (spike 2026-08-01):
- Lista: /documente-oficiale/concurenta/decizii/ + /page/{n}/
- Subcategorii: industrie-si-energie, bunuri-de-consum, servicii,
  serviciul-carteluri, cercetare, investitii-straine, directia-teritoriala,
  analiza-si-monitorizare
- Decizie = <div class="post-preview__date">180/2026</div> + link PDF direct:
  /wp-content/uploads/2026/07/Decizia-180-din-2026.pdf
- Titlul descriptiv NU e în listă (doar în PDF) → documentul folosește numărul

Usage:
    python crawler_concurenta.py                  # Indexează tot
    python crawler_concurenta.py --max-pages=2    # Doar primele 2 pagini (test)
    python crawler_concurenta.py --dry-run        # Doar descarcă, nu indexează
    python crawler_concurenta.py --force          # Ignoră hash-ul din state
"""

import argparse
import hashlib
import json
import os
import re
import sys
import time
from datetime import datetime
from pathlib import Path

import requests
from dotenv import load_dotenv
from meilisearch import Client

# ── Config ─────────────────────────────────────

load_dotenv(Path(__file__).resolve().parent.parent / "frontend" / ".env")

MEILISEARCH_HOST = os.getenv("MEILISEARCH_HOST", "http://localhost:7700")
MEILISEARCH_API_KEY = os.getenv("MEILISEARCH_API_KEY", "")
INDEX_NAME = "decizii_concurenta"
BATCH_SIZE = 500
STATE_FILE = Path(__file__).parent / ".crawler_state.json"

BASE_URL = "https://www.consiliulconcurentei.ro"
LIST_URL = BASE_URL + "/documente-oficiale/concurenta/decizii/"
HEADERS = {
    "User-Agent": "OpenTransparentaBot/1.0 (+https://github.com/Dragos-AI13/open-transparenta; date publice)",
    "Accept": "text/html,application/xhtml+xml",
}
DELAY = 0.6  # rate limiting politicos

SUBCATEGORIES = [
    ("industrie-si-energie", "Industrie și energie"),
    ("bunuri-de-consum", "Bunuri de consum"),
    ("servicii", "Servicii"),
    ("serviciul-carteluri", "Carteluri și licitații"),
    ("cercetare", "Cercetare"),
    ("investitii-straine", "Investiții străine"),
    ("directia-teritoriala", "Direcția teritorială"),
    ("analiza-si-monitorizare", "Analiză și monitorizare"),
]


def log(msg: str):
    ts = datetime.now().strftime("%H:%M:%S")
    print(f"[{ts}] {msg}", flush=True)


# ── State ──────────────────────────────────────

def load_state() -> dict:
    if STATE_FILE.exists():
        try:
            return json.loads(STATE_FILE.read_text())
        except Exception:
            pass
    return {"concurenta_last_hash": None, "concurenta_last_count": 0}


def save_state(state: dict):
    STATE_FILE.write_text(json.dumps(state, indent=2, default=str))


# ── Parsing ────────────────────────────────────

def parse_list_page(html: str, categorie: str) -> list[dict]:
    """Extrage deciziile dintr-o pagină de listă."""
    out = []
    # Pattern: post-preview__date" > 180/2026 ... href="...pdf"
    pattern = re.compile(
        r'post-preview__date">\s*([^<]+?)\s*</div>.*?href="([^"]+\.pdf)"',
        re.S,
    )
    for numar_raw, pdf_url in pattern.findall(html):
        numar = numar_raw.strip()
        if not numar:
            continue
        # Extrag anul din număr (ex. "180/2026" → 2026)
        an_match = re.search(r"/(\d{4})$", numar)
        an = an_match.group(1) if an_match else ""

        # PDF URL complet
        if pdf_url.startswith("http"):
            pdf_full = pdf_url
        else:
            pdf_full = BASE_URL + pdf_url

        # ID: slug din PDF filename, sanitizat pentru Meilisearch
        slug = re.sub(r"[^a-zA-Z0-9_-]", "-", pdf_full.rsplit("/", 1)[-1].replace(".pdf", ""))
        doc_id = f"{slug}".lower()

        out.append({
            "id": doc_id,
            "numar": numar,                     # "180/2026"
            "an": an,                           # "2026"
            "categorie": categorie,             # "Servicii"
            "titlu": f"Decizia {numar}",        # titlul descriptiv e doar în PDF
            "url_pdf": pdf_full,
            "url_sursa": pdf_full,              # lista nu are pagină dedicată per decizie
        })
    return out


def fetch_page(url: str) -> str | None:
    """Descarcă o pagină, cu retry simplu."""
    for attempt in range(3):
        try:
            resp = requests.get(url, headers=HEADERS, timeout=30)
            if resp.status_code == 200:
                return resp.text
            log(f"  HTTP {resp.status_code} la {url} (încercarea {attempt + 1})")
        except Exception as e:
            log(f"  Eroare rețea: {e} (încercarea {attempt + 1})")
        time.sleep(DELAY * 2)
    return None


def get_max_page(html: str) -> int:
    """Găsește ultima pagină din paginare (pattern /decizii/page/N/)."""
    pages = [int(p) for p in re.findall(r"/page/(\d+)/", html)]
    return max(pages) if pages else 1


# ── Meilisearch ────────────────────────────────

STAGING_INDEX = INDEX_NAME + "_staging"


def get_ms_client() -> Client:
    return Client(url=MEILISEARCH_HOST, api_key=MEILISEARCH_API_KEY)


def prepare_staging_index(client: Client):
    try:
        client.delete_index(STAGING_INDEX)
        time.sleep(0.5)
    except Exception:
        pass
    client.create_index(STAGING_INDEX, {"primaryKey": "id"})
    time.sleep(1.5)
    idx = client.index(STAGING_INDEX)
    idx.update_settings({
        "searchableAttributes": ["titlu", "numar", "categorie"],
        "filterableAttributes": ["categorie", "an"],
        "sortableAttributes": ["numar"],
    })
    time.sleep(1)
    try:
        client.index(INDEX_NAME).get_stats()
    except Exception:
        log("Indexul live nu există. Îl creez...")
        client.create_index(INDEX_NAME, {"primaryKey": "id"})
        time.sleep(1)
        client.index(INDEX_NAME).update_settings({
            "searchableAttributes": ["titlu", "numar", "categorie"],
            "filterableAttributes": ["categorie", "an"],
            "sortableAttributes": ["numar"],
        })
        time.sleep(1)


def swap_indexes(client: Client):
    client.swap_indexes([{"indexes": [INDEX_NAME, STAGING_INDEX]}])
    time.sleep(1)
    try:
        client.delete_index(STAGING_INDEX)
    except Exception:
        pass
    log("Swap atomic complet: staging → live")


# ── Main ───────────────────────────────────────

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--max-pages", type=int, default=None, help="Limitează paginile procesate per listă")
    parser.add_argument("--force", action="store_true")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    state = load_state()
    content_hash = hashlib.sha256(f"cc_decizii_{datetime.now().strftime('%Y%m')}".encode()).hexdigest()[:16]

    if state.get("concurenta_last_hash") == content_hash and not args.force:
        log("Deciziile sunt deja la zi (hash lună identic). Folosește --force pentru re-crawl.")
        return

    # 1. Categoria principală (toate deciziile)
    log(f"Descarc lista principală: {LIST_URL}")
    all_docs = []
    main_html = fetch_page(LIST_URL)
    if not main_html:
        log("Eroare: nu pot accesa lista principală. Ies.")
        sys.exit(1)

    max_page = get_max_page(main_html)
    log(f"Paginare principală: {max_page} pagini")

    pages_to_crawl = [1]
    if args.max_pages:
        pages_to_crawl = list(range(1, min(max_page, args.max_pages) + 1))
    else:
        pages_to_crawl = list(range(1, max_page + 1))

    for pg in pages_to_crawl:
        url = LIST_URL if pg == 1 else f"{LIST_URL}page/{pg}/"
        html = fetch_page(url)
        if not html:
            log(f"  Sari peste pagina {pg} (eșec)")
            continue
        docs = parse_list_page(html, "Toate")
        all_docs.extend(docs)
        if pg % 25 == 0 or pg == pages_to_crawl[-1]:
            log(f"  Pagina {pg}/{pages_to_crawl[-1]} — {len(all_docs)} decizii acum")
        time.sleep(DELAY)

    # 2. Subcategoriile
    for slug, label in SUBCATEGORIES:
        cat_url = f"{LIST_URL}{slug}/"
        html = fetch_page(cat_url)
        if not html:
            log(f"  Subcategorie {label}: eșec — sari peste")
            continue
        cat_max = get_max_page(html)
        cat_pages = [1] if args.max_pages else list(range(1, cat_max + 1))
        for pg in cat_pages:
            url = cat_url if pg == 1 else f"{cat_url}page/{pg}/"
            h = fetch_page(url)
            if not h:
                continue
            docs = parse_list_page(h, label)
            all_docs.extend(docs)
            time.sleep(DELAY)
        if args.max_pages:
            log(f"  Subcategorie {label}: 1/{cat_max} pagini crawl-uite (--max-pages)")
        else:
            log(f"  Subcategorie {label}: {cat_max} pagini procesate")

    # Dedupe pe id (deciziile pot apărea în principal + subcategorie)
    unique = {}
    for d in all_docs:
        unique[d["id"]] = d
    docs = list(unique.values())
    log(f"Total decizii unice: {len(docs)}")

    if not docs:
        log("Nicio decizie extrasă — verifică structura paginii. Ies.")
        sys.exit(1)

    # 3. Indexare
    client = get_ms_client()
    prepare_staging_index(client)
    target = client.index(STAGING_INDEX)

    t0 = time.time()
    for i in range(0, len(docs), BATCH_SIZE):
        batch = docs[i:i + BATCH_SIZE]
        if not args.dry_run:
            target.add_documents(batch)
        done = min(i + BATCH_SIZE, len(docs))
        if done % 1000 == 0 or done == len(docs):
            log(f"  {done}/{len(docs)} indexate")
    log(f"Gata: {len(docs)} decizii în {time.time() - t0:.0f}s")

    if not args.dry_run and docs:
        swap_indexes(client)
        state["concurenta_last_hash"] = content_hash
        state["concurenta_last_count"] = len(docs)
        save_state(state)
        log("State salvat")
    elif args.dry_run:
        log("Dry-run: nu am indexat nimic")


if __name__ == "__main__":
    main()
