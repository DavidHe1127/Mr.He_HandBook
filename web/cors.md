## CORS

* [What is it?](#what-is-it)
* [Why do we need it?](#why-need-it)
* [JSONP](#jsonp)
* [CORS](#cors)


### what-is-it
Stands for cross-origin resource sharing. i.e ajax calls can only access resources on your domain not some other domains.

### why-need-it
Security reasons. Protect your websites from CSRF or XSRF. The way CSRF works is as follow:
  * User David signs in reliable website A
  * Authentication is passed. A sets **cookie** on response header to retain David's login
  * User David goes to malicious website B without firstly signing out from website A
  * website B then takes **cookie** to forge a request to website A saying `buy pizza 100000+ pieces`
CSRF can be prevented by **same-origin policy**

### jsonp
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

### cors
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
Now, ajax calls to another domain is successfully returned.
