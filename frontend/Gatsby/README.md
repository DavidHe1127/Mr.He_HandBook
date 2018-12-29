* `/pages` contains files used to create static pages i.e `src/pages/index.jsx` is mapped to `yoursite.com` and `src/pages/about.jsx` becomes `yoursite.com/about/`. Pages support running `graphql` queries.

* `/templates` contains files used to create dynamic pages (create pages programmatically). i.e `/blogs/:slug` is a dynamic page (route).

```js
result.data.allMarkdownRemark.edges.forEach(({ node }) => {
  createPage({
    path: node.fields.slug,
    component: path.resolve(`./src/templates/blog-post.js`),
    context: {
      // Data passed to context is available
      // in page queries as GraphQL variables.
      slug: node.fields.slug,
    },
  })
```

All markdown files are servered as contents for template pages to use to build pages dynamically.
