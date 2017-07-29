* Validations & Caching Strategy
* Validations is how clients cooperate with server to determine if previously-cached data is still usable.
i.e `If-Modified-Since`, `If-None-Match`, `Last-Modified`.
Caching Strategy on the other hand tells clients' browsers how they should cache the data.
i.e `Cache-Control`
* `ETag` caching is commonly used. It can prevent server sending same response to save clients bandwidth
  * Server uses 3rd library to generate hash based on data content
  * Server sets response `header` - `res.setHeader('ETag', 'YOUR_HASH')`
  * Clients get the `ETag` and cache the response
  * For the subsequent requests, clients will send `If-None-Match: <ETAG>` alongside the request
  * Server checks to see if `ETag` match
  * Server sends the empty body and `304` which indicates no change since last request
* `Last-Modified` has a few issues compared to `ETag`
  * Accurate to 1 sec - if resource is modified within 1 sec multiple times then it will fail to work out the timestamp
  * Some resources are generated on a regular basis without their contents being changed, but `Last-Modified` changed
  * Server time is different from intermediary caching server

### Cache-Control

`Cache-Control: no-cache` or `Cache-Control: no-cache, no-store, ...` for more than one values.

Some common values

* `no-cache` or `max-age=0` - browsers must revalidate resources b4 using a cached copy. i.e with `If-Not-Modified`. If reply is `304` then the cached resource can be used.
* `no-store` - disallow browsers or intermediary caching servers to return cached resources to users
i.e bank data
* `public` - allow intermediary caching server to cache data
* `private` - only allow users browers to use cache data
* `max-age` how long browers can use cached data for without asking the server until time expires or cache is cleared

### Intermediary caching server

Proxy caching is a feature of proxy servers that stores content on the proxy server itself, allowing web services to share those resources to more users. The proxy server coordinates with the source server to cache
documents such as files, images and web pages.

![](./proxy-caching-server.png)


For more information and best practices see [Google Web Caching](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching)


