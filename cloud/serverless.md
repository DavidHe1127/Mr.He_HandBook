* [Best practice](#best practice)

### best practice

Handler should be as thin as possible and reference utils/modules sitting in different files than handler. If those modules are adequately unit tested, then testing the serverless part of your application (i.e., the handlers) will be easy during the integration tests.

```js
// need to be covered as much as possible by unit tests
const utils = require('../utils');

const createUser = (event, context) => {
  const user = utils.CreateUser(event.user)
  const avatarUrl = utils.updateAvatar(user)
  
  return {
    statusCode: 200,
    body: 'User Created!'
  };
}
```




