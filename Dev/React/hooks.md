## Hooks

- [useState](#useState)
- [useCallback](#useCallback)
- [useEffect](#useEffect)
- [Custom Hook example](#custom-hook-example)
- [Tips & Best practices](#Tips-n-best-practice)

### useState

When there is too many states to be managed, you can do this:

```js
const initialState = { loading: false, results: [], value: '' };

const App = () => {
  const [{ loading, results, value }, setState] = useState(initialState);

  // setState
  setState(prevState => ({ ...prevState, loading: true, value }));

  // reset all states
  setState(prevState => ({ ...initialState }));
};
```

### useCallback

For better performance. i.e avoid creating new func repeatedly which causes unnecessary re-rendering of child component which accepts the callback as a prop. Put deps in the array as the 2nd argument, when you access them from inside the func.

```js
const { setNav } = props;
const [value, setValue] = useState('');

const onClick = useCallback(
  e => {
    setNav(value); // put value in dep array as you access it!
  },
  [setNav, value]
);
```

Note, it's a perfect fit for `useCallback` in the above example as `value` referenced by arrow function is defined outside the arrow function scope.


### useEffect

- delays the running of a piece of code until that render is reflected on the screen.
- multiple `useEffect` in one component is ok to separate logic. React will run code in `useEffect` in the order they're defined after component finishes rendering.


### Custom Hook Example
Write custom hook when you feel a need to share common logic.

```jsx
// hook
function useSmartPassword() {
  const [isValid, setValid] = useState(false);

  const onChange = e => {
    const newValue = e.target.value;
    let _isValid = false;
    if (newValue.length >= 8) _isValid = true;
    setValid(_isValid);
  };

  return [isValid, onChange];
}

function Form() {
  const [isValid, onPasswordChange] = useSmartPassword();
  return (
    <div className="Form">
      <label htmlFor="password">Password: </label>
      <input id="password" onChange={e => onPasswordChange(e)} />
      {isValid ? <p>Your password is valid </p> : null}
    </div>
  );
}
```

### Tips-n-best-practice

- Declare functions needed by an effect inside of it:

```js
// bad
function Example({ someProp }) {
  function doSomething() {
    console.log(someProp);
  }

  useEffect(() => {
    doSomething();
  }, [someProp]);
}

// good
function Example({ someProp }) {
  useEffect(() => {
    function doSomething() {
      console.log(someProp);
    }

    doSomething();
  }, [someProp]);
}
```

- React uses `Object.is(a, b)` to do referential equality check.
- The function passed to `useEffect` will run after the render is committed to the screen.
