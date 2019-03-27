Webpack tips & notes

* [require.context](#require-context)

### require-context
```js
// working
require.context('./templates', false, /\*.js/);

var regexp = /^\.\/.*\.js$/;
var req = require.context("./templates", false, regexp);   // Uncaught Error

var bool = false;
var req = require.context("./templates", bool, /^\.\/.*\.js$/);   // Uncaught Error

var dir = "./templates";
var req = require.context(dir, false, /^\.\/.*\.js$/);   // Uncaught Error
```
Webpack needs to determine at build time (before any of your code runs) which files need to be bundled. It doesn't necessarily have to be a static string, it could also be a variable defined with the `DefinePlugin` or basic string operations applied these things.





