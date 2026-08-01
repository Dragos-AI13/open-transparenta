# Ticket 10.2 — API + pagina `/buget-si-finante/investitii-si-fonduri`

**ID:** TICKET-10.2
**Status:** 📋 ready
**Feature:** 10 — 🏗️ Investiții și Fonduri (MFE)
**Dependențe:** TICKET-10.1

## Descriere

Pagina subdomeniului cu proiectele finanțate din fonduri europene (MFE): proiecte contractate pe programe operaționale, cu valori, județ și stadiu, plus stadiul absorbției pe programe. Răspunde la „ce proiecte europene sunt în județul meu?" și „cât s-a absorbit din fonduri?".

## Cerințe

- [ ] `GET /api/proiecte-fonduri?q=&program=&judet=&stadiu=&page=&limit=` — listă:
  - Căutare full-text pe titlu/beneficiar/rezumat
  - Filtre: `program` (POIM/POC/POCU/POR/POAT/POAD/POCA), `judet`, `stadiu` (dacă e normalizat în date)
  - Sortare: valoare desc (opțional)
  - Răspuns: `{ hits, total, page, totalPages }`
  - Total exact: pattern-ul IP (stats când nu sunt filtre)
- [ ] `GET /api/proiecte-fonduri/rezumat` — pentru cardurile hero:
  - Total proiecte, total valoare contractată, total plăți (dacă există)
  - Absorbție pe programe (din indexul de absorbție)
- [ ] Pagină dedicată `app/buget-si-finante/investitii-si-fonduri/page.tsx`:
  - Hero: titlu „🏗️ Investiții și Fonduri", descriere
  - Carduri hero: număr proiecte, valoare totală, % absorbție
  - Tabel: Titlu proiect, Program (badge), Beneficiar, Județ, Valoare, Stadiu
  - Filtre: program (select), județ (select), căutare
  - Stări: skeleton, eroare, gol, cu date
  - Responsive
- [ ] Tip `ProiectFondDoc` + `AbsorbțieDoc` în `lib/meilisearch.ts`
- [ ] Update `lib/buget-domains.ts`: „Investiții și Fonduri" → `status: "live"` + href

## Fișiere

| Acțiune | Fișier |
|---------|--------|
| ➕ Creează | `frontend/src/app/api/proiecte-fonduri/route.ts` |
| ➕ Creează | `frontend/src/app/api/proiecte-fonduri/rezumat/route.ts` |
| ➕ Creează | `frontend/src/app/buget-si-finante/investitii-si-fonduri/page.tsx` |
| ➕ Creează | `frontend/src/components/buget/ProiecteFonduriTable.tsx` |
| 🔧 Editează | `frontend/src/lib/meilisearch.ts`, `frontend/src/lib/buget-domains.ts` |

## Detalii formatare

- Valorile în **lei** (din XLSX MFE — verificați unitatea la implementare: „Valoare totala eligibila" poate fi lei sau mii lei)
- Afișare: „125,4 mil RON" pentru valori mari, format RO (`.` mii, `,` zecimale)
- Badge-uri colorate per program (POIM indigo, POC cyan, POR verde, etc.)

## Acceptance criteria

- [ ] `/buget-si-finante/investitii-si-fonduri` afișează proiecte reale MFE cu filtre funcționale
- [ ] Cardul „🏗️ Investiții și Fonduri" din pagina domeniului → **Live** (4/7 subdomenii live)
- [ ] Căutare „oradea" → proiecte din Bihor
- [ ] `npm run build` trece

## Security

- **Impact:** none

## Verification

```bash
curl "http://localhost:3000/api/proiecte-fonduri?q=oradea&program=POIM"
# Browser: /buget-si-finante/investitii-si-fonduri
```
