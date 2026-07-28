# Ticket 2.9 — API Routes: Search + Company Detail + Status Parser

**ID:** TICKET-2.9
**Status:** ⏳ Pending
**Feature:** 2 — 🏢 Registrul Comerțului (ONRC)
**Dependențe:** TICKET-2.8 (crawler + index complet 4.2M firme)

## Descriere

Trei componente livrate împreună:

1. **Două API routes** Next.js care interoghează Meilisearch și întorc date despre companii.
2. **Parser stare firmă** — completează câmpul `stare` pentru fiecare din cele 4.2M firme, citind `OD_STARE_FIRMA.CSV`.
3. **Suport complet de filtre** — orice combinație de județ, localitate, formă juridică, stare, cod CAEN.

---

## Partea 1 — API Routes

### Cerințe

- [ ] `app/api/companies/search/route.ts` — GET cu query params
- [ ] `app/api/companies/[cui]/route.ts` — GET cu CUI
- [ ] Endpoint search: `?q=Autonom&page=1&judet=Bucuresti&forma_juridica=SRL&stare=Activa&localitate=`
- [ ] Endpoint search: răspuns paginat `{ hits, total, page, totalPages, facetDistribution }`
- [ ] Endpoint detail: întoarce obiectul complet al firmei sau 404
- [ ] Error handling standard: 400 (param invalid), 404 (negăsit), 500 (internal)
- [ ] Cache headers: `Cache-Control: public, max-age=60`
- [ ] Orice combinație de filtre funcționează (AND logic între filtre)

### Fișiere API

| Acțiune | Fișier |
|---------|--------|
| ➕ Creează | `src/app/api/companies/search/route.ts` |
| ➕ Creează | `src/app/api/companies/[cui]/route.ts` |

### Detalii tehnice

#### GET /api/companies/search
```
Input:  ?q=Autonom&page=1&limit=20
        &judet=Bucuresti
        &forma_juridica=SRL
        &stare=Activa
        &localitate=Cluj-Napoca
Output: {
  hits: CompanyDoc[],
  total: number,
  page: number,
  totalPages: number,
  facetDistribution: {
    judet: { "Bucuresti": 500, "Cluj": 200, ... },
    forma_juridica: { "SRL": 3000, "SA": 100, "PFA": 50, ... },
    stare: { "Activa": 2500, "Dizolvata": 300, ... }
  }
}
```

#### GET /api/companies/{cui}
```
Input:  /api/companies/RO12345678
Output: CompanyDoc (toate campurile)

Input:  /api/companies/ROINVALID
Output: { error: "Company not found" } → 404

Input:  /api/companies/ (fara CUI)
Output: { error: "Missing CUI parameter" } → 400
```

### Detalii implementare
- Folosește `searchCompanies()` și `getCompany()` din `lib/meilisearch.ts`
- Filter building: dacă un filtru e gol sau lipsă, nu-l include în query
- Facet distribution inclusă mereu în răspuns (pentru dropdown-uri)
- Query gol (`?q=`) întoarce ultimele firme (nu eroare)
- 0 rezultate → `{ hits: [], total: 0, page: 1, totalPages: 0 }`

---

## Partea 2 — Parser Stare Firmă (OD_STARE_FIRMA.CSV)

### Context

În indexul `companies`, câmpul `stare` e momentan gol (`""`) pentru toate cele 4.2M firme. Fișierul `OD_STARE_FIRMA.CSV` (91MB) conține starea curentă a fiecărei firme. Trebuie să populăm acest câmp.

### Cerințe

- [ ] Script `crawler/parse_stare_firma.py` care:
  - Descarcă `OD_STARE_FIRMA.CSV` din același dataset ONRC
  - Citește perechile `CUI → Stare` (sau `COD_INMATRICULARE → Stare`)
  - Trimite update în Meilisearch (doar field-ul `stare`)
  - Upsert pe `cod_inmatriculare`
- [ ] Batch-uri de 1000, aceeași reziliență ca crawlerul principal
- [ ] Se poate rula independent, după crawler

### Sursă date

În același pachet ONRC, resursa `OD_STARE_FIRMA.CSV`:
```
Format: CSV (^ delimitator)
Mărime: ~91MB
Conținut: COD_INMATRICULARE, DATA_INCEPUT_STARE, DATA_SFARSIT_STARE, STARE
```

### Mapare stare

| Valoare CSV | Valoare în index |
|-------------|-----------------|
| 0 | Activa |
| 1 | Dizolvata |
| 2 | Radiată |
| 3 | Inactivată |
| 4 | Suspendată |
| 5 | Rezoluționată |
| altele | (se păstrează raw) |

Pentru fiecare firmă, se ia ultima stare (cea mai recentă `DATA_INCEPUT_STARE`). Dacă o firmă nu apare în fișierul de stări, rămâne goală.

### Acceptanță stare

- [ ] După rulare, `curl .../companies/stats` arată fieldDistribution cu `stare` populat
- [ ] `searchCompanies("", { stare: "Activa" })` returnează doar firme active
- [ ] `searchCompanies("", { stare: "Dizolvata" })` returnează doar firme dizolvate
- [ ] `?stare=Activa&judet=Cluj` combină filtrele corect

---

## Acceptanță finală (tot ticketul)

- [ ] `curl "http://localhost:3000/api/companies/search?q=Autonom"` returnează JSON cu hits
- [ ] `curl "http://localhost:3000/api/companies/RO10654053"` returnează datele firmei
- [ ] `curl "http://localhost:3000/api/companies/INVALID"` returnează 404
- [ ] Filtre combinate: `?judet=Cluj&forma_juridica=SRL&stare=Activa` funcționează
- [ ] `?judet=Cluj&localitate=Dej` filtrează după oraș
- [ ] Starea firmelor e populată (nu mai e `""`)
- [ ] `npm run build` trece
