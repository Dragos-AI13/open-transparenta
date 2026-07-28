# Ticket 2.8 — Crawler ONRC: descărcare + indexare firme

**ID:** TICKET-2.8
**Status:** ✅ Done
**Feature:** 2 — 🏢 Registrul Comerțului (ONRC)
**Dependențe:** TICKET-2.7 (Meilisearch client)

## Descriere

Crearea unui crawler Python care descarcă dump-ul lunar ONRC (Registrul Comerțului) de pe data.gov.ro, parsează fișierul CSV și indexează toate firmele în Meilisearch. La rulări ulterioare, face **upsert** — adaugă/modifică doar ce s-a schimbat, nu dublează.

**NU** hardcodăm 50 de firme fake. Luăm date reale, complete.

---

## Flux

```
ONRC dump CSV (data.gov.ro)  →  Download + unzip  →  Parsare CSV  →  Upsert Meilisearch
                                                                       ↓
                                                              Incremental: CUI = primary key
                                                              → firme noi: se adaugă
                                                              → firme modificate: se updat
```

## Cerințe

- [ ] Script Python `crawler/crawler_onrc.py` care:
  - Identifică cel mai recent fișier ONRC pe data.gov.ro (API CKAN search)
  - Descarcă arhiva CSV
  - Parsează stream (nu încarcă tot în RAM)
  - Trimite în Meilisearch în bulk-uri de câte 1000 de firme
  - Upsert pe CUI (primary key) — fără ștergerea indexului
- [ ] Scriptul e **idempotent**: rulează de 2x, aceleași date (doar upsert, fără duplicate)
- [ ] Scriptul ține un log local: câte firme noi, câte actualizate, cât a durat
- [ ] Comandă în `package.json` pentru rulare rapidă (`"crawl:onrc": "cd ../crawler && python crawler_onrc.py"`)
- [ ] `.env` citit de script (MEILISEARCH_HOST, MEILISEARCH_API_KEY)
- [ ] Se poate limita numărul de linii procesate (`--max=1000` pentru teste rapide)

## Fișiere

| Acțiune | Fișier |
|---------|--------|
| ➕ Creează | `crawler/crawler_onrc.py` |
| ➕ Creează | `crawler/requirements.txt` (actualizat) |
| 🔧 Editează | `frontend/package.json` |
| 🔧 Editează | `.env.example` |

## Detalii tehnice

### Sursa datelor

ONRC publică pe data.gov.ro la organizația `onrc`. Căutăm setul „Firme" (cel mai recent dump CSV). API CKAN search:
```
https://data.gov.ro/api/3/action/package_search?q=onrc+firme&sort=metadata_modified+desc
```

Din răspuns extragem URL-ul resursei CSV, apoi descărcăm.

Alternativ: URL direct cunoscut (dacă e stabil) — setăm fallback.

### Structura fișierului CSV

Coloanele din dump-ul ONRC (variază ușor între luni, dar în general):
```
CUI,Denumire,FormaJuridica,Stare,Adresa,Localitate,Judet,
CodCAEN,DenumireCAEN,Telefon,Email,Website,DataInfiintare,NrRegComert
```

### Upsert strategy

```python
def index_batch(docs: list[dict], meilisearch_client):
    """Adaugă sau actualizează documentele în batch."""
    response = client.index("companies").add_documents(docs)
    # Meilisearch face upsert pe primaryKey (cui)
    # Dacă cui există → update, dacă nu → insert
```

Nu ștergem indexul înainte. Nu pierdem nicio firmă. Nu duplicăm.

### Incremental check (opțional)

Pentru eficiență, scriptul poate:
1. Salva hash-ul ultimului fișier procesat într-un fișier `.crawler_state.json`
2. La pornire, compară hash-ul fișierului de pe data.gov.ro cu cel salvat
3. Dacă e același → skip (nimic nou)
4. Dacă e diferit → descarcă și upsert

### Performance

| Operație | Detalii |
|----------|---------|
| Descărcare fișier ZIP | ~300-800 MB, ~1-3 minute |
| Parsare CSV (stream) | Memorie: ~50 MB (nu încărcăm tot) |
| Indexare Meilisearch | Bulk-uri de 1000 docs, ~2-5 minute |
| **Total prima dată** | **~5-10 minute** |
| **Rulări ulterioare** | doar dacă fișierul s-a schimbat |

### Reziliență

- Timeout la descărcare: 5 minute
- La eroare de rețea, scriptul reia de la ultimul batch reușit (salvăm progresul)
- Logging cu timp: `[2026-07-28 20:00] Procesate 15000 firme...`

## Comenzi

```bash
# Prima dată — indexează tot
cd crawler && python crawler_onrc.py

# Test rapid — doar 1000 de firme
cd crawler && python crawler_onrc.py --max=1000

# Forțează re-descărcare (ignoră starea salvată)
cd crawler && python crawler_onrc.py --force
```

## Acceptanță

- [ ] `python crawler_onrc.py --max=100` — indexează 100 de firme reale în Meilisearch
- [ ] `curl http://localhost:7700/indexes/companies/stats` arată N documents
- [ ] `searchCompanies("România")` returnează firme reale
- [ ] A doua rulare nu dublează firmele (același număr de documente)
- [ ] Scriptul poate fi oprit și reluat (progres salvat)
- [ ] `--max=0` procesează tot fișierul
