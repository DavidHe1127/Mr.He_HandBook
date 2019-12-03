## NGINX

* [Directives](#directives)
  * [try_files](#try_files)
  * [default_type](#default_type)
  * [rewrite last and break](#rewrite)
* [Debugging](#debugging)
* [Sample config](#sample-config)

### Directives

#### try_files

```apache_conf
root /var/www/main;
location / {
    try_files $uri $uri.html $uri/ /fallback/index.html;
}

location /fallback {
    root /var/www/another;
}
```
if a request made to `/image.js`, `/` location will catch the request and follow rules defined in `try_files` to try to find the match:

* $uri - try to find `image.js` from inside `/var/www/main`.
* $uri.html - try to find `image.js.html` from inside `/var/www/main`.
* $uri/ - try to find `image.js` dir from inside `/var/www/main`.
* /fallback/index.html - request redirected to `/fallback/index.html` which triggers another location search that will be trapped by `/fallback` location block which will serve `/var/www/another/fallback/index.html.

#### default_type
Default MIME type for response. The value will be set in the response header. When NGINX serves a file, The file extension is matched against the known types declared within the `types` block. If the extension doesn't match any of the known MIME types, the value of the `default_type` directive is used.

#### rewrite

- `last` will re-initiate another request which will then go through the subsequent locations and finds a match if there is any.
- `break` will execute the remaining commands in the current block.

```yml
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

### Debugging

Put nginx var values via header. Handy for development.

`add_header X-uri "$uri";`

Then var will be interpreted in response header.

`X-uri:/index.php`


### Sample config

```apache_conf
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

            # dns server
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
            proxy_read_timeout      60s;
            client_max_body_size    0;
            proxy_buffering         off;
            proxy_redirect          off;
            proxy_ssl_verify        off;
            proxy_ssl_server_name   on;
            proxy_ssl_ciphers       HIGH:!aNULL:!CAMELLIA:!SHA:!RSA;
            proxy_ssl_protocols     TLSv1.2;

            proxy_set_header Host $http_host;
            proxy_set_header    X-Real-IP $remote_addr;
            proxy_set_header    X-Forwarded-For $proxy_add_x_forwarded_for;

            proxy_hide_header   X-Powered-By;
            proxy_hide_header   Server;

            # header control - note these are also enforced by gateway if not present here
            proxy_hide_header       X-Powered-By;
            proxy_hide_header       Server;
            add_header  Strict-Transport-Security "max-age=15768000;";
            add_header  X-Frame-Options "SAMEORIGIN";
            add_header  X-Content-Type-Options "nosniff";
            add_header  X-Xss-Protection "1; mode=block";
            add_header  Referrer-Policy "no-referrer";

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
