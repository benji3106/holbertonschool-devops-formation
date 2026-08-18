# 1. Your first Dockerfile

A tiny Node.js (Express) web app that responds with a short message on port 3000, packaged with Docker.

## Files

- `app.js` — the Express app
- `package.json` — dependency manifest
- `Dockerfile` — recipe to build the image
- `.dockerignore` — excludes `node_modules` from the build context

## Build

```bash
docker build -t first-image .
```

## Run

```bash
docker run -d --name first-app -p 3000:3000 first-image
```

## Test

```bash
curl http://localhost:3000
```

Expected output:

```
Hello from inside a container!
```

## Clean up

```bash
docker stop first-app
docker rm first-app
```