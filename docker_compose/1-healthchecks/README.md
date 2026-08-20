# 1. Order matters

A healthcheck on the database, combined with `depends_on: condition: service_healthy`
on the API, guarantees the API only starts once PostgreSQL is actually ready to accept
connections — not just once the container has started.

## What changed from `0-first_stack`

**`db` service** : added a real healthcheck:

```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
  interval: 3s
  timeout: 2s
  retries: 10
```

`pg_isready` actually connects to PostgreSQL and checks it accepts connections,
rather than just confirming the process is running.

**`api` service** : `depends_on` now uses a condition instead of the short form:

```yaml
depends_on:
  db:
    condition: service_healthy
```

## Run

```bash
docker compose up --build
```

## Proof of ordering (from the logs)

```
db-1  | 2026-08-20 09:45:45.721 UTC [1] LOG:  database system is ready to accept connections
Container 1-healthchecks-db-1 Healthy
api-1  | > node app.js
api-1  | API listening on port 3000
```

The `api` container does not start until `db` is reported `Healthy` by Docker Compose,
confirmed by PostgreSQL's own "ready to accept connections" log line appearing first.

## Verify

```bash
curl http://localhost:3000/db-check
```

Expected:

```json
{"database":"connected","time":"..."}
```

## Stop

```bash
docker compose down
```

Add `-v` to also remove the database volume:

```bash
docker compose down -v
```