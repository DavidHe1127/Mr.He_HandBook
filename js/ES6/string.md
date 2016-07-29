##New ES6 String APIs

* String
  * [Includes](#string-include)
  * [Repeat](#string-repeat)
  * [Interpolation](#string-interpolation)

#string-include
```javascript
var str = 'To be, or not to be, that is the question.';

console.log(str.includes('To be'));       // true
console.log(str.includes('question'));    // true
console.log(str.includes('nonexistent')); // false
console.log(str.includes('To be', 1));    // false
console.log(str.includes('TO BE'));       // false
```

#string-repeat
```javascript
'abc'.repeat(-1); // RangeError
'abc'.repeat(0); // ''
'abc'.repeat(1); // 'abc'
'abc'.repeat(3); // 'abcabcabc'
```

#string-interpolation
```javascript
var me = "David";
var you = {
    "name": "Tracy"
};

var greetings = `Hi ${me}, My name is ${you.name} we love this game`;
var o = {
    x: 1,
    y: 2
};

console.log(`${o.x + o.y}`); // 6
console.log(`${() => {}()}`); // undefined
```