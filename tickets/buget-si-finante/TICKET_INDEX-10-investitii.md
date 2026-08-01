# TICKET INDEX — Phase 10: 🏗️ Investiții și Fonduri (MFE)

**Feature:** Proiecte finanțate din fonduri europene + stadiul absorbției — datele MFE (Ministerul Investițiilor și Proiectelor Europene) publicate pe data.gov.ro.

**Context tehnic (verificat 2026-08-01):**
- Sursă: data.gov.ro CKAN, org `mfe` — 3 pachete:
  - **Proiecte contractate**: 119 resurse XLSX, 7 programe (POIM, POC, POCU, POR, POAT, POAD, POCA); ultima „31 august 2025" publicată 09.07.2026
  - **Stadiul absorbției 2014-2020**: XLSX lunar (29 mai 2026 cel mai recent)
  - **Stadiul absorbției 2021-2027 (Politica de Coeziune)**: XLSX lunar (29 mai 2026 cel mai recent)
- Format verificat (POIM real, 5.2MB): sheet „Contracte semnate", 2554 rânduri × 57 coloane, header la rândul 5 (primele 4 = titlu/note); coloane: titlu proiect, cod SMIS, beneficiar, rezumat, județ, regiune, valori, stadiu, plăți
- Pachetul „Proiecte contractate" e istoric acumulat (2018→2025) — crawler-ul ia ultimele resurse per program, nu tot istoricul

**Status:** 📋 Planificat

---

| ID | Ticket | Status | Depends On | Efort |
|----|--------|--------|------------|-------|
| 10.1 | Crawler MFE (proiecte contractate + stadiul absorbției) | ✅ **done** | — | ~45 min |
| 10.2 | API + pagina `/buget-si-finante/investitii-si-fonduri` | ✅ **done** | 10.1 | ~40 min |
| 10.3 | QA + state docs | 📋 ready | 10.2 | ~20 min |

**Total efort estimat:** ~105 minute

---

## Dependency Graph

```
10.1 → 10.2 → 10.3
```

## Verification (end of feature)

- [x] Index Meilisearch cu proiecte reale MFE (POIM + minim 2 alte programe) — **16.979 proiecte pe 7 programe** (10.1 done)
- [x] `/buget-si-finante/investitii-si-fonduri` — tabel proiecte + carduri absorbție (**17.879 proiecte**, 7 programe, filtre program/județ/căutare, carduri hero + absorbție 29 programe)
- [x] Cardul „🏗️ Investiții și Fonduri" din pagina domeniului → **Live** (4/7)
- [ ] State docs actualizate (10.3)
