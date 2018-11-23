* [Smart way to attach classes](#smart-way-to-attach-classes)

### smart-way-to-attach-classes

Sometimes, components styling needs to be done via passing class name as prop. `React-Modal` for instance, allows users to control
its styles by passing corresponding class names to different parts inside it - see below

```js
<StyledModal 
  aria={aria} 
  bodyOpenClassName={classes('bodyOpen')} 
  className={classes('reactModal')} 
  htmlOpenClassName={classes('htmlOpen')}
  ...
  >
   ...children
</StyledModal>
```

If you wish to use styled-component way of styling it, you can do this:

```js
const ReactModalAdapter = ({ className, ...props }) => (
	<ReactModal
		portalClassName={`${className}__portal`}
		className={`${className}__reactModal`}
		overlayClassName={`${className}__overlay`}
		bodyOpenClassName={`${className}__bodyOpen`}
		htmlOpenClassName={`${className}__htmlOpen`}
		{...props}
	/>
);

const StyledModal = styled(ReactModalAdapter)`
	&__bodyOpen {
		${styles.bodyOpen};
	}

	&__reactModal {
		${styles.reactModal};
	}

	&__htmlOpen {
		${styles.htmlOpen};
	}

	&__overlay {
		${styles.overlay};
	}

	&__portal {
		${styles.portal};
	}
`;
```







