
* CSS
  * [Write shorthand css](#write-shorthand-css)


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
