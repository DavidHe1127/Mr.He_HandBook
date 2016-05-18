##JS Tricks

* Function
  * [Self-Defining Function](#self-defining-func)
  * [Function arguments Length](#func-arg-len)
  * [Function local static value](#func-static-value)
  * [Function name](#func-name)
  * [Convert arguments to array](#args-to-arr)
* String
  * [Count new lines in string](#count-str-line-break)
  * [Create specified number of string](#create-string)
  * [Get last n characters](#get-last-character)
* Number
  * [Generate random number](#gen-random-num)
  * [Round down to integer](#round-down-integer)
  * [Convert number to binary](#convert-to-binary)
  * [Differentiate between integer and float](#integer-or-float)
* Array
  * [Truncate array](#truncate-array)
  * [Transform array into object](#transform-arr-into-obj)
  * [Convert values to boolean](#convert-values-to-boolean)
  * [Get last elements](#get-last-element)
* Object
  * [Ideal object](#ideal-obj)

#self-defining-func
```javascript
var scareMe = function() {
     alert('Boo!');
     scareMe = function() {
     	  alert("Double boo!");
     };
};
scareMe(); // Boo!
scareMe(); // Double Boo!
```

#func-arg-len
```javascript
function check(args) {
    var actual = args.length;
    var expected = args.callee.length;
    console.log(actual, expected); // actual : 0 expected : 3
}

function f(x, y, z) {
    check(arguments);
}

f();
```

#func-static-value
```javascript
function count() {
   if(typeof count.i === 'undefined') {
      count.i = 0;
   } 
   return count.i++;
}
```

#func-name
```javascript
function A() {}

var B = function(callback) {
    console.log(callback.name); //name - internal property of function. Only available in 
                          //function declaration form	     
};

B(A); //'A'

var object = {
  someMethod: function object_someMethod() {}
};

console.log(object.someMethod.name); // logs "object_someMethod"
```

#args-to-arr
```javascript
var argArray = Array.prototype.slice.call(arguments);
```

#count-str-line-break
```javascript
var a = 0;
for (var y = 0, len = str.length; y < len; y++) {
    if (str.charCodeAt(y) === 13) {
        a++;
    }
}
```

#create-string
```javascript
new Array(256).join('-');  // create 255 dashes
```

#get-last-character
```javascript
'12345'.sbustr(-3); // 345
```

#gen-random-num
```javascript
var rnd = Math.floor(Math.random() * n);  // between 0~N
var rnd = Math.random(); //between 0~1
```

#round-down-integer
```javascript
11.887 | 0 === 11; 
```

#convert-to-binary
```javascript
4.toString(2); // convert 4 to 100
```

#integer-or-float
```javascript
12 % 1 === 0; // true
1.2 % 1 === 0; // false
```

#truncate-array
```javascript
var myArray = yourArray = [1, 2, 3];
myArray = []; // "yourArray" is still [1, 2, 3]
myArray.length = 0; // "yourArray" and "myArray" both []
```

#array-merge-by-push
```javascript
var mergeTo = [4,5,6], mergeFrom = [7,8,9];
Array.prototype.push.apply(mergeTo, mergeFrom); // mergeTo : [4,5,6,7,8,9]
```

#remove-duplicates-in-array
```javascript
[1,2,34,34,2,1].filter((ele, pos, arr) => {
	return arr.indexOf(ele) == pos;
});
```

#transform-arr-into-obj
```javascript
var arr = ["apple", "orange", "apple", "orange", "pear", "orange"];
function getWordCnt() {
    return arr.reduce(function(prev, next) {
        prev[next] = (prev[next] + 1) || 1;
        return prev;
    }, {});
}
//result : {"apple":2,"orange":3,"pear":1}
```

#convert-values-to-boolean
```javascript
['', 0, 'a', 'b'].filter(Boolean)  // ['a', 'b']
```

#get-last-element
```javascript
[1,2,3,4,5].slice(-2); // [4, 5]
[1,2,3].slice(-1); // [3]
```

#ideal-obj 
```javascript
var map = Object.create(null); // map is ideal for hash maps because the absence of a [[Prototype]] 
                             // removes the risk of name conflicts. Object is completely void of any methods or properties 
                             // It is purely for key-value store 
  map + ‘’; //TypeError : Cannot convert object to primitive value
```
