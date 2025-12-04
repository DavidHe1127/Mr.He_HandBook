## HTTP Caching

Preamble, HTTP caches are typically limited to caching responses to GET and may decline other methods.

Two major parts:

* Freshness - tell browser how long it can retrieve contents from cache without asking server.
* Validation - is a way for clients to avoid refetching data when they’re not sure if the data is still fresh or not.

### Freshness
`Cache-Control: max-age=3600` response header tells browser don't bother to ask for resource again in the next 1 hour.

### Validation

Two common ways:

1. Server responds with `Last-Modified: Mon, 12 Dec 2016 14:45:00 GMT` and browser caches the response. Later on, browser can issue a GET/HEAD request with header `If-Modified-Since: Wed, 21 Oct 2015 07:28:00 GMT` to avoid downloading unchanged resource.
If there is no change, server will send `HTTP 304 NOT MODIFIED`.

`Last-Modified` has a few issues compared to `ETag`:
* Accurate to 1 sec - if resource is modified within 1 sec multiple times then it will fail to work out the timestamp
* Some resources are generated on a regular basis without their contents being changed, but `Last-Modified` changed
* Server time is different from intermediary caching server

2. ETag
* Server uses 3rd lib to generate hash based on data content
* Server sets response header `res.setHeader('ETag', 'YOUR_HASH')`
* Clients get the `ETag` and cache the response
* For the subsequent requests, clients will send `If-None-Match: <ETAG>` alongside the request
* Server checks to see if `ETag` match
* Server sends the empty body and `304` which indicates no change since last request

[GraphQL & Caching: The Elephant in the Room](https://blog.apollographql.com/graphql-caching-the-elephant-in-the-room-11a3df0c23ad)

### Other Cache-Control header values

* `no-cache` or `max-age=0` - browsers must revalidate resources b4 using a cached copy. i.e with `If-Not-Modified`. If reply is `304` then the cached resource can be used.
* `public` - allow intermediary caching server to cache data
* `private` - only allow users browers to use cache data
* `no-store` - disallow browsers or intermediary caching servers to return cached resources to users
i.e bank data


### Intermediary caching server

Proxy caching is a feature of proxy servers that stores content on the proxy server itself, allowing web services to share those resources to more users. The proxy server coordinates with the source server to cache
documents such as files, images and web pages.

For more information and best practices see [Google Web Caching](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching)


### Cache-busting

Cache busting allows us to keep long `max-age` values for resources that may change frequently. Google recommends that max-age be set to 1 year.

To invalidate cached resource, server can add a fingerprint based on the file contents:

`assets/js/app-d41d8cd98f00b204e9800998ecf8427e.min.js`.

1. Let’s say that you have a CSS file (e.g. style.css) and you set the expires value for that file type to 1 year. This means that once cached locally on the user’s browser, the browser won’t check the origin server again for 1 whole year to see if any updates have been made to the file.
2. Three months down the road you decide to make a change to the style.css file. Therefore if you make the change, and re-upload it to the server under the same name, the browser won’t know the difference and will keep delivering the original style.css file.
3. On the other hand, if you implement cache busting, you would rename the updated file to something like style.v2.css. Therefore once you have updated the page’s HTML to reflect this change, the browser will know that there is a new file that should be retrieved and it will start using it right away.

