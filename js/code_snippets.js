* Self-Defining Function
var scareMe = function() {
     alert('Boo!');
     scareMe = function() {
     	  alert("Double boo!");
     };
};
scareMe(); // Boo!
scareMe(); // Double Boo!

* function add() {
    var total = 0;
    for (var i = 0, l = arguments.length; i < l; i++) {
        total = total + arguments[i];
    }
    return total;
}
alert(add(2, 2, 2, 2));

* The length of function arguments
i.e. :
function check(args) {
	var actual = args.length;
	var expected = args.callee.length;
	alert(actual + '\n' + expected); // actual : 0 expected : 3
}

function f(x, y, z) {
	check(arguments);
}

f();

* Check how many '\n' in one string
var a = 0;

for (var y = 0, len = str.length; y < len; y++) {
    if (str.charCodeAt(y) === 13) {
        a++;
    }
}

* JS Static Local Value
function count() {
   if(typeof count.i === 'undefined') {
      count.i = 0;
   } 
   return count.i++;
}

* Generate random number
var rnd = Math.floor(Math.random() * n);  // between 0~N
var rnd = Math.random(); //between 0~1

*	0  1  2  3
     	4  5  6  7
     	8  9 10 11

0,4,8 % 4 = 0;
1,5,9 % 4 = 1;
2,6,10 % 4 = 2;
3,7,11 % 4 = 3;

0,1,2,3 / 4 < 1
4,5,6,7 / 4 < 2
8,9,10,11 / 4 < 3

* Array Length for Truncation
var myArray = yourArray = [1, 2, 3];

myArray = []; // "yourArray" is still [1, 2, 3]

// The right way, keeping reference
myArray.length = 0; // "yourArray" and "myArray" both []

* Array Merging with push
var mergeTo = [4,5,6], mergeFrom = [7,8,9];

Array.prototype.push.apply(mergeTo, mergeFrom); // mergeTo : [4,5,6,7,8,9]

* function replacer(match, p1, p2, p3, offset, string){
  // p1 is nondigits, p2 digits, and p3 non-alphanumerics
  return [p1, p2, p3].join(' - ');
};
var newString = "abc12345#$*%".replace(/([^\d]*)(\d*)([^\w]*)/, replacer);
// "abc - 12345 - #$*%":

* Slick way of removing duplicates in an array
[1,2,34,34,2,1].filter(function(ele, pos, arr) {
	return arr.indexOf(ele) == pos;
});

* Get inspired by the fancy way of using reduce?

var arr = ["apple", "orange", "apple", "orange", "pear", "orange"];
function getWordCnt() {
    return arr.reduce(function(prev, next) {
        prev[next] = (prev[next] + 1) || 1;
        return prev;
    }, {});
}
//result : {"apple":2,"orange":3,"pear":1}

* Think about the following implementation
function Product(name, price) {
    this.name = name;
    this.price = price;
    var _discount; // private member
    Object.defineProperty(this, "discount", {
        get: function() {
            return _discount;
        },
        set: function(value) {
            _discount = value;
            if (_discount > 80) _discount = 80;
        }
    });
}
var sneakers = new Product("Sneakers", 20);
sneakers.discount = 50; // 50, setter is called
sneakers.discount += 20; // 70, setter is called
sneakers.discount += 20; // 80, not 90!

* slick way of filtering falsy value out
['', 0, 'a', 'b'].filter(Boolean) => returns ['a', 'b']

