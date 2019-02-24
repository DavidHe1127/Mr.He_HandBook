
* Internals
  * [Node internals](./links/node_internals.md)
  * [nextTick vs setImmediate](./links/nexttick_vs_setimmediate.md)
* Fundamental
  * [Scaling and load balancing](./links/scaling_load_balancing.md)
  * [Web Caching](./links/web_caching.md)
  * [Streams](./links/stream.md)
* Miscellaneous
  * [Module Loading](#module-loading)
* Best Practice
  * [Production Deployment](./links/production_deployment_tips.md)
  * [Graceful shutdown](./links/graceful_shutdown.md)
  * [Manage Environment Variables](#manage-env-vars)
  * [Hoisting import](#hoisting-import)
  * [logging](#logging)

### module-loading
```javascript
const foo = require('./foo');

// first look for foo.js in current directory
// if not found, search for index.js in ./foo/index.js
// or else throws out error 'module not found'
```

### manage-env-vars
* Use [dotenv](https://github.com/motdotla/dotenv) to load env vars for development **ONLY**.
  ```js
  if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }
  ```
  For production, use deployment host to set variables.

* Have a `.env.example` file as a base to unfold potential params for other team members to share.
* `.env` needs to be shortlisted in `.gitignore`.

 [Good readings](https://www.twilio.com/blog/2017/08/working-with-environment-variables-in-node-js.html)

### hoisting-import
Import will be hoisted during evaluations!

Entry
```js
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
  console.log(11);
}

import firebase from './firebase';
```

module firebase
```js
console.log(1333)
const firebase = 12;

export default firebase;
```
Execution will print `1333` followed by `11`.

### logging

The target should always be the standard output/error. It is not the responsibility of the application to route logs.


