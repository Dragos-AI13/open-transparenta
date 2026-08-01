#!/usr/bin/env python3
"""
Crawler Bugetul de Stat — XML Ministerul Finanțelor (data.gov.ro).

Descarcă pachetele „Bugetul de stat {an}" (2023-2025) și indexează în
Meilisearch sinteza veniturilor și cheltuielilor pe capitole.

Sursă: data.gov.ro — organizația mfp, pachete „Bugetul de stat {an}",
fișierul `anexa1_bs_{an}.xml` (sinteza pe capitole).

Structură XML (verificat 2026-08-01):
- Encoding: ISO-8859-2 (NU UTF-8)
- Valori în MII LEI
- Rânduri: <G_TITLU_RAPORT> cu CAPITOL, SUBCAPITOL, DENUMIRE,
  PROGRAM_2025, ESTIMARI2026-2028
- Venituri: capitole 0001-4999, valoarea direct pe rândul capitolului
  (ex. cap 0001 = "VENITURI - TOTAL" = 357.353.033)
- Cheltuieli: capitole 5000+, valoarea pe rândul „II.Credite bugetare"
  cu GRUPA gol (total funcțiune, ex. cap 6501 INVATAMANT = 60.295.342)
- DEFICIT: cap 9901

Usage:
    python crawler_buget.py              # Indexează 2023-2025
    python crawler_buget.py --dry-run    # Doar descarcă, nu indexează
    python crawler_buget.py --max=1      # Doar primul an
"""

import argparse
import hashlib
import json
import os
import sys
import time
import xml.etree.ElementTree as ET
from datetime import datetime
from pathlib import Path

import requests
from dotenv import load_dotenv
from meilisearch import Client

# ── Config ─────────────────────────────────────

load_dotenv(Path(__file__).resolve().parent.parent / "frontend" / ".env")

MEILISEARCH_HOST = os.getenv("MEILISEARCH_HOST", "http://localhost:7700")
MEILISEARCH_API_KEY = os.getenv("MEILISEARCH_API_KEY", "")
INDEX_NAME = "buget_stat"
BATCH_SIZE = 500
STATE_FILE = Path(__file__).parent / ".crawler_state.json"

CKAN_API = "https://data.gov.ro/api/3/action/package_search"
HEADERS = {
    "User-Agent": "OpenTransparentaBot/1.0 (+https://github.com/Dragos-AI13/open-transparenta; date publice MF)",
    "Accept": "application/xml,text/xml,*/*",
}

# Anii bugetari de procesat
YEARS = [2023, 2024, 2025]


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
    return {"buget_hash": None, "buget_count": 0}


def save_state(state: dict):
    STATE_FILE.write_text(json.dumps(state, indent=2, default=str))


# ── CKAN discovery ─────────────────────────────

def find_budget_package(year: int) -> str | None:
    """Găsește pachetul 'Bugetul de stat {year}' pe data.gov.ro, returnează id."""
    try:
        resp = requests.get(
            CKAN_API,
            params={"q": f"Bugetul de stat {year}", "rows": 5},
            headers=HEADERS,
            timeout=30,
        )
        resp.raise_for_status()
        results = resp.json()["result"]["results"]
        # Titlurile pot fi „Bugetul de stat 2025" sau „Bugetul de stat - 2024"
        # → normalizez: scot cratimele și spațiile
        normalized = {pkg["id"]: pkg.get("title", "") for pkg in results}
        for pkg in results:
            title = pkg.get("title", "").lower().replace("-", "").replace("–", "").replace(" ", "")
            if title == f"bugetuldestat{year}".lower().replace(" ", ""):
                return pkg["id"]
        # Fallback: conține „bugetul de stat {year}"
        for pkg in results:
            title = pkg.get("title", "").lower()
            if f"bugetul de stat {year}" in title or f"bugetul de stat - {year}" in title:
                return pkg["id"]
    except Exception as e:
        log(f"  CKAN error: {e}")
    return None


