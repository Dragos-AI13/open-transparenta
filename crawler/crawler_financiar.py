#!/usr/bin/env python3
"""
Crawler Situații Financiare — descarcă datele financiare ale firmelor din
România de pe data.gov.ro (Ministerul Finanțelor) și le indexează în
Meilisearch.

Usage:
    python crawler_financiar.py                    # Indexează toți anii
    python crawler_financiar.py --ani=2024         # Doar 2024
    python crawler_financiar.py --ani=2023,2024    # Ani specifici
    python crawler_financiar.py --max=1000         # Doar primele 1000 firme
    python crawler_financiar.py --force            # Re-descarcă
    python crawler_financiar.py --dry-run          # Doar descarcă, nu indexează
"""
import argparse
import csv
import hashlib
import json
import os
import re
import sys
import time
import unicodedata
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
INDEX_NAME = "financial"
BATCH_SIZE = 1000
STATE_FILE = Path(__file__).parent / ".financiar_state.json"
CACHE_DIR = Path(__file__).parent / ".financiar_cache"

CKAN_BASE = "https://data.gov.ro"

# ── Indicator mapping ──────────────────────────

# Column I1-I20 → human-readable field name
INDICATOR_MAP = {
    "i1": "active_imobilizate",
    "i2": "active_circulante",
    "i3": "stocuri",
    "i4": "creante",
    "i5": "numerar",
    "i6": "cheltuieli_avans",
    "i7": "datorii",
    "i8": "venituri_avans",
    "i9": "provizioane",
    "i10": "capitaluri_proprii",
    "i11": "capital_subscris",
    "i12": "patrimoniu_regie",
    "i13": "cifra_afaceri",
    "i14": "venituri_totale",
    "i15": "cheltuieli_totale",
    "i16": "profit_brut",
    "i17": "pierdere_bruta",
    "i18": "profit_net",
    "i19": "pierdere_neta",
    "i20": "numar_salariati",
}


# ── Helpers ─────────────────────────────────────


def normalize_romanian(s: str) -> str:
    """Normalize Romanian diacritics: ţ/ş (cedilla) → ț/ș (comma)."""
    return unicodedata.normalize("NFC", s).replace("\u0163", "\u021B").replace("\u015F", "\u0219")


def log(msg: str):
    ts = datetime.now().strftime("%H:%M:%S")
    print(f"[{ts}] {msg}", flush=True)


def parse_int(val: str) -> int | None:
    """Parse a financial value string to int. Returns None if empty/invalid."""
    val = val.strip().replace(",", ".").split(".")[0] if val.strip() else ""
    if not val:
        return None
    try:
        # Valori pot fi negative
        return int(float(val))
    except (ValueError, TypeError):
        return None


# ── CKAN helpers ───────────────────────────────


def find_financiar_datasets() -> list[dict]:
    """Find all 'Situatii financiare' datasets, sorted by year descending."""
    url = f"{CKAN_BASE}/api/3/action/package_search"
    params = {"q": "Situatii financiare", "sort": "metadata_modified desc", "rows": 20}
    resp = requests.get(url, params=params, timeout=30)
    resp.raise_for_status()
    results = resp.json().get("result", {}).get("results", [])

    datasets = []
    for r in results:
        title = r.get("title", "")
        # Match "Situatii financiare 2024", "Situatii financiare 2025" etc.
        match = re.search(r"Situatii financiare (\d{4})", title)
        if match:
            year = int(match.group(1))
            datasets.append({"year": year, "id": r["id"], "title": title})

    # Sort by year descending
    datasets.sort(key=lambda d: d["year"], reverse=True)
    return datasets


def find_resource(dataset: dict, name_contains: str) -> dict | None:
    """Find a resource within a CKAN dataset."""
    url = f"{CKAN_BASE}/api/3/action/package_show?id={dataset['id']}"
    resp = requests.get(url, timeout=30)
    resp.raise_for_status()
    resources = resp.json().get("result", {}).get("resources", [])

    for res in resources:
        if name_contains.upper() in (res.get("name", "")).upper():
            return res
    return None


