## Styled-components

* [Smart way to attach classes](#smart-way-to-attach-classes)
* [Platform-specific styling with styled-components](#platform-specific-styling-with-styled-component)

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

### platform-specific-styling-with-styled-component
Scenario 1: totally different styles
```js

const styles = {
  backButtonContainer: {
    desktop: {
      width: '32px',
      height: '32px',
      display: 'table-cell',
      'vertical-align': 'middle',
    },
    others: {
      float: 'left',
      height: '100%',
      width: '25%',
      'padding-left': '16px',
      cursor: 'pointer',
    },
  },
};

const StyledBackBtnContainerDiv = styled.div.attrs({
  style: isDesktopClient ? styles.backButtonContainer.desktop : styles.backButtonContainer.others
});
```
Scenario 2: have most in common
```js
const postPickStylesWeb = `
  height: 20px;
  width: 80px;
  border: 1px solid #ccc;
  font-size: 12px;
  padding: 4px;
  ${false ? 'color: red;' : ''}
  color: ${true ? 'red' : 'green'};
`;

const postPickStylesOthers = `${postPickStylesWeb}
  font-size: 9px;
  padding: 2px;
`;

const Title = `${postPickStylesOthers}`;
```






