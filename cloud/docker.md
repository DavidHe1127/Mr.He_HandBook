## Docker

* Docker
  * [Basics](#basics)
  * [Dockerfile](#dockerfile)
  * [Enter running container](#Enter-running-container)
  * [Use multi-stage build](#use-multi-stage-build)
  * [logging](#logging)
  * [Copy files](#copy-files)
  * [Delete dangling images](#delete-dangling-images)
  * [Networking](#networking)
* Docker Compose
  * [Mount your code as a volume to avoid image rebuilds](#mount-src-to-volume)
  * [Use hostnames to connect to containers](#use-host-as-ref)
  * [Running Compose in background mode](#run-in-detached-mode)

### basics
Typically, we talk about 2 things when working with docker - Docker Client and Docker Server.

`Docker Client(cli) talks to Docker Server(daemon) via rest api`.

![docker-arch](./docker-arch.png)

### dockerfile
Each instruction in `Dockerfile` composes one layer of final image. More layers more complex. So try to group instructions.

Docker images are layered. When you build a new image, Docker does this for each instruction (RUN, COPY etc.) in your Dockerfile:

* Create a temporary container from the previous image layer (or the base FROM image for the first command
* Run the Dockerfile instruction in the temporary `intermediate` container
* Save the temporary container as a new image layer

**BAD!**
```yml
FROM debian:jessie

RUN apt-get update
RUN apt-get install -y gcc libc6-dev make
RUN wget -O redis.tar.gz "http://download.redis.io/releases/redis-3.2.5.tar.gz"
RUN mkdir -p /usr/src/redis
RUN tar -xzf redis.tar.gz -C /usr/src/redis --strip-components=1
RUN make -C /usr/src/redis
RUN make -C /usr/src/redis install
```

**GOOD**
```yml
# Use `\` to mark line break

FROM debian:jessie

RUN buildDeps='gcc libc6-dev make' \
    && apt-get update \
    && apt-get install -y $buildDeps \
    && wget -O redis.tar.gz "http://download.redis.io/releases/redis-3.2.5.tar.gz" \
    && mkdir -p /usr/src/redis \
    && tar -xzf redis.tar.gz -C /usr/src/redis --strip-components=1 \
    && make -C /usr/src/redis \
    && make -C /usr/src/redis install \
    && rm -rf /var/lib/apt/lists/* \
    && rm redis.tar.gz \
    && rm -r /usr/src/redis \
    && apt-get purge -y --auto-remove $buildDeps
```

* Keep it in mind that this is not shell script you should try to write as less lines of intructions as possible.
* Remember to remove/clean up redundant files you've created during build/setup to reduce image footprint.
* Each line of instruction should only do things relating to that layer.

### networking
The Docker server creates and configures the host system’s **docker0** interface as an Ethernet bridge inside the Linux kernel that could be used by the docker containers to communicate with each other and with the outside world.

When docker engine is started, the default bridge network named **docker0** is created - not visible on Mac via ifconfig since it’s in VM.

Docker bridge network:
![docker-bridge-network-01](./../docker-bridge-network-01.png)
![docker-bridge-network-02](./../docker-bridge-network-02.tiff)




### mount-src-to-volume
Any time you make a change to your code, you need to rebuild your Docker image (which is a manual step and can be time consuming). To solve this issue, mount your code as a volume. Now manual rebuilds are no longer necessary when code is changed.

```yml
services:
  web:
    volumes:
      - ./webapp:/opt/webapp
```

### use-host-as-ref
By default Compose sets up a single network for your app. When you name a service in your Compose YAML, it creates a hostname that you can then use to connect to the service.

```yml
services:
  web:
  redis:
  db:
```

```js
postgres://db:5432
redis://redis:6379
```

### run-in-detached-mode
`docker-compose up -d`

### Enter running container
```bash
docker exec -it <CONTAINER_ID> /bin/bash
```
or this if it's alpine-based container
```bash
docker exec -it --rm <IMAGE_ID/TAG> /bin/ash
```

### use-multi-stage-build
[Docker multi-stage build](https://medium.com/@tonistiigi/advanced-multi-stage-build-patterns-6f741b852fae)

### logging
To pull out a cranshed/stopped container logs, you can do:
```shell
$ docker ps -a // get container id. it prints out all containers infor default is running ones only
$ docker logs <CONTAINER_ID> 
```
To see logs printed in real-time while running your container, you can do:
```shell
$ docker exec -ip 3000:3000 serverless
```

### copy-files
Use `COPY` command in `Dockerfile` when copying files to **image**, Use `docker cp` while copying files in/out of a **container**. Container basically implies it's running.

### delete-dangling-images
To remove images such as `<none>:<none>`, run command below:

`$ docker rmi -f $(docker images -f "dangling=true" -q)`
