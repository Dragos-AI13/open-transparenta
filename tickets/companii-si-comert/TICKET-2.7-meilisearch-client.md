# Ticket 2.7 — Meilisearch Index Config + API Client

**ID:** TICKET-2.7
**Status:** ✅ Done
**Feature:** 2 — 🏢 Registrul Comerțului (ONRC)
**Dependențe:** TICKET-2.1 (design tokens — pentru constante)

## Descriere

Configurarea indexului `companies` în Meilisearch și crearea unui client API centralizat în Next.js pentru interogarea acestuia. Toate celelalte ticket-uri din Feature 2 vor folosi acest client.

## Cerințe

- [ ] Index `companies` creat în Meilisearch cu setările corecte
- [ ] Fișier `lib/meilisearch.ts` cu client Meilisearch inițializat
- [ ] Fișier `.env.local` (sau `.env`) cu variabilele de mediu
- [ ] Funcție `searchCompanies(query, filters, page)` — paginată
- [ ] Funcție `getCompany(cui)` — după CUI exact
- [ ] Indexul configurat cu `searchableAttributes`, `filterableAttributes`

## Fișiere

| Acțiune | Fișier |
|---------|--------|
| ➕ Creează | `src/lib/meilisearch.ts` |
| 🔧 Editează | `frontend/.env` |
| 🔧 Editează | `frontend/.env.example` |

## Detalii tehnice

### Index settings
```json
{
  "searchableAttributes": ["denumire", "cui", "adresa", "cod_caen_denumire", "localitate", "judet"],
  "filterableAttributes": ["judet", "forma_juridica", "stare", "localitate"],
  "sortableAttributes": ["denumire"],
  "rankingRules": ["words", "typo", "proximity", "attribute", "sort", "exactness"]
}
```

### lib/meilisearch.ts
```typescript
import { MeiliSearch } from "meilisearch";

const client = new MeiliSearch({
  host: process.env.MEILISEARCH_HOST || "http://localhost:7700",
  apiKey: process.env.MEILISEARCH_API_KEY || "",
});

const INDEX_NAME = "companies";

export interface CompanyDoc {
  cui: string;
  denumire: string;
  forma_juridica: string;
  stare: string;
  adresa: string;
  localitate: string;
  judet: string;
  cod_caen: string;
  cod_caen_denumire: string;
  telefon?: string;
  email?: string;
  website?: string;
  data_infiintare?: string;
  numar_registru_comert?: string;
}

export interface SearchFilters {
  judet?: string;
  forma_juridica?: string;
  stare?: string;
}

export async function searchCompanies(
  query: string,
  filters?: SearchFilters,
  page = 1,
  limit = 20,
) { ... }

export async function getCompany(cui: string) { ... }
```

### Instalare dependență
```bash
npm install meilisearch
```

## Acceptanță

- [ ] `meilisearch` e instalat în package.json
- [ ] Indexul `companies` e creat în Meilisearch (verificat via curl)
- [ ] `searchCompanies("test")` nu crapă (returnează array gol)
- [ ] `getCompany("RO123")` nu crapă (returnează null)
- [ ] `npm run build` trece
