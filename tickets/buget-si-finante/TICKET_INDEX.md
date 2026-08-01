# TICKET INDEX — Feature 7: 💰 Buget și Finanțe

**Feature:** Domeniul „Buget și Finanțe" — banii publici ai României. Primul subdomeniu atacat: **💱 Indicatori Financiari (BNR — curs valutar)**, plus **pagina principală a domeniului** linkată din homepage.

**Sursă:** BNR (Banca Națională a României) — API XML public, fără auth.

**Investigație sursă (2026-08-01, verificat live):**
- `https://www.bnr.ro/nbrfxrates.xml` → **funcționează** (XML, curs zilnic: EUR 5.2473, GBP 6.1332, USD, CHF, ~36 valute + aur)
- Structură: `<Cube date="2026-07-31"><Rate currency="EUR">5.2473</Rate>...` — unele valute au `multiplier="100"`
- Istoric: `https://www.bnr.ro/files/xml/nbrfxrates2025.xml` → 502 (temporar sau URL diferit — de confirmat în spike)
- Homepage DomainGrid: doar „Companii și Comerț" are `href`; „Buget și Finanțe" are `slug: "buget"` fără href → pagina principală a domeniului trebuie creată + linkată

**Status:** 📋 Planificat

---

| ID | Ticket | Status | Depends On | Efort |
|----|--------|--------|------------|-------|
| 7.1 | Spike + Crawler BNR curs valutar (XML live + istoric) | ✅ **done** | — | ~30 min |
| 7.2 | API + pagina subdomeniului `/buget-si-finante/curs-valutar` | ⏳ pending | 7.1 | ~25 min |
| 7.3 | Pagina principală a domeniului `/buget-si-finante` + link homepage | ⏳ pending | 7.2 | ~20 min |
| 7.4 | QA + state docs + README | ⏳ pending | 7.2, 7.3 | ~15 min |

**Total efort estimat:** ~90 minute

---

## Dependency Graph

```
7.1 → 7.2 → 7.3 → 7.4
```

## Verification (end of feature)

- [ ] `/buget-si-finante` afișează pagina principală a domeniului cu carduri pe subdomenii
- [ ] Cardul „💰 Buget și Finanțe" din homepage duce la pagina principală a domeniului (nu mai e `#`)
- [ ] `/buget-si-finante/curs-valutar` afișează cursul BNR zilnic (EUR, USD, CHF, GBP + toate valutele)
- [ ] Cursul are dată de publicare + istoric (dacă spike-ul confirmă)
- [ ] State docs actualizate
