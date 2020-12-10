## SSR - Server-side Rendering

### Concept

Server side takes care of rendering (producing) ui elements - form, div, table etc into the HTML file before sending it down to client's browser to load. This is in opposition to client side rendering (CSR) where client's browser takes care of rendering ui elements by executing js files come embedded in the html file to work out elements to be added to HTML. In this case, html file comes from the server is usually bare minimum. i.e include a root `<div>` rather than other ui elements.

It affects only first page load. Once the first page is loaded, SSR behaves the same as CSR.

### Reference

- [SSR vs CSR](https://www.jianshu.com/p/b8cfa496b7ec)
