# Open Transparență 🇷🇴

**Caută orice dată publică din România. Instant. Gratuit.**

Open Transparență e un motor de căutare care agreghează **toate datele publice** puse la dispoziție de statul român — de la bugete și companii, la spitale, licitații și statistici. Un singur search bar, 5.000+ seturi de date, 100+ surse.

> **Pentru cetățeni:** Fără conturi, fără birocrație. Scrii ce cauți, găsești instant.
> **Pentru developeri:** API public (în curând). Date structurate, machine-readable.
> **Pentru firme:** Export bulk, rapoarte, monitorizare.

---

## 🚀 Status

```
Phase 1 — Fundația                ██████████ 100%
  ✅ Next.js + Tailwind (frontend)
  ✅ Design tokens + dark theme
  ✅ Layout (Header, Footer, Domain Grid)
  ✅ Meilisearch (motor căutare)

Phase 2 — Registrul Comerțului    ██████████ 100%
  ✅ Crawler ONRC (4.2M firme reale)
  ✅ Căutare full-text + 7 filtre
  ✅ Profil firmă (stare, CAEN, înființare)
  ✅ Parser stare (activă/dizolvată/radiată)

Phase 3 — Situații Financiare     ██████████ 100%
  ✅ Crawler Ministerul Finanțelor (1.7M doc)
  ✅ 20 indicatori per firmă/an
  ✅ Tabel trenduri ▲/▼ + grafice Chart.js

Phase 4 — Administratori        ██████████ 100%
  ✅ 3.68M reprezentanți legali indexați
  ✅ Card pe profil cu badge-uri pe funcție

Phase 5 — Întreprinderi Publice  ██████████ 100%
  ✅ 1.259 firme cu capital de stat (AMEPIP)
  ✅ 17 indicatori per firmă/an (2019-2023)
  ✅ Pagină subdomeniu + card profil + grafice

Phase 6 — Concurență           ██████████ 100%
  ✅ 2.380 decizii Consiliul Concurenței
  ✅ Pagină subdomeniu + filtre + link-uri PDF

Phase 7 — Buget și Finanțe     ██████████ 100%
  ✅ Curs Valutar BNR live (37 valute, zilnic)
  ✅ Pagină domeniu + link homepage (2/17 domenii live)

Phase 8 — În lucru
  ⬜ Subdomeniul 2 Buget și Finanțe (Bugetul de Stat)
  ⬜ Deploy producție (VPS)
  ⬜ PWA manifest + service worker
  ⬜ Domenii noi (sănătate, educație)
```

## 🧱 Stack

| Componentă | Tech |
|---|---|
| Frontend | Next.js + Tailwind CSS (PWA) |
| Motor căutare | Meilisearch |
| Crawler | Python + Scrapy |
| Hosting | TBD |

## 🗺️ Surse Acoperite

Vezi documentul complet: [Catalogul Resurselor de Date Publice din România](docs/romanian-public-data-registry.md)

Pe scurt: data.gov.ro, ONRC, BNR, SEAP, INS, ANAF, ANCOM, ANRE, Ministerul Sănătății, Ministerul Educației, Ministerul Finanțelor, Ministerul Justiției, portal.just.ro, legislatie.just.ro, CNSAS, ANCPI (când revine), Autoritatea Electorală, Primării, Consilii Județene — 100+ surse.

## 📜 Legal

Acest proiect reutilizează date publice în mod **explicit permis** de:
- Legea 544/2001 (liber acces la informații)
- Legea 109/2007 (reutilizarea informațiilor publice)
- OUG 118/2014 (date deschise)
- Directiva UE 2019/1024 (Open Data Directive)

Codul este licențiat **MIT**. Datele rămân sub licențele lor originale (OGL-ROU-1.0, CC-BY-4.0).

## 🤝 Contribuții

Acest proiect e open-source și încurajează contribuții. Vezi [issues](https://github.com/Dragos-AI13/open-transparenta/issues) pentru task-uri deschise.

## 📬 Contact

Proiect menținut de [@Dragos-AI13](https://github.com/Dragos-AI13).
