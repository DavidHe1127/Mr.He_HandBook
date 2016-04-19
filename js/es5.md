##ES5 uncommon APIs

* Object
  * [Create objects with defineProperties](#create-obj-define-property)
* String
  * [String replacement](#string-replacement)

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
