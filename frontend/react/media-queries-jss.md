## An elegant way to write media queries with JSS.

```
const xsmall = '@media (max-width: 600px)';

const styles = () => ({
	bar: {
		display: 'flex',
		alignItems: 'center',
		[xsmall]: {
			flexDirection: 'column',
			alignItems: 'center',
		},
	},
});
```
