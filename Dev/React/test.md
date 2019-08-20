## Testing

- Good articles/tips
  - [Habits of successful react components](https://javascriptplayground.com/habits-of-successful-react-components/)
  - [Rule of thumb testing tips](https://gist.github.com/fokusferit/e4558d384e4e9cab95d04e5f35d4f913)
- [Test ref](#test-ref)

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
