## Unit Test Tips/Code Snippets

- Good articles
  - [javascript-testing-best-practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
  - [Jest cheatsheet](https://github.com/sapegin/jest-cheat-sheet)
- Tips
  - [Mocking modules](#mocking-modules)
  - [Mock required, non-existent file](#mock-required-non-existent-file)
  - [Mock large input](#mock-large-input)
  - [Partially mock a module/class](#partially-mock-a-module-or-class)
  - [Mock function](#mock-function)
  - [Mock one given exported method from a 3rd module](#mock-one-given-exported-method-from-a-3rd-module)
  - [Mock direct function reference](#mock-direct-function-reference)
  - [Use doMock to avoid hoisting](#use-domock)
  - [Correct Mocked data](#correct-mocked-data)
  - [Test rejected promise](#test-rejected-promise)
  - [Test a specific test in a spec](#test-specific-test-in-spec)
- Best Practices
  - [Tests should be deterministic](https://jestjs.io/docs/en/snapshot-testing#2-tests-should-be-deterministic)

### Mocking Modules

Mock your module when you need to:

1) Monitor how a function/module is called/used
2) Change the original implementations

```js
// Icon.js
export { A };
export default B;

// test.js
jest.mock("../src/Icon", () => {
  return {
    __esModule: true,
    A: true,
    default: () => {
      return <div></div>;
    },
  };
});
```
Sometimes, you have your whole module mocked out automatically. This is good but you wish you can mock one of exported method manually. You can do:
```js
const { init, warmer, PcsSurvey } = require('../../utils');

jest.mock('../../utils'); // everything is auto-mocked

beforeAll(() => {
  // manually mocks PcsSurvey export
  PcsSurvey.prototype.getSurveyDetails = jest.fn().mockImplementation(() => Promise.resolve(surveyFixture));
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

### Mock one given exported method from a 3rd module
```js
jest.mock('date-fns', () => {
  const original = jest.requireActual('date-fns');
  return { ...original, distanceInWordsToNow: jest.fn(() => 'some time ago') };
});
```

### Use doMock
By default, `jest.mock` will hoist code to the top of test file. This behaviour leads to error when trying to reference a variable defined outside of scope.
```js
// error: jest.mock() is not allowed to reference any out-of-scope variables
let output = null;

jest.mock('./code', () => {
  output = require('./fixtures/test-data.json');
});
```
Use `jest.doMock` can fix it. Change `jest.mock` to `jest.doMock` in the above example.

### Mock direct function reference
`foo` cannot be mocked since mock replaces `export foo` but `foo` is directly called by `bar` leaving `foo` with original implementation.
```js
export const foo = () => return 'original';

function bar() {
  return <div>{foo()}</div>
}

export default bar;
```
The solution would be move `foo` out to a separate helper module and mock that helper.

### Correct mocked data
Ensure mocked data aligns with data produced in the real implementations when mocking out 3rd libraries. This is very crucial for writing correct tests.

```js
// Wrong mocked data can lead to hidden error

// mock data returned by DynamoDB query

// wrong
{
  "name": "David"
}

// actual
{
  "Items": [{
    "name": "David"
  }]
}
```
With wrong one, your test is passed even though actual run of your code would fail.
```js
query().promise().then(res => res.name); // wrong! should be res.Items[0].name
```

### Test rejected promise

```js
const connect = async () => {
  try {
    const conn = await AWS.RDS.connect().promise();
  } catch(err) {
    log.error(err); // rethrow error is useful when you want to log your errors or process it
    throw err;
  }
}

// test
connect().catch(error => {
    expect(error).toEqual(err);
});

// or
await expect(connect()).rejects.toThrow(err);
```

### Test specific test in spec

Use `-t` to match words in description.

```
// e2e/__tests__/main.test.ts
describe('test ecs fargate', () => {
  test('ecs service created', async () => {
    ...
    expect(Object.entries(res).length).not.toEqual(0);
  });
});

// npx jest e2e/__tests__/main.test.ts -t fargate
```
