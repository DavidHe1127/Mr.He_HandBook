## Redux

* [3 must-follow rules](#3-must-follow-rules)
* [Action essentials](#action-essentials)
* [Reducer essentials](#reducer-essentials)
* [Store essentials](#store-essentials)
* [Miscellaneous](#miscellaneous)
* [Use with React](#use-with-react)

### 3-must-follow-rules
* Only one single store holding the whole App state
* State is ready-only - the only way to change it is to emit an action and an object describing the changes (payload)
* Changes are made with pure reducers - take previous state and an action, and return the next state - NO state MUTATION ALLOWED

### action-essentials
* Only source of information for store
* Being sent to Store by using `store.dispatch()`
* Action is comprised of type and payload - can be object, string, array
* Pass as minimal data as possible to each action
Action Creator
```javascript
function addTodo(text) {
  return {
    type: ADD_TODO,
    text
  }
}
```
Dispatch action
```
dispatch(addTodo(text)); // When being used together with react, we typically access dispatch via connect()
```

### Reducers-essentials
* Specify how the App state changes
```javascript
(previousState, action) => newState

action - action.type, action.payload
```
Things below must not happen in reducers.
* Mutate existing values. Instead, it needs to return a new object with new state
* Perform side effects like API calls and routing transitions
* Call non-pure functions. i.e `Date.now()` or `Math.random()`

* App state needs to be separated from UI state
* Things should never happen in reducers
  * Mutate arguments
  * Perform side effects like API calls and routing transitions
  * Call non-pure functions. e.g `Date.now()` or `Math.random()`

### store-essentials
* Responsibilities
  * Hold App state
  * Allow access to state via `getState()`
  * Allow state to be updated via `dispatch(action)`
  * Register listeners via `subscribe(listener)`
  * Handle unregistering of listeners via the function returned by `subscribe(listener)`
* Create store by passing reducers
```javascript
let store = createStore(todoApp)
```
* Split reducers rather than having multiple stores

### miscellaneous
* The middlware acts like interceptors for actions before they reach the store: they can modify the actions, create more actions, suppress actions and much more.

___

### use-with-react

* Connect store with React container component
```javascript
const FilterLink = connect(
  mapStateToProps,
  mapDispatchToProps
)(Link);
```
* `mapStateToProps` tells how to transform the current Redux store state into the props you want to pass down to presentational components

* Without `mapDispatchToProps`, to call functions being passed down, we need to do this:
```javascript
this.props.dispatch(toggleTodo(id));
```
Bad! Since component is aware of redux.
With the help of this utility function, we can just write:
```javascript
this.props.toggleTod(id)
```
Note: The `dispatch` method is passed down by `Provider` as a prop if you leave out defining your own `mapDispatchToProps`.

* `<Provider>` makes the store available to all container components in the App without passing it explicitly. Only do it once in root component.
```javascript
render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```





