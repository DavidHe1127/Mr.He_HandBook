## Avoid inadvertent mounting/unmounting

Consider code below:
```js
<div>
  <Message />
  <Table />
  <Footer />
</div>

// Virtual DOM representations
props: {
  children: [
    { type: Message },
    { type: Table },
    { type: Footer }
  ]
}
```

The mounting/unmounting will be triggered when message is removed. Why? Because, VDOM will look like this now:
```js
props: {
  children: [
    { type: Table },
    { type: Footer }
  ]
}
```
When react performs a reconciliation, it sees *children[0] has been changed from Message to Table* which fails triple equal comparison. `Mounting/Unmounting` will be run.

Fix is:
```js
<div>
  {isShown && <Message />}
  <Table />
  <Footer />
</div>

// Virtual DOM representations
props: {
  children: [
    false, //  isShown && <Message /> evaluates to false
    { type: Table },
    { type: Footer }
  ]
}
```
With update, both `Table` and `Footer` remain on the same index prior to update. Perfect!
Note: `Unique key is required for array elements` warnings will not be fired off since the children are created by a list of arguments!

```js
<div>
  <Message />
  <Table />
  <Footer />
</div>

React.createElement(
  'div',
  React.createElement(Message),
  React.createElement(Table),
  React.createElement(Footer)
)
```
