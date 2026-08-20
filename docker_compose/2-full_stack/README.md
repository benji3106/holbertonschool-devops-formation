# 2. Grow the stack

The stack now has a single entry point (a reverse proxy) and a Redis cache
reachable by the API through Compose's internal DNS.

## What changed from `1-healthchecks`

**New `gateway` service** : Nginx reverse proxy, the only service with a
published port (8080). It routes external traffic:

- `/api/...` → `api:3000`
- everything else → `frontend:80`

```yaml
gateway:
  image: nginx:1.27-alpine
  ports:
    - "8080:80"
  volumes:
    - ./gateway/nginx.conf:/etc/nginx/conf.d/default.conf:ro
  depends_on:
    - frontend
    - api
```

**`frontend` and `api`** : no longer publish their own ports; only reachable
through the gateway now.

**New `cache` service** : Redis, with the same healthcheck pattern used for `db`:

```yaml
cache:
  image: redis:7-alpine
  healthcheck:
    test: ["CMD", "redis-cli", "ping"]
    interval: 3s
    timeout: 2s
    retries: 10
```

**`api` service** : added `REDIS_HOST`/`REDIS_PORT` env vars and a
`depends_on: cache: condition: service_healthy`. `app.js` now connects to
Redis and exposes a `/cache-check` route that writes and reads a value to
prove the connection works, not just that it opened.

## Run

```bash
docker compose up --build
```

## Verify (everything goes through the gateway on port 8080)

```bash
curl http://localhost:8080              # frontend
curl http://localhost:8080/api/         # API root
curl http://localhost:8080/api/db-check     # API -> PostgreSQL
curl http://localhost:8080/api/cache-check  # API -> Redis
```

## Stop

```bash
docker compose down
```

Add `-v` to also remove the database volume:

```bash
docker compose down -v
```