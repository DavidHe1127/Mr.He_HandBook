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

* Use Number("08")  rather than parseInt when doing int conversion

* Use var o = {} and var a = [] rather than new Object and new Array()

* new Array(256).join('-');  //to create 255 dashes

* '' means null while ' ' means one whitespace

* Context is always the value of the this keyword, which is a reference to the object that "owns" the currently executing code

* 11.887 | 0 === 11; Math.ceil(1.1/1.8) = 2;

* Array.concat(); // return a shallow copy of array object

* Instead of using "+" to concatenate the string, USE 
var a = [1,2].join('');

Each "+" operation will trigger memory allocation 

* 23.toString(2) ===> Convert 23 to binery 

* Primitive type are compared by value
var a = 3;
var b = 3;
alert(a == b) //true
Reference type are compared by reference and value
var a = [1];
var b = [1];
alert(a == b) //false

* 
/\\/    // (1) matches one backslash (the 1st occurrence only)
/\\/g   // (2) matches any occurrence of backslash (global search)

* isNaN() converts empty string into zero. As a result, isNaN("  ") or isNaN("") returns false. Use parseInt will fix this problem as parseInt will fail to convert empty string into number : isNaN(parseInt("")); //true

* var argArray = Array.prototype.slice.call(arguments);

* Use toFixed to round number to N decimal place
var num =2.443242342;
num = num.toFixed(4);  // num will be equal to "2.4432" IT IS A STRING!!!

* string to boolean conversion -> myString = myString == “true”;
