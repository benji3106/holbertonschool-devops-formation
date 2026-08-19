# 4. Talk to your container

The Express app from Task 1 was modified to read a `GREETING_NAME`
environment variable and change its response accordingly (default: `stranger`).

## Rebuild the image

```bash
docker build -t first-image .
```

## 1. Pass the variable at run time (`-e`)

```bash
docker run -d --name greet-app -p 3000:3000 -e GREETING_NAME=Benjamin first-image
curl http://localhost:3000
```

Output:

```
Hello, Benjamin! This message comes from inside a container.
```

**Observation:** the `-e GREETING_NAME=Benjamin` flag injected the variable
into the container at creation time, and the app's response changed
accordingly instead of falling back to the default value (`stranger`).

## 2. Read it from inside the container (`exec`)

```bash
docker exec -it greet-app env | grep GREETING_NAME
```

Output:

```
GREETING_NAME=Benjamin
```

**Observation:** the variable isn't just read by the app from the outside,
it genuinely exists in the container's own environment, exactly like an
environment variable set on a normal machine.

## 3. Inspect the container (`logs` and `inspect`)

```bash
docker logs greet-app
```

Output:

```
App listening on port 3000
GREETING_NAME is set to: Benjamin
```

```bash
docker inspect greet-app | grep -A 3 "Env"
```

Output:

```
"Env": [
    "GREETING_NAME=Benjamin",
    "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
    "NODE_VERSION=20.20.2",
```

**Observation:** `logs` confirms the app itself picked up the variable at
startup (thanks to the `console.log` added in `app.js`), while `inspect`
shows that Docker stores the variable as part of the container's
configuration, alongside other environment variables inherited from the
base image (like `NODE_VERSION`).

## Clean up

```bash
docker stop greet-app
docker rm greet-app
```