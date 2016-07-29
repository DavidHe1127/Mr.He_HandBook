##New ES6 function APIs

* Function
  * [Fat arrow](#fat-arrow)

#fat-arrow
* One line of statement can omit `{}`
* Single parameter can omit `()`
```javascript
[1, 2].find(x => x > 0);

var s = [1, 2].find((x, index) => {
  if (index > 3) {
    return true;
  }
  return false;
});
```
Arrow function does have its own `this`. Hence, `this` in code below refers to global variable.
```javascript
var o = {
  name: 'David',
  rename: () => {
    this.name; // not o.name but global variable
  }
};
```

