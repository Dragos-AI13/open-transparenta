#!/usr/bin/env python3
"""
Crawler BNR — curs valutar zilnic (API XML public, fără auth).

Descarcă cursul de schimb BNR pentru ziua curentă și îl indexează în Meilisearch.

Sursă: https://www.bnr.ro/nbrfxrates.xml

Structură XML:
    <DataSet>
      <Header><PublishingDate>2026-07-31</PublishingDate></Header>
      <Body>
        <Cube date="2026-07-31">
          <Rate currency="EUR">5.2473</Rate>
          <Rate currency="HUF" multiplier="100">1.4420</Rate>
        </Cube>
      </Body>
    </DataSet>

Note spike (2026-08-01):
- Parametrul ?data=YYYYMMDD e IGNORAT de BNR (întoarce mereu ziua curentă)
- Fișierele anuale nbrfxrates{YYYY}.xml → 502 (nu mai sunt expuse)
- → Crawler-ul acumulează istoricul singur: rulează zilnic (cron), documentele
  au id = {VALUTA}_{DATA}, deci re-rulează = upsert idempotent

Usage:
    python crawler_bnr.py              # Indexează cursul zilei
    python crawler_bnr.py --dry-run    # Doar descarcă + parsează, nu indexează
"""

import argparse
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
INDEX_NAME = "curs_valutar"
BATCH_SIZE = 200
STATE_FILE = Path(__file__).parent / ".crawler_state.json"

FX_URL = "https://www.bnr.ro/nbrfxrates.xml"
HEADERS = {
    "User-Agent": "OpenTransparentaBot/1.0 (+https://github.com/Dragos-AI13/open-transparenta; date publice BNR)",
    "Accept": "application/xml,text/xml,*/*",
}

# Denumiri oficiale pentru valutele principale (pentru afișare)
CURRENCY_NAMES = {
    "AED": "Dirham EAU", "AUD": "Dolar australian", "BRL": "Real brazilian",
    "CAD": "Dolar canadian", "CHF": "Franc elvețian", "CNY": "Yuan chinezesc",
    "CZK": "Coroană cehă", "DKK": "Coroană daneză", "EGP": "Liră egipteană",
    "EUR": "Euro", "GBP": "Liră sterlină", "HKD": "Dolar Hong Kong",
    "HUF": "Forint maghiar", "IDR": "Rupie indoneziană", "ILS": "Șekel israelian",
    "INR": "Rupie indiană", "ISK": "Coroană islandeză", "JPY": "Yen japonez",
    "KRW": "Won sud-coreean", "MDL": "Leu moldovenesc", "MXN": "Peso mexican",
    "NOK": "Coroană norvegiană", "NZD": "Dolar neo-zeelandez", "PHP": "Peso filipinez",
    "PLN": "Zlot polonez", "RSD": "Dinar sârb", "RUB": "Rublă rusească",
    "SEK": "Coroană suedeză", "SGD": "Dolar Singapore", "THB": "Baht thailandez",
    "TRY": "Liră turcească", "MYR": "Ringgit malaysian", "UAH": "Hrivnă ucraineană", "USD": "Dolar american", "XAU": "Aur (gram)",
    "XDR": "Drepturi speciale de tragere", "ZAR": "Rand sud-african",
}


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
    return {"bnr_last_date": None, "bnr_last_count": 0}


def save_state(state: dict):
    STATE_FILE.write_text(json.dumps(state, indent=2, default=str))


# ── Fetch + parse ──────────────────────────────

