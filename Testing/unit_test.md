## Unit Test Tips/Code Snippets

- [Mocking modules](#mocking_modules)
- [Mock required, non-existent file](#mock_required_non-existent-file)

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
    }),
  },
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
jest.mock("./runtimeConfig.json", () => ({env: 'QA1'}), { virtual: true });
```

