
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
```
