## State

Whether or not React preserves component state depends on the component position in the render tree.

- same component at the same position ✅
- same component at the same position with different keys ❌
- same component at different position ❌
- different component at the same position ❌

```js
// state of counter component is preserved regardless of isFancy value as long as its position stays the same in
// render tree
<div>
  <Counter isFancy={true} />
  <label>
    <input
      type="checkbox"
      checked={isFancy}
      onChange={e => {
        setIsFancy(e.target.checked)
      }}
    />
    Use fancy styling
  </label>
</div>

// moving Counter elsewhere causes its state to lose! or rendering a different component at the same position
<div>
  <label>
    <input
      type="checkbox"
      checked={isFancy}
      onChange={e => {
        setIsFancy(e.target.checked)
      }}
    />
    Use fancy styling
  </label>
  <Counter isFancy={true} />
</div>

// same component same position
{isPlayerA ? (
  <Counter person="Taylor" />
) : (
  <Counter person="Sarah" />
)}

// same component same position with keys so state preserved
{isPlayerA ? (
  <Counter key="Taylor" person="Taylor" />
) : (
  <Counter key="Sarah" person="Sarah" />
)}

// same component different position - see use of 2{} in this example
{isPlayerA &&
  <Counter person="Taylor" />
}
{!isPlayerA &&
  <Counter person="Sarah" />
}
````

### Reset all states

When key is changed, React will dump the current component and re-create a new one and all states are reset as a result.

```js
<EmailInput defaultEmail={this.props.user.email} key={this.props.user.id} />
```
