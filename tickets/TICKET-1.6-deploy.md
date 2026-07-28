# Ticket #1.6 — Deploy pe VPS + Script

**ID:** TICKET-1.6
**Status:** ⏳ Pending
**Feature:** 1 — 🏗️ Fundația
**Dependențe:** TICKET-1.1 (Meilisearch), TICKET-1.4 (layout)

## Descriere

Deploy al aplicației Next.js pe VPS-ul curent. Configurare build de producție,
script de deploy, testare că totul merge end-to-end.

## Cerințe

- [ ] Script `scripts/deploy.sh` — face build + pornește
- [ ] Next.js rulează pe portul 3000 (sau 80 via nginx)
- [ ] Variabile de mediu în `.env.production`
- [ ] `npm run build` trece fără erori
- [ ] Site-ul e accesibil la `http://[VPS_IP]`
- [ ] Pagina principală se încarcă (search bar + footer)
- [ ] Meilisearch e accesibil de la Next.js
- [ ] Script `scripts/status.sh` care verifică: site UP, Meilisearch UP

## Detalii tehnice

```bash
# scripts/deploy.sh
#!/bin/bash
cd /root/projects/open-transparenta/frontend
git pull
npm ci
npm run build
pm2 restart open-transparenta || pm2 start npm --name open-transparenta -- start
```

```bash
# scripts/status.sh
#!/bin/bash
echo "=== Open Transparență Status ==="
curl -s -o /dev/null -w "Frontend: %{http_code}\n" http://localhost:3000
curl -s -o /dev/null -w "Meilisearch: %{http_code}\n" http://localhost:7700/health
```

## Acceptanță

- [ ] `http://[VPS_IP]:3000` arată pagina principală (HTTP 200)
- [ ] `curl localhost:7700/health` returnează 200
- [ ] Script `deploy.sh` rulează fără erori
- [ ] Script `status.sh` arată ambele servicii UP
