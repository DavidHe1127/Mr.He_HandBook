#Best Practice

* Using single var pattern when defining several variables
```var a = 1, b = 2, c = 3;```

* When enumerating an object you need to filter the prototype methods 
```javascript
typeof object[key] !== 'function' // or object.hasOwnProperty(key)
```

* Cache the length of an array
``` for(var i = 0, max = Array.length; i < max; i++) {//Do something} ```

* Always ends switch with a default to ensure there is always a sane result

* Use !==  and  ===

* Use `Number("08")`  rather than parseInt when doing int conversion

* Use `var o = {} and var a = []` literal way rather than new Object and new Array()

* '' means null while ' ' means one whitespace

* Context is always the value of the `this` keyword, which is a reference to the object that **owns** the currently executing code

* Each "+" operation will trigger memory allocation. Use
`var a = [1,2].join('');`
