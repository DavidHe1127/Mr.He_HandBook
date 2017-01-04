## NPM Notes

* [Scripts](#scripts)
* [Quick init](#quick-init)
* [PeerDependency](#peer-dependency)

#scripts
Run `npm run [YOUR_SCRIPT]` in terminal.

Using `npm scripts` has a few benefits over the other JS automation tools such as ```grunt and gulp```.
* `npm` will automatically setup `$PATH` to look into `node_modules/.bin`, so you can just run commands supplied by `dependencies` and `devDependencies` directly without a global installation of module.
* No need to install `grunt-cli` globally anymore

To incorporate a module into your project, that module needs a `CLI` so you can run from npm scripts.

####Example
```js
{
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
    "start": "node server.js",
    "test": "tap test/*.js"
  }
}
```
####Put tasks in bash file
```bash
#!/bin/bash
(cd site/main; browserify browser/main.js | uglifyjs -mc > static/bundle.js)
(cd site/xyz; browserify browser.js > static/bundle.js)
```
Run `chmod + x` on the bash file and specify it like this `"build-js": "bin/build.sh"`

#quick-init
`npm init --yes` accept default configs from npm.

#peer-dependency
[Peer Dependency mechanism](https://codingwithspike.wordpress.com/2016/01/21/dealing-with-the-deprecation-of-peerdependencies-in-npm-3/).

As of `npm v3`, `peerDependency` will not be auto-installed. All you have to do is install it manually.



