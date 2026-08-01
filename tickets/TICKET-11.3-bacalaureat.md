# Ticket 11.3 — Crawler ME + Bacalaureat live

**ID:** TICKET-11.3
**Status:** ✅ done
**Feature:** 11 — 🎓 Educație
**Dependențe:** TICKET-11.1

## Descriere

Crawler pentru rezultatele la bacalaureat + API + pagina `/educatie/bacalaureat`. Răspunde la „cât e rata de promovare la bacalaureat în județul meu / la școala mea?".

## Context tehnic (verificat 2026-08-01 pe fișier real, 7MB)

- **Sursă:** data.gov.ro, pkg `Rezultate Bacalaureat sesiunea 2-2025` (org `ministerul-educatiei`) — pachete per sesiune (26 seturi, istoric)
- **Structură:** sheet `export`, **30.280 candidați × 52 coloane**, header la **rândul 1**
- **Coloane:** `Cod unic candidat` (anonimizat), `Sex` (F/M), `Specializare` (Științe ale Naturii), `Profil` (Real), `Fileira` (Teoretică), `Forma de învățământ` (Zi/Seral), `Mediu candidat` (RURAL), `Unitate (SIIIR)`, `Unitate (SIRUES)`, `Clasa`, `Promoție`, `NOTE_RECUN_A..D` (note recunoscute), `STATUS_A..ED` (Admis/Respins/…), `NOTA_EA..ED` (note probe), `CONTESTATIE_*`, `NOTA_CONTESTATIE_*`, `PUNCTAJ DIGITALE`, **`STATUS`** (final), **`Medie`**
- **Notă:** candidații sunt **anonimizați** (cod unic, nu nume) → GDPR ok; `Medie` e col52, `STATUS` col51 — verifică valorile la implementare (Admis/Respins/Absent)
- **Atenție sesiuni:** numele pachetelor variază (`Rezultate Bacalaureat sesiunea 2-2025`, `Sesiunea 2-2023`...) — crawler-ul ia cea mai recentă sesiune (comparație dată numerică)

## Cerințe

- [x] `crawler/crawler_educatie_bac.py`:
  - Descoperă pachetele (q=`Rezultate Bacalaureat`), ia cea mai recentă sesiune (comparație dată numerică — fallback pe an pentru „sesiunea 2- 2025")
  - Parsează: header r1, candidați anonimizați (cod unic); STATUS final → promovat/prezent
  - **Join local cu rețeaua școlară** (parsează și XLSX-ul rețelei — SIIIR → județ/denumire; 1.341/1.382 școli mapate, 97%)
  - Agregare pe școală: `{siiir, denumire, judet, candidati, prezenti, promovati, rata_promovare}`
  - Index `bacalaureat` — searchable: denumire, judet_nume, localitate; filterable: judet, judet_nume, sesiune, candidati; sortable: rata_promovare, candidati
  - `--dry-run`, `--force`, state, staging + swap, wait_for_task; npm `crawl:educatie-bac`
- [x] `GET /api/bacalaureat?q=&judet=&sesiune=&minCand=&page=&limit=` + `rezumat` (rata națională + top județe)
- [x] Pagina `/educatie/bacalaureat`:
  - Hero: 📝 Bacalaureat + sesiunea curentă
  - Carduri hero: **rată națională 32%**, 25.665 prezenți / 8.202 promovați, top județ Caraș-Severin 41,6%
  - Tabel: Școală (denumire din rețea), Județ (badge), Candidați/Prezenți/Promovați, Rată (colorată)
  - Filtre: județ, min candidați (Toți/≥10/≥30/≥50 — elimină zgomotul școlilor mici), căutare
  - Stări: skeleton, eroare, gol, cu date; responsive
- [x] Update `educatie-domains.ts`: Bacalaureat → `live` + href

## Fișiere

| Acțiune | Fișier |
|---------|--------|
| ➕ Creează | `crawler/crawler_educatie_bac.py` |
| ➕ Creează | `frontend/src/app/api/bacalaureat/route.ts` + `rezumat/route.ts` |
| ➕ Creează | `frontend/src/app/educatie/bacalaureat/page.tsx` + `components/educatie/BacalaureatTable.tsx` |
| 🔧 Editează | `frontend/src/lib/meilisearch.ts`, `educatie-domains.ts`, `package.json` |

## Acceptance criteria

- [x] Index cu școli reale — **1.382 școli** (sesiunea 2-2025), rata națională 32% (8.202/25.665 prezenți)
- [x] `/educatie/bacalaureat` — rată promovare + tabel pe școli (912 cu ≥10 candidați), filtre funcționale
- [x] Cardul Bacalaureat → **Live** (2/3 Educație)
- [x] `npm run build` trece

## Security

- **Impact:** none (candidați anonimizați — cod unic, fără nume)

## Verification

```bash
cd crawler && python crawler_educatie_bac.py --dry-run --max 500
python crawler_educatie_bac.py
# Browser: /educatie/bacalaureat
```
