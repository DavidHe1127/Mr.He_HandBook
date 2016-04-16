##JS code & snippets

* Function
  * [Self-Defining Function](#self-defining-func)
  * [Function arguments Length](#func-arg-len)
  * [Function local static value](#func-static-value)
* String
  * [Count new lines in string](#count-str-line-break)
* Number
  * [Generate random number](#gen-random-num)
* Array
  * [Truncate array](#truncate-array)
  * [Transform array into object](#transform-arr-into-obj)
  * [Convert values to boolean](#convert-values-to-boolean)
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

#count-str-line-break
```javascript
var a = 0;
for (var y = 0, len = str.length; y < len; y++) {
    if (str.charCodeAt(y) === 13) {
        a++;
    }
}
```

#gen-random-num
```javascript
var rnd = Math.floor(Math.random() * n);  // between 0~N
var rnd = Math.random(); //between 0~1
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

#ideal-obj 
```javascript
var map = Object.create(null); // map is ideal for hash maps because the absence of a [[Prototype]] removes the risk of name                                    // conflicts. Object is completely void of any methods or properties. It is purely for key-value store 
  map + ‘’; //TypeError : Cannot convert object to primitive value
```
