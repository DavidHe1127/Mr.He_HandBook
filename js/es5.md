##ES5 uncommon APIs

* Object
  * [Create objects with defineProperties](#create-obj-define-property)
* String
  * [String replacement](#string-replacement)
* Array
  * [Array reverse](#array-reverse)
  * [Array sort](#array-sort)
* Date
  * [UTC, ISO and local time](#utc-iso-local-time)

#create-obj-define-property
 * `Object.defineProperty` or `Object.defindProperties` can take either `value` or `get/set func`, but not both.
 * `configurable, writable, enumerable` default to `false`.
 * Use either combinations `writable/value`, `get/set` on a property.

**Object.defineProperties**
```javascript
function Product(name, price) {
  this.name = name;
  this.price = price;
  var _discount; //private member
  
  Object.defineProperty(this, 'discount', {
    get: function() {
      return _discount;
    },
    set: function(value) {
      _discount = value;
      _discount > 80 && (_discount = 80);
    }
  });
}
var sneaker = new Product('Sneaker', 20);
sneaker.discount = 50; //50, setter is called
sneaker.discount += 20; //70, setter is called
sneaker.discount += 20; //80, not 90
```
**Object.defineProperties**
```javascript
var obj = {};
Object.defineProperties(obj, {
  'price': {
    value: 10,
    writable: true, // property value can be changed
    configurable: false, // property cannot be deleted
    enumerable: true // property shows up during enumeration of the properties like 
  },
  'code': {
     get: function() {
       return 'BD001';
    },
    enumerable: true
  },
  'color': {
     get: function() {
       return 'red';
     }  
  }
});
console.log(obj); // { price: 10, code: [Getter] } color property not show up since it is not enumerable
obj.code = 10; // throws an error since no setter defined
```

#string-replacement
```javascript
function replacer(match, p1, p2, p3, offset, string){
  // p1 is nondigits, p2 digits, and p3 non-alphanumerics
  console.log([p1, p2, p3].join('-')); // abc-12345-#$*%:
};
var newString = "abc12345#$*%".replace(/([^\d]*)(\d*)([^\w]*)/, replacer);
```

#array-reverse
```javascript
var myArray = ['one', 'two', 'three'];
var result = myArray.reverse(); 
console.log(myArray) // ['three', 'two', 'one']
console.log(result) // ['three', 'two', 'one']
```

#array-sort
Basic usage
```javascript
var fruit = ['cherries', 'apples', 'bananas'];
fruit.sort(); // ['apples', 'bananas', 'cherries']

var scores = [1, 10, 2, 21]; 
scores.sort(); // [1, 10, 2, 21]
// Watch out that 10 comes before 2,
// because '10' comes before '2' in Unicode code point order.

var things = ['word', 'Word', '1 Word', '2 Words'];
things.sort(); // ['1 Word', '2 Words', 'Word', 'word']
// In Unicode, numbers come before upper case letters,
// which come before lower case letters.
```
`sort` also takes a **compare** as a function with two arguments.
```javascript
['a', 'b'].sort((a, b) => {
  if (a < b) {
    return -1; // sort a to a lower index than b
  }
  if (a > b) {
    return 1; // sort b to a lower index than a
  }
  return 0; // leave a and b unchanged order
});
```
To compare numbers instead of strings, use
```javascript
var numbers = [4, 2, 5, 1, 3];
var res = numbers.sort(function(a, b) {
  return a - b; // ascending order, b -a descending order
});

console.log(numbers, res); // both are [1, 2, 3, 4, 5]
```
`sort` based on a already-sorted array breaks the former order!!! - **NOT PRESERVE IT**. Use either `lodash` or `underscore`
`sortBy` instead.
``` javascript
var items = [{
  name: 'Edward',
  value: 21
}, {
  name: 'Sharpe',
  value: 37
}, {
  name: 'And',
  value: 45
}, {
  name: 'The',
  value: -12
}, {
  name: 'Zeros',
  value: 37
}];
items.sort(function(a, b) {
  if (a.value > b.value) {
    return 1;
  }
  if (a.value < b.value) {
    return -1;
  }
  
  return 0;
}).sort(function(a, b) {
  if (a.name > b.name) {
    return 1;
  }
  if (a.name < b.name) {
    return -1;
  }
  
  return 0;
});

// first sort yields: 
 [{ name: 'The', value: -12 },
  { name: 'Edward', value: 21 },
  { name: 'Sharpe', value: 37 },
  { name: 'Zeros', value: 37 },
  { name: 'And', value: 45 }]

// second sort yields:
 [{ name: 'And', value: 45 },
  { name: 'Edward', value: 21 },
  { name: 'Sharpe', value: 37 },
  { name: 'The', value: -12 },
  { name: 'Zeros', value: 37 }]
```

#utc-iso-local-time
Code below is running in Sydney AEST +10:00
```javascript
let date = new Date();

date.getHours(); // 20
date.getUTCHours(); // 10

let today = new Date('05 October 2011 14:48 UTC');
today.toISOString(); // 2011-10-05T14:48:00.000Z

// timezone is always zero UTC offset denoted by 'Z'
```








