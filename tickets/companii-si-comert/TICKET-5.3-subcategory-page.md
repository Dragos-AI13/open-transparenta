# Ticket 5.3 — Sub-category page `/companii/intreprinderi-publice`

**ID:** TICKET-5.3
**Status:** ✅ Done
**Feature:** 5 — 🏛️ Întreprinderi Publice
**Dependențe:** TICKET-5.2

## Descriere

Pagina subdomeniului „Întreprinderi Publice" — tabel cu toate firmele cu capital de stat, căutare, filtre și link către profilul firmei existent. Ruta există deja ca placeholder (sub-category page din Feature 2), trebuie doar populată cu date reale.

## Cerințe

- [ ] Pagina `app/companii/intreprinderi-publice/page.tsx` (sau prin slug-ul existent) afișează:
  - Header: titlu „🏛️ Întreprinderi Publice" + descriere scurtă (firme cu capital de stat, OUG 109/2011, sursă AMEPIP)
  - Search bar (filtrează pe denumire/CUI)
  - Tabel cu coloanele: Denumire (link → profil), CUI, CAEN, ROE (ultimul an), EBITDA (ultimul an), Nr. ani de date
  - Paginare (20/firmă pe pagină)
  - Loading skeletons
- [ ] Fiecare rând e link către `/companii/firma/{cui}` — profilul existent (cui-ul e același, RO-prefix)
- [ ] Stare gol: mesaj elegant când nu sunt rezultate
- [ ] Stare eroare: mesaj + retry
- [ ] Breadcrumb corect: Companii și Comerț › Întreprinderi Publice

## Fișiere

| Acțiune | Fișier |
|---------|--------|
| 🔧 Editează | `frontend/src/app/companii/[slug]/page.tsx` (sau creează `intreprinderi-publice/page.tsx` dacă pagina există separat) |
| ➕ Creează | `frontend/src/components/companii/IntreprinderiPubliceTable.tsx` |

## Acceptance criteria

- [ ] `/companii/intreprinderi-publice` afișează tabel cu firme reale (1.259)
- [ ] Căutarea filtrează live (server-side prin API)
- [ ] Click pe firmă → `/companii/firma/{cui}` funcționează (firma există în ONRC)
- [ ] Paginare funcțională
- [ ] `npm run build` trece

## Security

- **Impact:** none

## Verification

```bash
curl -s "http://localhost:3000/companii/intreprinderi-publice" | grep -c "COMPANIA"
# Manual: browser → tabel + click pe firmă → profil
```
