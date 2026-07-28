# Design System — Open Transparență

> **Varianta:** Dark Colorat (Hibrid)
> Fundal întunecat cu accente de culoare per domeniu.

---

## 1. Paleta de Culori

### Background & Text

| Token | Valoare | Utilizare |
|---|---|---|
| `bg-deep` | `#08090b` | Fundalul principal al site-ului |
| `bg-surface` | `#121317` | Carduri, panouri, sectiuni |
| `bg-elevated` | `#1a1c23` | Elemente ridicate, hover |
| `bg-input` | `#1e2030` | Câmpuri de input, search bar |
| `border-subtle` | `rgba(255,255,255,0.06)` | Linii separatoare, borduri fine |
| `border-default` | `rgba(255,255,255,0.1)` | Borduri standard |
| `text-primary` | `#f0f1f5` | Text principal |
| `text-secondary` | `#a0a5b5` | Text secundar, descrieri |
| `text-muted` | `#6b7084` | Text terțiar, metadata |
| `text-inverse` | `#0a0a0b` | Text pe fundaluri de accent |

### Culori per Domeniu

| Domeniu | Culoare | Hex |
|---|---|---|
| 💰 Buget și Finanțe | Emerald | `#10b981` |
| 🏥 Sănătate | Rose | `#f43f5e` |
| 🎓 Educație | Sky | `#0ea5e9` |
| ⚖️ Justiție | Amber | `#f59e0b` |
| 🏛️ Administrație | Violet | `#8b5cf6` |
| 🏢 Companii | Cyan | `#06b6d4` |
| 📋 Achiziții | Orange | `#f97316` |
| 🌳 Mediu | Lime | `#84cc16` |
| 🚗 Transport | Indigo | `#6366f1` |
| 👥 Muncă și Social | Teal | `#14b8a6` |
| 🛡️ Siguranță și Ordine | Red | `#ef4444` |
| 🌾 Agricultură | Green | `#22c55e` |
| ⚡ Energie | Yellow | `#eab308` |
| 🏛️ Cultură | Pink | `#ec4899` |
| 📊 Statistici | Blue | `#3b82f6` |
| 📡 Telecomunicații | Purple | `#a855f7` |
| 🌐 Externe | Slate | `#64748b` |

### Status & Semantic

| Token | Hex | Utilizare |
|---|---|---|
| Status online | `#22c55e` | 🟢 Sursă disponibilă |
| Status warning | `#f59e0b` | 🟡 Actualizare recentă |
| Status error | `#ef4444` | 🔴 Sursă indisponibilă |
| Status archived | `#6b7280` | ⚫ Set arhivat |

---

## 2. Tipografie

| Element | Font | Greutate | Dimensiune |
|---|---|---|---|
| Heading 1 | Inter | 700 (bold) | 2.5rem / 40px |
| Heading 2 | Inter | 600 (semi) | 1.5rem / 24px |
| Heading 3 | Inter | 600 (semi) | 1.25rem / 20px |
| Body | Inter | 400 (regular) | 1rem / 16px |
| Body small | Inter | 400 | 0.875rem / 14px |
| Meta / label | Inter | 500 | 0.75rem / 12px |
| Code / date | JetBrains Mono | 400 | 0.875rem |
| Cifre statistice | JetBrains Mono | 600 | 2rem+ |

```css
/* Import Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
```

---

## 3. Componente UI

### Search Bar

```
┌────────────────────────────────────────────────────────────┐
│  🔍  Caută în toate datele publice din România          ⏎ │
└────────────────────────────────────────────────────────────┘

Stări:
- Idle:      bg #1e2030, border rgba(255,255,255,0.08)
- Focus:     border #6366f1 (indigo), glow subtle
- Typing:    autocomplete dropdown apare sub
- Loading:   spinner în dreapta
- Rezultate: dropdown cu primele 5 sugestii
```

### Card Domeniu