def find_anexa1_url(package_id: str) -> str | None:
    """Din pachet, găsește URL-ul fișierului anexa1 (sinteza)."""
    try:
        resp = requests.get(
            f"https://data.gov.ro/api/3/action/package_show?id={package_id}",
            headers=HEADERS,
            timeout=30,
        )
        resp.raise_for_status()
        for res in resp.json()["result"]["resources"]:
            name = res.get("name", "").lower()
            url = res.get("url", "").lower()
            fmt = res.get("format", "").lower()
            # Numele resursei e „Bugetul de stat, pe anii 2025-2028 – sinteza"
            # iar URL-ul conține anexa1_bs_{an}.xml
            if "anexa1" in url and fmt in ("xml", "xls", "xlsx"):
                return res["url"]
            if "sinteza" in name and "venit" in name:
                return res["url"]
        # fallback: orice fișier cu anexa1 în nume
        for res in resp.json()["result"]["resources"]:
            name = res.get("name", "").lower()
            if "anexa1" in name:
                return res["url"]
    except Exception as e:
        log(f"  package_show error: {e}")
    return None


# ── Parsing ────────────────────────────────────

def parse_num(val: str | None) -> float | None:
    """'357.353.033' → 357353033.0 (mii lei). None dacă gol/invalid."""
    if not val or not val.strip():
        return None
    try:
        return float(val.strip().replace(".", "").replace(",", "."))
    except ValueError:
        return None


