##New ES6 argument, parameter operators

* Arguments and Parameters
  * [Spread Operator](#spread-operator)
  * [Rest Parameters](#rest-parameter)
  * [Default Parameters](#default-parameter)
  * [Destructuring](#destructuring)
  * [Argument Callee](#callee)

#spread-operator
`...` basically expands `array` into individual parameters.

```javascript
function a(first, second) {
  console.log(first, second); // 10 15
  console.log(arguments[0]); // 10
  console.log(arguments[1], arguments[2]); // 15 20
  console.log(arguments[3]); // 25
}

var params = [10, 15];
a(...params, 20, ...[25]);    // 5 10 15 20 25
```

#rest-parameter
Same syntax as spread operator but collects parameters and turns them into an "array". Not real array but has array built-in methods.
```javascript
function a(string, ...keys) {
  console.log(string, ...keys); // a A B
  console.log(...keys[0], ...keys[1]); // A B
  console.log(Array.isArray(...keys)); // false
  console.log(...keys.shift()); // A
}
a('a', 'A', 'B');   // true
```
Two things to keep in mind
* must be last argument
* only one rest parameter allowed

Both code samples below throw out errors
```javascript
function a(a, ...params, b) {
  console.log(a, params, b);
}
a(5, 10, 15);    // SyntaxError: parameter after rest parameter

function a(...param1, ...param2) {
}
a(5, 10, 15);    // SyntaxError: parameter after rest parameter
```

#default-parameter
```javascript
var getDefault = function () {
  return 4;
};

function a(a, b = ++a, c = getDefault()) {
  console.log(c); // 4
  console.log(a); // 1
  console.log(b); // 2
}
a(1, 2);
```

#destructuring
```javascript
function a({port}, bundle = {
  protocol,
  port
}) {
  console.log(port, bundle.protocol); // 888 http
};

var options = {
  protocol: 'http',
  port: 800
}

a(options, options);

function b({
  delay = 150,
  log = true
}) {
  console.log(delay, log); // 150 false
}

var c = {
  log: false
};

b(c);
```
If parameters are omitted, errors thrown out.
```javascript
function a({protocol, port, delay, retries, timeout, log}) {
}
a(); // TypeError: Cannot match against 'undefined' or 'null'
```
To fix it, we need to assign a default value
```javascript
function a({protocol, port, delay, retries, timeout, log} = {}) {
}
a(); // no error
```
Use destructuring to check mandatory parameter
```javascript
function throwError() {
    throw new Error('Missing parameter');
}
function a(param1 = throwError()) {
}
a(10); // ok
a(); // Error: missing parameter
```

#callee
```javascript
arguments.callee; // refer to func currently being executed
```



