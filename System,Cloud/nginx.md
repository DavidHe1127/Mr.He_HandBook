## NGINX

* [Directives](#directives)
  * [try_files](#try_files)
  * [default_type](#default_type)
* [Debugging](#debugging)


### Directives

#### try_files

```config
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

#### Default Type
Default MIME type for response. The value will be set in the response header. When NGINX serves a file, The file extension is matched against the known types declared within the `types` block. If the extension doesn't match any of the known MIME types, the value of the `default_type` directive is used.

### Debugging

Put nginx var values via header. Handy for development.

`add_header X-uri "$uri";`

Then var will be interpreted in response header.

`X-uri:/index.php`