def parse_budget_xml(content: bytes, year: int) -> list[dict]:
    """Parsează anexa1 XML → documente Meilisearch."""
    # Encoding ISO-8859-2 (important!)
    text = content.decode("iso-8859-2")
    root = ET.fromstring(text)

    # Coloanele depind de an: PROGRAM_2024, ESTIMARI2025... (nu doar 2025)
    col_program = f"PROGRAM_{year}"
    col_e1 = f"ESTIMARI{year + 1}"
    col_e2 = f"ESTIMARI{year + 2}"
    col_e3 = f"ESTIMARI{year + 3}"

    rows = root.findall(".//G_TITLU_RAPORT")
    docs = []
    venituri_total = None
    cheltuieli_total = None

    for r in rows:
        cap = (r.findtext("CAPITOL") or "").strip()
        sub = (r.findtext("SUBCAPITOL") or "").strip()
        par = (r.findtext("PARAGRAF") or "").strip()
        grupa = (r.findtext("GRUPA") or "").strip()
        art = (r.findtext("ARTICOL") or "").strip()
        den = (r.findtext("DENUMIRE") or "").strip()
        prog = parse_num(r.findtext(col_program))
        if not cap or not den or prog is None:
            continue

        # Nivel "total" = rândul de sinteză al capitolului (fără detalii)
        nivel = "total" if (sub == "" and par == "" and grupa == "" and art == "") else "detalii"

        if cap < "5000":
            # ── VENITURI: valoarea direct pe rândul capitolului ──
            # Id unic: ierarhie + denumire (I.Credite de angajament vs II.Credite bugetare)
            hier = f"{cap}.{sub}.{par}.{grupa}.{art}|{den}"
            uid = hashlib.sha1(f"v{year}|{hier}".encode()).hexdigest()[:16]
            docs.append({
                "id": uid,
                "an": year,
                "denumire": den,
                "capitol": cap,
                "subcapitol": sub,
                "nivel": nivel,
                "tip": "venituri",
                "valoare": prog,  # mii lei
                "estimari_1": parse_num(r.findtext(col_e1)),
                "estimari_2": parse_num(r.findtext(col_e2)),
                "estimari_3": parse_num(r.findtext(col_e3)),
            })
            if den.upper() == "VENITURI - TOTAL":
                venituri_total = prog
        elif cap == "9901":
            # ── DEFICIT ──
            docs.append({
                "id": f"deficit_{year}",
                "an": year,
                "denumire": den,
                "capitol": cap,
                "subcapitol": sub,
                "nivel": "total",
                "tip": "deficit",
                "valoare": prog,
                "estimari_1": parse_num(r.findtext(col_e1)),
                "estimari_2": parse_num(r.findtext(col_e2)),
                "estimari_3": parse_num(r.findtext(col_e3)),
            })
        else:
            # ── CHELTUIELI: doar rândul de TOTAL al capitolului
            # („II.Credite bugetare" cu sub/par/grupa/art goale)
            if (
                "Credite bugetare" in den
                and grupa == ""
                and sub == ""
                and par == ""
                and art == ""
            ):
                docs.append({
                    "id": f"c{cap}_{year}",
                    "an": year,
                    "denumire": den,
                    "capitol": cap,
                    "subcapitol": sub,
                    "nivel": "total",
                    "tip": "cheltuieli",
                    "valoare": prog,
                    "estimari_1": parse_num(r.findtext(col_e1)),
                    "estimari_2": parse_num(r.findtext(col_e2)),
                    "estimari_3": parse_num(r.findtext(col_e3)),
                })
                if cap == "5001":
                    cheltuieli_total = prog

    log(f"  {year}: {len(docs)} rânduri ({'venituri: ' + str(venituri_total) if venituri_total else ''} / {'cheltuieli: ' + str(cheltuieli_total) if cheltuieli_total else ''})")
    return docs


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
        "searchableAttributes": ["denumire"],
        "filterableAttributes": ["an", "tip", "capitol", "nivel"],
        "sortableAttributes": ["an", "valoare"],
    })
    time.sleep(1)
    try:
        client.index(INDEX_NAME).get_stats()
    except Exception:
        log("Indexul live nu există. Îl creez...")
        client.create_index(INDEX_NAME, {"primaryKey": "id"})
        time.sleep(1)
        client.index(INDEX_NAME).update_settings({
            "searchableAttributes": ["denumire"],
            "filterableAttributes": ["an", "tip", "capitol", "nivel"],
            "sortableAttributes": ["an", "valoare"],
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
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--max", type=int, default=None, help="Max ani de procesat")
    args = parser.parse_args()

    years = YEARS[: args.max] if args.max else YEARS
    log(f"Procesez anii: {years}")

    all_docs = []
    for year in years:
        log(f"Găsesc pachetul 'Bugetul de stat {year}'...")
        pkg_id = find_budget_package(year)
        if not pkg_id:
            log(f"  Nu am găsit pachetul pentru {year} — sar peste")
            continue
        url = find_anexa1_url(pkg_id)
        if not url:
            log(f"  Nu am găsit anexa1 pentru {year} — sar peste")
            continue
        log(f"  Descarc: {url[-60:]}")
        resp = requests.get(url, headers=HEADERS, timeout=60)
        if resp.status_code != 200:
            log(f"  HTTP {resp.status_code} — sar peste")
            continue
        docs = parse_budget_xml(resp.content, year)
        all_docs.extend(docs)
        time.sleep(1)

    log(f"Total documente: {len(all_docs)}")

    if not all_docs:
        log("Nicio dată extrasă — verifică sursa. Ies.")
        sys.exit(1)

    client = get_ms_client()
    prepare_staging_index(client)
    target = client.index(STAGING_INDEX)

    t0 = time.time()
    for i in range(0, len(all_docs), BATCH_SIZE):
        batch = all_docs[i:i + BATCH_SIZE]
        if not args.dry_run:
            task = target.add_documents(batch)
            # Așteaptă finalizarea indexing-ului înainte de swap (evită pierderi)
            try:
                client.wait_for_task(task.task_uid, timeout_in_ms=30000)
            except Exception:
                time.sleep(2)
    log(f"Indexat în {time.time() - t0:.1f}s")

    if not args.dry_run:
        swap_indexes(client)
        save_state({"buget_hash": datetime.now().strftime("%Y%m%d"), "buget_count": len(all_docs)})
        log("State salvat")
    else:
        log("Dry-run: nu am indexat nimic")


if __name__ == "__main__":
    main()
