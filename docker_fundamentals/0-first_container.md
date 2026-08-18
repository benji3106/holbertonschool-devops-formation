# 0. Meet your first container

## Commands used

```bash
# Pull the official nginx image
docker pull nginx

# Run the container in the background with a published port
docker run -d --name mon-nginx -p 8080:80 nginx

# Check that the container is running
docker ps

# Test it with curl
curl http://localhost:8080

# Open a shell inside the container
docker exec -it mon-nginx bash
ls /usr/share/nginx/html
cat /etc/nginx/nginx.conf | head -20
exit

# Read the logs
docker logs mon-nginx

# Clean up
docker stop mon-nginx
docker rm mon-nginx
docker ps -a
```

## Observations

1. **Speed of execution.** The container started almost instantly after `docker run`, unlike a VM which has to boot a full operating system. A container doesn't have its own OS: it shares the host machine's kernel and simply starts an isolated process, which explains this speed.

2. **Image vs container.** The `nginx` image pulled with `docker pull` is a frozen, read-only template made of several layers (visible during the download). The `mon-nginx` container is a living instance created from that image: it has a running process, a writable layer on top, and a lifecycle (start/stop/rm) that the image alone doesn't have. Several different containers can be created from the same image.

3. **What you can see inside.** With `exec`, you enter a minimal filesystem specific to the container (`/usr/share/nginx/html`, `/etc/nginx/nginx.conf`), isolated from the rest of the host machine. With `logs`, you get everything the nginx process writes to its standard output: its startup sequence, its configuration, and even the trace of the earlier `curl` request (`GET / HTTP/1.1" 200`). This shows that Docker captures the main process's output directly, without needing to go inside the container to debug it.