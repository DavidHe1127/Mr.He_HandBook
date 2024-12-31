# React Essentials and Tips

## Hooks

- [Hooks](./hooks.md)

## State

- [State](./state.md)

## General

- [React Component as prop](https://www.developerway.com/posts/react-component-as-prop-the-right-way#part2)
- [Event Listeners](#event-listeners)
- [Prevent unnecessary re-rendering](#prevent-unnecessary-rerendering)
- [Avoid inadvertent mounting/unmounting](./avoid_inadvertent_mounting_unmounting.md)
- [Useful tools/resources](#useful-tools-resources)
- [Create component dynamically](#create-component-dynamically)
- [Namespace your components](#namespace-your-components)
- [JSX Control Statement](#jsx-control-statement)
- [local state or prop](#local-state-or-prop)
- [Compound Components](#compound-components)
- [Refs](./refs.md)
- [Test](./test.md)
- [Pass props to parent children](#props-forwarding-to-children)
- [Pass param to event handler](#pass-param-to-event-handler)
- [Use props.children to prevent props drilling](#prevent-props-drilling)
- [Lazy loading](#lazy-loading)
- [Component/Element as a prop](https://www.developerway.com/posts/react-component-as-prop-the-right-way#part2)

## [Cookbook](./cookbook.md)

## Styled-components

- [Styled-components](./styled-components.md)

## JSS

- [Elegant media queries](./media-queries-jss.md)

## Ohter topics

- [Abstract logic from JSX into class](./abstract-logic-into-class.md)

### event-listeners

React doesn’t actually attach event handlers to the nodes themselves, instead when React starts up, it starts listening for all events at the top level using a single event listener, and when your component is mounted the event handlers are added to an internal mapping. Then when an event occurs, React knows how to dispatch it using this mapping. When your component is unmounted the event handlers are removed from the internal mapping so you don’t need to worry about memory leaks.

### useful-tools-resources

[Bits - the powerful way to share react UI components among projects](https://bitsrc.io/bit/movie-app/components/navigation)

### create-component-dynamically

Example 1 works in components

```js
import React, { Component } from 'react';
import FooComponent from './foo-component';
import BarComponent from './bar-component';
class MyComponent extends Component {
  components = {
    foo: FooComponent,
    bar: BarComponent,
  };
  render() {
    const TagName = this.components[this.props.tag || 'foo'];
    return <TagName />;
  }
}
export default MyComponent;
```

Example 2 **ONLY** works on standard html tags

```js
const FullForm = isGreyhounds(raceType) ? 'input' : 'textarea';
return <FullForm key={key} formData={val} />;
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

### jsx-control-statement

With [this](https://github.com/AlexGilleran/jsx-control-statements), you can do things below

```js
// before transformation
<If condition={test}>
  <span>Truth</span>
</If>;

// after transformation
{
  test ? <span>Truth</span> : null;
}
```

### Compound Components

Say components `A` and `B` will nowhere be used individually, it makes sense only when they're used with `Main`. And for better maintainability you prefer managing them in different files. So you can use this trick below to achieve what you expect.

```js
// A.js
export class A extends Component {
  render() {
    return <div>A</div>
  }
}

// B.js
export class B extends Component {
  render() {
    return <div>B</div>
  }
}

// Main.js
import A from './A';
import B from './B';

export class Main extends Component {
  static A = A
  static B = B

  render() {
    return <div>Main</div>
  }
}

// usage
<Main.A></Main.A>
<Main.B></Main.B>
```

[Composite Components](https://itnext.io/using-advanced-design-patterns-to-create-flexible-and-reusable-react-components-part-1-dd495fa1823)

### Pass param to event handler

```js
// instead of doing this
<li onClick={() => this.handleClick(letter)}>{letter}</li>

// do this
<ul>
  {this.state.letters.map(letter =>
    <li key={letter} data-letter={letter} onClick={this.handleClick}>
      {letter}
    </li>
  )}
</ul>
...
// handler
handleClick = e => {
  this.setState({
    justClicked: e.target.dataset.letter
  });
}
```

### Props forwarding to children

```js
import React, { Children, cloneElement } from 'react';

const Parent = ({ children }) => {
  const arrayOfChildren = Children.toArray(children);

  return (
    <>
      {arrayOfChildren.map(x => {
        return cloneElement(x, { disabled: true });
      })}
    </>
  );
};
```

### Prevent props drilling

`GrandChild` props are passed all the way down from `Parent` without being traced from `Child` component that is sitting middle in the passing path.

```js
function Parent({ parentProps, childProps, grandchildProps }){
  return (
      <ul>
        <Child { ...childProps }>
            <Grandchild { ...grandchildProps } />
        </Child>
    </ul>;
}

function Child({ childProps }) {
  return <li { ...childProps }>{ childProps.children }</li>;
}

function Grandchild({ grandchildProps }){
  return <a { ...grandchildProps }>link</a>;
}
```

### Lazy loading

Lazy load module when an introduced dependency is

- too large i.e pdf generator
- needed only in certain circumstances i.e user click a generate button to produce pdf

Then you can do `const LazyPDFDocument = React.lazy(() => import("./PDFPreview"));`.







