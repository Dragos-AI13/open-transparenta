#!/usr/bin/env python3
"""
Crawler ONRC — reprezentanți legali (OD_REPREZENTANTI_LEGALI.CSV).

Descarcă fișierul cu persoanele imputernicite (administratori, asociați,
lichidatori etc.) din dataset-ul lunar ONRC de pe data.gov.ro și le
indexează în Meilisearch (index "reprezentanti", upsert).

Usage:
    python crawler_reprezentanti.py                  # Indexează tot
    python crawler_reprezentanti.py --max=1000       # Doar primele 1000
    python crawler_reprezentanti.py --force          # Fortează re-descărcare
    python crawler_reprezentanti.py --dry-run        # Doar descarcă, nu indexează
"""

import argparse
import csv
import hashlib
import json
import os
import sys
import time
from datetime import datetime
from io import StringIO
from pathlib import Path

import requests
from dotenv import load_dotenv
from meilisearch import Client

# ── Config ─────────────────────────────────────

load_dotenv(Path(__file__).resolve().parent.parent / "frontend" / ".env")

MEILISEARCH_HOST = os.getenv("MEILISEARCH_HOST", "http://localhost:7700")
MEILISEARCH_API_KEY = os.getenv("MEILISEARCH_API_KEY", "")
INDEX_NAME = "reprezentanti"
BATCH_SIZE = 1000
STATE_FILE = Path(__file__).parent / ".crawler_state.json"
CACHE_FILE = Path(__file__).parent / ".crawler_reprezentanti_cache.csv"

CKAN_BASE = "https://data.gov.ro"

# ── Logger ──────────────────────────────────────

def log(msg: str):
    ts = datetime.now().strftime("%H:%M:%S")
    print(f"[{ts}] {msg}", flush=True)


# ── CKAN API helpers ───────────────────────────

def find_latest_onrc_dataset() -> dict | None:
    """Găsește cel mai recent set de date ONRC cu firme."""
    url = f"{CKAN_BASE}/api/3/action/package_search"
    params = {"q": "onrc", "sort": "metadata_modified desc", "rows": 15}
    resp = requests.get(url, params=params, timeout=30)
    resp.raise_for_status()
    results = resp.json().get("result", {}).get("results", [])

    for r in results:
        title = r.get("title", "")
        if "Firme" in title and ("Registrul Comertului" in title or "Registrul Comerțului" in title):
            return r
    return results[0] if results else None


def find_reprezentanti_resource(dataset: dict) -> dict | None:
    """Găsește resursa OD_REPREZENTANTI_LEGALI.CSV."""
    for res in dataset.get("resources", []):
        name = (res.get("name") or "").upper()
        if "OD_REPREZENTANTI_LEGALI" in name and res.get("format") == "CSV":
            return res
    return None


def get_download_url(resource_id: str) -> str:
    url = f"{CKAN_BASE}/api/3/action/resource_show?id={resource_id}"
    resp = requests.get(url, timeout=30)
    resp.raise_for_status()
    return resp.json()["result"]["url"]


# ── State ──────────────────────────────────────

def load_state() -> dict:
    if STATE_FILE.exists():
        try:
            return json.loads(STATE_FILE.read_text())
        except Exception:
            pass
    return {"reprezentanti_last_hash": None, "reprezentanti_last_count": 0}


def save_state(state: dict):
    STATE_FILE.write_text(json.dumps(state, indent=2, default=str))


# ── Row parsing ────────────────────────────────

def sanitize_id(cod_inmat: str) -> str:
    """Meilisearch nu acceptă '/' sau '\\' în document ID."""
    return cod_inmat.replace("/", "-").replace("\\", "-")


def parse_row(row: dict, index: int) -> dict | None:
    cod_inmat = (row.get("COD_INMATRICULARE") or "").strip()
    persoana = (row.get("PERSOANA_IMPUTERNICITA") or "").strip()
    calitate = (row.get("CALITATE") or "").strip()

    if not cod_inmat or not persoana:
        return None

    cod_sanitized = sanitize_id(cod_inmat)

    return {
        # ID compus: o firmă poate avea mai mulți reprezentanți
        "id": f"{cod_sanitized}_{index}",
        "cod_inmatriculare": cod_sanitized,   # J40-1737-1992 (același format ca în indexul companies)
        "numar_registru_comert": cod_inmat,   # J40/1737/1992 (format original)
        "persoana_imputernicita": persoana,
        "calitate": calitate,                 # Administrator, Asociat, Lichidator...
        "data_nastere": (row.get("DATA_NASTERE") or "").strip(),
        "localitate_nastere": (row.get("LOCALITATE_NASTERE") or "").strip(),
        "judet_nastere": (row.get("JUDET_NASTERE") or "").strip(),
        "tara_nastere": (row.get("TARA_NASTERE") or "").strip(),
        "localitate": (row.get("LOCALITATE") or "").strip(),
        "judet": (row.get("JUDET") or "").strip(),
        "tara": (row.get("TARA") or "").strip(),
    }


# ── Meilisearch ────────────────────────────────

STAGING_INDEX = INDEX_NAME + "_staging"


def get_ms_client() -> Client:
    return Client(url=MEILISEARCH_HOST, api_key=MEILISEARCH_API_KEY)


