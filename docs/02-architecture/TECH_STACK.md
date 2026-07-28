# Stack Tehnic — Comparație și Decizie

## Cele 3 Opțiuni Analizate

### Opțiunea 1 — Stack Simplu ✅ ALES

| Componentă | Alegere |
|---|---|
| Frontend | Next.js + Tailwind CSS (PWA) |
| Search | Meilisearch |
| Crawler | Python + Scrapy |
| Hosting | VPS Hetzner (€4.50/lună) |

**Cost lunar:** ~€6.50  
**Timp setup:** 1-2 zile  
**Complexitate:** Scăzută  
**Viteză căutare:** ~20-50ms

### Opțiunea 2 — Stack Enterprise (respinsă)

| Componentă | Alegere |
|---|---|
| Frontend | Next.js |
| Search | ElasticSearch + Kibana |
| Backend | Go (Fiber) — API Gateway |
| Crawler | Go + Python |
| Hosting | 2x VPS (€25-30/lună) + Cloudflare |
| Extra | PostgreSQL, Redis, RabbitMQ, Prometheus, Grafana |

**Cost lunar:** ~€30-40  
**Timp setup:** 2-3 săptămâni  
**Complexitate:** Ridicată  
**De ce nu:** Tir să muți o canapea. Pentru 5.192 seturi, ES și Meilisearch sunt identic de rapidi.

### Opțiunea 3 — Zero Admin (respinsă)

| Componentă | Alegere |
|---|---|
| Frontend | Next.js → Vercel (gratis) |
| Search | Meilisearch Cloud (€29/lună) |
| Crawler | Python → GitHub Actions (cron gratis) |
| Hosting | Cloudflare Pages + Workers + R2 |

**Cost lunar:** ~€29  
**Timp setup:** 2-3 zile  
**Complexitate:** Scăzută  
**De ce nu:** Plătești €29/lună pentru ce rulezi tu cu €4.50. Diferența e doar „nu atingi un server".

## Tabel Comparativ

| Criteriu | Opțiunea 1 🥇 | Opțiunea 2 | Opțiunea 3 |
|---|---|---|---|
| Cost lunar | **€4.50** | €30-40 | **€29** |
| Viteză căutare | ~20-50ms | ~10-20ms | ~20-50ms |
| Setup | **1-2 zile** | 2-3 săptămâni | **2-3 zile** |
| Admin | Scăzut | **Ridicat** | Zero |
| Scalare | Medie | **Masivă** | Medie |
| Control total | ✅ | ✅ | ⚠️ Vendor lock |
| Romanian search | ✅ Implicit | ⚠️ Configurare | ✅ Implicit |
| Typo tolerance | ✅ Implicit | ⚠️ Configurare | ✅ Implicit |

## Când Am Schimba Opțiunea

| Componentă | Acum | Alternativă | Prag de schimbare |
|---|---|---|---|
| Search | Meilisearch | ElasticSearch | Trafic > 1M query-uri/zi |
| Frontend | Next.js | Vite + React SPA | Dacă SEO nu mai e relevant |
| Hosting | VPS | Cloudflare Workers | Când VPS-ul devine bottleneck |
| Crawler | Python | Go | Când crawlăm 100+ surse și viteza contează |
