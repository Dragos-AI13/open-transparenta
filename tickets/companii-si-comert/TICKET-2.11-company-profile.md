# Ticket 2.11 — Company Profile Page (/companii/firma/[cui])

**ID:** TICKET-2.11
**Status:** ⏳ Pending
**Feature:** 2 — 🏢 Registrul Comerțului (ONRC)
**Dependențe:** TICKET-2.9 (API routes)

## Descriere

Pagina de profil al unei firme la `/companii/firma/[cui]` care afișează toate datele publice disponibile: date generale, stare, adresă, reprezentanți, cod CAEN. Conține și link-uri către feature-urile viitoare (situații financiare, etc.)

## Cerințe

- [ ] Rută dinamică: `app/companii/firma/[cui]/page.tsx`
- [ ] Fetch date de la `/api/companies/[cui]` pe server
- [ ] Dacă CUI nu există → 404
- [ ] Layout paginii:
  - Header cu denumirea firmei și CUI-ul
  - Status badge (culoare în funcție de stare)
  - Grid cu informații cheie:
    - Formă juridică, Stare, Județ, Localitate
    - Cod CAEN + denumire, Data înființării
    - Telefon, Email, Website
  - Adresă completă
  - Secțiuni placeholder pentru feature-uri viitoare:
    - Situații Financiare — „în curând"
    - Acționari — „în curând"
    - Administratori — „în curând"
- [ ] Link „Înapoi la rezultate" (dacă există `referrer`)
- [ ] Breadcrumb: Companii › Căutare › [Nume Firmă]

## Fișiere

| Acțiune | Fișier |
|---------|--------|
| ➕ Creează | `src/app/companii/firma/[cui]/page.tsx` |
| ➕ (opțional) Creează | `src/components/companii/CompanyInfo.tsx` |

## Detalii tehnice

### Layout pagină
```
Companii › Căutare › AUTONOM SERVICE SRL

┌──────────────────────────────────────────────┐
│ ← Înapoi la rezultate                        │
│                                              │
│ 🏢 AUTONOM SERVICE SRL                [Activă]│
│ RO12345678 · J40/12345/2005                  │
│                                              │
│ ┌──────┬──────┬──────┬──────┐               │
│ │Formă │Stare  │Județ │Local.│               │
│ │ SRL  │Activă │Buc.  │Buc.  │               │
│ ├──────┼──────┼──────┼──────┤               │
│ │CAEN  │Înființ.│Tel.  │Email │               │
│ │6201  │2005   │021...│...@..│               │
│ └──────┴──────┴──────┴──────┘               │
│                                              │
│ Adresă completă                               │
│ Str. Libertatii, Nr. 25, Sector 3            │
│                                              │
│ 📊 Situații Financiare ⏳ în curând          │
│ 🧑‍💼 Administratori ⏳ în curând              │
└──────────────────────────────────────────────┘
```

### Stare badge
```tsx
const stareColors = {
  Activa: "bg-status-online/15 text-status-online",
  Dizolvata: "bg-status-error/15 text-status-error",
  Inactivată: "bg-status-archived/15 text-text-muted",
  Radiată: "bg-status-archived/15 text-text-muted",
};
```

### Breadcrumb
Trebuie actualizat `DomainLayout` să detecteze rutele `/companii/firma/[cui]` și să afișeze:
```
Companii › Căutare › [Denumire Firmă]
```

## Acceptanță

- [ ] `/companii/firma/RO12345678` arată profilul firmei cu toate datele
- [ ] Badge-ul de stare e colorat corect
- [ ] Link „Înapoi la rezultate" funcționează
- [ ] CUI inexistent → 404
- [ ] Secțiunile placeholder se văd cu „în curând"
- [ ] Breadcrumb-ul e corect
- [ ] `npm run build` trece
