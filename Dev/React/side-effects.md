## Side Effects

It allows you to run a side effect that synchronizes your component with some outside system.

### Rule 0

When a component renders, it should do so without running into any side effects.

### Rule 1

If a side effect is triggered by an event, put that side effect in an event handler

### Rule 2

If a side effect is synchronizing your component with some outside system, put that side effect inside useEffect.
