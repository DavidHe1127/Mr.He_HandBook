* How react virtual DOM (fast and in-memory) works
  * Whenever the state of your data model changes, the virtual DOM and React will rerender your UI to a virtual DOM representation.
  * React then calculates the difference between the two virtual DOM (current state vs previous state).
    The resulting difference will be applied to real DOM to reflect changes.
  * React updates only what needs to be updated in the real DOM.   
* Use propTypes on all occasions - You can use it to document your components. You t no longer need to look around the source code of the `render` methodo figure out what properties needs to be provided.

* It is a common best practice to create several stateless components that just render data, and have a stateful component wrapping them that passes its state to the children via props. This way you can encapsulate all the interaction logic in one place — the stateful component — , while the stateless components take care of rendering data in a declarative way.

* React doesn’t actually attach event handlers to the nodes themselves, instead when React starts up, it starts listening for all events at the top level using a single event listener, and when your component is mounted the event handlers are added to an internal mapping. Then when an event occurs, React knows how to dispatch it using this mapping. When your component is unmounted the event handlers are removed from the internal mapping so you don’t need to worry about memory leaks.

* Component LifeCycle

|Initialization   |Mounting           |Updating  |Unmounting|
| -------- |:---------------:|:---------------:| --------:|
|getDefaultProps   |componentWillMount|componentWillReceiveProps(props update only)|componentWillUnmount
|getInitialState   |componentDidMount |shouldComponentUpdate|
|                  |                  |componentWillUpdate|
|                  |                  |render|
|                  |                  |componentDidUpdate|

Init
---
`getDefaultProps` - set default props if parents not pass it down

Mounting
---
`componentWillMount` - setState will not re-render

`componentDidMount` - fetch data

Updating
---
`componentWillReceiveProps` - setState will not trigger additional re-render / place to access old props
`shouldComponentUpdate` - return true/false def true. if false methods below won't be called - see example below
`componentWillUpdate` - DO NOT use setState()

`render`

`componentDidUpdate`  - updated DOM interactions and post-render actions go here                              

whenever parent passes down 'text' and it is equal to current 'text' no re-render

```javascript
var TextComponent = React.createClass({
    shouldComponentUpdate: function(nextProps, nextState) {
        if (this.props.text === nextProps.text) return false;
        return true;
    },
    
    render: function() {
        return <textarea value={this.props.text} />;
    }
});
```
Unmounting
---
`componentWillUnmount` - invalidate timers

* Container Component - components that deal with backend data
Presentational Component - Stateless component vs Stateful component


### React element vs component

* React element is an object representation of a DOM node and its properties
* A component is a function or a Class which optionally accepts input and returns a React element.


https://www.youtube.com/watch?v=-DX3vJiqxm4 - see rationale behind the virtual DOM
