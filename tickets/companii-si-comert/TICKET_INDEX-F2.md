# TICKET INDEX — Feature 2: 🏢 Registrul Comerțului (ONRC)

**Feature:** Căutare firmă + Profil + Crawler ONRC
**Feature doc:** `docs/planning/features/companii-si-comert/FEATURES.md`
**Status:** ⏳ Planificat

---

| ID | Ticket | Status | Depends On | Efort |
|----|--------|--------|------------|-------|
| 2.7 | Meilisearch Index Config + API Client | ✅ **done** | 2.1 | ~10 min |
| 2.8 | Crawler ONRC: descărcare + indexare firme reale | ✅ **done** | 2.7 | ~30 min |
| 2.9 | API Routes: Search + Company Detail | ⏳ pending | 2.8 | ~15 min |
| 2.10 | Search Results Page (/companii/cauta) | ⏳ pending | 2.9 | ~15 min |
| 2.11 | Company Profile Page (/companii/firma/[cui]) | ⏳ pending | 2.9 | ~15 min |
| 2.12 | Connect Search Bar + Navigation Flow | ⏳ pending | 2.10, 2.11 | ~10 min |

**Total efort estimat:** ~85 minute

---

## Dependency Graph

```
2.7 → 2.8 → 2.9 → 2.10
               ↓
             2.11 → 2.12
```

## Verification (end of feature)

- [ ] Scriu „Autonom Service" în search → apare firma în rezultate
- [ ] Click pe firmă → profil cu date generale, stare, adresă, reprezentanți
- [ ] Filtrare după județ, formă juridică, stare în pagina de căutare
- [ ] Search bar-ul de pe `/companii` e funcțional (nu mai e decorativ)
- [ ] Link „Companii și Comerț" din grid-ul de pe homepage duce la `/companii`
- [ ] 50+ firme sample indexate în Meilisearch
- [ ] `npm run build` trece