def get_download_url(resource_id: str) -> str:
    resp = requests.get(
        f"{CKAN_BASE}/api/3/action/resource_show?id={resource_id}", timeout=30
    )
    return resp.json()["result"]["url"]


def download_file(url: str, name: str, cache_path: Path, force: bool) -> bytes:
    """Download a file with caching."""
    if cache_path.exists() and not force:
        log(f"  Cache: {cache_path.name}")
        return cache_path.read_bytes()

    log(f"  Downloading {name}...")
    t0 = time.time()
    resp = requests.get(url, stream=True, timeout=600)
    resp.raise_for_status()
    raw = resp.content
    elapsed = time.time() - t0
    log(f"  {len(raw):,} bytes in {elapsed:.1f}s ({len(raw)/1024/1024/elapsed:.1f} MB/s)")
    cache_path.parent.mkdir(parents=True, exist_ok=True)
    cache_path.write_bytes(raw)
    return raw


def get_nomenclator_mapping(year: int) -> dict[str, str]:
    """Get the I1-I20 → indicator name mapping from nomenclator CSV.

    Returns dict like {"i1": "Cifra de afaceri neta", ...}
    """
    datasets = find_financiar_datasets()
    for ds in datasets:
        if ds["year"] == year:
            # Try to find WEB_UU_AN{year}.csv (the nomenclator, not the data file)
            resource = find_resource(ds, f"WEB_UU_AN{year}.csv")
            if resource and resource.get("size", 0) < 5000:
                url = get_download_url(resource["id"])
                raw = download_file(url, f"WEB_UU_AN{year}.csv", CACHE_DIR / f"nomen_{year}.csv", False)
                text = raw.decode("utf-8-sig")
                mapping = {}
                for line in text.splitlines():
                    parts = line.split(";")
                    if len(parts) >= 2:
                        col_name = parts[1].strip().lower()
                        indicator_label = parts[0].strip()
                        mapping[col_name] = indicator_label
                return mapping
            break
    return {}


# ── State ──────────────────────────────────────


def load_state() -> dict:
    if STATE_FILE.exists():
        try:
            return json.loads(STATE_FILE.read_text())
        except Exception:
            pass
    return {"years_done": [], "last_hash_per_year": {}, "last_count": 0}


def save_state(state: dict):
    STATE_FILE.write_text(json.dumps(state, indent=2, default=str))


# ── Meilisearch ────────────────────────────────

STAGING_INDEX = INDEX_NAME + "_staging"


def prepare_index(client: Client):
    """Create or update index with proper settings."""
    # Create staging
    try:
        client.delete_index(STAGING_INDEX)
        time.sleep(0.5)
    except Exception:
        pass

    client.create_index(STAGING_INDEX, {"primaryKey": "id"})
    time.sleep(1.5)

    idx = client.index(STAGING_INDEX)
    idx.update_settings({
        "searchableAttributes": ["cui"],
        "filterableAttributes": ["cui", "an"],
        "sortableAttributes": ["an", "cifra_afaceri", "profit_net", "numar_salariati"],
    })
    time.sleep(1)

    # Ensure live index exists (with same settings)
    try:
        stats = client.index(INDEX_NAME).get_stats()
        # Check if settings are compatible
        current_settings = client.index(INDEX_NAME).get_settings()
        # If settings mismatch, we'll still swap from staging
    except Exception:
        log(f"Indexul '{INDEX_NAME}' nu exista. Il creez...")
        client.create_index(INDEX_NAME, {"primaryKey": "id"})
        time.sleep(1)
        client.index(INDEX_NAME).update_settings({
            "searchableAttributes": ["cui"],
            "filterableAttributes": ["cui", "an"],
            "sortableAttributes": ["an", "cifra_afaceri", "profit_net", "numar_salariati"],
        })
        time.sleep(1)


def swap_index(client: Client):
    """Swap staging → live atomically."""
    log("🔁 Swap atomic intre indexe...")
    try:
        client.swap_indexes([{"indexes": [INDEX_NAME, STAGING_INDEX]}])
        time.sleep(1)
        log("✅ Swap complet!")
    except Exception as e:
        log(f"⚠️  Eroare la swap: {e}")
        raise


