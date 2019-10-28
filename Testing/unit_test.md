## Unit Test Tips/Code Snippets

- Good articles
  - [javascript-testing-best-practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
  - [Jest cheatsheet](https://github.com/sapegin/jest-cheat-sheet)
- [Mocking modules](#mocking-modules)
- [Mock required, non-existent file](#mock-required-non-existent-file)
- [Mock large input](#mock-large-input)
- [Partially mock a module/class](#partially-mock-a-module-or-class)
- [Mock function](#mock-function)

### Mocking Modules

Mock your module when you need to:

1) Monitor how a function/module is called/used
2) Change the original implementations

```js
// code.js
import Cookie from 'cookies-js';

Cookie.get('key');
Cookie.set('key');

// code.spec.js
let mockGetCookie = jest.fn();
let mockSetCookie = jest.fn();

jest.mock('cookies-js', () => ({
  __esModule: true, // mock the exports
  default: {
    set: jest.fn().mockImplementation((...args) => {
      mockSetCookie(...args);
    }),
    get: jest.fn().mockImplementation((...args) => {
      mockGetCookie(...args);
    })
  }
}));
// ...
it('should call Cookie.set', () => {
  expect(mockSetCookie).toHaveBeenCalledWith('key');
});
```

### Mock required non-existent file

```js
// runtimeConfig.json does not exist on the filesystem, but your test
// will still execute and your code will use this runtimeConfig.json file
jest.mock('./runtimeConfig.json', () => ({ env: 'QA1' }), { virtual: true });
```

### Mock large input

Use snapshot to test the return value is expected.

```js
it('should get sort characters', () => {
  const result = sortedByName(require('./starWarsCharacters.json'));
  expect(result).toMatchSnapshot();
});
```

### Partially mock a module or class
Basically, 2 ways to partially mock a module:
```js
// 1st approach
import * as apolloHooks from '@apollo/react-hooks';

jest.spyOn(apolloHooks, 'useApolloClient').mockImplementationOnce(() => {
  return {
    writeQuery: jest.fn(),
    readQuery: jest.fn()
  };
});

// 2nd approach
jest.mock('./browserStorage', () => ({
  ...jest.requireActual('./browserStorage'),
  get: jest.fn(),
}));

const {get: mockGet} = require('./browserStorage');
```

Remember, ES6 class is just syntactic sugar for prototype-based class, so we can do this:

```js
jest.mock('./myClass', () => {
  const module = jest.requireActual('./myClass');
  
  module.myClass.prototype.oneMethod = jest.fn().mockImplementationOnce(() => ({
    id: '2def'
  })).mockImplementationOnce(() => {
    id: '1abc'
  });

  return module;
});
```
Note, call `mockImplementationOnce` twice enable you to have 2 different behaviours. i.e resolve fisrt then reject in the same targeting method.

### Mock function

```js
const myObj = {
  myMethod: jest.fn().mockReturnThis(),
};

// is the same as

const otherObj = {
  myMethod: jest.fn(function() {
    return this;
  }),
};
```
Call can be chained when needing access to mocked function returned by another mocked function. Example below shows how you can get the first argument of the first call to a mocked function which is returned by `someMockFunc` as the second element in the array `value[1]`.

```js
someMockFunc.mock.results[1].value[1].mock.calls[0][0]
```





