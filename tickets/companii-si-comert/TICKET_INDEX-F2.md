# TICKET INDEX — Feature 2: 🏢 Registrul Comerțului (ONRC)

**Feature:** Căutare firmă + Profil + Crawler ONRC
**Status:** ✅ Complet

---

| ID | Ticket | Status |
|----|--------|--------|
| 2.7 | Meilisearch Index Config + API Client | ✅ **done** |
| 2.8 | Crawler ONRC: descărcare + indexare firme reale | ✅ **done** |
| 2.9 | API Routes: Search + Company Detail + Status Parser | ✅ **done** |
| 2.10 | Search Results Page (/companii/cauta) cu filtre complete | ✅ **done** |
| 2.11 | Company Profile Page (/companii/firma/[cui]) | ✅ **done** |
| 2.12 | Connect Search Bar + Navigation Flow | ✅ **done** |

---

# TICKET INDEX — Feature 3: 📊 Situații Financiare

**Feature:** Date financiare ale firmelor — bilanț, cont P&L, indicatori economici
**Sursă:** Ministerul Finanțelor (data.gov.ro)
**Ticket details:** `tickets/companii-si-comert/situatii-financiare/`
**Status:** ⏳ Planificat

---

| ID | Ticket | Status | Depends On |
|----|--------|--------|------------|
| 3.1 | Research + Crawler situații financiare | ⏳ **pending** | — |
| 3.2 | Index Meilisearch + API Routes | ⏳ **pending** | 3.1 |
| 3.3 | UI — Tabel indicatori pe profil firmă | ⏳ **pending** | 3.2 |
| 3.4 | UI — Grafice evoluție (Chart.js) | ⏳ **pending** | 3.3 |
| 3.5 | Integrare sidebar + feature flags | ⏳ **pending** | 3.3, 3.4 |

---

## Dependency Graph

```
3.1 → 3.2 → 3.3 → 3.4
               ↓
             3.5
```