def fetch_fx() -> tuple[str, str, list[dict]] | None:
    """Descarcă și parsează XML-ul BNR. Returnează (data, valute) sau None."""
    resp = requests.get(FX_URL, headers=HEADERS, timeout=30)
    if resp.status_code != 200:
        log(f"HTTP {resp.status_code} de la BNR")
        return None

    try:
        root = ET.fromstring(resp.content)
    except ET.ParseError as e:
        log(f"XML invalid: {e}")
        return None

    # Namespace din XML
    ns = ""
    if root.tag.startswith("{"):
        ns = root.tag.split("}")[0] + "}"

    pub_el = root.find(f".//{ns}PublishingDate")
    cube_el = root.find(f".//{ns}Cube")
    if cube_el is None:
        log("Nu am găsit <Cube> în XML")
        return None

    data = cube_el.get("date", "")
    rates = []
    for rate in cube_el.findall(f"{ns}Rate"):
        valuta = rate.get("currency", "")
        if not valuta:
            continue
        multiplier = int(rate.get("multiplier", "1") or "1")
        try:
            valoare = float(rate.text.strip())
        except (ValueError, AttributeError):
            continue
        rates.append({
            "valuta": valuta,
            "denumire": CURRENCY_NAMES.get(valuta, valuta),
            "multiplier": multiplier,
            # valoarea reală = rate × multiplier (ex. HUF: 1.4420 × 100 = 144.20)
            "rata": valoare * multiplier,
            "rata_bruta": valoare,
        })

    pub = pub_el.text.strip() if pub_el is not None else data
    return pub, data, rates


def build_docs(data: str, rates: list[dict]) -> list[dict]:
    """Construiește documentele Meilisearch: unul per (valută, dată)."""
    docs = []
    for r in rates:
        docs.append({
            "id": f"{r['valuta']}_{data}",
            "valuta": r["valuta"],
            "denumire": r["denumire"],
            "data": data,
            "rata": r["rata"],
            "rata_bruta": r["rata_bruta"],
            "multiplier": r["multiplier"],
        })
    return docs


# ── Meilisearch ────────────────────────────────

STAGING_INDEX = INDEX_NAME + "_staging"


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
        "searchableAttributes": ["valuta", "denumire"],
        "filterableAttributes": ["valuta", "data"],
        "sortableAttributes": ["data"],
    })
    time.sleep(1)
    try:
        client.index(INDEX_NAME).get_stats()
    except Exception:
        log("Indexul live nu există. Îl creez...")
        client.create_index(INDEX_NAME, {"primaryKey": "id"})
        time.sleep(1)
        client.index(INDEX_NAME).update_settings({
            "searchableAttributes": ["valuta", "denumire"],
            "filterableAttributes": ["valuta", "data"],
            "sortableAttributes": ["data"],
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
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()

    state = load_state()

    log("Descarc cursul BNR...")
    result = fetch_fx()
    if result is None:
        log("Eroare: nu pot descărca cursul BNR. Ies.")
        sys.exit(1)

    pub_date, cube_date, rates = result
    log(f"Publicare: {pub_date} | Cube date: {cube_date} | {len(rates)} valute")

    if not args.force and state.get("bnr_last_date") == cube_date:
        log(f"Cursul pentru {cube_date} e deja indexat. Folosește --force pentru re-crawl.")
        return

    docs = build_docs(cube_date, rates)
    log(f"Documente de indexat: {len(docs)}")

    client = get_ms_client()
    prepare_staging_index(client)
    target = client.index(STAGING_INDEX)

    t0 = time.time()
    for i in range(0, len(docs), BATCH_SIZE):
        batch = docs[i:i + BATCH_SIZE]
        if not args.dry_run:
            target.add_documents(batch)
    log(f"Indexat în {time.time() - t0:.1f}s")

    if not args.dry_run and docs:
        swap_indexes(client)
        state["bnr_last_date"] = cube_date
        state["bnr_last_count"] = len(docs)
        save_state(state)
        log("State salvat")
    elif args.dry_run:
        log("Dry-run: nu am indexat nimic")


def get_ms_client() -> Client:
    return Client(url=MEILISEARCH_HOST, api_key=MEILISEARCH_API_KEY)


if __name__ == "__main__":
    main()
