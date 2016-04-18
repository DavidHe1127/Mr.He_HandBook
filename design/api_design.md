## Table of Contents

* [Method Chaining](#method-chaining)
* [Command and Query Separation](#cqs)
* [Consistency](#consistency)
* [Handling Arguments](#handle-arguments)
  * [Named Arguments](#named-arguments)
* [Extensibility](#extensibility)
  * [Callback](#callback)
  * [Event](#event)
  * [Hooks](#hooks)

#method-chaining
It creates fluently readable code and thus is easier to understand.
```javascript
var stooges = [{
  name: 'curly',
  age: 25
}, {
  name: 'moe',
  age: 21
}, {
  name: 'larry',
  age: 23
}];

var youngest = _.chain(stooges)
  .sortBy((stooge) => {
    return stooge.age;
  })
  .map((stooge) => {
    return stooge.name + ' is ' + stooge.age;
  })
  .first()
  .value(); // moe is 21
```

#cqs
Functions to change object state are called `commands`
Functions to retrieve values are called `queries`
Separate them out!! Multi-signature function harder to document.
```javascript
var $el = jQuery('#foobar');

//Good
$el.setCss('background', 'green'); //command
$el.getCss('color'); //query

//Bad
$el.css('background', 'green'); //command
$el.css('color'); //query
```

#consistency
* **Never** name functions like `str_repeat, strpos, substr`.
* **Never** shuffle around posistions of arguments. If you declare
`find_in_array(haystack, needle)` at some point, introducing `findInString(needle, haystack)` will arouse zombies from graves to hunt you down in the future.
* Choose one style and stick to it - even if you find yourself disliking it at some point in the future.

#handle-arguments
Consider sample code below.
Try to reduce the need for boilerplate code with tricks shown below and your API users will invite you over for a drink.
```javascript
// bad
jQuery("#some-selector")
.css("background", "red")
.css("color", "white")
.css("font-weight", "bold")
.css("padding", 10);

// good
jQuery("#some-selector").css({
  "background" : "red",
  "color" : "white",
  "font-weight" : "bold",
  "padding" : 10,
  "keyup": myKeyupHandler
});
```

```javascript
<input type="text" value="" data-default="foo">
<input type="text" value="" data-default="bar">
<input type="text" value="" data-default="baz">

// alright but not that good
jQuery('input').each(() => {
  var $this = jQuery(this);
  $this.val($this.data('default')); 
});

// good!
jQuery('input').val(() => {
  return jQuery(this).data('default');
});
```

#named-arguments
Consider sample below which is utterly a nightmare.
```javascript
event.initMouseEvent("click", true, true, window,
123, 101, 202, 101, 202,
true, false, false, false,
1, null);
```
Point is - `No matter how good your docs is, do what you can so 
people don't have to look things up`

#extensibility
Focus on the primary user cases, only do the things most of your
API users will need. Everything else should be left up to them.

#callback
```javascript
var readFile = (path, name, done) => {
  var res = fHandle.read(path, name);

  if(res) {
    done(res);
  }
};
```

#event
```javascript
var widget = () => {
  
  var show = () => {
    $('.dialog').show();
    $.trigger('dialog' + ':' + 'show');  
  };

  return {
    show: show
  };
};

$(document.body).on('dialog:show', () => {
   // do something 
});
```

#hooks
```javascript
// define a custom css hook
jQuery.cssHooks.custombox = {
  get: function(elem, computed, extra) {
    return $.css(elem, 'borderRadius') == "50%" ? "circle" : "box";
  },
  set: function(elem, value) {
    elem.style.borderRadius = value == "circle" ? "50%" : "0";
  }
};
// have .css() use that hook
$("#some-selector").css("custombox", "circle");
```









