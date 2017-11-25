* General
  * [Server compression](#server-compression)
* CSS
  * [Write shorthand css](#write-shorthand-css)
  * [Minify css](#minify-css)
  * [Use shallow css selectors](#use-shallow-css-selectors)
  * [Scan & remove unused css](#scan-remove-unused-css)
  * [Stay DRY](#stay-dry)
  * [Segment css or bulk css](#segment-css-or-bulk-css)

### server-compression
Enable server-side compression to gzip assets (.js and .css). Don't apply it to images since most of their formats are already compressed.


### write-shorthand-css
```css
// don't
p {
  font-family: "Arial", "Helvetica", sans-serif;
  font-size: 0.75rem;
  font-style: italic;
}

// do ~35% smaller
p {
  font: italic 0.75rem "Arial", "Helvetica", sans-serif;
}

// don't
.page {
  margin-top: 0;
  margin-right: auto;
  margin-bottom: 0;
  margin-left: auto;
}

// do
.page {
  margin: 0 auto;
}
```
To override, do this
```css
.parent {
  margin: 20px;
  .child {
    margin-top: 15px; 
  }
}
```

### minify-css
Remove all unnecessary spaces/carriage returns

### use-shallow-css-selectors
Don't be too specific. Keep css selectors brief can save space.
```css
// don't
div.mainContent div.genericContent div.listContainer ul.genericList {
  width: 202px;
  margin-right: 12px;
  float: left;
  display: inline;
  list-style: none;
}

// do
.genericList {
  width: 202px;
  margin-right: 12px;
  float: left;
  display: inline;
  list-style: none;
}
```

### scan-remove-unused-css
Use `uncss`, `csscss` node module to remove them.

### stay-dry
```css
// don't
#mainColumn {
  background: #fff;
}
#sideColumn {
  background: #fff;
}

// do
#mainColumn,
#sideColumn {
  background: #fff;
}
```
### segment-css-or-bulk-css
Segment css allows users to only download css of the page they are visiting not unvisited pages. Bulk css means we concatenate all segment css files into one. It allows for the whole site's css cached while on the other hand, enforce users to download css portions they might never use (i.e some specific pages css).

The rule of thumb is check your style sheet. If they are highly generalized, stick to one big style sheet. On the contrary, use css segments if these pages have distinct css.







