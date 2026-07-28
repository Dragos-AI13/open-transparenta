#!/usr/bin/env python3
"""
Crawler ONRC — descarca dump-ul lunar cu toate firmele din Romania
de pe data.gov.ro si le indexeaza in Meilisearch (upsert).

Usage:
    python crawler_onrc.py                  # Indexeaza tot
    python crawler_onrc.py --max=1000       # Doar primele 1000
    python crawler_onrc.py --force          # Forteaza re-descarcare
    python crawler_onrc.py --dry-run        # Doar descarca, nu indexeaza
"""

import argparse
import csv
import hashlib
import json
import os
import sys
import time
from datetime import datetime, timezone
from io import StringIO
from pathlib import Path

import requests
from dotenv import load_dotenv
from meilisearch import Client

# ── Config ─────────────────────────────────────

load_dotenv(Path(__file__).resolve().parent.parent / "frontend" / ".env")

MEILISEARCH_HOST = os.getenv("MEILISEARCH_HOST", "http://localhost:7700")
MEILISEARCH_API_KEY = os.getenv("MEILISEARCH_API_KEY", "")
INDEX_NAME = "companies"
BATCH_SIZE = 1000
STATE_FILE = Path(__file__).parent / ".crawler_state.json"
CACHE_FILE = Path(__file__).parent / ".crawler_cache.csv"

CKAN_BASE = "https://data.gov.ro"


# ── Logger ──────────────────────────────────────

def log(msg: str):
    ts = datetime.now().strftime("%H:%M:%S")
    print(f"[{ts}] {msg}", flush=True)


# ── CKAN API helpers ───────────────────────────

def find_latest_onrc_dataset() -> dict | None:
    """Gaseste cel mai recent set de date ONRC cu firme."""
    url = f"{CKAN_BASE}/api/3/action/package_search"
    params = {"q": "onrc", "sort": "metadata_modified desc", "rows": 15}
    resp = requests.get(url, params=params, timeout=30)
    resp.raise_for_status()
    results = resp.json().get("result", {}).get("results", [])

    for r in results:
        title = r.get("title", "")
        if "Firme" in title and "Registrul Comertului" in title:
            return r
    return results[0] if results else None


def find_firme_resource(dataset: dict) -> dict | None:
    """Gaseste resursa OD_FIRME.CSV."""
    for res in dataset.get("resources", []):
        if "OD_FIRME" in (res.get("name", "")).upper() and res.get("format") == "CSV":
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
    return {"last_hash": None, "last_position": 0, "last_count": 0}


def save_state(state: dict):
    STATE_FILE.write_text(json.dumps(state, indent=2, default=str))


# ── Row parsing ────────────────────────────────

def parse_row(row: dict) -> dict | None:
    denumire = (row.get("DENUMIRE") or "").strip()
    if not denumire:
        return None

    def adr(k):
        return (row.get(k) or "").strip()

    # Construim adresa
    parts = []
    for label, key in [
        ("", "ADR_DEN_STRADA"),
        (None, "ADR_NR_STRADA"),
        (None, "ADR_BLOC"),
        (None, "ADR_SCARA"),
        (None, "ADR_ETAJ"),
        (None, "ADR_APARTAMENT"),
        (None, "ADR_SECTOR"),
        ("", "ADR_COD_POSTAL"),
    ]:
        val = adr(key)
        if not val:
            continue
        if label is None:
            if key == "ADR_NR_STRADA":
                parts.append(f"Nr. {val}")
            elif key == "ADR_BLOC":
                parts.append(f"Bl. {val}")
            elif key == "ADR_SCARA":
                parts.append(f"Sc. {val}")
            elif key == "ADR_ETAJ":
                parts.append(f"Et. {val}")
            elif key == "ADR_APARTAMENT":
                parts.append(f"Ap. {val}")
            elif key == "ADR_SECTOR":
                parts.append(f"Sector {val}")
        else:
            parts.append(val)
    adresa = ", ".join(parts)

    # CUI
    cui_raw = adr("CUI")
    try:
        cui_val = int(cui_raw)
        cui = f"RO{cui_val}" if cui_val > 0 else ""
    except (ValueError, TypeError):
        cui = ""

    cod_inmat = adr("COD_INMATRICULARE")
    if not cod_inmat and cui:
        cod_inmat = cui
    # Meilisearch nu accepta "/" in document ID
    doc_id = cod_inmat.replace("/", "-").replace("\\", "-")

    return {
        "cod_inmatriculare": doc_id,
        "cui": cui,
        "denumire": denumire.upper(),
        "forma_juridica": adr("FORMA_JURIDICA"),
        "stare": "",
        "adresa": adresa,
        "localitate": adr("ADR_LOCALITATE"),
        "judet": adr("ADR_JUDET"),
        "cod_caen": "",
        "cod_caen_denumire": "",
        "website": adr("WEB"),
        "data_infiintare": adr("DATA_INMATRICULARE"),
        "numar_registru_comert": adr("COD_INMATRICULARE"),
    }


