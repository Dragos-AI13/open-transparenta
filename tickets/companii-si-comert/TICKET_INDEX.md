# TICKET INDEX — Feature 1: 🏗️ Arhitectura Domeniului

**Feature:** Companii și Comerț — scheletul complet al paginilor domeniului
**Feature doc:** `docs/planning/features/companii-si-comert/FEATURES.md`
**Status:** ⏳ Planificat

---

| ID | Ticket | Status | Depends On | Efort |
|----|--------|--------|------------|-------|
| 2.1 | Domain Design Tokens + Constants | ✅ **done** | — | ~5 min |
| 2.2 | Domain Layout (Sidebar + Breadcrumb) | ✅ **done** | 2.1 | ~10 min |
| 2.3 | Route Group + Domain Homepage | ✅ **done** | 2.2 | ~10 min |
| 2.4 | 8 Sub-Category Placeholder Pages | ✅ **done** | 2.3 | ~10 min |
| 2.5 | Domain Search Bar + Global Nav Update | ✅ **done** | 2.3 | ~10 min |
| 2.6 | Mobile Responsive + Navigation State | ✅ **done** | 2.4, 2.5 | ~10 min |

**Total efort estimat:** ~55 minute

---

## Dependency Graph

```
2.1 → 2.2 → 2.3 → 2.4
               ↓
             2.5 → 2.6
```

## Verification (end of feature)

- [ ] `/companii` arată toate cele 8 sub-categorii cu iconițe și descrieri
- [ ] Sidebar-ul are linkuri active pentru fiecare sub-pagină
- [ ] Breadcrumb-ul arată calea curentă
- [ ] Fiecare sub-categorie are pagină proprie cu placeholder
- [ ] Search bar-ul apare pe pagina domeniului
- [ ] Link "Companii" apare în header-ul global
- [ ] Totul arată bine pe mobil (max 400px)
