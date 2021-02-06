## Caching

### Notes

- `ADD`, `COPY` and `RUN` will create new layers!
- Use `--no-cache` to disable caching such that Docker will rebuild every single step. It might be useful in CD environment where you want a guaranteed fresh build inevitably.

### Caching for ADD and COPY
The targeting files are examined and checksum is calculated for each of them. During cache lookup, every checksum is compared with the existing one individually (if there is any) and if a change is detected, cache will be invalidated and a new layer will be built. This also has the following lines of code rerun - new layer could be built.

Consider the following sample

```Dockerfile
FROM node:8
COPY . /app
RUN npm install --production
EXPOSE 3000
CMD ["node", "app/index.js"]

FROM node:8
COPY package.json /app/package.json
RUN cd /app; npm install --production
COPY . /app
EXPOSE 3000
CMD ["node", "app/index.js"]
```

Second build example is better. Why? The only time we need to run `npm install` is when a change occurs to dependencies, in other words `package.json`. If a change is made to other source files, the first build will still run `npm install` while the second build won't.

### Caching for RUN

Unlike `ADD` and `COPY`, Docker will not check content change from output of `RUN`. That means, as long as `RUN` command itself does not change, Docker will reuse cached layer:

```Dockerfile

# as long as url stays the same, Docker will reuse this layer
RUN git clone http://some.git.server/your-repo.git
```
You could turn on `--no-cache` however this disable entire caching from which you get faster build. One trick to fix it is, dynamically generate an unique script that includes `RUN` work on every build making docker to treat it as a fresh build.

```Dockerfile
FROM mhart/alpine-node:slim-15
ARG HASH
COPY $HASH.sh .
RUN ./$HASH.sh
ENTRYPOINT []
CMD ['/bin', '/sh']
```

```shell
HASH=$(openssl rand -hex 12)

cat > "$HASH".sh <<EOL
  #!/bin/bash
  date +"%T"
EOL

chmod +x "$HASH".sh
docker build --build-arg HASH="$HASH" -t test-caching .
```
