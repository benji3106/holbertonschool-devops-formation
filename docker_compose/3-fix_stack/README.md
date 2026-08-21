# 3. Fix a stack that will not start

Three classic Compose bugs, fixed in `compose.yaml` only : no service was redesigned.

## Bugs found and fixed

### 1. Missing database password

**Before:** `db` had no `environment` block at all : PostgreSQL refuses to
start without at least `POSTGRES_PASSWORD` set.

**Fix:** added an `environment` block reading the password from a `.env` file:

```yaml
environment:
  POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
```

### 2. Port conflict

**Before:** both `web` and `api` published port `8080` on the host:

```yaml
web:
  ports:
    - "8080:80"
api:
  ports:
    - "8080:8080"
```

**Fix:** changed `api`'s host port to `8083`, so both services can run
side by side:

```yaml
api:
  ports:
    - "8083:8080"
```

### 3. `depends_on` referencing a nonexistent service

**Before:** `api` depended on a service called `databse` (typo, and even
corrected to `database` it still would not have matched : the actual
service is named `db`):

```yaml
depends_on:
  - databse
```

**Fix:** pointed `depends_on` to the real service name:

```yaml
depends_on:
  - db
```

## Run

```bash
docker compose up -d
docker compose ps
```

Expected: all 4 services (`db`, `cache`, `web`, `api`) reach `Up`, `db` reaches
`(healthy)`, no service restarts or crash-loops.

## `.env`

```
POSTGRES_PASSWORD=fixstackpass
```

(Not committed to version control — see `.gitignore`.)

## Stop

```bash
docker compose down
```