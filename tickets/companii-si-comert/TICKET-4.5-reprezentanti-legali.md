# Ticket 4.5 — Administratori și Acționari (reprezentanți legali ONRC)

**ID:** TICKET-4.5
**Status:** ✅ Done
**Feature:** 2 — 🏢 Registrul Comerțului (ONRC)
**Dependențe:** TICKET-2.8 (crawler ONRC), TICKET-2.11 (Company Profile Page)
**Sursă:** `OD_REPREZENTANTI_LEGALI.CSV` din dataset-ul ONRC lunar (data.gov.ro)

## Descriere

Înlocuiește placeholder-ul „Administratori și Acționari" de pe pagina profilului firmei
(`/companii/firma/[cui]`) cu date reale despre reprezentanții legali, extrase din
fișierul `OD_REPREZENTANTI_LEGALI.CSV` publicat de ONRC lunar pe data.gov.ro.

**NU** hardcodăm date fake. Luăm persoanele reale din sursa oficială.

---

## Flux

```
OD_REPREZENTANTI_LEGALI.CSV (data.gov.ro)  →  Download + unzip  →  Parsare CSV (^)
                                                                    ↓
                                                          Index Meilisearch (index nou: "reprezentanti")
                                                                    ↓
                                          API route /api/companies/[cui]/reprezentanti
                                                                    ↓
                                          UI pe profil firmă: card Administratori + Acționari
```

## Cerințe

- [ ] Script Python `crawler/crawler_reprezentanti.py` care:
  - Identifică cel mai recent dataset ONRC pe data.gov.ro (API CKAN search — același pattern ca la `crawler_onrc.py`)
  - Descarcă resursa `OD_REPREZENTANTI_LEGALI.CSV`
  - Parsează stream cu `delimiter="^"`, encoding `utf-8-sig`
  - Indexează în Meilisearch, index nou `reprezentanti`, în bulk-uri de câte 1000
  - Upsert pe ID sanitizat: `cod_inmatriculare.replace("/", "-").replace("\\", "-")` + număr de ordine
- [ ] Documentele indexate conțin cel puțin: `cod_inmatriculare`, `nume`, `prenume` (sau `nume_complet`), `functie` (ex. „Administrator", „Asociat"), `cui` (extras din cod înmatriculare dacă e disponibil)
- [ ] Scriptul e **idempotent**: rulează de 2x → aceleași date (upsert, fără duplicate)
- [ ] `--max=1000` pentru teste rapide (limitează liniile procesate)
- [ ] Se actualizează `.crawler_state.json` cu hash-ul datasetului (evită re-descărcarea celor ~X MB)

## Fișiere

| Acțiune | Fișier |
|---------|--------|
| ➕ Creează | `crawler/crawler_reprezentanti.py` |
| ➕ Creează | `frontend/src/app/api/companies/[cui]/reprezentanti/route.ts` |
| 🔧 Editează | `frontend/src/app/companii/firma/[cui]/page.tsx` — înlocuiește placeholder-ul cu date reale |
| ➕ Creează | `frontend/src/components/companii/RepresentativesCard.tsx` |
| 🔧 Editează | `frontend/src/lib/meilisearch.ts` — adaugă tipul `RepresentativeDoc` |
| 🔧 Editează | `frontend/package.json` — comandă `"crawl:reprezentanti"` |

## Detalii tehnice

### Structura document în Meilisearch

```ts
interface RepresentativeDoc {
  id: string;                 // cod_inmatriculare sanitizat + "_" + index
  cod_inmatriculare: string;  // ex. "J40/1737/1992"
  cui: string;                // ex. "RO28397" (dacă se poate mapa)
  nume_complet: string;       // "IONESCU ATANASE"
  functie: string;            // "Administrator" | "Asociat" | ...
  tip_persoana: string;       // "Persoana fizica" | "Persoana juridica"
}
```

- `searchableAttributes`: `["nume_complet"]`
- `filterableAttributes`: `["cod_inmatriculare"]`

### API

```
GET /api/companies/{cui}/reprezentanti
→ { hits: RepresentativeDoc[], total: number }
```

În pagina profilului firmei, CUI-ul curent se potrivește prin `cod_inmatriculare`
(se cunoaște deja `cod_inmatriculare` în documentul companiei — verifică ce câmp
folosește pagina curentă: `J40/1737/1992` din screenshot).

### UI

- Card „🧑‍💼 Administratori și Acționari" pe profil firmă, înlocuiește placeholder-ul:
  - Listă: fiecare persoană cu nume + funcție (badge colorat: Administrator = indigo, Asociat = verde)
  - Separare vizuală între Administrare și Asociere (grupare pe `functie` dacă datele permit)
  - Stare gol: mesaj elegant „Nu există date despre reprezentanții legali pentru această firmă"
  - Loading state: skeleton (la fel ca la restul paginii)

## Acceptance criteria

- [ ] `crawler_reprezentanti.py` indexează date reale în Meilisearch (index `reprezentanti`)
- [ ] API `GET /api/companies/RO28397/reprezentanti` returnează persoanele reale (testat cu curl)
- [ ] Pagina `/companii/firma/RO28397` afișează reprezentanții legali în loc de placeholder
- [ ] Stare gol afișată frumos pentru firme fără date (verificat pe o firmă mică)
- [ ] `npm run build` trece curat
- [ ] State docs actualizate (TICKET_INDEX, NEXT_ACTIONS, PROJECT_STATUS, CHANGELOG_WORKING)

## Security

- **Impact:** low — date publice ONRC, fără date personale sensibile suplimentare
- Notă: numele reprezentanților sunt date publice deja (ONRC open data, listafirme.ro le afișează)
- Fără auth necesară (aplicație publică, la fel ca restul)

## Verification

```bash
# 1. Crawler (test rapid)
cd crawler && python crawler_reprezentanti.py --max=1000

# 2. Verificare index
curl -H "Authorization: Bearer $MEILISEARCH_API_KEY" \
  "http://localhost:7700/indexes/reprezentanti/stats"

# 3. API
curl "http://localhost:3000/api/companies/RO28397/reprezentanti"

# 4. Build
cd frontend && npm run build

# 5. Manual: /companii/firma/RO28397 → card Administratori și Acționari cu date reale
```

## Note

- Fișierul ONRC publică reprezentanții legali pentru toate firmele (~4.2M) — se așteaptă un volum de zeci de milioane de înregistrări (o firmă poate avea mai multe persoane). Verifică dimensiunea reală la download și alege bulk-size potrivit.
- Dacă `OD_REPREZENTANTI_LEGALI.CSV` lipsește din dataset-ul curent, caută după pattern-ul CKAN: `q=Reprezentanti&sort=metadata_modified+desc` și documentează numele exact al resursei.
- Mapping CUI: dacă fișierul conține și CUI (pe lângă cod înmatriculare), folosește-l direct; altfel se potrivește prin `cod_inmatriculare`.
