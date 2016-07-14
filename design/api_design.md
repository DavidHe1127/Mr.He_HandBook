## Table of Contents

* [Declarative better than Imperative](#declarative)
* [Method Chaining](#method-chaining)
* [Command and Query Separation](#cqs)
* [Consistency](#consistency)
* [Handling Arguments](#handle-arguments)
  * [Named Arguments](#named-arguments)
* [Extensibility](#extensibility)
  * [Callback](#callback)
  * [Event](#event)
  * [Hooks](#hooks)
* [Validations](#validations)
* [Summary](#summary)

#declarative
Most of you know that a declarative style of programming results in less code.
It tells a computer what to do without specifying how, while an imperative style
of programming describes how to do it. JavaScript's call to the DOM API is an example of imperative programming. jQuery is another such example

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
DateInterval.nameHooks = {
  "yesterday": function () {
    var d = new Date();
    d.setTime(d.getTime() - 86400000);
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    return d;
  }
};

DateInterval.prototype.start = function (date) {
  if (date === undefined) {
    return new Date(this.startDate.getTime());
  }
  if (typeof date === "string" && DateInterval.nameHooks[date]) {}
  date = DateInterval.nameHooks[date]();
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  this.startDate.setTime(date.getTime());
  return this;
};
var di = new DateInterval();
di.start("yesterday");
```

#validations
Make validation of input a top-level citizen even if it is ugly. Make our program robust means not accepting rubbish and
telling developers about it.
```javascript
var count = (num) => {
 if (typeof num === 'string') {
  return new Error('expect number as input');
 }
};
```

#summary
* An API is a contract between you (the provider) and the user (the consumer). Don’t just change things between versions.
* You should invest as much time into the question - How will people use my software? as you have put into How does my software work internally?
* With a couple of simple tricks you can greatly reduce the developer's efforts (in terms of lines of code).
* Handle invalid input as early as possible — throw Errors.
* Good APIs are flexible, better APIs don’t let you make mistakes.