```
┌──────────────────┐
│  💰              │  ← icon 48x48
│  Buget           │  ← text primary, weight 600
│  550+ seturi     │  ← text muted, weight 400
│  ████████░░ 80%  │  ← progress bar colorat
└──────────────────┘

Stări:
- Default:    bg-surface, border-subtle
- Hover:      bg-elevated, border luminos, scale(1.02)
```

### Card Rezultat Căutare

```
┌────────────────────────────────────────────────────────────┐
│ 🏥 Paturi clinice în spitale 2024                        │
│    Ministerul Sănătății  ·  XLSX  ·  2024                 │
│    ███████████████████████░░░  98% relevanță              │
│    📥 [Descarcă]  🔗 [Sursă]  👁️ [Previzualizează]       │
└────────────────────────────────────────────────────────────┘

Stări:
- Default:    bg-surface, cu bordură stângă colorată (#f43f5e)
- Hover:      bg-elevated
- Selected:   bg-elevated, border-left visible
```

### Badge Status

```
🟢 Disponibil      → bg rgba(34,197,94,0.1), text #22c55e
🟡 Actualizat      → bg rgba(245,158,11,0.1), text #f59e0b
🔴 Indisponibil    → bg rgba(239,68,68,0.1), text #ef4444
⚫ Arhivat          → bg rgba(107,114,128,0.1), text #6b7280
```

### Butoane

```
Primary:   bg #6366f1, text white, hover #5558e6
Secondary: bg transparent, border, text primary
Ghost:     bg transparent, text muted, hover bg subtle
Icon:      40x40, rounded, hover bg subtle
```

### Breadcrumbs

```
🏥 Sănătate  ›  🏥 Spitale  ›  📊 Paturi clinice
Text secundar, hover primary, separator `›` muted
```

### Tabel Parsat

```
┌────────────────────────────────────────────────────────────┐
│ Județ      │ Total  │ La 1000 loc │ Public │ Privat       │
│────────────┼────────┼─────────────┼────────┼─────────────│
│ București  │ 12.450 │    6.8      │ 8.200  │ 4.250       │
│ ────────── │        │             │        │             │
│ Header: bg-elevated, text-primary, weight 600             │
│ Row:     hover bg-elevated                                │
│ Sort:    click header, arată caret sus/jos                │
└────────────────────────────────────────────────────────────┘
```

---

## 4. Layout

### Pagina Principală

```
┌─────────────────────────────────────────────────────────┐
│  Header (30px)                                          │
│  Logo în stânga  ·  Trending în centru  ·  About în dr. │
├─────────────────────────────────────────────────────────┤
│                                                          │
│                SEARCH BAR (centrat vertical)              │
│                                                          │
│         Gri1ă 5x4 Domenii (cu număr de seturi)           │
│                                                          │
│         Total: ~5.400+ seturi (footer text)              │
│                                                          │
├─────────────────────────────────────────────────────────┤
│  Footer (date, surse, licență)                          │
└─────────────────────────────────────────────────────────┘
```

### Pagina Domeniu

```
┌─────────────────────────────────────────────────────────┐
│  Header + Breadcrumbs:  Acasă  ›  🏥 Sănătate           │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  🏥 Sănătate              [📊 186 seturi de date]       │
│  Descriere scurtă domeniu                                │
│                                                          │
│  ┌──────────────────────┐  ┌──────────────────────────┐ │
│  │ 🔍 Caută în Sănătate │  │ Filtre:  An  ·  Format  │ │
│  └──────────────────────┘  └──────────────────────────┘ │
│                                                          │
│  Instituții în acest domeniu:                           │
│  ┌────────────────────────────────────────────────────┐ │
│  │ 🏛️ Ministerul Sănătății             111 seturi  › │ │
│  │    Spitale · Medicamente · Boli · Finanțare       │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │ 🏛️ CNAS                             32 seturi    › │ │
│  │    Asigurări · Indicatori · Medicamente           │ │
│  └────────────────────────────────────────────────────┘ │
│  ...                                                     │
└─────────────────────────────────────────────────────────┘
```

