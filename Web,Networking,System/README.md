## Networking

- [Networking](./networking.md)

## System

- [Linux](./linux.md)
  - [shell](./shell.md)

## Miscellaneous

- [Premature Optimization](#premature_optimization)
- [WebAssembly](#web-assembly)
- [Idempotent](#idempotent)
- [CORS](#cors)
- [Service Worker](#service-worker)

## Web

- [Auth](./auth.md)

### premature_optimization

Any coding practice that makes your code harder to understand in the name of performance is a `premature optimization`.

---

### Web Assembly

- It's a new kind of code that can be compiled (ahead of time) down into a binary format that browsers can read. This means that high-level languages (C, C++) can be compiled down into a format that is legible to the browser. For developers that want to do some heavy computing on the web, this is a huge plus.
- At the time of writing, it does not support `DOM access` - so JS is still needed.

---

### idempotent
In the context of API server, idempotent means each request must be independent, produce the same outcome, and not related to the previous one. So, when it is multiple API instances, then it doesn’t matter to which server request is redirected.

---

### CORS

- [What is it?](#what-is-it)
- [Why do we need it?](#why-do-we-need-it)
- [JSONP](#jsonp)
- [How to enable it?](#how-to-enable-it)
- [Preflight](#preflight)

#### What is it

Stands for cross-origin resource sharing. i.e ajax calls can only access resources on your domain not some other domains.

Note, client's request still hits the server and gets the response, but HTTP client like `fetch` which follows `same origin policy` will prevent the client accessing the response since there is a lack of `Access-Control-Allow-Origin` header. You can set up a proxy server to fix the problem if you don't have control over the server.

[Useful link](https://stackoverflow.com/questions/43871637/no-access-control-allow-origin-header-is-present-on-the-requested-resource-whe/43881141#43881141)

#### Why do we need it

Security reasons. Protect your websites from CSRF or XSRF. The way CSRF works is as follow:

- User David signs in to a reliable website A
- Authentication is passed. A sets **cookie** on response header to retain David's login
- User David goes to malicious website B without firstly signing out from website A
- website B then takes **cookie** to forge a request to website A saying `buy pizza 100000+ pieces`
  CSRF can be prevented by **same-origin policy**

#### jsonp

Altough ajax requests are restricted, remote scripts loaded via `src tags` are free to go.

```js
<script>
  function logMessage(json) {
    console.log(json.message);
  }
</script>
<script src="http://example.com/jsonpMessage?cb=logMessage"></script>
```

Downside of jsonp is - it only works for http `GET`.

#### How to enable it

**Origin** header specifies where this request is being sent from.

```js
GET /cors HTTP/1.1
Origin: http://api.bob.com
Host: api.alice.com
Accept-Language: en-US
Connection: keep-alive
User-Agent: Mozilla/5.0...
```

Server will respond without **Access-Control-Allow-Origin** which will in turn trigger `onerror` in the ajax call.

Turn on cors for whole list of webistes as exceptions to same-origin policy. This time, server will respond

```js
Access-Control-Allow-Origin: http://api.bob.com
Access-Control-Allow-Credentials: true
Access-Control-Expose-Headers: FooBar
Content-Type: text/html; charset=utf-8
```

Now, ajax calls to another domain is allowed.

#### preflight

For non-simple requests - `PUT`, `DELETE` or `content-type: application/json` header, an `OPTIONS` http request will be sent first asking if the requested site is within the exception list and available http methods and headers. If answer is 200, the actual request will then be issued.

To avoid sending too many `OPTIONS`, One approach is - frontend sends ajax to its server (only serves up frontend code) which then forwards the requests to api server - backend. Because the communication is between two servers, preflight calls are completed avoided.

---

### Service Worker
It enables your site to still work when users are offline after first load.

The way it works is:

- Intercept the http request browser sends to server for fetching resources
- Checks whether the resource is already in cache
- If not, send a request to fetch that image and save it in cache




