# TICKET INDEX — Feature 8: 💳 Taxe și Impozite (ANAF)

**Feature:** Subdomeniul „Taxe și Impozite" din 💰 Buget și Finanțe — veniturile fiscale ale statului: încasări pe tipuri de impozite, contribuabili înregistrați, arierate.

**Sursă:** ANAF pe data.gov.ro — **Buletinul statistic fiscal** (trimestrial).

**Investigație sursă (2026-08-01, verificat live):**
- `Buletin statistic fiscal nr. 1 2026` — XLSX, 31KB, actualizat 07.07.2026 ✅
- Buletine trimestriale complete: **2021-2026** (~4/an = ~24 buletine), structură uniformă
- Structura internă (verificată cu openpyxl): un singur sheet, ~292 rânduri, 10 coloane
  - Cuprins (r1-24) → tabele cu date din r86+
  - Tabele: etichete text în coloana A + valori numerice, comparații **an curent vs an anterior** (ex. 2025 vs 2026)
  - Capitole: indicatori macro, contribuabili înregistrați (2.531.562 total), venituri bugetare (impozit pe profit 764.766 vs 852.408), TVA, accize, arierate, inspecție fiscală, antifraudă
- `wait_for_task` înainte de swap (pattern Phase 7)

**Status:** 📋 Planificat

---

| ID | Ticket | Status | Depends On | Efort |
|----|--------|--------|------------|-------|
| 8.1 | Spike + Crawler Buletin Statistic Fiscal ANAF | ✅ **done** | — | ~40 min |
| 8.2 | API + pagina `/buget-si-finante/taxe-si-impozite` | ✅ **done** | 8.1 | ~25 min |
| 8.3 | QA + state docs + README | ✅ **done** | 8.2 | ~15 min |

**Total efort estimat:** ~80 minute

---

## Dependency Graph

```
8.1 → 8.2 → 8.3
```

## Verification (end of feature)

- [ ] `/buget-si-finante/taxe-si-impozite` afișează date fiscale reale ANAF
- [ ] Cardul „💳 Taxe și Impozite" din pagina domeniului → Live
- [ ] Datele au comparație pe ani (2025 vs 2026) sau trimestre
- [ ] State docs actualizate
