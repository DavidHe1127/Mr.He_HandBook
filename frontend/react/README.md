## React Essentials and Tips

* [How react works](#how-react-works)
* [Why use PropTypes](#why-use-proptypes)
* [Component VS Element](#component-vs-element)
* [Event Listeners](#event-listeners)
* [Lifecycle Event Hooks](#lifecycle-hooks)
* [Smart vs Dumb Components](#smart-vs-dumb)
* [Prevent unnecessary re-rendering](#prevent-unnecessary-rerendering)
* [Avoid inadvertent mounting/unmounting](./avoid_inadvertent_mounting_unmounting.md)
* [Why need keys](#why-need-keys)
* [Controlled vs uncontrolled components](#controlled-vs-uncontrolled)
* [Async setState](#async-setstate)
* [Useful tools/resources](#useful-tools-resources)
* [Render Props](#render-props)
* [Create component dynamically](#create-component-dynamically)
* [Namespace your components](#namespace-your-components)
* [Why findDOMNode only works on classical component](#finddomnode-only-works-on-classical-component)
* [Use shouldComponentUpdate correctly](#use-shouldcomponentupdate-correctly)
* [Use controlled component widely](#use-controlled-component-widely)
* [JSX Control Statement](#jsx-control-statement)
* [Platform-specific styling with styled-components](#platform-specific-styling-with-styled-component)
* [Why need to import react even for stateless components](#react-import-need-for-stateless-component)

### how-react-works
Every time `state` or `prop` changes in component, process below happens
* React will re-render your UI with updated `state` or `prop` to a virtual DOM representation.
* React then smartly calculates the difference between the two virtual DOM (current state vs previous state)
* The resulting difference will be applied to real DOM to reflect changes. Note, React updates only what needs to be updated in the
  real DOM
![React UI update](./rendering-process.gif)

### why-use-proptypes
Use `propTypes` on all occasions - You can use it to document your components. You no longer need to look around the source code of the `render` method to figure out what properties needs to be provided.

> If an element has a key property, elements will be compared by a value of a key, not by index. As long as keys are unique, React will move elements around without removing them from DOM tree and then putting them back (a process known in React as mounting/unmounting).

### component-vs-element
* React element is an object representation of a DOM node and its properties
* A component is a function or a Class which optionally accepts input and returns a React element.

### lifecycle-hooks

|Initialization   |Mounting           |State or Props updating  |Unmounting|
| -------- |:---------------:|:---------------:| --------:|
|getDefaultProps   |constructor|componentWillReceiveProps(props update only)|componentWillUnmount
|getInitialState   |componentWillMount|shouldComponentUpdate|
|                  |componentDidMount|componentWillUpdate|
|                  |                  |render|
|                  |                  |componentDidUpdate|

Init
---
`getDefaultProps` - set default props if parents not pass it down

Mounting
---
`constructor` - initialize `states`
`componentWillMount` - setState will not re-render
`componentDidMount` - fetch data

Updating
---
`componentWillReceiveProps` - setState will not trigger additional re-render / place to access old props
`shouldComponentUpdate` - return true/false def true. if false methods below won't be called - see example below
`componentWillUpdate` - DO NOT use setState() in
`render`
`componentDidUpdate`  - updated DOM interactions and post-render actions go here. **NO setState otherwise it might cause infinite loop**


### smart-vs-dumb
It is a common best practice to create several stateless components that just render data, and have a stateful component wrapping them that passes its state to the children via props. This way you can encapsulate all the interaction logic in one place — the stateful component — , while the stateless components take care of rendering data in a declarative way.

### event-listeners
React doesn’t actually attach event handlers to the nodes themselves, instead when React starts up, it starts listening for all events at the top level using a single event listener, and when your component is mounted the event handlers are added to an internal mapping. Then when an event occurs, React knows how to dispatch it using this mapping. When your component is unmounted the event handlers are removed from the internal mapping so you don’t need to worry about memory leaks.

|Initialization   |Mounting           |State or Props updating  |Unmounting|
| -------- |:---------------:|:---------------:| --------:|
|getDefaultProps   |componentWillMount|componentWillReceiveProps(props update only)|componentWillUnmount
|getInitialState   |componentDidMount |shouldComponentUpdate|
|                  |                  |componentWillUpdate|
|                  |                  |render|
|                  |                  |componentDidUpdate|

##### Init
`getDefaultProps` - set default props if parents not pass it down

##### Mounting
`componentWillMount` - setState will not re-render
`componentDidMount` - fetch data

##### Updating
`componentWillReceiveProps` - setState will not trigger additional re-render / place to access old props
`shouldComponentUpdate` - return true/false def true. if false methods below won't be called - see example below
`componentWillUpdate` - DO NOT use setState()
`render`
`componentDidUpdate`  - updated DOM interactions and post-render actions go here. **NO setState otherwise it might cause infinite loop**

##### Unmounting
`componentWillUnmount` - invalidate timers

**NOTE, Try to avoid using these lifecycle events hooks as less as possible**

### prevent-unnecessary-rerendering
Reconciliation is the process that React uses algorithm to diff one tree with another to determine which parts need to be changed.
The only way to prevent re-rendering happening is explicitly call `shouldComponentUpdate` and return `false`.

```js
var TextComponent = React.createClass({
    shouldComponentUpdate: function(nextProps, nextState) {
    // whenever parent passes down 'text' and it is equal to current 'text' no re-render
        if (this.props.text === nextProps.text) return false;
        return true;
    },

    render: function() {
        return <textarea value={this.props.text} />;
    }
});
```
![React UI update](./react_ui_update.png)

`shouldComponentUpdate` happens before React update process. Both parent and its children components will not bother computing the difference if parent's `shouldComponentUpdate` returns false.
`React.PureComponent` does *shallow comparison* on all `props` and `states` by default.
React uses `shallow-comparison` to work out if `state` or `prop` is changed. `shallow-comparion` only compares the value for primitive types or reference for reference types. Hence, code below should be avoided since component B always re-renders even though `onChange` is not changed.
```js
// Component A
...
render () {
  <B onChange={this.onChange.bind()} />
}

// Component B
class B extends React.PureComponent { // NOT HELP!!! a different onChange passed to it on every render
  render () {
    <div>
      <input onChange={this.props.onChange} />
    </div>
  }
}
```

### why-need-keys
It is for react to determine what component in the list has changed. Use `shortid` as keys rather than `index` in the array. Using `index` as keys leads to performance issue when you
* Add new elements to the front
* Sort the list

Elements will be compared one by one on each index - two elements both on index 0 will be compared.

> If an element has a key property, elements will be compared by a value of a key, not by index. As long as keys are unique, React will move elements around without removing them from DOM tree and then putting them back (a process known in React as mounting/unmounting).

For more details, read [Why need keys](https://paulgray.net/keys-in-react/?utm_source=reactnl&utm_medium=email)

### controlled-vs-uncontrolled
In a nutshell, Uncontrolled - Use `ref` to reference the component and get the value. While on the other hand, controlled means you access the component from the callback.

For more details - read [Controlled vs Uncontrolled form inputs](https://goshakkk.name/controlled-vs-uncontrolled-inputs-react/)

### async-setstate
`setState` is async and will batch updates. If you do something in the `setState` callback, then it will be triggered last. See flow below.

**setState => render with new state => componentDidUpdate => setState callback**

### useful-tools-resources
[Bits - the powerful way to share react UI components among projects](https://bitsrc.io/bit/movie-app/components/navigation)

### render-props
```js
import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

// Instead of using a HOC, we can share code using a
// regular component with a render prop!
class Mouse extends React.Component {
  static propTypes = {
    render: PropTypes.func.isRequired
  }

  state = { x: 0, y: 0 }

  handleMouseMove = (event) => {
    this.setState({
      x: event.clientX,
      y: event.clientY
    })
  }

  render() {
    return (
      <div style={{ height: '100%' }} onMouseMove={this.handleMouseMove}>
        {this.props.render(this.state)}
      </div>
    )
  }
}

const App = React.createClass({
  render() {
    return (
      <div style={{ height: '100%' }}>
        <Mouse render={({ x, y }) => (
          // The render prop gives us the state we need
          // to render whatever we want here.
          <h1>The mouse position is ({x}, {y})</h1>
        )}/>
      </div>
    )
  }
})

ReactDOM.render(<App/>, document.getElementById('app'))
```

### create-component-dynamically
Example 1 works in components
```js
import React, { Component } from 'react';
import FooComponent from './foo-component';
import BarComponent from './bar-component';
class MyComponent extends Component {
    components = {
        foo: FooComponent,
        bar: BarComponent
    };
    render() {
       const TagName = this.components[this.props.tag || 'foo'];
       return <TagName />
    }
}
export default MyComponent;
```
Example 2 **ONLY** works on standard html tags
```js
const FullForm = isGreyhounds(raceType) ? 'input' : 'textarea';
return <FullForm key={key} formData={val} />
```

### namespace-your-components
```js
const FKEventCompetitorProperty = {
  Sex: {
    Label: () => <div><span>Sex:</span></div>
  }
};

...
<FKEventCompetitorProperty.Sex.Label value={'good'} />
```

### finddomnode-only-works-on-classical-component
`findDOMNode` only works on mounted component that why it only works on **classical** component not stateless component.

### use-shouldcomponentupdate-correctly
`shouldComponentUpdate` is best used as a performance optimization, not to ensure correctness of derived state.

### use-controlled-component-widely
Instead of trying to **"mirror" a prop value in state**, make the component **controlled**, and consolidate the two diverging values in the state of some parent component. For example, rather than a child accepting a `committed(final)` **props.value** and tracking a `draft(transitional)` **state.value**, have the parent manage both **state.draftValue** and **state.committedValue** and control the child’s value directly. This makes the data flow more explicit and predictable.

### jsx-control-statement
With [this](https://github.com/AlexGilleran/jsx-control-statements), you can do things below
```js
// before transformation
<If condition={ test }>
  <span>Truth</span>
</If>

// after transformation
{ test ? <span>Truth</span> : null }
```

### platform-specific-styling-with-styled-component
Scenario 1: totally different styles
```js

const styles = {
  backButtonContainer: {
    desktop: {
      width: '32px',
      height: '32px',
      display: 'table-cell',
      'vertical-align': 'middle',
    },
    others: {
      float: 'left',
      height: '100%',
      width: '25%',
      'padding-left': '16px',
      cursor: 'pointer',
    },
  },
};

const StyledBackBtnContainerDiv = styled.div.attrs({
  style: isDesktopClient ? styles.backButtonContainer.desktop : styles.backButtonContainer.others
});
```
Scenario 2: have most in common
```js
const postPickStylesWeb = `
  height: 20px;
  width: 80px;
  border: 1px solid #ccc;
  font-size: 12px;
  padding: 4px;
`;

const postPickStylesOthers = `${postPickStylesWeb}
  font-size: 9px; 
  padding: 2px;
`;

const Title = `${postPickStylesOthers}`;
```

### react-import-need-for-stateless-component
Code below:
```js
import React from "react";
const App = () => (
  <div>Hello World!!!</div>
);
export default App;
```
will be transpiled into:
```js
var App = function App() {
  return React.createElement(
    "div",
    null,
    "Hello World!!!"
  );
};
```
See React? that's why we need to explicitly import react. Get bored of doing this? See [Babel-plugin-react-require](https://github.com/vslinko/babel-plugin-react-require)
