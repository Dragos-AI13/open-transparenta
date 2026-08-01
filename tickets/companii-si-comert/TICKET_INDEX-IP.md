# TICKET INDEX — Feature 5: 🏛️ Întreprinderi Publice

**Feature:** Subdomeniul „Întreprinderi Publice" din Companii și Comerț — firmele cu capital de stat (companii de apă, transport, ocoale silvice, servicii publice) cu indicatori financiari specifici AMEPIP.

**Sursă:** AMEPIP (Agenția pentru Monitorizarea și Evaluarea Performanțelor Întreprinderilor Publice) — organismul OUG 109/2011
- `data_2023.csv` (data.gov.ro, dataset „Export de date indicatori financiari inclusiv 2023 din site-ul AMEPIP.gov.ro") — 1.259 firme, ani 2019-2023, 17 indicatori, CUI + nume + registru + CAEN
- `datecompanii_ind-finnefin.xlsx` (data.gov.ro, dataset „AMEPIP - Indicatori financiari, nefinanciari si de guvernanta corporativa - ian 2026") — aduce anul 2024, format pivot (necesită openpyxl + mapare coduri interne)

**Status:** 📋 Planificat

---

| ID | Ticket | Status | Depends On | Efort |
|----|--------|--------|------------|-------|
| 5.1 | Crawler AMEPIP: CSV 2023 + XLSX 2024 → Meilisearch | ⏳ pending | — | ~20 min |
| 5.2 | API Routes: listă + detalii întreprinderi publice | ⏳ pending | 5.1 | ~15 min |
| 5.3 | Sub-category page `/companii/intreprinderi-publice` (tabel + filtre) | ⏳ pending | 5.2 | ~20 min |
| 5.4 | Card „🏛️ Întreprindere publică" pe profil firmă (indicatori + mini-chart) | ⏳ pending | 5.2 | ~25 min |
| 5.5 | Integrare sidebar + navigare cap-coadă | ⏳ pending | 5.3, 5.4 | ~10 min |
| 5.6 | QA complet subdomeniu + state docs + README | ⏳ pending | 5.3-5.5 | ~15 min |

**Total efort estimat:** ~105 minute

---

## Dependency Graph

```
5.1 → 5.2 → 5.3
         ↓
        5.4 → 5.5 → 5.6
```

## Verification (end of feature)

- [ ] `/companii/intreprinderi-publice` afișează tabel cu firmele (1.259) + căutare + sortare pe indicatori
- [ ] Click pe o firmă → profilul existent `/companii/firma/[cui]` cu card „Întreprindere publică"
- [ ] Cardul afișează indicatorii AMEPIP (ROE, ROA, EBITDA, lichiditate, marje) cu istoric pe ani
- [ ] Sidebar-ul „🏛️ Întreprinderi Publice" e funcțional (nu mai e dead link)
- [ ] Breadcrumb corect, flow cap-coadă: homepage → Companii → Întreprinderi Publice → profil → înapoi
- [ ] State docs actualizate
