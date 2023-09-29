## UI/UX

- [typeface, font and font family](#typeface-font-font-family)

### Typeface font and font family

```
# typeface
Helvetica

# font
Helvetica Light
Helvetica Bold
Helvetica Regular

# font face is a css rule to define custom font
@font-face {
  font-family: "Trickster";
  src:
    local("Trickster"),
    url("trickster-COLRv1.otf") format("opentype") tech(color-COLRv1),
    url("trickster-outline.otf") format("opentype"),
    url("trickster-outline.woff") format("woff");
}
```