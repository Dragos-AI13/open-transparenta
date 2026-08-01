# TICKET INDEX — Feature 6: 🔒 Concurență (Consiliul Concurenței)

**Feature:** Subdomeniul „Concurență" din Companii și Comerț — decizii, concentrări economice și avize ale Consiliului Concurenței.

**Sursă:** site-ul oficial `consiliulconcurentei.ro`

**Investigație sursă (2026-08-01, verificat live):**
- REST API WordPress (`wp-json`) → **blocat 401** (Solid Security) — nu e cale de API curat
- Paginile publice funcționează (200): `/documente-oficiale/concurenta/decizii/` + 6 subcategorii (industrie-energie, bunuri-de-consum, servicii, carteluri, cercetare, investitii-straine, directia-teritoriala, analiza-monitorizare)
- Paginare: ~241 pagini de decizii (`/page/2` … `/page/241`)
- Deciziile folosesc template-uri specifice (`template-decizii-servicii`) — link-urile individuale nu apar static în HTML simplu → **necesită spike de parsare în TICKET-6.1**

**Status:** 📋 Planificat

---

| ID | Ticket | Status | Depends On | Efort |
|----|--------|--------|------------|-------|
| 6.1 | Spike + Crawler decizii CC (HTML scraping) | ⏳ pending | — | ~40 min |
| 6.2 | API Routes + pagina `/companii/concurenta` (tabel decizii) | ⏳ pending | 6.1 | ~20 min |
| 6.3 | QA + state docs + README | ⏳ pending | 6.2 | ~15 min |

**Total efort estimat:** ~75 minute

---

## Dependency Graph

```
6.1 → 6.2 → 6.3
```

## Verification (end of feature)

- [ ] `/companii/concurenta` afișează deciziile Consiliului Concurenței (titlu, categorie, dată, link PDF)
- [ ] Crawler-ul extrage minim: titlu decizie, categorie, dată, URL PDF
- [ ] Sidebar-ul „🔒 Concurență" duce la pagina cu date live (nu mai e doar informativă)
- [ ] Stări: loading, gol, eroare, cu date — toate testate
- [ ] State docs actualizate
