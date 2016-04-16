#Secrets


* There is a prototype property that every JavaScript function has (it is empty by default), and you attach properties and methods on this prototype property when you want to implement inheritance. 

* If an object is created with an object literal (var newObj = {}), it inherits properties from Object.prototype and we say its prototype object (or prototype attribute) is Object.prototype.
If an object is created from a constructor function such as new Object (), new Fruit () or new Array () or new Anything (), it inherits from that constructor (Object (), Fruit (), Array (), or Anything ()). For example, with a function such as Fruit (), each time we create a new instance of Fruit (var aFruit = new Fruit ()), the new instance’s prototype is assigned the prototype from the Fruit constructor, which is Fruit.prototype.

* var obj = {};  
obj.prototype //undefined, why is that? there is an internal property called [[proto]] which is not accessible to programmer. That property points to object prototype. However, most engines make this property accessible as __proto__ 
When you create an object like var o = { a: false, b: "something", ... } then o.__proto__ is Object.prototype

* The critical feature of constructor invocation (when use new) is that the prototype property of the constructor is used as the prototype of the new object

* Two objs are instances of the same class only if they inherit from the same prototype object
```javascript
 r instanceof Range //return true if r inherits from Range.prototype
```

* Every JS function except Function.bind() automatically has a prototype property. The value of this property is an object that has a single non-enumerable constructor property whose value is the function object

* var map = Object.create(null); //map is ideal for hash maps because the absence of a [[Prototype]] removes the risk 	//of name conflicts. Object is completely void of any methods or properties. It is purely for key-value store 
  map + ‘’; //TypeError : Cannot convert object to primitive value

* Use 'g' will make Regex stateful - it remembers the last index of the match and will continue the search starting with that index
i.e ['defabc', 'abc'] reg = /abc/g -> will only match 'defabc' but not 'abc' since lastIndex is 4
solution is set reg.lastIndex = 0 after each match
