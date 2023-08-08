## Cookbook

- Find the raw element that corresponds to a React component

You have `<TableContainer>` but it's most likely rendered as `<div>` which is mixed in the pile of `div`s. To pinpoint the right one, add a `className` to the react component and then search in the chrome console for the class value.