### Pagina Instituție

```
┌─────────────────────────────────────────────────────────┐
│  Acasă  ›  🏥 Sănătate  ›  🏛️ Ministerul Sănătății    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  🏛️ Ministerul Sănătății        🟢 Disponibil           │
│  📍 https://www.ms.ro          📊 111 seturi de date    │
│                                                          │
│  Categorii:                                              │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐          │
│  │ 🏥   │ │ 💊   │ │ 🦠   │ │ 💰   │ │ 📋   │          │
│  │Spit. │ │Medi. │ │Boli  │ │Fin.  │ │Ach.  │          │
│  │32    │ │18    │ │12    │ │15    │ │34    │          │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘          │
│                                                          │
│  Toate seturile de date:                                 │
│  ┌────────────────────────────────────────────────────┐ │
│  │ 📊 Paturi clinice în spitale 2024                 │ │
│  │    XLSX · 2024 · Actualizat acum 1 an             │ │
│  │    📥 [Descarcă]  🔗 [Sursă]                      │ │
│  └────────────────────────────────────────────────────┘ │
│  ...                                                     │
└─────────────────────────────────────────────────────────┘
```

---

## 5. Animații și Tranziții

| Element | Animație | Timing |
|---|---|---|
| Card hover | scale(1.02) + border glow | 200ms ease |
| Search focus | border-color + shadow | 150ms ease |
| Pagină load | fade-in + slide-up | 300ms ease |
| Rezultate apar | stagger 50ms per card | 200ms ease |
| Tabel sort | reflow lin 200ms | 200ms ease |
| Hartă marker | pop-in | 300ms spring |
| Mobile menu | slide from right | 250ms ease |
| Loading | skeleton shimmer | 1.5s infinite |
| Error | shake input | 300ms ease |

---

## 6. Responsive

| Breakpoint | Lățime | Layout |
|---|---|---|
| Desktop | > 1024px | 5 coloane domenii, 3 coloane rezultate |
| Tablet | 768-1024px | 3 coloane domenii, 2 coloane rezultate |
| Mobile | < 768px | 2 coloane domenii, 1 coloană rezultate |
| Small mobile | < 400px | 1 coloană domenii |

### Mobile

- Search bar pe tot ecranul
- Domenii în scroll orizontal sau grid 2 coloane
- Bottom navigation (Home, Domenii, About)
- Touch targets ≥ 44px

---

## 7. Stări Speciale

| Stare | Ce se afișează |
|---|---|
| **Loading** | Skeleton shimmer pe carduri |
| **0 rezultate** | Ilustrație + text „Nu am găsit nimic pentru..."
| **Eroare rețea** | Mesaj + buton reîncercare |
| **Sursă offline** | Badge 🔴 + text „Sursa e temporar indisponibilă" |
| **Parsare în curs** | Loader progresiv: Descărcare → Parsare → Gata |
| **Parsare eșuată** | Buton „Descarcă originalul" + notă |
| **Cache expirat** | Se re-parsează automat la click |

---

## 8. Fișiere de Configurare

```json
// tailwind.config.js — culori per domeniu
{
  "colors": {
    "domain": {
      "buget": "#10b981",
      "sanatate": "#f43f5e",
      "educatie": "#0ea5e9",
      "justitie": "#f59e0b",
      "administratie": "#8b5cf6",
      "companii": "#06b6d4",
      "achizitii": "#f97316",
      "mediu": "#84cc16",
      "transport": "#6366f1",
      "munca": "#14b8a6",
      "siguranta": "#ef4444",
      "agricultura": "#22c55e",
      "energie": "#eab308",
      "cultura": "#ec4899",
      "statistici": "#3b82f6",
      "telecom": "#a855f7",
      "externe": "#64748b"
    }
  }
}
```

---

> **Design creat:** 28 Iulie 2026  
> **Status:** Aprobat — Dark Colorat  
> **Următorul pas:** Implementare Feature 1 — Fundația
