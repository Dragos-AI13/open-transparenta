#!/usr/bin/env python3
"""
Parse OD_CAEN_AUTORIZAT.CSV + N_CAEN.CSV from ONRC dataset and populate
`cod_caen`, `cod_caen_denumire`, and `caen_sectiune` fields for all 4.2M
companies in the Meilisearch index.

Usage:
    python parse_caen.py                          # Full update
    python parse_caen.py --max=100000             # Only first 100k
    python parse_caen.py --force                   # Re-download even if cached
    python parse_caen.py --dry-run                 # Preview only
"""
import argparse
import csv
import hashlib
import json
import os
import sys
import time
from collections import defaultdict
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
STATE_FILE = Path(__file__).parent / ".caen_state.json"
CACHE_CAEN_FILE = Path(__file__).parent / ".caen_cache.csv"
CACHE_NOM_FILE = Path(__file__).parent / ".caen_nomenclator_cache.csv"

CKAN_BASE = "https://data.gov.ro"


import unicodedata


# ── Logger ──────────────────────────────────────


def log(msg: str):
    ts = datetime.now().strftime("%H:%M:%S")
    print(f"[{ts}] {msg}", flush=True)


# ── Unicode normalization (prevent '?' encoding issues) ──


def normalize_romanian(s: str) -> str:
    """Normalize Romanian diacritics: ţ/ş (cedilla) → ț/ș (comma)."""
    return unicodedata.normalize("NFC", s).replace("\u0163", "\u021B").replace("\u015F", "\u0219")


# ── CKAN helpers ───────────────────────────────


def find_latest_onrc_dataset() -> dict | None:
    url = f"{CKAN_BASE}/api/3/action/package_search"
    params = {"q": "onrc", "sort": "metadata_modified desc", "rows": 15}
    resp = requests.get(url, params=params, timeout=30)
    resp.raise_for_status()
    for r in resp.json()["result"]["results"]:
        title = r.get("title", "")
        if "Firme" in title and ("Registrul Comertului" in title
                                  or "Registrul Comerțului" in title):
            return r
    return None


def find_resource(dataset: dict, name_contains: str) -> dict | None:
    for res in dataset.get("resources", []):
        if name_contains.upper() in (res.get("name", "")).upper():
            return res
    return None


def find_nomenclator_dataset() -> dict | None:
    resp = requests.get(
        f"{CKAN_BASE}/api/3/action/package_search",
        params={"q": "Nomenclatoare", "sort": "metadata_modified desc", "rows": 5},
        timeout=30,
    )
    for r in resp.json()["result"]["results"]:
        title = r.get("title", "")
        if "Nomenclatoare" in title:
            for res in r.get("resources", []):
                if "N_CAEN" in (res.get("name", "")).upper() and "VERSIUNE" not in (res.get("name", "")).upper():
                    return r
    return None


def get_download_url(resource_id: str) -> str:
    resp = requests.get(
        f"{CKAN_BASE}/api/3/action/resource_show?id={resource_id}", timeout=30
    )
    return resp.json()["result"]["url"]


def download_csv(url: str, name: str, cache_path: Path, force: bool) -> bytes:
    if cache_path.exists() and not force:
        log(f"  Cache: {cache_path.name}")
        return cache_path.read_bytes()
    log(f"  Downloading {name}...")
    t0 = time.time()
    resp = requests.get(url, stream=True, timeout=600)
    resp.raise_for_status()
    raw = resp.content
    log(f"  {len(raw):,} bytes in {time.time() - t0:.1f}s")
    cache_path.write_bytes(raw)
    return raw


# ── State ──────────────────────────────────────


def load_state() -> dict:
    if STATE_FILE.exists():
        try:
            return json.loads(STATE_FILE.read_text())
        except Exception:
            pass
    return {"last_hash": None, "last_run": None, "last_count": 0}


def save_state(state: dict):
    STATE_FILE.write_text(json.dumps(state, indent=2, default=str))