# ── Meilisearch ────────────────────────────────

STAGING_INDEX = INDEX_NAME + "_staging"

def get_ms_client() -> Client:
    return Client(url=MEILISEARCH_HOST, api_key=MEILISEARCH_API_KEY)


def prepare_staging_index(client: Client):
    """Creeaza sau curata indexul staging cu aceleasi setari ca cel live."""
    # Sterge staging daca exista
    try:
        client.delete_index(STAGING_INDEX)
        time.sleep(0.5)
    except Exception:
        pass

    # Creeaza staging cu primaryKey corect
    client.create_index(STAGING_INDEX, {"primaryKey": "cod_inmatriculare"})
    time.sleep(1.5)

    idx = client.index(STAGING_INDEX)
    idx.update_settings({
        "searchableAttributes": [
            "denumire", "cui", "adresa", "localitate", "judet",
            "cod_inmatriculare",
        ],
        "filterableAttributes": ["judet", "forma_juridica", "stare", "localitate"],
        "sortableAttributes": ["denumire"],
    })
    time.sleep(1)

    # Daca indexul live nu exista, il cream la fel
    try:
        client.index(INDEX_NAME).get_stats()
    except Exception:
        log("Indexul live nu exista. Il creez...")
        client.create_index(INDEX_NAME, {"primaryKey": "cod_inmatriculare"})
        time.sleep(1)
        client.index(INDEX_NAME).update_settings({
            "searchableAttributes": [
                "denumire", "cui", "adresa", "localitate", "judet",
                "cod_inmatriculare",
            ],
            "filterableAttributes": ["judet", "forma_juridica", "stare", "localitate"],
            "sortableAttributes": ["denumire"],
        })
        time.sleep(1)


def swap_indexes(client: Client):
    """Swap atomic: staging → live. Instant, zero downtime."""
    log("🔁 Fac swap atomic intre indexe...")
    try:
        client.swap_indexes([{"indexes": [INDEX_NAME, STAGING_INDEX]}])
        time.sleep(1)
        log("✅ Swap complet!")
    except Exception as e:
        log(f"⚠️  Eroare la swap: {e}")
        # Fallback: delete live, rename staging to live
        log("   Fallback: copiere manuala...")
        raise


def cleanup_staging(client: Client):
    """Sterge indexul staging (acum contine datele vechi)."""
    try:
        client.delete_index(STAGING_INDEX)
        log("🧹 Staging sters")
    except Exception:
        pass


def index_batch(client: Client, docs: list[dict], index_name: str = STAGING_INDEX):
    client.index(index_name).add_documents(docs)


