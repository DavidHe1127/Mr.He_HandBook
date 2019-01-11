
* [Test ref](#test-ref)



### test-ref

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
Oftentimes, you use 3rd UI libraries and still want to pass `ref` to them. It's fine but where `ref` is bound to is controlled by libraries themselves. To ensure library takes `ref` that's being passed down from the wrapper, you can do:

```js
import ReactDayPicker from 'react-day-picker';

it('pass ref to access dom node', () => {
	const ref = React.createRef();
	mount(
		<div>
			<DatePicker ref={ref} />
		</div>
	);

	const res = ReactTestUtils.isCompositeComponentWithType(ref.current, ReactDayPicker);
	expect(res).toBe(true);
});
```

