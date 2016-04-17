##ES6 uncommon APIs

* Array
  * [Find and findIndex](#find-findindex)
  * [From](#array-from)
  * [Includes](#array-include)
* String
  * [String replacement](#string-replacement)

#find-findindex
* `Array.find` find the first matched element or `undefined` if no match.
* `Array.findIndex` return index of first matched elemnt or `-1` if no match.

```javascript
[1, 4, -2, -5, 10].find(n => n < 0); // -2
[-1, 2, 3].findIndex(n => n > 0); // 1
```

#array-from
```javascript
Array.from('hello'); // [ 'h', 'e', 'l', 'l', 'o' ]
Array.from([1, 2, 3]); // [1, 2, 3]
function foo() {
  var args = Array.from(arguments); // [2, 'x', 'c']
}

Array.from({
	length: 2
}, () => 'jack'); // ['jack', 'jack']

foo(2, 'x', 'c');
```

#array-include
Take two arguments, `searchElement` and `fromIndex`. `fromIndex` defaults to `0` and search from end of the array if
any negative value is given.
```javascript
[1, 2, 3].includes(2);     // true
[1, 2, 3].includes(4);     // false
[1, 2, 3].includes(3, 3);  // false
[1, 2, 3].includes(3, -1); // true
[1, 2, NaN].includes(NaN); // true
```

