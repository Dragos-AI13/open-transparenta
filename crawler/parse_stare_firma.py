#!/usr/bin/env python3
"""
Parse OD_STARE_FIRMA.CSV from the ONRC dataset and populate the `stare`
field for all 4.2M companies in the Meilisearch index.

Usage:
    python parse_stare_firma.py                  # Parse + update
    python parse_stare_firma.py --max=10000      # Only first 10k
    python parse_stare_firma.py --force           # Re-download even if cached
    python parse_stare_firma.py --dry-run         # Preview only, no writes

Note:
    OD_STARE_FIRMA.CSV has columns: COD_INMATRICULARE, COD
    N_STARE_FIRMA.CSV maps COD → DENUMIRE (starea efectivă)
    We take the LAST row per COD_INMATRICULARE (most recent state).
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
STATE_FILE = Path(__file__).parent / ".stare_state.json"
CACHE_STARE_FILE = Path(__file__).parent / ".stare_cache.csv"
CACHE_NOM_FILE = Path(__file__).parent / ".stare_nomenclator_cache.csv"

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
    """Find the latest ONRC 'Firme' dataset."""
    url = f"{CKAN_BASE}/api/3/action/package_search"
    params = {"q": "onrc", "sort": "metadata_modified desc", "rows": 15}
    resp = requests.get(url, params=params, timeout=30)
    resp.raise_for_status()
    results = resp.json().get("result", {}).get("results", [])

    for r in results:
        title = r.get("title", "")
        if "Firme" in title and ("Registrul Comertului" in title
                                  or "Registrul Comerțului" in title):
            return r
    return None


def find_resource(dataset: dict, name_contains: str) -> dict | None:
    """Find a resource by name substring."""
    for res in dataset.get("resources", []):
        if name_contains.upper() in (res.get("name", "")).upper():
            return res
    return None


def find_nomenclator_dataset() -> dict | None:
    """Find the latest Nomenclatoare dataset containing N_STARE_FIRMA."""
    url = f"{CKAN_BASE}/api/3/action/package_search"
    params = {"q": "Nomenclatoare", "sort": "metadata_modified desc", "rows": 5}
    resp = requests.get(url, params=params, timeout=30)
    resp.raise_for_status()
    results = resp.json().get("result", {}).get("results", [])

    for r in results:
        title = r.get("title", "")
        if "Nomenclatoare" in title:
            for res in r.get("resources", []):
                if "N_STARE_FIRMA" in (res.get("name", "")).upper():
                    return r
    return None


def get_download_url(resource_id: str) -> str:
    url = f"{CKAN_BASE}/api/3/action/resource_show?id={resource_id}"
    resp = requests.get(url, timeout=30)
    resp.raise_for_status()
    return resp.json()["result"]["url"]


def download_csv(url: str, name: str, cache_path: Path, force: bool) -> bytes:
    """Download a CSV, with caching."""
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
        description="Parse OD_STARE_FIRMA.CSV and update Meilisearch"
    )
    parser.add_argument("--max", type=int, default=0, help="Max entries (0=all)")
    parser.add_argument("--force", action="store_true", help="Ignore cache")
    parser.add_argument("--dry-run", action="store_true", help="No writes")
    args = parser.parse_args()

    # ── Step 1: Download nomenclator N_STARE_FIRMA.CSV ──
    log("[1/5] Incarc nomenclatorul N_STARE_FIRMA...")
    nom_dataset = find_nomenclator_dataset()
    if not nom_dataset:
        log("EROARE: Nu am gasit Nomenclatoare dataset")
        sys.exit(1)

    nom_resource = find_resource(nom_dataset, "N_STARE_FIRMA")
    if not nom_resource:
        log("EROARE: Nu am gasit N_STARE_FIRMA.CSV in nomenclator")
        sys.exit(1)

    nom_url = get_download_url(nom_resource["id"])
    nom_raw = download_csv(nom_url, "N_STARE_FIRMA.CSV", CACHE_NOM_FILE, args.force)
    nom_text = nom_raw.decode("utf-8-sig")
    nom_reader = csv.DictReader(StringIO(nom_text), delimiter="^")

    # Build COD → DENUMIRE mapping
    cod_to_stare: dict[str, str] = {}
    for row in nom_reader:
        cod = (row.get("COD") or "").strip()
        denumire = normalize_romanian((row.get("DENUMIRE") or "").strip().capitalize())
        if cod and denumire:
            cod_to_stare[cod] = denumire
    log(f"  Nomenclator: {len(cod_to_stare):,} coduri de stare incarcate")

    # ── Step 2: Download OD_STARE_FIRMA.CSV ──
    log("[2/5] Caut OD_STARE_FIRMA.CSV in cel mai recent dataset ONRC...")
    dataset = find_latest_onrc_dataset()
    if not dataset:
        log("EROARE: Nu am gasit dataset-ul ONRC")
        sys.exit(1)

    stare_resource = find_resource(dataset, "OD_STARE_FIRMA")
    if not stare_resource:
        log("EROARE: Nu am gasit OD_STARE_FIRMA.CSV")
        sys.exit(1)

    log(f"  Gasit: {stare_resource.get('name', 'OD_STARE_FIRMA.CSV')} "
        f"({stare_resource.get('size', 0):,} bytes)")

    # Check hash to skip if unchanged
    resource_id = stare_resource["id"]
    current_hash = hashlib.sha256(
        f"stare_{resource_id}_{nom_resource['id']}".encode()
    ).hexdigest()[:16]
    state = load_state()

    if not args.force and state.get("last_hash") == current_hash:
        log(f"  Deja actualizat ({state.get('last_count', 0):,} entries). "
            "Use --force sa re-descarci.")
        return

    url = get_download_url(resource_id)
    raw = download_csv(url, "OD_STARE_FIRMA.CSV", CACHE_STARE_FILE, args.force)

    # ── Step 3: Parse CSV ──
    log("[3/5] Parsez si grupez dupa COD_INMATRICULARE...")
    text = raw.decode("utf-8-sig")
    lines = text.splitlines()
    log(f"  Linii: {len(lines):,} (inclusiv header)")

    if len(lines) < 2:
        log("EROARE: Fisier gol")
        sys.exit(1)

    reader = csv.DictReader(StringIO(text), delimiter="^")

    # Group by COD_INMATRICULARE → take LAST entry (most recent)
    latest_stare: dict[str, str] = {}
    total_rows = 0
    for row in reader:
        cod_inmat = (row.get("COD_INMATRICULARE") or "").strip()
        cod_stare = (row.get("COD") or "").strip()

        if not cod_inmat or not cod_stare:
            continue

        # Map to human-readable stare
        stare = cod_to_stare.get(cod_stare, f"Cod {cod_stare}")

        # Document ID format matching crawler_onrc.py
        doc_id = cod_inmat.replace("/", "-").replace("\\", "-")

        # Overwrite on each occurrence → last one wins
        latest_stare[doc_id] = stare
        total_rows += 1

        if args.max and len(latest_stare) >= args.max:
            break

    log(f"  {total_rows:,} randuri → {len(latest_stare):,} firme unice")

    if not latest_stare:
        log("EROARE: Niciun rand valid")
        sys.exit(1)

    # ── Step 4: Preview (dry-run) ──
    if args.dry_run:
        log("[4/5] 🔍 Dry-run — nu fac scriere")
        # Show distribution
        from collections import Counter
        dist = Counter(latest_stare.values())
        log(f"  Distributie stare (top 15):")
        for stare, count in dist.most_common(15):
            pct = count / len(latest_stare) * 100
            log(f"    {stare}: {count:,} ({pct:.1f}%)")
        sample = list(latest_stare.items())[:5]
        for doc_id, stare in sample:
            log(f"    Exemplu: {doc_id} → {stare}")
        log(f"  Total: {len(latest_stare):,} entries")
        return

    # ── Step 5: Update Meilisearch ──
    log("[4/5] Conectare la Meilisearch...")
    client = Client(url=MEILISEARCH_HOST, api_key=MEILISEARCH_API_KEY)

    try:
        client.index(INDEX_NAME).get_stats()
    except Exception:
        log(f"EROARE: Indexul '{INDEX_NAME}' nu exista. Ruleaza intai crawler_onrc.py")
        sys.exit(1)

    log("[5/5] Actualizez stare in Meilisearch...")
    batch: list[dict] = []
    total_updated = 0
    errors = 0
    t_start = time.time()

    for doc_id, stare in latest_stare.items():
        batch.append({
            "cod_inmatriculare": doc_id,
            "stare": stare,
        })

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
                log(f"  {total_updated:,} / {len(latest_stare):,} "
                    f"({total_updated / elapsed:.0f}/s)")

    if batch:
        try:
            client.index(INDEX_NAME).update_documents(batch)
            total_updated += len(batch)
        except Exception as e:
            log(f"  Eroare batch final: {e}")
            errors += 1

    elapsed = time.time() - t_start
    log("=" * 50)
    log("REZUMAT STARE:")
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

    # Cleanup cache on success
    if errors == 0:
        for f in [CACHE_STARE_FILE, CACHE_NOM_FILE]:
            try:
                f.unlink()
            except Exception:
                pass
        log("🧹 Cache-uri sterse")

    if errors:
        log("⚠️  Au fost erori. Verifica log-urile.")
        sys.exit(1)

    log("✅ Stare firmelor actualizata cu succes!")


if __name__ == "__main__":
    main()
