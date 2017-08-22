
* [JS tags loading](#js-tags-loading)

### js-tags-loading
Js script tags can be embedded into HTML in two forms - `inline` and `external`. For external ones, they basically need to be downloaded first before executions. During this process, page rendering and other assets loading (css styles) are0p blocked. In other words, page will not be rendered until all Js script tags defined `before <body>` finish executions. The rationale behind this is `JS script might modify DOM`.

Traditionally, in old browsers scripts need to be downloaded and executed sequentially.

At present, almost all browsers support parallel download of Js scripts. It allows us to download multiple Js scripts concurrently. But, blocking problem still presents - block `css styles` loading and `images`.

Tips: For analytics, event tracking code, put them in `window.onload` callback.



