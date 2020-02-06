## Create React App facts

- [build time env](#build-time-env)


### Build time env
In reality, the object `process.env` does not exist inside the browser environment, It’s Node-specific. CRA by default doesn’t do server-side rendering. 
It can’t inject environment variables during content serving (like Next.js does). During transpiling, Webpack process replaces all occurrences of `process.env` with a string value defined in env files. 
This means it can only be configured during build time.

Therefore, injecting runtime envs via tools such as `docker-compose` will not work when running a CRA inside a container.

[Practical way of setting envs](https://create-react-app.dev/docs/deployment#customizing-environment-variables-for-arbitrary-build-environments)