# ── Main ────────────────────────────────────────


def main():
    parser = argparse.ArgumentParser(
        description="Parse OD_CAEN_AUTORIZAT.CSV and update Meilisearch"
    )
    parser.add_argument("--max", type=int, default=0, help="Max entries (0=all)")
    parser.add_argument("--force", action="store_true", help="Ignore cache")
    parser.add_argument("--dry-run", action="store_true", help="No writes")
    args = parser.parse_args()

    # ── Step 1: Load nomenclator CAEN ──
    log("[1/6] Incarc nomenclatorul N_CAEN...")
    nom_dataset = find_nomenclator_dataset()
    if not nom_dataset:
        log("EROARE: Nu am gasit Nomenclatoare dataset")
        sys.exit(1)

    nom_resource = find_resource(nom_dataset, "N_CAEN")
    if not nom_resource:
        log("EROARE: Nu am gasit N_CAEN.CSV in nomenclator")
        sys.exit(1)

    nom_url = get_download_url(nom_resource["id"])
    nom_raw = download_csv(nom_url, "N_CAEN.CSV", CACHE_NOM_FILE, args.force)
    nom_text = nom_raw.decode("utf-8-sig")
    nom_reader = csv.DictReader(StringIO(nom_text), delimiter="^")

    # Build CLASA → (DENUMIRE, SECTIUNEA) mapping
    caen_map: dict[str, tuple[str, str]] = {}
    for row in nom_reader:
        clasa = (row.get("CLASA") or "").strip()
        denumire = normalize_romanian((row.get("DENUMIRE") or "").strip())
        sectiunea = (row.get("SECTIUNEA") or "").strip()
        if clasa and denumire:
            caen_map[clasa] = (denumire, sectiunea)
    log(f"  Nomenclator: {len(caen_map):,} coduri CAEN incarcate")

    # ── Step 2: Download OD_CAEN_AUTORIZAT.CSV ──
    log("[2/6] Caut OD_CAEN_AUTORIZAT.CSV...")
    dataset = find_latest_onrc_dataset()
    if not dataset:
        log("EROARE: Nu am gasit dataset-ul ONRC")
        sys.exit(1)

    caen_resource = find_resource(dataset, "OD_CAEN_AUTORIZAT")
    if not caen_resource:
        log("EROARE: Nu am gasit OD_CAEN_AUTORIZAT.CSV")
        sys.exit(1)

    log(f"  Gasit: {caen_resource.get('name', 'OD_CAEN_AUTORIZAT.CSV')} "
        f"({caen_resource.get('size', 0):,} bytes)")

    resource_id = caen_resource["id"]
    current_hash = hashlib.sha256(
        f"caen_{resource_id}_{nom_resource['id']}".encode()
    ).hexdigest()[:16]
    state = load_state()

    if not args.force and state.get("last_hash") == current_hash:
        log(f"  Deja actualizat ({state.get('last_count', 0):,} entries). "
            "Use --force sa re-descarci.")
        return

    url = get_download_url(resource_id)
    raw = download_csv(url, "OD_CAEN_AUTORIZAT.CSV", CACHE_CAEN_FILE, args.force)

    # ── Step 3: Parse and group by company ──
    log("[3/6] Parsez si grupez CAEN-uri pe firma...")
    text = raw.decode("utf-8-sig")
    lines = text.splitlines()
    log(f"  Linii: {len(lines):,} (inclusiv header)")

    if len(lines) < 2:
        log("EROARE: Fisier gol")
        sys.exit(1)

    reader = csv.DictReader(StringIO(text), delimiter="^")

    # Group all CAEN codes per company
    company_caen: dict[str, list[str]] = defaultdict(list)
    total_rows = 0
    for row in reader:
        cod_inmat = (row.get("COD_INMATRICULARE") or "").strip()
        cod_caen = (row.get("COD_CAEN_AUTORIZAT") or "").strip()

        if not cod_inmat or not cod_caen:
            continue

        doc_id = cod_inmat.replace("/", "-").replace("\\", "-")
        company_caen[doc_id].append(cod_caen)
        total_rows += 1

        if args.max and len(company_caen) >= args.max:
            break

    log(f"  {total_rows:,} randuri → {len(company_caen):,} firme cu coduri CAEN")

    if not company_caen:
        log("EROARE: Niciun rand valid")
        sys.exit(1)

    # ── Step 4: Build update documents ──
    log("[4/6] Construiesc documentele de actualizat...")
    updates: list[dict] = []
    for doc_id, caen_codes in company_caen.items():
        # Use first CAEN code as primary (take first in list)
        primary_caen = caen_codes[0]
        denumire, sectiune = caen_map.get(primary_caen, ("", ""))

        # Join all CAEN codes as comma-separated
        all_caen = ", ".join(sorted(set(caen_codes)))

        updates.append({
            "cod_inmatriculare": doc_id,
            "cod_caen": all_caen,
            "cod_caen_denumire": denumire,
            "caen_sectiune": sectiune,
        })
    log(f"  {len(updates):,} documente de actualizat")

    if args.dry_run:
        log("[5/6] 🔍 Dry-run — distributie pe sectiuni CAEN:")
        from collections import Counter
        sect_dist = Counter(u["caen_sectiune"] for u in updates if u["caen_sectiune"])
        for sect, count in sect_dist.most_common():
            pct = count / len(updates) * 100
            log(f"    Sectiunea {sect}: {count:,} ({pct:.1f}%)")
        for s in updates[:3]:
            log(f"    Ex: {s['cod_inmatriculare']} → CAEN {s['cod_caen']} = {s['cod_caen_denumire']} ({s['caen_sectiune']})")
        log(f"  Total: {len(updates):,} entries")
        return

    # ── Step 5: Update Meilisearch ──
    log("[5/6] Conectare la Meilisearch...")
    client = Client(url=MEILISEARCH_HOST, api_key=MEILISEARCH_API_KEY)

    try:
        client.index(INDEX_NAME).get_stats()
    except Exception:
        log(f"EROARE: Indexul '{INDEX_NAME}' nu exista.")
        sys.exit(1)

    log("[6/6] Actualizez codurile CAEN in Meilisearch...")
    batch: list[dict] = []
    total_updated = 0
    errors = 0
    t_start = time.time()

    for doc in updates:
        batch.append(doc)
        if len(batch) >= BATCH_SIZE:
            try:
                client.index(INDEX_NAME).update_documents(batch)
                total_updated += len(batch)
            except Exception as e:
                log(f"  Eroare batch: {e}")
                errors += 1
            batch = []
            elapsed = time.time() - t_start
            if elapsed > 0:
                log(f"  {total_updated:,} / {len(updates):,} ({total_updated / elapsed:.0f}/s)")

    if batch:
        try:
            client.index(INDEX_NAME).update_documents(batch)
            total_updated += len(batch)
        except Exception as e:
            log(f"  Eroare batch final: {e}")
            errors += 1

    elapsed = time.time() - t_start
    log("=" * 50)
    log("REZUMAT CAEN:")
    log(f"  Actualizate: {total_updated:,} firme")
    log(f"  Erori: {errors}")
    log(f"  Durata: {elapsed:.1f}s")
    if elapsed > 0:
        log(f"  Viteza: {total_updated / elapsed:.0f} docs/s")
    log("=" * 50)

    save_state({
        "last_hash": current_hash,
        "last_count": total_updated,
        "last_run": datetime.now(timezone.utc).isoformat(),
    })

    if errors == 0:
        for f in [CACHE_CAEN_FILE, CACHE_NOM_FILE]:
            try:
                f.unlink()
            except Exception:
                pass
        log("🧹 Cache-uri sterse")

    if errors:
        log("⚠️  Au fost erori.")
        sys.exit(1)

    log("✅ Codurile CAEN actualizate cu succes!")


if __name__ == "__main__":
    main()