# ── Main ────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Crawler ONRC")
    parser.add_argument("--max", type=int, default=0, help="Max firme (0=tot)")
    parser.add_argument("--force", action="store_true", help="Ignora cache")
    parser.add_argument("--dry-run", action="store_true", help="Nu indexa")
    args = parser.parse_args()

    # 1. Gaseste cel mai recent dataset
    log("Caut cel mai recent set ONRC...")
    dataset = find_latest_onrc_dataset()
    if not dataset:
        log("EROARE: Nu am gasit setul ONRC pe data.gov.ro")
        sys.exit(1)

    dataset_id = dataset["id"]
    modified = dataset.get("metadata_modified", "")[:10]
    log(f"Dataset: {dataset.get('title','?')} ({modified})")

    resource = find_firme_resource(dataset)
    if not resource:
        log("EROARE: Nu am gasit OD_FIRME.CSV")
        sys.exit(1)

    resource_id = resource["id"]
    log(f"Fisier: OD_FIRME.CSV ({resource.get('size',0):,} bytes)")

    # 2. Verifica daca avem deja date actualizate
    current_hash = hashlib.sha256(
        f"{dataset_id}_{resource_id}".encode()
    ).hexdigest()[:16]
    state = load_state()

    if not args.force and state.get("last_hash") == current_hash:
        log(
            f"Deja actualizat ({state.get('last_count',0):,} firme). "
            "Use --force sa re-descarci."
        )
        return

    # 3. Descarca
    if CACHE_FILE.exists() and not args.force:
        log(f"Folosesc cache local: {CACHE_FILE.name}")
        with open(CACHE_FILE, "rb") as f:
            raw = f.read()
    else:
        url = get_download_url(resource_id)
        log("Descarc OD_FIRME.CSV...")
        t0 = time.time()
        resp = requests.get(url, stream=True, timeout=600)
        resp.raise_for_status()
        raw = resp.content
        log(f"  {len(raw):,} bytes in {time.time()-t0:.1f}s")

        # Salveaza in cache
        with open(CACHE_FILE, "wb") as f:
            f.write(raw)

    # 4. Parseaza CSV
    text = raw.decode("utf-8-sig")
    lines = text.splitlines()
    log(f"Linii totale: {len(lines):,} (inclusiv header)")

    if len(lines) < 2:
        log("EROARE: Fisier gol")
        sys.exit(1)

    # 5. Initializeaza Meilisearch (index staging)
    if not args.dry_run:
        client = get_ms_client()
        prepare_staging_index(client)
        log("Index staging pregatit")

    # 6. Proceseaza rand cu rand in staging
    reader = csv.DictReader(StringIO(text), delimiter="^")
    total = 0
    batch: list[dict] = []
    errors = 0
    t_start = time.time()

    for row in reader:
        doc = parse_row(row)
        if doc is None:
            continue

        batch.append(doc)
        total += 1

        if len(batch) >= BATCH_SIZE:
            if not args.dry_run:
                try:
                    index_batch(client, batch)
                except Exception as e:
                    log(f"Eroare indexare: {e}")
                    errors += 1
            batch = []
            elapsed = time.time() - t_start
            if elapsed > 0:
                log(f"  {total:,} firme ({total/elapsed:.0f}/s)")

        if args.max and total >= args.max:
            log(f"Limita --max={args.max} atinsa")
            break

    if batch and not args.dry_run:
        try:
            index_batch(client, batch)
        except Exception as e:
            log(f"Eroare indexare final: {e}")
            errors += 1

    elapsed = time.time() - t_start

    # 7. Swap atomic: staging → live
    if not args.dry_run and total > 0 and errors == 0:
        swap_indexes(client)
        cleanup_staging(client)
    elif errors > 0:
        log("⚠️  Nu fac swap din cauza erorilor. Verifica staging.")
    else:
        log("ℹ️  Niciun document nou de indexat.")

    # 8. Sterge cache-ul CSV dupa indexare reusita
    if errors == 0 and CACHE_FILE.exists():
        try:
            CACHE_FILE.unlink()
            log(f"🧹 Cache sters ({CACHE_FILE.name})")
        except Exception:
            pass
    log("=" * 50)
    log("REZUMAT:")
    log(f"  Indexate: {total:,} firme")
    log(f"  Erori: {errors}")
    log(f"  Durata: {elapsed:.1f}s")
    if elapsed > 0:
        log(f"  Viteza: {total/elapsed:.0f} docs/s")
    log("=" * 50)

    save_state({
        "last_hash": current_hash,
        "last_count": total,
        "last_run": datetime.now(timezone.utc).isoformat(),
    })

    if errors:
        log("Au fost erori. Verifica log-urile.")
        sys.exit(1)

    log("Crawler ONRC complet!")


if __name__ == "__main__":
    main()
