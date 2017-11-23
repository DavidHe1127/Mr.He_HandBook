
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

// do
p {
  font: italic 0.75 rem "Arial", "Helvetica", sans-serif;
}
```
