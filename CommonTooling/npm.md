## NPM

- [Scripts](#scripts)
- [PeerDependency](#peer-dependency)
- [Semver](#semantic-versioning)
- [Scoped Packages](#scoped-packages)
- [Show pkg latest version](#show-pkg-latest-version)
- [Cli searching rule](#cli-searching-rule)
- [Hooks](#hooks)
- [Proxy](#Proxy)
- [npm ci and lockfile](#npm-ci-and-lockfile)
- [Unpublish a published package](#npm-unpublish)
- [npx](#npx)
- [unsafe-perm](#unsafe-perm)
- [How npm handle module version conflicts](https://www.geeksforgeeks.org/how-does-npm-handle-version-conflicts/)

## Yarn

- [Lock file and dependency update](#lock-file-and-dependency-update)
- [yarn workspaces](#yarn-workspaces)

### scripts

`npm` will automatically setup `$PATH` to look into `node_modules/.bin`, so you can just run commands supplied by `dependencies` and `devDependencies` directly without a global installation of module.

package.json

```json
{
  "config": { "port": 3000 },
  "scripts": {
    "start": "pm2 start --name accounts --port $npm_package_config_port index.js"
  }
}
```

Access port in js

```js
console.log(process.env.npm_package_config_port);
```

### peer-dependency

- Useful when authoring a library where some deps are required however, author does not need to install them themselves. It's down to consumers for deps installation.
- When you see a mismatch error, it basically means dep version defined in lib's `peerDependencies` does not match what consumers have supplied in their `package.json`.
- As of `npm v3`, `peerDependency` will not be auto-installed. All you have to do is install it manually.

### semantic-versioning

Given version `1.2.3`:

- 1 - Major a large change that breaks compatibility. If users don't adapt to a major version change, stuff won't work
- 2 - Minor a new functionality that doesn't break anything
- 3 - Patch a bugfix

By default, npm installs the latest version, and prepends a caret e.g. `^1.2.12`. This signifies that at a minimum, version `1.2.12` should be used, but any version higher than that is OK, as long as it has the same major version.

### scoped-packages

`@storybook/react` is a scoped package.

- `@storybook/react` indicates it is published by `storybook` core team.
- `@storybook/react` only has to be unique in the scope `storybook` it's published in not the entire npm registry.

### show-pkg-latest-version

```js
npm show <PKG> version
```

### cli-searching-rule

In a mono repo (managed by lerna) case, `yarn` will look up in the locations as below to find the targeted cli. Lower numbered location will be searched first before looking at higher numbered ones.

1. `packages/pkgA/node_modules/.bin`
2. `<projectRoot>/node_modules/.bin`
3. Global bin folder

### Hooks

custom hooks
```json
{
  "scripts": {
    "such-custom-script": "echo custom-script",
    "presuch-custom-script": "echo pre-custom-script",
    "postsuch-custom-script": "echo post-custom-script"
  }
}
```

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

Essentially, `npm install` reads `package.json` to create a list of dependencies and uses `package-lock.json` to inform which versions of these dependencies to install. If a dependency is not in `package-lock.json` it will be added by `npm install`.

`npm ci` installs dependencies directly from `package-lock.json` and uses `package.json` only to validate that there are no mismatched versions. If any dependencies are missing or have incompatible versions, it will throw an error.

```shell
$ npm ci

$ yarn install --frozen-lockfile
```

Key facts about `package.json` and lockfile.

- If you have a `package.json` and you run `npm i` we generate a `package-lock.json` from it.
- If you run `npm i` with presence of `package.json` and `package-lock.json`, the latter will never be updated, even if the `package.json` would be happy with newer versions.
- If you manually edit your `package.json` to have different version ranges for a dependency which aren't compatible with your `package-lock.json` then the latter will be updated with version ranges that are compatible with that in `package.json` when run `npm i`. Further runs of `npm i` will follow the above 2.

### NPM unpublish
Packages that are published less than 72 hours can be unpublished. See example below:

```shell
$ npm unpublish david-test-module@1.3.0-prerelease.1
```

Wait a couple of minutes before carrying out unpublish if you are faced this issue - `Cannot publish over previously published version "1.3.0-prerelease.2".`.

### NPX
`npx semantic-release` will first look to find binary file locally before it's trying to pull from remote if local instance not found.

---

### Lock file and dependency update

- Lock file will be used to determine the full dependency tree and their versions. When `package.json` is changed, lock files will be regenerated by running install. See below.
- If dependencies are manually modified in a `package.json` file, yarn will only update the `yarn.lock` file the next time the yarn CLI is used to install or modify dependencies. So if modifying dependencies in `package.json`, be sure to run `yarn install` to update the `yarn.lock` file.
- `yarn upgrade` allows to upgrade all the dependencies listed in a package.json to the latest versions specified by the version ranges. Or one can use `yarn upgrade --latest` will update dependencies to the latest version ignoring version range.

### Yarn Workspaces

Use it when:

- Link a local module for testing in place of `yarn link`.
- Run one root command will run the same command in workspaces. i.e Run `yarn start` at the project root will run the same command in all workspaces.

It's a perfect match when using `yarn workspace` alongside `lerna` - configure `lerna` to leave dependency management to `yarn workspaces` and use its utility commands to publish multiple packages instead.

### unsafe-perm

npm will not run command as `root` user for security reasons. It will use `nobody` user to run commands even if you specify `root`. However, some operations such as write files to `/root/.node-gyp` would fail as `nodbody` does not have privilege to do it. `--unsafe-perm` comes to the rescue, it will tell `npm` not to switch to use `nobody` and use whatever user that is running the command even though it's `root` user.

```shell
$ npm config set unsafe-perm true
# if current user is root then command below will be run as root
$ npm install -g sonar-scanner@"^3.1.0"
```
