# Roadmap — Etapele de Dezvoltare

> **Actualizat:** 28 Iulie 2026
> **Durata estimată MVP:** ~10 zile lucrătoare

---

## Faza 0 — Fundația (1 zi) 🏗️

**Obiectiv:** Setup tehnic + primul search funcțional

- [ ] Instalare Meilisearch pe VPS
- [ ] Schelet Next.js + Tailwind
- [ ] Configurare PWA manifest
- [ ] Deploy pagină statică pe VPS (placeholder)
- [ ] Script crawl data.gov.ro (CKAN API → Meilisearch)
- [ ] Căutare funcțională pe localhost

**Resultat:** Un search bar care găsește date din 5.192 seturi.

---

## Faza 1 — Frontend Esențial (2 zile) 🎨

**Obiectiv:** Pagina principală cu domenii + navigare ierarhică

- [ ] Pagina principală: search bar + 17 domenii în grilă
- [ ] Pagina domeniu: descriere + instituții + subdomenii
- [ ] Pagina instituție: seturi de date pe categorii
- [ ] Pagina set de date: metadata + link descărcare
- [ ] Navigare pe 4 nivele (domeniu → subdomeniu → categorie → set)
- [ ] Responsive (funcționează pe telefon)

**Resultat:** Site-ul e navigabil pe telefon de orice cetățean.

---

## Faza 2 — Căutare + Filtre (1 zi) 🔍

**Obiectiv:** Căutare completă cu filtre

- [ ] Search bar pe toate paginile
- [ ] Rezultate cu infinite scroll
- [ ] Filtre: domeniu, instituție, format, an, județ
- [ ] Sortare: relevanță, dată, alfabetic
- [ ] Căutare în interiorul unui domeniu

**Resultat:** Orice căutare dă rezultate în sub 50ms cu filtre.

---

## Faza 3 — Parsare Date (2 zile) 📊

**Obiectiv:** Datele din documente devin vizibile pe site

- [ ] Parser CSV
- [ ] Parser XLSX/XLS
- [ ] Parser PDF (tabele + text)
- [ ] Afișare tabele sortabile pe site
- [ ] Grafice simple (fl_chart)
- [ ] Export CSV/JSON din datele parsate

**Resultat:** Cetățeanul vede tabele și grafice, nu descarcă PDF-uri.

---

## Faza 4 — Surse Suplimentare (2 zile) 🔌

**Obiectiv:** Adăugăm mai multe surse de date

- [ ] Crawler BNR (curs valutar zilnic)
- [ ] Crawler ONRC (toate firmele, CSV lunar)
- [ ] Crawler SEAP (achiziții publice, 171 seturi)
- [ ] Crawler INS TEMPO (statistici)
- [ ] Crawler ANAF (plătitori TVA)
- [ ] Testare + integrare în search

**Resultat:** Peste 6.000 de surse indexate.

---

## Faza 5 — Polisare + Deploy (1 zi) 🚀

**Obiectiv:** Site-ul e gata de lansare

- [ ] Ultimele ajustări UI
- [ ] Testare pe mobile
- [ ] PWA — instalabil pe home screen
- [ ] Cron zilnic pentru crawler
- [ ] Deploy final pe VPS
- [ ] Domeniu .ro configurat

**Resultat:** Site-ul e live și accesibil oricărui român.

---

## Faza 6+ — Extindere (continuu) 📈

**Obiectiv:** Adăugăm funcționalități avansate

- [ ] Hartă interactivă (MapLibre + WMS ANCPI)
- [ ] API public
- [ ] Toate cele 100+ surse
- [ ] Rapoarte și analytics
- [ ] Statistici (grafice, topuri per domeniu)
- [ ] Monetizare (API pentru firme)

---

## Timeline

```
Săptămâna 1:    ████░░░░░░  Faza 0 + 1 + 2   (setup + frontend + search)
Săptămâna 2:    ████████░░  Faza 3 + 4        (parsare + surse)
Săptămâna 3:    ██████████  Faza 5 + lansare   (polisare + deploy)
Luna 2+:         Continuă   Faza 6+            (hartă, API, toate sursele)
```
