## NGINX

- [Directives](#directives)
  - [try_files](#try_files)
  - [default_type](#default_type)
  - [rewrite last and break](#rewrite)
  - [server_name](#server_name)
  - [regex matching](#regex-matching)
  - [upstream](#upstream)
  - [reverse proxy](#reverse-proxy)
  - [named_location](#named_location)
  - [resolver](#resolver)
  - [access custom header](#access-custom-header)
- [Debugging](#debugging)
- [Sample config](#sample-config)
- Tips
  - [Print more nginx infor](#print-detailed-nginx-info)
  - [Run nginx in docker host network mode](#run-nginx-in-docker-host-network)
- Learning Resources
  - [nginx tutorial basics concepts](https://www.netguru.com/codestories/nginx-tutorial-basics-concepts)

### Directives

#### try_files

```nginx
root /var/www/main;
location / {
    try_files $uri $uri.html $uri/ /fallback/index.html;
}

location /fallback {
    root /var/www/another;
}
```

if a request made to `/image.js`, `/` location will catch the request and follow rules defined in `try_files` to try to find the match:

- \$uri - try to find `image.js` from inside `/var/www/main`.
- \$uri.html - try to find `image.js.html` from inside `/var/www/main`.
- \$uri/ - try to find `image.js` dir from inside `/var/www/main`.
- /fallback/index.html - request redirected to `/fallback/index.html` which triggers another location search that will be trapped by `/fallback` location block which will serve `/var/www/another/fallback/index.html.

#### default_type

Default MIME type for response. The value will be set in the response header. When NGINX serves a file, The file extension is matched against the known types declared within the `types` block. If the extension doesn't match any of the known MIME types, the value of the `default_type` directive is used.

#### rewrite

- `last` will re-initiate another request which will then go through the subsequent locations and finds a match if there is any.
- `break` will execute the remaining commands in the current block.

```nginx
server {
  listen 80 default_server;
  server_name dcshi.com;
  root www;

  location /break/ {
    rewrite ^/break/(.*) /test/$1 break;
    echo "break page";
  }

  location /last/ {
    rewrite ^/last/(.*) /test/$1 last;
    echo "last page";
  }

  location /test/ {
    echo "test page";
  }
}
```

It prints `break page` when hitting `http://dcshi.com/break/foo` while prints `test page` when hitting `http://dcshi.com/last/foo`.

#### server_name

Every HTTP/1.1 message needs to be sent with `Host` header to the endpoint. `Host` will be used by nginx to determine which virtual server is used to serve the request.

```txt
Host: cai:8080

server {
  listen         8080;
  server_name    cai;    # serve reqs hitting http://cai:8080
}
```

#### regex matching

```nginx
# ~* regex+case-insensitive
# will match /test/myapp/hello.php and /myapp/hello.php
# $1 is /myapp while $2 is hello.php Parentheses denotes match group
location ~* (.*/myapp)/(.+\.php)$ {
    #...

    # /download/music/media/aoa.aaaaa -> download/music/mp3/aoa.mp3
    # $1 is /download/music $2 is aoa
    rewrite ^(/download/.*)/audio/(.*)\..*$ $1/mp3/$2.mp3 last;
}
```

#### upstream

it defines one a cluster of servers for serving requests. Load-balancing can also be configured inside it.

```nginx
upstream myproject {
  server 127.0.0.1:8000 weight=3;
  server 127.0.0.1:8001;
  server 127.0.0.1:8002;
  server 127.0.0.1:8003;
}

server {
  listen 80;
  server_name www.domain.com;
  location / {
    proxy_pass http://myproject;
  }
}
```

It means all requests for `/` will go to any one of the servers listed inside `myproject` upstream, with a preference for port 8000.

#### reverse proxy

When requesting `http://192.168.1.1/proxy/test.html`, different `proxy_pass` value could produce different results:

```nginx
# / denotes uri

# with uri
# proxied req - http://127.0.0.1/test.html
location /proxy/ {
    proxy_pass http://127.0.0.1/;
}

# proxied req - http://127.0.0.1/aaa/test.html
location /proxy/ {
    proxy_pass http://127.0.0.1/aaa/;
}

# without uri
# proxied req - http://127.0.0.1/proxy/test.html
location /proxy/ {
    proxy_pass http://127.0.0.1;
}

# proxied req - http://127.0.0.1/aaatest.html
location /proxy/ {
    proxy_pass http://127.0.0.1/aaa;
}
```

As you can see, when specifying uri in proxy_pass, path matching location parameter will be stripped out before forwarding the req to destination(upstream) server.

#### named_location

```nginx
# @ specifies a named_location which will NEVER be used to match incoming request
# Its purpose is to be used as a reference to determine the action
# In this case, it is used for @PLACEHOLDER_BACKEND_NAME specified above in try_files
# Once @PLACEHOLDER_BACKEND_NAME is reached as the last fallback option, named_location will be used to handle response
try_files $uri $uri/index.html $uri.html @PLACEHOLDER_BACKEND_NAME;

location @PLACEHOLDER_BACKEND_NAME {
  ...
  proxy_pass http://PLACEHOLDER_BACKEND_NAME;
  ...
}
```

#### resolver

By default, Nginx will resolve DNS name **only once** at the time of start or config reload. It's looking at `/etc/resolv.conf` to pick a nameserver for resolution.

```nginx
# sample /etc/resolv.conf

nameserver 127.0.0.53
```

The problem with this is if domain name cannot be resolved or DNS record Nginx caches becomes invalid, you have no option but restart Nginx or reload Nginx config to force DNS names re-resolution.

To mitigate this, you **must** explicitely specify a resolver for Nginx to re-resolve DNS names at the runtime. `/etc/resolv.conf` will not be used.

```nginx
resolver 10.0.0.2 valid=10s;

server {
    location / {
        # important! need to be done by assigning domain to a variable because
        # Using a variable in proxy_pass forces re-resolution of the DNS names because NGINX treats variables differently to
        # static configuration.
        # Also note, /etc/hosts file won't used for lookup. That's why we must explicitly specify a resolver
        set        $backend_servers backends.example.com;
        proxy_pass http://$backend_servers:8080;
    }
}
```

[Ref](https://www.nginx.com/blog/dns-service-discovery-nginx-plus/#domain-name-proxy_pass)

[Ref from StackOverflow](https://serverfault.com/questions/240476/how-to-force-nginx-to-resolve-dns-of-a-dynamic-hostname-everytime-when-doing-p/593003#593003)


#### Access Custom Header

```nginx
# for header 'upstream-host:www.baidu.com'

# to access it

echo $http_upstream_host
```

---

### Debugging

Put nginx var values via header. Handy for development.

`add_header X-uri "$uri";`

Then var will be interpreted in response header.

`X-uri:/index.php`

### Sample config

```nginx
#user  nobody;
worker_processes  1;

events {
    worker_connections  1024;
}

http {
    # include mime.types files
    include       mime.types;
    default_type  text/html;

    log_format  main  '$remote_addr - $remote_user $time_local "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for" ';

    # access_log allows nginx to write information in the access log regarding each request made by a client.
    # access_log log_file log_format;
    # here main is the name of log format
    access_log  /var/log/nginx/access.log  main;

    # error_log log_file log_level;
    # Nginx will log all errors that are equal to or above the defined level.
    # Give debug, info, notice, warn, error, crit, alert, emerg for all levels, set level to warn will log warn, error, crit, alert and emerg level of messages

    # optimization purpose
    sendfile            on;
    # keep tcp connection alive at the server
    keepalive_timeout   10;
    # If the client does not receive anything within this time, the connection is closed.
    send_timeout        10;
    # displaying the Nginx version number and Operating system on error pages and in the “Server” HTTP response header field
    server_tokens       off;
    # todo: latest nginx release does not bundle gzip
    #gzip_proxied        any;
    #gzip_min_length     1000;
    #gzip_types          *;

    # write rewrite-related logs - when using rewrite directive to error_log with notice as severity level
    rewrite_log on;

    server {
        listen 80 default_server;
        # any requests made to http will be caught
        server_name _;
        return 301 https://$host$request_uri;
    }

    server {
        listen 443 http2 ssl;
        server_name         localhost *.localhost;

        error_page  404              /404.html;
        error_page  500 502 503 504  /50x.html;

        ssl_certificate     ssl/nginx.crt;
        ssl_certificate_key ssl/nginx.key;
        ssl_dhparam                 ssl/dhparam.pem;

        ssl_session_cache           shared:SSL:1m;
        ssl_session_tickets         off;
        ssl_session_timeout         5m;
        ssl_ciphers                 ALL:!EXP:!NULL:!ADH:!LOW:!SSLv2:!SSLv3:!MD5:!RC4;
        ssl_prefer_server_ciphers   on;
        ssl_protocols               TLSv1.2;

        location / {
            root   /usr/share/nginx/html;
            index  index.html index.htm;
        }

        # * denotes case-insenstive match
        location ~* ^/private/health$ {

            # rewrite and forward requests to http://express:5000/.well-known/apollo/server-health
            rewrite /private/health /.well-known/apollo/server-health break;

            # docker default dns server
            resolver 127.0.0.11 ipv6=off;

            proxy_ssl_verify off;
            proxy_ssl_server_name on;
            # set headers on requests proxied to server that's set in proxy_pass
            proxy_set_header Host $http_host;

            # proxy to express container.
            proxy_pass http://express:5000;

            # custom HTTP Headers start with X according to naming convention
            add_header X-Request-time $request_time;
        }

        location ~* ^/graphql$ {
            resolver 127.0.0.11 ipv6=off;

            # configure upstream parameters
            proxy_ssl_protocols     TLSv1.2;

            proxy_set_header Host $http_host;
            proxy_set_header    X-Real-IP $remote_addr;
            proxy_set_header    X-Forwarded-For $proxy_add_x_forwarded_for;

            proxy_hide_header   X-Powered-By;
            proxy_hide_header   Server;

            add_header  Strict-Transport-Security "max-age=15768000;";
            add_header  X-Frame-Options "SAMEORIGIN";

            # proxy to express container.
            proxy_pass http://express:5000;
        }

        location ~ /\. {
            deny all;
            return 404;
        }
    }
}
```

---

### Print detailed nginx info

```sh
$ sudo nginx -V
...
# tell u where all files can be found. i.e index.html under default root html
--prefix=/usr/local/Cellar/nginx/1.17.3_1
...
```

### Run nginx in docker host network mode

Suppose we have a Python flask container running on `3100` in `host` network mode, refer to below example config to learn how nginx is configured
to forward traffic through to flask app.

```nginx
http {
    resolver 127.0.0.1 valid=60s;
    error_log /var/log/nginx/error.log error;

    server {
        listen 80 default_server deferred;
        root /usr/share/nginx/html;
        index index.html index.htm;

        location / {
            add_header X-SERVE "served by location /";
            try_files $uri $uri/ /index.html;
        }
    }

    server {
      listen 8443 ssl http2 default_server;

      ssl_protocols TLSv1.2;

      ssl_certificate     /etc/certs/nginx.crt;
      ssl_certificate_key /etc/certs/nginx.key;
      root /tmp/NOROOT;

      postpone_output 0;
      merge_slashes off;
      msie_padding off;

      location / {
        # localhost won't work since it cannot be resolved
        proxy_pass http://127.0.0.1:3100$request_uri;
      }
    }
}

events {}
```
