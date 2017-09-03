## CORS

* [What is it?](#what-is-it)
* [Why do we need it?](#why-need-it)
* [JSONP](#jsonp)

### what-is-it
Stands for cross-origin resource sharing. i.e ajax calls can only access resources on your domain not some other domains.

### why-need-it
Security reasons. Protect your websites from CSRF or XSRF. The way CSRF works is as follow:
  * User David signs in reliable website A
  * Authentication is passed. A sets **cookie** on response header to retain David's login
  * User David goes to malicious website B without firstly signing out from website A
  * website B then takes **cookie** to forge a request to website A saying "buy pizza 100000+ pieces"
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
