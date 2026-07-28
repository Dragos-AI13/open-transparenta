# 🏢 Domeniul 6 — Companii și Comerț

> Dosar complet: toate instituțiile, toate seturile de date, toate sursele.
> Verificat pe data.gov.ro + surse proprii, Iulie 2026.

---

## Cuprins

1. [Descriere](#descriere)
2. [Instituții și surse](#instituții)
3. [Arborele complet](#arborele-complet)
4. [Inventar complet — toate seturile de date](#inventar-complet)
5. [Surse din afara data.gov.ro](#surse-externe)
6. [Prezentare propusă](#prezentare)
7. [Întrebări frecvente](#întrebări)

---

## Descriere

Date despre companiile din România și mediul de afaceri: registrul comerțului (toate firmele),
situații financiare, întreprinderi publice, piața de capital, pensii private, asigurări,
protecția consumatorilor și drepturi de autor.

**Pentru cetățean:** „Cine e înregistrat ca firmă în România și cum se prezintă?"

---

## Instituții

### A. Pe data.gov.ro

| # | Instituție | Tip | Seturi | Cod |
|---|---|---|---|---|
| 1 | **ONRC — Registrul Comerțului** | Oficiu | **76** | `onrc` |
| 2 | **AMEPIP — Întreprinderi Publice** | Agenție | **2** | `agentia-pentru-monitorizarea-si-evaluarea-performantelor-intreprinderilor-publice` |
| 3 | **ORDA — Drepturi de Autor** | Oficiu | **8** | `oficiul-roman-pentru-drepturile-de-autor` |
| 4 | **ONACP — Achiziții Centralizate** | Oficiu | **1** | `oficiul-national-pentru-achizitii-centralizate` |

### B. În afara data.gov.ro

| # | Instituție | Tip | Date disponibile | Acces |
|---|---|---|---|---|
| 5 | **ASF — Autoritatea de Supraveghere Financiară** | Autoritate | Piață de capital, pensii private, asigurări, emitenți | asfromania.ro |
| 6 | **ANPC — Protecția Consumatorilor** | Autoritate | Amenzi, reclamații, controale, OPC | anpc.ro |
| 7 | **BVB — Bursa de Valori București** | Bursă | Cotații, indici, emitenți, dividende | bvb.ro |
| 8 | **Consiliul Concurenței** | Autoritate | Avize, decizii, concentrări economice | consiliulconcurentei.ro |

---

## Arborele Complet

```
🏢 COMPANII ȘI COMERȚ
│
├── 🏢 REGISTRUL COMERȚULUI (ONRC)
│   ├── Firme înregistrate (dumps CSV lunare, 2013-2026)
│   │   ├── Denumire, CUI, EUID, adresă
│   │   ├── Formă juridică, stare
│   │   ├── Cod CAEN (domeniu de activitate)
│   │   └── Reprezentanți legali (nume)
│   ├── Nomenclatoare (stare firmă, CAEN, formă juridică)
│   └── Activități autorizate
│
├── 📊 SITUAȚII FINANCIARE
│   ├── Situații financiare anuale (2008-2025, CSV)
│   │   ├── Active, datorii, capitaluri proprii
│   │   ├── Cifra de afaceri, profit/pierdere
│   │   └── Număr angajați
│   └── Date de identificare plătitori (2018-2026)
│
├── 🏛️ ÎNTREPRINDERI PUBLICE (AMEPIP)
│   ├── Indicatori financiari, nefinanciari și de guvernanță
│   └── Lista întreprinderilor publice monitorizate
│
├── 📈 PIAȚA DE CAPITAL (ASF + BVB)
│   ├── Cotații bursiere, indici (BVB)
│   ├── Emitenți și valori mobiliare
│   ├── Dividende
│   └── Rapoarte anuale piață de capital (ASF)
│
├── 💰 PENSII PRIVATE (ASF)
│   ├── Active fonduri de pensii (Pilon II, III)
│   ├── Contribuții și randamente
│   └── Participanți
│
├── 🛡️ ASIGURĂRI (ASF)
│   ├── Prime subscrise și daune
│   ├── Intermediari autorizați
│   └── Solvabilitate
│
├── ⚖️ PROTECȚIA CONSUMATORULUI (ANPC)
│   ├── Amenzi și sancțiuni
│   ├── Controale OPC
│   └── Reclamații
│
├── 🔒 CONCURENȚĂ (Consiliul Concurenței)
│   ├── Decizii și avize
│   ├── Concentrări economice
│   └── Ajutoare de stat
│
└── 💎 DREPTURI DE AUTOR (ORDA)
    ├── Marcaje holografice (fonograme, videograme)
    ├── Produse pirat distruse
    └── Top societăți beneficiare
```

---

## Prezentare Propusă

### Card Rezumat

```
┌──────────────────────────────────────────────────────────────┐
│ 🏢 Companii și Comerț  ▸                                    │
│                                                               │
│ 4+ instituții · 87+ seturi de date                           │
│                                                               │
│ 🏢 Registrul Comerțului   📊 Situații Financiare             │
│ 🏛️ Întreprinderi Publice 📈 Piață de Capital                │
│ 💰 Pensii Private         🛡️ Asigurări                      │
│ ⚖️ Protecția Consumator   🔒 Concurență                    │
└──────────────────────────────────────────────────────────────┘
```

---

## Întrebări Frecvente

| Întrebare | Răspuns rapid | Unde găsești |
|---|---|---|
| „Câte firme sunt înregistrate în România?" | ONRC — dump CSV lunar | Registrul Comerțului |
| „Câte firme s-au înființat luna asta?" | ONRC — diferența între luni | Registrul Comerțului |
| „Cine e administratorul firmei X?" | Date firmă ONRC | Registrul Comerțului |
| „Ce situație financiară are firma X?" | Situații financiare (2008-2025) | Situații Financiare |
| „Câte întreprinderi publice sunt?" | AMEPIP | Întreprinderi Publice |
| „Cât valorează acțiunile pe Bursă?" | BVB — cotații | Piața de Capital |
| „Câți participanți sunt la pensii private?" | ASF — statistici | Pensii Private |
| „Câte amenzi a dat ANPC?" | ANPC — rapoarte | Protecția Consumatorului |
