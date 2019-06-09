## Hooks
* [useState](#use-state)
* [useCallback](#use-callback)
* [Tips & Best practices](#tips-best-practices)


### use-state
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

### use-callback
For better performance. i.e avoid creating new func repeatedly. Put deps in the array as the 2nd argument, when you access them from inside the func.

```js
const { setNav } = props;
const [ value, setValue ] = useState('');

const onClick = useCallback(e => {
  setNav(value); // put value in dep array as you access it!

}, [setNav, value]);
```

### tips-best-practices
Declare functions needed by an effect inside of it.
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