def prepare_staging_index(client: Client):
    """Creează sau curăță indexul staging cu aceleași setări ca cel live."""
    try:
        client.delete_index(STAGING_INDEX)
        time.sleep(0.5)
    except Exception:
        pass

    client.create_index(STAGING_INDEX, {"primaryKey": "id"})
    time.sleep(1.5)

    idx = client.index(STAGING_INDEX)
    idx.update_settings({
        "searchableAttributes": ["persoana_imputernicita", "calitate"],
        "filterableAttributes": ["cod_inmatriculare", "calitate"],
    })
    time.sleep(1)

    # Dacă indexul live nu există, îl creăm la fel
    try:
        client.index(INDEX_NAME).get_stats()
    except Exception:
        log("Indexul live nu există. Îl creez...")
        client.create_index(INDEX_NAME, {"primaryKey": "id"})
        time.sleep(1)
        client.index(INDEX_NAME).update_settings({
            "searchableAttributes": ["persoana_imputernicita", "calitate"],
            "filterableAttributes": ["cod_inmatriculare", "calitate"],
        })
        time.sleep(1)


def swap_indexes(client: Client):
    """Swap atomic: staging → live (zero downtime)."""
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
    parser.add_argument("--max", type=int, default=None, help="Limitează numărul de linii procesate")
    parser.add_argument("--force", action="store_true", help="Fortează re-descărcarea")
    parser.add_argument("--dry-run", action="store_true", help="Doar descarcă, nu indexează")
    args = parser.parse_args()

    state = load_state()

    # 1. Găsim dataset-ul + resursa
    log("Caut dataset-ul ONRC pe data.gov.ro...")
    dataset = find_latest_onrc_dataset()
    if not dataset:
        log("Eroare: nu am găsit dataset-ul ONRC")
        sys.exit(1)
    log(f"Dataset: {dataset.get('title')}")

    resource = find_reprezentanti_resource(dataset)
    if not resource:
        log("Eroare: nu am găsit resursa OD_REPREZENTANTI_LEGALI.CSV în dataset")
        sys.exit(1)
    log(f"Resursă: {resource.get('name')} ({resource.get('size', '?')} bytes)")

    # 2. Hash pentru skip
    dataset_id = dataset.get("id", "")
    resource_id = resource.get("id", "")
    content_hash = hashlib.sha256(f"{dataset_id}_{resource_id}".encode()).hexdigest()[:16]

    if state.get("reprezentanti_last_hash") == content_hash and not args.force:
        log("Datele sunt deja la zi (hash identic). Folosește --force pentru re-indexare.")
        return

    # 3. Descărcăm (stream)
    url = get_download_url(resource_id)
    log(f"Descarc {url}")
    log("(streaming, nu încarc tot în RAM)")

    download_ok = False
    if CACHE_FILE.exists() and not args.force:
        log("Folosesc cache-ul local existent")
        download_ok = True
    else:
        try:
            with requests.get(url, stream=True, timeout=60) as resp:
                resp.raise_for_status()
                total = int(resp.headers.get("Content-Length", 0))
                downloaded = 0
                t0 = time.time()
                with open(CACHE_FILE, "wb") as f:
                    for chunk in resp.iter_content(chunk_size=1024 * 256):
                        f.write(chunk)
                        downloaded += len(chunk)
                        if total:
                            pct = downloaded / total * 100
                            elapsed = time.time() - t0
                            speed = downloaded / elapsed / 1024 / 1024 if elapsed > 0 else 0
                            log(f"  {downloaded/1024/1024:.0f}/{total/1024/1024:.0f} MB ({pct:.0f}%)  {speed:.0f} MB/s")
            download_ok = True
            log("Descărcare completă")
        except Exception as e:
            log(f"Eroare la descărcare: {e}")
            if CACHE_FILE.exists():
                log("Folosesc cache-ul parțial existent")
                download_ok = True

    if not download_ok or not CACHE_FILE.exists():
        log("Nu am date de procesat. Ies.")
        sys.exit(1)

    # 4. Parsăm și indexăm
    client = get_ms_client()
    prepare_staging_index(client)
    target_index = client.index(STAGING_INDEX)

    log("Parsare CSV (delimiter '^') + indexare...")
    t0 = time.time()
    batch = []
    total_parsed = 0
    total_indexed = 0
    skipped = 0

    with open(CACHE_FILE, "r", encoding="utf-8-sig", errors="replace") as f:
        reader = csv.DictReader(f, delimiter="^")
        for row_index, row in enumerate(reader):
            if args.max and total_parsed >= args.max:
                break

            doc = parse_row(row, row_index)
            total_parsed += 1
            if doc is None:
                skipped += 1
                continue

            batch.append(doc)
            if len(batch) >= BATCH_SIZE:
                if not args.dry_run:
                    target_index.add_documents(batch)
                total_indexed += len(batch)
                batch = []
                elapsed = time.time() - t0
                log(f"  {total_indexed:,} documente indexate ({total_indexed/elapsed:.0f} docs/s)")

    if batch:
        if not args.dry_run:
            target_index.add_documents(batch)
        total_indexed += len(batch)

    elapsed = time.time() - t0
    log(f"Gata: {total_indexed:,} indexate, {skipped:,} sărite, în {elapsed:.0f}s")

    # 5. Swap atomic + state
    if not args.dry_run and total_indexed > 0:
        swap_indexes(client)
        state["reprezentanti_last_hash"] = content_hash
        state["reprezentanti_last_count"] = total_indexed
        save_state(state)
        log("State salvat")
    elif args.dry_run:
        log("Dry-run: nu am indexat nimic")
    else:
        log("Nimic de indexat — indexul rămâne neschimbat")


if __name__ == "__main__":
    main()
