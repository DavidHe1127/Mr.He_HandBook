##JS code & snippets

* Object
  * [Create objects with defineProperties](#create-obj-define-property)
* String
  * [Count new lines in string](#count-str-line-break)
  * [Create specified number of string](#create-string)

#create-obj-define-property
`Object.defineProperty` or `Object.defindProperties` can take either `value` or `get/set func`, but not both.

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
Object.defineProperites(obj, {
  'price': {
    value: 10,
    writable: true, // property value can be changed
    configurable: false, // property cannot be deleted
    enumerable: true // property shows up during enumeration of the properties like for(key in obj)
  },
  'code': {
    set: function(val) {
      this.code = val;
    },
    get: function() {
      return this.code;
    }
  }
});
```
