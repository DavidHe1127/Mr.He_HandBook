## Unit Test Tips/Code Snippets

- Good articles
  - [javascript-testing-best-practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
  - [Jest cheatsheet](https://github.com/sapegin/jest-cheat-sheet)
- [Mocking modules](#mocking-modules)
- [Mock required, non-existent file](#mock-required-non-existent-file)
- [Mock large input](#mock-large-input)
- [Partially mock a module](#partially-mock-a-module)

### Mocking Modules

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

### Partially mock a module
Basically, 2 ways to partially mock a module:
```js
jest.spyOn(lodash, 'random').mockImplementationOnce(() => {
  return 2;
});

jest.mock('./browserStorage', () => ({
  ...jest.requireActual('./browserStorage'),
  get: jest.fn(),
}));

const {get: mockGet} = require('./browserStorage');
```


