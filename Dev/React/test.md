## Testing

- Good articles/tips
  - [Habits of successful react components](https://javascriptplayground.com/habits-of-successful-react-components/)
  - [Mount, shallow, renderer diff and tips](https://gist.github.com/fokusferit/e4558d384e4e9cab95d04e5f35d4f913)
- [Test ref](#test-ref)
- [Don't test implementation details](#dont-test-implementation-details)
- [Use data-testid attr](#use-data-testid-attr)

### Test ref

```js
it('calls onChange with the new value when the value has changed', () => {
  const ref = React.createRef();
  const wrapper = mount(
    <div>
      <Input ref={ref} />
    </div>
  );

  expect(ReactTestUtils.isDOMComponent(ref.current)).toBeTruthy();
  expect(ref.current.tagName).toEqual('INPUT');
});
```

Oftentimes, you use 3rd UI libraries and still want to pass `ref` to them. It's fine but where `ref` is bound to is controlled by libraries themselves. For example, `react-day-picker` takes `ref` and attaches it to the class instance called `DayPicker`.

To ensure you pass `ref` to it, you can do:

```js
import ReactDayPicker from 'react-day-picker';

it('pass ref to access dom node', () => {
  const ref = React.createRef();
  mount(
    <div>
      <DatePicker ref={ref} />
    </div>
  );
  const res = ReactTestUtils.isCompositeComponentWithType(
    ref.current,
    ReactDayPicker
  );
  expect(res).toBe(true);
});
```

---

### Dont test implementation details

Implementation details refer to the details around how you achieve the desired component behaviours.

Consider code below:

```js
import React from 'react';
import AccordionContents from './accordion-contents';
class Accordion extends React.Component {
  state = { openIndex: 0 };
  setOpenIndex = openIndex => this.setState({ openIndex });
  render() {
    const { openIndex } = this.state;
    return (
      <div>
        {this.props.items.map((item, index) => (
          <>
            <button onClick={() => this.setOpenIndex(index)}>
              {item.title}
            </button>
            {index === openIndex ? (
              <AccordionContents>{item.contents}</AccordionContents>
            ) : null}
          </>
        ))}
      </div>
    );
  }
}
export default Accordion;

// test
import React from 'react';
// if you're wondering why not shallow,
// then please read https://kcd.im/shallow
import Enzyme, { mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import Accordion from '../accordion';
// Setup enzyme's react adapter
Enzyme.configure({ adapter: new EnzymeAdapter() });
test('setOpenIndex sets the open index state properly', () => {
  const wrapper = mount(<Accordion items={[]} />);
  expect(wrapper.state('openIndex')).toBe(0);
  wrapper.instance().setOpenIndex(1);
  expect(wrapper.state('openIndex')).toBe(1);
});
```

As you can see, it's testing state but as an end user, we don't care about `openIndex` is kept as an internal state we only care about when a segement of accordion is opened/closed when being clicked.

So we should test behaviour:

```js
import React from 'react';
import { render, fireEvent } from 'react-testing-library';
import Accordion from '../accordion';
test('can open accordion items to see the contents', () => {
  const hats = { title: 'Favorite Hats', contents: 'Fedoras are classy' };
  const footware = {
    title: 'Favorite Footware',
    contents: 'Flipflops are the best'
  };
  const { getByText, queryByText } = render(
    <Accordion items={[hats, footware]} />
  );
  expect(getByText(hats.contents)).toBeInTheDocument();
  expect(queryByText(footware.contents)).toBeNull();
  fireEvent.click(getByText(footware.title));
  expect(getByText(footware.contents)).toBeInTheDocument();
  expect(queryByText(hats.contents)).toBeNull();
});
```

See [Testing Implementation Details](https://kentcdodds.com/blog/testing-implementation-details) for the reasons why we shouldn't do it.

### Use data-testid attr
As suggested by `react-testing-library`, we should use `data-testid` attr to facilitate the trackdown of target element.

```jsx
// main.js
<button
  className="btn btn-lg btn-primary pull-xs-right"
  type="submit"
  disabled={this.props.inProgress}
  data-testid="submit"
>

// test
const sel = id => `[data-testid="${id}"]`
const emailField = rootNode.querySelector(sel('email'))
```
