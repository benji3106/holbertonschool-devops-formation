# 0. Your first stack

A 3-service Compose stack: a static frontend (Nginx), an API (Express), and a database (PostgreSQL).

## Services

- **frontend** : static page served by Nginx, published on port 8080
- **api** : Express app connected to PostgreSQL, published on port 3000
- **db** : PostgreSQL 16, internal only (no published port)

## Run

```bash
docker compose up -d --build
```

## Verify

```bash
curl http://localhost:8080
curl http://localhost:3000
curl http://localhost:3000/db-check
```

`db-check` queries PostgreSQL directly and confirms the API can reach the database.

## Stop

```bash
docker compose down
```

Add `-v` to also remove the database volume (`stack-db-data`) and start with a clean database next time:

```bash
docker compose down -v
```