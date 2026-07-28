# Ticket 2.4 — 8 Sub-Category Placeholder Pages

**ID:** TICKET-2.4
**Status:** ✅ Done
**Feature:** 1 — 🏗️ Arhitectura Domeniului (Companii și Comerț)
**Dependențe:** TICKET-2.3 (route group + homepage)

## Descriere

Crearea paginilor individuale pentru fiecare sub-categorie sub ruta dinamică `/companii/[slug]`. Fiecare pagină arată informații descriptive despre acea sub-categorie și placeholder-uri pentru datele care vor veni în feature-urile viitoare.

## Cerințe

- [ ] Rută dinamică `app/companii/[slug]/page.tsx`
- [ ] Pagina citește `slug` din params și caută categoria corespunzătoare în `companiiCategories`
- [ ] Dacă slug-ul nu există → 404
- [ ] Fiecare pagină arată:
  - Hero small cu iconiță, nume, culoare
  - Descriere completă
  - Lista surselor de date (instituții + număr seturi)
  - Placeholder sections pentru feature-urile viitoare („Căutare firmă — în curând", „Situații financiare — în curând", etc.)
  - Secțiune cu întrebări frecvente (FAQ) specifice sub-categoriei
- [ ] Breadcrumb-ul arată: Companii › [Nume Sub-categorie]
- [ ] Sidebar-ul are link-ul curent evidențiat

## Fișiere

| Acțiune | Fișier |
|---------|--------|
| ➕ Creează | `src/app/companii/[slug]/page.tsx` |

## Detalii tehnice

### Structura paginii
```
┌──────────────────────────────────────────────────┐
│ Companii › Registrul Comerțului                  │ ← breadcrumb
│                                                  │
│ 🏢 Registrul Comerțului                          │ ← hero
│ Toate firmele înregistrate în România            │
│                                                  │
│ 📋 Date disponibile (76 seturi — ONRC)           │
│ • Firme înregistrate (dumps CSV lunare)          │
│ • Nomenclatoare (CAEN, forme juridice)           │
│ • Activități autorizate                          │
│                                                  │
│ 🔍 Căutare firmă                                 │ ← placeholder
│ [  Caută după CUI sau denumire...  ]             │
│ ⚠️ În curând — funcționalitatea va fi activată   │
│                                                  │
│ ❓ Întrebări frecvente                           │
│ • Câte firme sunt în România?                    │
│ • Cum găsesc o firmă după CUI?                   │
└──────────────────────────────────────────────────┘
```

### Date inline per sub-categorie (în același fișier)
Fiecare sub-categorie are un obiect cu:
- `sources: [{ institution, count, description }]`
- `features: [{ name, description, status: 'coming_soon' }]`
- `faq: [{ question, answer }]`

Aceste date stau direct în fișierul paginii (sau într-un helper) — nu necesită fetching.

## Acceptanță

- [ ] `/companii/registrul-comertului` arată pagina cu toate secțiunile
- [ ] `/companii/piata-de-capital` etc. — toate 8 funcționează
- [ ] `/companii/categorie-invalida` → 404
- [ ] Breadcrumb-ul arată calea corectă
- [ ] Sidebar-ul are link-ul curent evidențiat (cu culoarea categoriei)
- [ ] `npm run build` trece
