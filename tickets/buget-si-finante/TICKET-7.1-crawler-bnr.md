# Ticket 7.1 — Spike + Crawler BNR curs valutar (XML live + istoric)

**ID:** TICKET-7.1
**Status:** 📋 ready
**Feature:** 7 — 💰 Buget și Finanțe (subdomeniul: 💱 Indicatori Financiari)
**Dependențe:** —

## Context (investigație făcută)

- `https://www.bnr.ro/nbrfxrates.xml` → **funcționează** (XML, curs zilnic BNR)
- Structură XML:
  ```xml
  <DataSet>
    <Header><PublishingDate>2026-07-31</PublishingDate></Header>
    <Body>
      <Cube date="2026-07-31">
        <Rate currency="EUR">5.2473</Rate>
        <Rate currency="HUF" multiplier="100">1.4420</Rate>  <!-- atenție la multiplier -->
      </Cube>
    </Body>
  </DataSet>
  ```
- ~36 valute + aur; unele au `multiplier` (HUF, IDR, ISK, JPY, KRW, TRY — valoarea reală = rate × multiplier)
- Istoric: `https://www.bnr.ro/files/xml/nbrfxrates2025.xml` → 502 în test — **de confirmat în spike** (posibil URL greșit sau rate limit)

## Cerințe

### Faza 1 — Spike (15 min max)
- [ ] Confirmă URL-ul istoric corect (pattern: `nbrfxrates{YYYY}.xml`? alt pattern?) — testează 2024, 2023, 2025
- [ ] Verifică dacă API-ul live are istoric pe mai multe zile sau doar ziua curentă
- [ ] Documentează constatările în ticket (secțiunea „Rezultat spike")

### Faza 2 — Crawler
- [ ] `crawler/crawler_bnr.py`:
  - Descarcă `nbrfxrates.xml` (cursul zilei) + istoricul disponibil (anual sau zilnic)
  - Parsează XML (ElementTree), respectă `multiplier`
  - Indexează în Meilisearch, index `curs_valutar`:
    - Document per (valută, dată): `{ id: "EUR_2026-07-31", valuta: "EUR", data: "2026-07-31", rata: 5.2473, multiplier: 1 }`
    - Sau document per zi cu toate valutele — decide în spike (recomandat: per valută+dată, căutare mai flexibilă)
  - Idempotent (upsert pe id), `--dry-run`, `--max`
  - Actualizează `.crawler_state.json`
- [ ] Config Meilisearch: `searchableAttributes: ["valuta"]`, `filterableAttributes: ["valuta", "data"]`, `sortableAttributes: ["data"]`
- [ ] Comandă npm: `"crawl:bnr"`

## Fișiere

| Acțiune | Fișier |
|---------|--------|
| ➕ Creează | `crawler/crawler_bnr.py` |
| 🔧 Editează | `frontend/package.json` |

## Acceptance criteria

- [ ] Spike documentat: istoric confirmat sau documentat ca indisponibil
- [ ] Index `curs_valutar` populat (cel puțin cursul zilei pentru toate valutele)
- [ ] Multiplier aplicat corect (HUF: 1.4420 × 100 = 144.20)
- [ ] `--dry-run` + `--max` funcționale
- [ ] Idempotent: rulează de 2x → aceleași date

## Security

- **Impact:** none — date publice BNR, API oficial gratuit fără auth

## Verification

```bash
cd crawler && python crawler_bnr.py --dry-run --max=5
cd crawler && python crawler_bnr.py
curl -H "Authorization: Bearer $KEY" "http://localhost:7700/indexes/curs_valutar/stats"
```
