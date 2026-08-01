# TICKET INDEX — Phase 11: 🎓 Educație

**Feature:** Domeniul „Educație" — sistemul de învățământ din România. Pagina principală + 3 subdomenii cu surse verificate (ME pe data.gov.ro).

**Context tehnic (verificat 2026-08-01 pe fișiere reale):**
- **Rețea școlară**: `Rețea scolară 2025-2026` (org `ministerul-educatiei`) — XLSX 3MB, sheet `Export`, **18.026 rânduri × 26 coloane, header r4** (r1-r3 titlu/generat); coloane: Denumire, Județ (cod), Localitate, Mediu (URBAN/RURAL), SIIIR, Tip, Statut, Mod funcționare, Forma finanțare, adresă, telefon, email; aceeași unitate apare de mai multe ori → id pe SIIIR + hash
- **Bacalaureat**: `Rezultate Bacalaureat sesiunea 2-2025` (ME) — XLSX 7MB, sheet `export`, **30.280 candidați × 52 coloane, header r1**; candidați ANONIMIZAȚI (cod unic); coloane: Sex, Specializare, Profil, Fileira, Forma, Mediu, Unitate SIIIR, Clasa, Promoție, NOTE_RECUN, STATUS per probă, NOTA_EA..ED, CONTESTATIE, STATUS final, Medie; 26 pachete (istoric sesiuni) → crawler ia cea mai recentă
- **Cadre didactice**: `Număr cadre didactice preuniversitar per grad didactic în anul școlar 2025-2026` (ME, apr 2026) — XLSX 77KB, sheet `Numar de persoane pe grade dida`, **220 rânduri × 76 coloane, pivot pe vârstă** (r1-r2 header vârstă 18-70+, r3 header Judeţ/Grad, r4+ date); grade: Grad I, Grad II, Debutant, Definitiv, Fara Pregatire → crawler face unpivot sau agregat pe (județ, grad)

**Status:** 📋 Planificat

---

| ID | Ticket | Status | Depends On | Efort |
|----|--------|--------|------------|-------|
| 11.1 | Pagina principală `/educatie` (grid subdomenii) | ✅ **done** | — | ~20 min |
| 11.2 | Rețea școlară (crawler + API + pagină) | ✅ **done** | 11.1 | ~60 min |
| 11.3 | Bacalaureat (crawler + API + pagină) | 📋 ready (ticket scris) | 11.1 | ~60 min |
| 11.4 | Cadre didactice (crawler + API + pagină) | 📋 ready (ticket scris) | 11.1 | ~45 min |

**Total efort estimat:** ~3h

---

## Dependency Graph

```
11.1 → 11.2, 11.3, 11.4 (paralel posibil — surse independente)
```

## Verification (end of feature)

- [ ] `/educatie` — 3 subdomenii **Live** (zero „În pregătire")
- [ ] Rețea școlară: 18.026+ unități, căutare pe județ/mediu
- [ ] Bacalaureat: rată promovare pe județ/școală (sesiunea 2-2025)
- [ ] Cadre didactice: pivot județ × grade (2025-2026)
- [ ] Homepage → Educație → fiecare subdomeniu → înapoi (flow cap-coadă)
- [ ] State docs actualizate