def cleanup_staging(client: Client):
    try:
        client.delete_index(STAGING_INDEX)
        log("🧹 Staging sters")
    except Exception:
        pass


# ── Parse and index ────────────────────────────


def process_year(
    client: Client,
    year: int,
    max_docs: int,
    dry_run: bool,
    force: bool,
    state: dict,
) -> int:
    """Process one year's financial data. Returns count of indexed docs."""

    # 1. Find dataset
    datasets = find_financiar_datasets()
    dataset = None
    for ds in datasets:
        if ds["year"] == year:
            dataset = ds
            break

    if not dataset:
        log(f"❌ Nu am gasit dataset pentru anul {year}")
        return 0

    log(f"\n{'='*50}")
    log(f"Anul {year}: {dataset['title']}")

    # 2. Find UU resource (main file with all companies)
    resource = find_resource(dataset, f"WEB_UU_AN{year}")
    if not resource:
        log(f"❌ Nu am gasit WEB_UU_AN{year}.txt")
        return 0

    resource_id = resource["id"]
    file_size = resource.get("size", 0)
    log(f"  Resursa: WEB_UU_AN{year}.txt ({file_size:,} bytes)")

    # 3. Check state
    current_hash = hashlib.sha256(f"financiar_{year}_{resource_id}".encode()).hexdigest()[:16]
    if not force and state.get("last_hash_per_year", {}).get(str(year)) == current_hash:
        log(f"  Deja actualizat pentru {year}. Use --force sa re-descarci.")
        return state.get("last_count_per_year", {}).get(str(year), 0)

    # 4. Download
    url = get_download_url(resource_id)
    cache_file = CACHE_DIR / f"uu_{year}.txt"
    raw = download_file(url, f"WEB_UU_AN{year}.txt", cache_file, force)

    # 5. Parse CSV
    log("  Parsez CSV...")
    text = raw.decode("utf-8-sig")
    lines = text.splitlines()
    log(f"  Linii: {len(lines):,} (inclusiv header)")

    if len(lines) < 2:
        log("  EROARE: Fisier gol")
        return 0

    reader = csv.DictReader(StringIO(text))
    # Check if header has CUI/CAEN/I1..I20 format
    fieldnames = reader.fieldnames or []

    total = 0
    batch: list[dict] = []
    errors = 0
    t_start = time.time()

    log("  Procesez si indexez...")

    for row in reader:
        cui_raw = (row.get("CUI") or "").strip()
        if not cui_raw:
            continue

        # Normalize CUI: add RO prefix
        try:
            cui_num = int(float(cui_raw))
            cui = f"RO{cui_num}"
        except (ValueError, TypeError):
            continue

        # Build document
        doc = {
            "id": f"{cui}_{year}",
            "cui": cui,
            "an": year,
        }

        # Parse CAEN if present
        caen_raw = (row.get("CAEN") or "").strip()
        if caen_raw:
            doc["caen"] = caen_raw

        # Parse I1-I20 indicators
        has_data = False
        for col_name, field_name in INDICATOR_MAP.items():
            if col_name in row or col_name.upper() in row:
                raw_val = row.get(col_name) or row.get(col_name.upper()) or ""
                val = parse_int(raw_val)
                if val is not None:
                    doc[field_name] = val
                    if val != 0:
                        has_data = True

        if not has_data:
            continue  # Skip companies with no financial data

        batch.append(doc)
        total += 1

        if len(batch) >= BATCH_SIZE:
            if not dry_run:
                try:
                    client.index(STAGING_INDEX).add_documents(batch)
                except Exception as e:
                    log(f"  Eroare batch: {e}")
                    errors += 1
            batch = []
            elapsed = time.time() - t_start
            if elapsed > 0 and total % 10000 == 0:
                log(f"  {total:,} firme ({total/elapsed:.0f}/s)")

        if max_docs and total >= max_docs:
            log(f"  Limita --max={max_docs} atinsa")
            break

    # Final batch
    if batch and not dry_run:
        try:
            client.index(STAGING_INDEX).add_documents(batch)
        except Exception as e:
            log(f"  Eroare batch final: {e}")
            errors += 1

    elapsed = time.time() - t_start
    log(f"  Total: {total:,} firme procesate in {elapsed:.1f}s")
    if total > 0 and elapsed > 0:
        log(f"  Viteza: {total/elapsed:.0f} docs/s")

    if errors:
        log(f"  ⚠️  Erori: {errors}")

    # Update state
    if not dry_run and errors == 0:
        state.setdefault("last_hash_per_year", {})[str(year)] = current_hash
        state.setdefault("last_count_per_year", {})[str(year)] = total
        state["last_count"] = state.get("last_count", 0) + total

    return total


