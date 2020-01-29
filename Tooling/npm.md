## NPM

* [Scripts](#scripts)
* [Quick init](#quick-init)
* [PeerDependency](#peer-dependency)
* [Semver](#semantic-versioning)
* [Scoped Packages](#scoped-packages)
* [Show pkg latest version](#show-pkg-latest-version)
* [Cli searching rule](#cli-searching-rule)
* [Proxy](#Proxy)
* [npm ci and lockfile](#npm-ci-and-lockfile)

### scripts
Run `npm run [YOUR_SCRIPT]` in terminal.

Using `npm scripts` has a few benefits over the other JS automation tools such as ```grunt and gulp```.
* `npm` will automatically setup `$PATH` to look into `node_modules/.bin`, so you can just run commands supplied by `dependencies` and `devDependencies` directly without a global installation of module.

```javascript
tap test/*.js   // rather than ./node_modules/.bin/tap test/*.js
```

To incorporate a module into your project, that module needs a `CLI` so you can run from npm scripts.

```json
{
  "config": {"port": 3000},
  "dependencies": {
    "browserify": "~2.35.2",
    "uglifyjs": "~2.3.6"
  },
  "devDependencies": {
    "watchify": "~0.1.0",
    "catw": "~0.0.1",
    "tap": "~0.4.4"
  },
  "scripts": {
    "build-js": "browserify browser/main.js | uglifyjs -mc > static/bundle.js",
    "build-css": "cat static/pages/*.css tabs/*/*.css",
    "build": "npm run build-js && npm run build-css",                           // run two tasks in series
    "watch-js": "watchify browser/main.js -o static/bundle.js -dv",
    "watch-css": "catw static/pages/*.css tabs/*/*.css -o static/bundle.css -v",
    "watch": "npm run watch-js & npm run watch-css",                            // run two tasks in parallel
    "start": "node server.js -- --port $npm_package_config_port", // 3000
    "test": "tap test/*.js"
  }
}
```
Access port in js
```javascript
console.log(process.env.npm_package_config_port)
```

Put tasks in bash file
```bash
#!/bin/bash
(cd site/main; browserify browser/main.js | uglifyjs -mc > static/bundle.js)
(cd site/xyz; browserify browser.js > static/bundle.js)
```
Run `chmod + x` on the bash file and specify it like this `"build-js": "bin/build.sh"`

Use command below to page all npm scripts
```bash
npm run | less
```

### quick-init
`npm init --yes` accept default configs from npm.

### peer-dependency
[Peer Dependency mechanism](https://codingwithspike.wordpress.com/2016/01/21/dealing-with-the-deprecation-of-peerdependencies-in-npm-3/).

As of `npm v3`, `peerDependency` will not be auto-installed. All you have to do is install it manually.

### semantic-versioning
Given version `1.2.3`:
  * 1 - Major a large change that breaks compatibility. If users don't adapt to a major version change, stuff won't work
  * 2 - Minor a new functionality that doesn't break anything
  * 3 - Patch a bugfix

By default, npm installs the latest version, and prepends a caret e.g. `^1.2.12`. This signifies that at a minimum, version `1.2.12` should be used, but any version higher than that is OK, as long as it has the same major version.

### scoped-packages
`@storybook/react` is a scoped package.
* `@storybook/react` indicates it is published by `storybook` core team.
* `@storybook/react` only has to be unique in the scope `storybook` it's published in not the entire npm registry.

### show-pkg-latest-version
```js
npm show <PKG> version
```

### cli-searching-rule
In a mono repo (managed by lerna) case, `yarn` will look up in the locations as below to find the targeted cli. Lower numbered location will be searched first before looking at higher numbered ones.

1. `packages/pkgA/node_modules/.bin`
2. `<projectRoot>/node_modules/.bin`
3. Global bin folder

### Proxy
In `package.json`, specify proxy to tell development server to proxy any unknown requests to your API server:
```json
{
  "proxy": "http://localhost:8080"
}
```
This way, when you `fetch('/api/todos')` in development, the development server will recognize that it’s not a static asset, and will proxy your request to `http://localhost:8080/api/todos` as a fallback. Conveniently, this avoids `CORS` errors during local development.

Note, it is **ONLY** working in development mode.

### NPM CI and lockfile
Use `npm ci` during ci process to ensure desired dep versions are used. It looks at lockfile and only uses `package.json` for drift detection. As a result, if it sees any difference between `package.json` and lockfile it will throw an error to terminate ci process.

```shell
$ npm ci

$ yarn install --frozen-lockfile
```

Key facts about `package.json` and lockfile.

- If you have a `package.json` and you run `npm i` we generate a `package-lock.json` from it.
- If you run `npm i` against that `package.json` and `package-lock.json`, the latter will never be updated, even if the `package.json` would be happy with newer versions.
- If you manually edit your `package.json` to have different ranges and run `npm i` and those ranges aren't compatible with your `package-lock.json` then the latter will be updated with version that are compatible with your `package.json`. Further runs of `npm i` will follow the above 2.


