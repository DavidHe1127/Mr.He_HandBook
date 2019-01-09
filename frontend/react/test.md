
* [Test ref](#test-ref)



### test-ref

```js
it('calls onChange with the new value when the value has changed', () => {
  const ref = React.createRef();
  const wrapper = mount(
     <div>
       <Input theme={defaultTheme} ref={ref} onChange={changeHandlerSpy} />
     </div>
  );
  
  expect(ReactTestUtils.isDOMComponent(ref.current)).toBeTruthy();
  expect(ref.current.tagName).toEqual('INPUT');
});
```
