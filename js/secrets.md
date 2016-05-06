#Secrets

### Prototype
* Every JS func (except Fucntion.bind) has a prototype property - an empty object by default. You attach properties and methods on this prototype property in order to implement inheritance. 

* If an object is created with an object literal `var newObj = {}`, it inherits properties from Object.prototype and we say its prototype object (or prototype attribute) is Object.prototype.
If an object is created from a constructor function such as `new Object (), new Fruit () or new Array () or new Anything ()`, it inherits from that constructor `Object (), Fruit (), Array (), or Anything ()`. For example, with a function such as Fruit (), each time we create a new instance of Fruit `var aFruit = new Fruit ()`, the new instance’s prototype is assigned the prototype from the Fruit constructor, which is Fruit.prototype.

* var obj = {};  
obj.prototype //undefined, why is that? there is an internal property called `[[proto]]` which is not accessible to programmer. That property points to object prototype. However, most engines make this property accessible as `__proto__` 
When you create an object like `var o = { a: false, b: "something", ... }` then `o.__proto__` is Object.prototype

* The critical feature of constructor invocation (when use new) is that the prototype property of the constructor is used as the prototype of the new object

* Two objs are instances of the same class only if they inherit from the same prototype object
```javascript
 r instanceof Range //return true if r inherits from Range.prototype
```

* Use `'g'` will make Regex stateful - it remembers the last index of the match and will continue the search starting with that index
```javascript
var arr = ['defabc', 'abc'] 
var reg = /abc/g // will only match 'defabc' but not 'abc' since lastIndex is 4 
arr.forEach((ele) => ele.test(reg)); // solution is set reg.lastIndex = 0 after each match
```

* Use `Array.prototype.concat()` will leave the originals untouched. Furthermore, any operation on the new array will have no effect on the original arrays, and vice versa.
```javascript
let arr1 = [1,2];
var res2 = arr1.concat();
res2.push(5);
// res2 [1,2,5] arr1 [1,2]
```

* Primitive type are compared by value while Reference type are compared by reference and value
```javascript
console.log(3 == 3) //true
console.log([1] == [1]) //false
```

* `isNaN()` converts empty string into zero. As a result, `isNaN("  ")` or `isNaN("")` returns **false**. Use `parseInt` will fix this problem as `parseInt` will fail to convert empty string into number
```javascript
isNaN(parseInt("")); //true
```

* Use toFixed to round number to N decimal place
```javascript
var num = 2.443242342;
num = num.toFixed(4);  // num will be equal to "2.4432" IT IS A STRING!!!
```

### Pass by Reference & Pass by Value
The function only knows the value not the argument's **location**.
`Objects` **references** are values - that is why `Objects` behave like they are passed by reference.
```javascript
let a = {
  a: 1,
  c: []
};

let b = 1;

const d = (a) => {
  a = 4;
};

d(b); // a: 1, b: {a:1, c:[]}
```















