# Ticket #1.1 — Instalare Meilisearch pe VPS

**ID:** TICKET-1.1
**Status:** ✅ Done
**Feature:** 1 — 🏗️ Fundația
**Dependențe:** — (primul ticket)

## Descriere

Instalare și configurare Meilisearch (motorul de căutare) pe VPS-ul curent.
Meilisearch va rula ca serviciu Docker, bind pe portul 7700, cu datele persistente
într-un volum cu mount pe disc.

## Cerințe

- [ ] Meilisearch rulează în Docker container
- [ ] Ascultă pe `localhost:7700` (fără auth pentru development)
- [ ] Date persistente în `/data/meilisearch/`
- [ ] `curl localhost:7700/health` returnează `{"status": "available"}`
- [ ] Containerul pornește automat la reboot (restart policy: always)
- [ ] Script de backup pentru index (opțional)

## Detalii tehnice

```bash
# Comanda de instalare
docker run -d \
  --name meilisearch \
  -p 7700:7700 \
  -v /data/meilisearch:/meili_data \
  -e MEILI_MASTER_KEY=open-transparenta-dev \
  --restart always \
  getmeili/meilisearch:v1.12
```

## Acceptanță

- [ ] `curl http://localhost:7700/health` → 200 OK
- [ ] `curl http://localhost:7700/version` → returnează versiunea
- [ ] Docker container e `Up` și `healthy`
- [ ] După reboot, containerul pornește automat
