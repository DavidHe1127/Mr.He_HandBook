* Docker
  * [Dockerfile tips](#dockerfile-tips)
* Docker Compose
  * [Create Branch](#create-branch)


### dockerfile-tips
* Each instruction in `Dockerfile` composes one layer of final image. More layers more complex. So try to group instructions.

**BAD!**
```js
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
Use `\` to mark line break
```js
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
