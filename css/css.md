##CSS Essentials

* General
  * [Cascading vs Inheritence](#cascading-inheritence)
* Position and Layout
  * [Positioning](#positioning)

#cascading-inheritence
```css
body {
  color: lightblue;
}
.cascade {
  color: maroon;
}
-----------------------------
<p class="cascade">Maroon</p> /* cascading - p is in maroon */
<p>Lightblue</p> /* inheritence - p is in lightblue */
```

#absolute-relative-position
`absolute`
* Out of document flow
* Room taken up by the element is not preserved (as opposed to relative)
* Position relatively to element's direct ancestor element (might be <body> and not static position)

`relative`
* In the document flow
* Elements added before it affects its position since `relative` makes element in document flow - see `css.html`

`static`
* Default position value
* Position-related properties such as `left, right, top, bottom` are ignored 

`fixed`
* Same as absolute but the element stays where it is permanently even screen is scrolled

See `css.html` for more examples. 

