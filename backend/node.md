
* Fundamental
  * [Scaling and load balancing](./links/scaling_load_balancing.md)
  * [Web Caching](./links/web_caching.md)
  * [Streams](./links/stream.md)
* Miscellaneous
  * [Module Loading](#module-loading)
* Best Practice
  * [Production Deployment](./links/production_deployment_tips.md)
  * [Graceful shutdown](./links/graceful_shutdown.md)

# module-loading
```javascript
const foo = require('./foo');

// first look for foo.js in current directory
// if not found, search for index.js in ./foo/index.js
// or else throws out error 'module not found'
```
