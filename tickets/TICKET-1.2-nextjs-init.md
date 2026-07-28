# Ticket #1.2 — Inițializare Next.js + Tailwind

**ID:** TICKET-1.2
**Status:** ⏳ Pending
**Feature:** 1 — 🏗️ Fundația
**Dependențe:** — (poate rula în paralel cu 1.1)

## Descriere

Inițializare proiect Next.js 15 cu App Router, TypeScript și Tailwind CSS
în directorul `frontend/`. Configurare structură de fișiere conform arhitecturii.

## Cerințe

- [ ] `npx create-next-app@latest frontend` cu TypeScript + Tailwind
- [ ] Configurare tailwind.config.ts cu tema dark
- [ ] Font Inter importat din Google Fonts
- [ ] Font JetBrains Mono pentru cifre (importat)
- [ ] Fișier `globals.css` cu variabile CSS personalizate (dark theme defaults)
- [ ] Structură foldere: `app/`, `components/`, `lib/`
- [ ] `layout.tsx` cu metadata de bază
- [ ] `page.tsx` placeholder cu titlul „Open Transparență"

## Detalii tehnice

```bash
cd /root/projects/open-transparenta
npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd frontend
npm install @fontsource/inter @fontsource/jetbrains-mono
```

## Acceptanță

- [ ] `npm run dev` pornește fără erori
- [ ] `http://localhost:3000` arată pagina placeholder
- [ ] Layout-ul are fontul Inter aplicat
- [ ] Dark mode funcționează (fundal negru, text alb)