# ── Main ────────────────────────────────────────


def main():
    parser = argparse.ArgumentParser(
        description="Crawler Situații Financiare — Ministerul Finanțelor"
    )
    parser.add_argument("--ani", type=str, default="",
                        help="Ani de procesat, separated by comma (ex: 2024,2025)")
    parser.add_argument("--max", type=int, default=0, help="Max firme per an (0=all)")
    parser.add_argument("--force", action="store_true", help="Re-descarca fisiere")
    parser.add_argument("--dry-run", action="store_true", help="Doar descarca, nu indexeaza")
    args = parser.parse_args()

    # ── Discover years ──
    available_datasets = find_financiar_datasets()
    if not available_datasets:
        log("EROARE: Nu am gasit niciun dataset 'Situatii financiare' pe data.gov.ro")
        sys.exit(1)

    log(f"Am gasit {len(available_datasets)} ani disponibili:")
    for ds in available_datasets:
        log(f"  {ds['year']}: {ds['title']}")

    # Parse requested years
    if args.ani:
        requested_years = [int(y.strip()) for y in args.ani.split(",")]
        years = [ds for ds in available_datasets if ds["year"] in requested_years]
        if not years:
            log(f"EROARE: Nu am gasit date pentru anii: {args.ani}")
            sys.exit(1)
    else:
        # Default: newest first (up to 3 most recent)
        years = available_datasets[:3]
        log(f"\nDefault: procesez ultimii {len(years)} ani")

    # ── Prepare ──
    state = load_state()
    total_all_years = 0
    years_done = []

    if not args.dry_run:
        log("\nPregatesc indexul Meilisearch...")
        client = Client(url=MEILISEARCH_HOST, api_key=MEILISEARCH_API_KEY)
        prepare_index(client)
    else:
        client = None

    # ── Process each year ──
    for ds in years:
        year = ds["year"]
        try:
            count = process_year(client, year, args.max, args.dry_run, args.force, state)
            if count > 0:
                total_all_years += count
                years_done.append(year)
        except Exception as e:
            log(f"❌ Eroare la procesarea anului {year}: {e}")
            import traceback
            traceback.print_exc()

    # ── Swap ──
    if not args.dry_run and client and total_all_years > 0:
        log(f"\n{'='*50}")
        log(f"Total: {total_all_years:,} documente in {len(years_done)} ani")
        swap_index(client)
        cleanup_staging(client)

        # Update state
        state["years_done"] = list(set(state.get("years_done", []) + years_done))
        state["last_run"] = datetime.now(timezone.utc).isoformat()
        save_state(state)
        log(f"✅ State salvat")

        # Stats
        stats = client.index(INDEX_NAME).get_stats()
        log(f"Index „{INDEX_NAME}”: {stats.numberOfDocuments:,} documente")
    elif args.dry_run:
        log(f"\n{'='*50}")
        log(f"🔍 Dry-run: {total_all_years:,} documente gata de indexat")
        log(f"   Ani: {', '.join(str(y) for y in years_done)}")
    else:
        log("\n⚠️  Niciun document nou de indexat.")

    # Cleanup old cache files (keep last 2)
    if CACHE_DIR.exists():
        for f in sorted(CACHE_DIR.iterdir(), key=lambda f: f.stat().st_mtime)[:-4]:
            try:
                f.unlink()
            except Exception:
                pass


if __name__ == "__main__":
    main()
