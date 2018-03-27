## Linting Tips & Notes

### When dealing with linting errors on legacy codebase, use below tips to help out

* Use autofix utility comes with `ESlint` to auto-fix errors
```js
eslint --fix
```
* Specify environments to fix errors such as `window is not defined` or `setTimeout is not defined`
```js
{
    "env": {
        "browser": true,
        "node": true
    }
}
```
For more infor, see [Specify environments](https://eslint.org/docs/user-guide/configuring#specifying-environments)

* Specify globals to fix errors such as `$ is not defined` or `moment is not defined`
```js
{
    "globals": {
        "$": true,
        "moment": false
    }
}
```
* Disable rules
```js
// one line
alert('foo'); // eslint-disable-line no-alert, quotes, semi

// block
/* eslint-disable no-alert, no-console */
alert('foo');
console.log('bar');
/* eslint-enable no-alert, no-console */

// entire file
/* eslint-disable no-alert */

// entire directory
// create a new config file inside that dir. One project is allowed to have multiple config files. The closest config file will be used // and overwrite all outer ones

// entire project
// disable them in the root config

```
