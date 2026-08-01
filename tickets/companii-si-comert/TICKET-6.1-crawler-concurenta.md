# Ticket 6.1 — Spike + Crawler decizii Consiliul Concurenței (HTML scraping)

**ID:** TICKET-6.1
**Status:** 📋 ready
**Feature:** 6 — 🔒 Concurență
**Dependențe:** —

## Context (investigație făcută)

- REST API WordPress e blocat (Solid Security → 401) — **NU folosim wp-json**
- Paginile publice sunt accesibile:
  - Lista principală: `https://www.consiliulconcurentei.ro/documente-oficiale/concurenta/decizii/`
  - Subcategorii: `industrie-si-energie/`, `bunuri-de-consum/`, `servicii/`, `serviciul-carteluri/`, `cercetare/`, `investitii-straine/`, `directia-teritoriala/`, `analiza-si-monitorizare/`
  - Paginare: `/page/2` … `/page/241`
- Deciziile individuale NU apar ca link-uri statice simple — au template-uri JS (`template-decizii-servicii` etc.)

## Cerințe

### Faza 1 — Spike (30 min max)
- [ ] Descarcă 1 pagină de subcategorie completă (ex. `servicii/`) și inspectează HTML-ul brut:
  - Găsește unde sunt deciziile (JSON embedded în script? tabel? iframe? acordeon?)
  - Identifică structura: titlu, număr decizie, dată, PDF URL
  - Verifică dacă deciziile se încarcă via AJAX (caută `admin-ajax`, endpoint-uri custom, fetch/XHR)
- [ ] **Decizie de arhitectură:** dacă HTML-ul e parsabil → scraping; dacă e 100% JS → investighează endpoint-ul AJAX și folosește-l direct
- [ ] Documentează constatările în ticket (secțiunea „Rezultat spike")

### Faza 2 — Crawler (dacă spike-ul reușește)
- [ ] `crawler/crawler_concurenta.py`:
  - Descarcă lista + subcategoriile + paginarea (max 241 pagini)
  - Parsează fiecare decizie: `titlu`, `categorie`, `data` (dacă există), `url_pdf`, `url_sursa`
  - Rate limiting politicos (delay 0.5-1s între request-uri)
  - Indexează în Meilisearch, index `decizii_concurenta`, primary key `url_sursa` (sanitizat)
  - Idempotent, `--max` pentru teste, `--dry-run`, actualizează `.crawler_state.json`
- [ ] Dacă spike-ul eșuează (deciziile sunt doar în PDF-uri neindexabile): **oprește ticket-ul** și documentează — nu forțăm un crawler pe jumătate

## Fișiere

| Acțiune | Fișier |
|---------|--------|
| ➕ Creează | `crawler/crawler_concurenta.py` |
| 🔧 Editează | `frontend/package.json` — `"crawl:concurenta"` |

## Detalii tehnice

### Document Meilisearch (țintă)

```ts
interface DecizieConcurentaDoc {
  id: string;               // url_sursa sanitizat
  titlu: string;            // ex. "Decizia nr. 12/2024 privind concentrarea economică..."
  categorie: string;        // ex. "Servicii", "Industrie și energie"
  data?: string;            // dacă e disponibilă
  url_pdf: string;          // link spre document
  url_sursa: string;        // link spre pagina deciziei
}
```

### Config Meilisearch

- `searchableAttributes`: `["titlu", "categorie"]`
- `filterableAttributes`: `["categorie"]`
- `sortableAttributes`: `["titlu"]`

## Acceptance criteria

- [ ] Spike documentat: structura deciziei identificată clar
- [ ] Index `decizii_concurenta` populat cu date reale (sute de decizii)
- [ ] Căutare „concentrare economică" → rezultate cu titlu + PDF
- [ ] `--dry-run` + `--max` funcționale
- [ ] Fără hammering: delay între request-uri, User-Agent explicit

## Security

- **Impact:** none — date publice, scraping politicos pe site instituțional public
- Notă: verificăm robots.txt în spike; respectăm orice restricție explicită

## Verification

```bash
cd crawler && python crawler_concurenta.py --dry-run --max=5
cd crawler && python crawler_concurenta.py
curl -H "Authorization: Bearer $KEY" "http://localhost:7700/indexes/decizii_concurenta/stats"
```
