
* Fundamental
  * [Scaling and load balancing](scaling_load_balancing.md)
  * [Web Caching](web_caching.md)
  * [Streams](stream.md)
* Miscellaneous
  * [Module Loading](#module-loading)
* Best Practice
  * [Production Deployment](#production_deployment.md)
  * [Graceful shutdown](#graceful_shutdown.md)

# module-loading
```javascript
const foo = require('./foo');

// first look for foo.js in current directory
// if not found, search for index.js in ./foo/index.js
// or else throws out error 'module not found'
```
