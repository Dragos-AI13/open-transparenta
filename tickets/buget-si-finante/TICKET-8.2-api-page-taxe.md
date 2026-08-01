# Ticket 8.2 — API + pagina `/buget-si-finante/taxe-si-impozite`

**ID:** TICKET-8.2
**Status:** 📋 ready
**Feature:** 8 — 💳 Taxe și Impozite (ANAF)
**Dependențe:** TICKET-8.1

## Descriere

Pagina subdomeniului cu datele fiscale ANAF: încasări pe tipuri de impozite, contribuabili înregistrați, cu comparație an curent vs an anterior. Răspunde la întrebarea „cât TVA s-a colectat?"

## Cerințe

- [ ] `GET /api/taxe-impozite?q=&sectiune=&an=&page=&limit=` — listă:
  - Căutare pe indicator (ex. „TVA", „profit", „salarii")
  - Filtru `sectiune` (Venituri bugetare / Contribuabili / Arierate)
  - Filtru `an` + `trimestru` (opțional)
  - Răspuns: `{ hits, total, page, totalPages }`
  - Total exact: pattern-ul IP (stats când nu sunt filtre)
- [ ] `GET /api/taxe-impozite/rezumat` — top-level per an/trimestru:
  - Total contribuabili, total venituri bugetare (dacă există în date)
  - Pentru cardurile hero
- [ ] Pagină dedicată `app/buget-si-finante/taxe-si-impozite/page.tsx`:
  - Hero: titlu „💳 Taxe și Impozite", descriere
  - Tabel: Indicator, Secțiune (badge), An, Valoare curentă, Valoare an anterior, Diferență (▲/▼ cu procent)
  - Selector an + trimestru (dacă datele au trimestre)
  - Căutare + paginare
  - Stări: skeleton, eroare, gol, cu date
  - Responsive
- [ ] Tip `TaxaImpozitDoc` + `TaxeRezumat` în `lib/meilisearch.ts`
- [ ] Update `lib/buget-domains.ts`: „Taxe și Impozite" → `status: "live"` + href

## Fișiere

| Acțiune | Fișier |
|---------|--------|
| ➕ Creează | `frontend/src/app/api/taxe-impozite/route.ts` |
| ➕ Creează | `frontend/src/app/api/taxe-impozite/rezumat/route.ts` |
| ➕ Creează | `frontend/src/app/buget-si-finante/taxe-si-impozite/page.tsx` |
| ➕ Creează | `frontend/src/components/buget/TaxeImpoziteTable.tsx` |
| 🔧 Editează | `frontend/src/lib/meilisearch.ts`, `frontend/src/lib/buget-domains.ts` |

## Detalii formatare

- Valorile în **mii lei** (venituri) sau **număr** (contribuabili) — unitatea din document
- Afișare: „852,41 mil lei" pentru mii lei (sau „852.408 mii lei")
- Diferență: `((curent - anterior) / anterior) * 100` → „▲ 11,5%" verde / „▼ 3,2%" roșu

## Acceptance criteria

- [ ] `/buget-si-finante/taxe-si-impozite` afișează date reale ANAF (impozit pe profit, TVA, accize)
- [ ] Cardul „💳 Taxe și Impozite" din pagina domeniului → **Live**
- [ ] Căutare + filtre funcționale, diferențe ▲/▼ vizibile
- [ ] `npm run build` trece

## Security

- **Impact:** none

## Verification

```bash
curl "http://localhost:3000/api/taxe-impozite?q=TVA&an=2026"
# Browser: /buget-si-finante/taxe-si-impozite
```
