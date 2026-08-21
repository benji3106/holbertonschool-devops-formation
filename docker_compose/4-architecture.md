# 4. Stack architecture — `2-full_stack`

## Overview diagram

```
                         ┌─────────────────────────────────────────┐
                         │         2-full_stack_default network      │
                         │                                             │
  Browser                │   ┌─────────┐                              │
  localhost:8080 ───────────▶│ gateway │  (nginx, published: 8080)   │
                         │   └────┬────┘                              │
                         │        │  routes by path                   │
                         │   ┌────┴─────┐                             │
                         │   ▼          ▼                             │
                         │ ┌──────────┐ ┌─────┐                       │
                         │ │ frontend │ │ api │                       │
                         │ │ (nginx)  │ │(node)│                      │
                         │ └──────────┘ └──┬──┘                       │
                         │                 │                          │
                         │          ┌──────┴──────┐                  │
                         │          ▼             ▼                  │
                         │        ┌────┐       ┌───────┐             │
                         │        │ db │       │ cache │             │
                         │        │(pg)│       │(redis)│             │
                         │        └─┬──┘       └───────┘             │
                         └──────────┼───────────────────────────────┘
                                    ▼
                          stack-db-data (named volume)
```

## Services and their role

| Service    | Image                | Role                                                              |
|------------|-----------------------|---------------------------------------------------------------------|
| `gateway`  | `nginx:1.27-alpine`   | Reverse proxy. The only service with a port published to the host (`8080`). Routes incoming requests to `frontend` or `api` based on the URL path. |
| `frontend` | built from `./frontend` (nginx) | Serves the static web page. Not reachable directly from outside the stack. |
| `api`      | built from `./api` (node) | Application logic. Talks to `db` for persistent data and `cache` for fast lookups. |
| `db`       | `postgres:16-alpine`  | Persistent relational storage. Has a healthcheck (`pg_isready`) so `api` waits for it to actually accept connections. |
| `cache`    | `redis:7-alpine`      | In-memory cache. Has a healthcheck (`redis-cli ping`) so `api` waits for it to be ready too. |

## Networks

Compose automatically creates one network for the stack (`2-full_stack_default`).
All five services join it by default (no manual network configuration was
needed). Inside this network, each service can reach any other service using
its **service name** as a hostname (ex: the API connects to `db` and `cache`
by name, not by IP). This is Compose's built-in DNS resolution.

No service other than `gateway` exposes a port to the host machine. `frontend`,
`api`, `db`, and `cache` are only reachable from inside this network (never
directly from the browser or from `curl` on the host).

## Volumes

One named volume: `stack-db-data`, mounted on `db` at
`/var/lib/postgresql/data`. This is where PostgreSQL stores its actual data
files. Because it's a named volume (not tied to the container's filesystem),
the data survives `docker compose down` and container recreation : it is only
removed if `docker compose down -v` is explicitly used.

No other service needs a volume: `frontend`'s static files are baked into its
image at build time, `cache` (Redis) is used purely as an ephemeral cache here
(no persistence configured), and `gateway`'s config is mounted read-only from
the host, not stored in a volume.

## End-to-end request path

Example: a browser requests `http://localhost:8080/api/db-check`.

1. **Browser → gateway** : The request leaves the browser and hits the host
   machine's port `8080`, which Compose has mapped to `gateway`'s internal
   port `80`.
2. **gateway routes by path** : Nginx's config matches the `/api/` prefix and
   forwards the request internally to `http://api:3000/db-check` (the `/api/`
   prefix is stripped). This hop uses the service name `api`, resolved through
   Compose's internal DNS (no host port is involved here, it's container-to-container).
3. **api queries db** : The API server receives the request, and runs a SQL
   query against `db:5432` using the credentials injected via `environment`
   variables (`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`). Again,
   `db` is reached by service name, not IP.
4. **db responds** : PostgreSQL executes the query and returns the result.
5. **api responds to gateway, gateway responds to browser**. The response
   travels back the same path: `db → api → gateway → browser`, arriving as a
   JSON payload like `{"database":"connected","time":"..."}`.

The same pattern applies to `/api/cache-check`, except step 3 talks to
`cache:6379` (Redis) instead of `db:5432`. A request to `/` (no `/api/`
prefix) is routed by `gateway` straight to `frontend:80` instead of `api`,
and never touches `db` or `cache` at all.

## Key takeaway

The browser only ever knows about one address: `localhost:8080`. Everything
past the gateway (service names, internal ports, which service talks to
which) is invisible from the outside and only resolvable inside the Compose
network. This is the same principle observed in the Deploy Night PLD: a
single entry point, with the internal topology hidden behind it.