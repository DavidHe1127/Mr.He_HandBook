## Process

![docker processes](docker-process.svg)

### ENTRYPOINT and CMD

- In Linux, `init` process is run on `PID 1` and cannot be killed even with `sudo`. It ignores any signals unless a handler for that signal is explicitly declared.
- A process running as PID 1 inside a container is treated specially by Linux - it ignores any signals with the default action. So, the process will not terminate on SIGINT or SIGTERM unless it is coded to do so. Alternatively, specify `--init` flag or use `tini` for docker versions not supporting that flag.
- `ENTRYPOINT` specifies a command that will always be executed when the container starts, by default it is `/bin/sh -c`.
- `CMD` specifies arguments that is fed to `ENTRYPOINT`.
- Process specified in `ENTRYPOINT` or `CMD` becomes the main process owning pid `1`. When PID 1 exits, the container will exit.
- Always use exec format.

```Dockerfile
# bad
ENTRYPOINT "/bin/chamber"
CMD "/bin/service"

# good
# same as ["/bin/chamber", "exec", "production", "--", "/bin/service", "-d"]
ENTRYPOINT ["/bin/chamber", "exec", "production", "--"]
CMD ["/bin/service", "-d"]
```
- Can be overwritten. i.e `docker run --entrypoint /bin/logwrap myservice`
- Use `ENTRYPOINT` if want to make an image dedicated to a specific command. If general purpose, then leave `ENTRYPOINT` unspecified and use `CMD`. Users can set `ENTRYPOINT` via cli to cater for their own needs.

### Signals

When running `docker kill` or `docker stop`, the main process inside the container will receive a signal.

`docker stop` - stop a running container. Main process will receive a `SIGTERM` at which point, docker is given time to do cleanup. If the process hasn't exited within the grace period (can be specified) a SIGKILL signal will be sent.

`docker kill` - send `SIGKILL` to kill the main process inside the container leaving no chance for cleanup.

Sometimes app may be configured to listen to a different signal - `SIGUSR1` and `SIGUSR2`, for example. In these instances, you can use the STOPSIGNAL instruction in Dockerfile to override the default.

```Dockerfile
STOPSIGNAL SIGTERM
```

### Init

If PID 1 is `init` - run docker with `--init`, PID 1 will help a) handle signal forwarding to its child process b) reap zombie processes. In this case, containers can be terminated via `ctrl+c` that sends interrupt (SIGINT) to the process.

If PID 1 is anything but `init`, container will not stop/terminate when `ctrl+c` from host unless there is code to handle `SIGINT` and exit explicitly.

However, container can still be killed from host via `docker kill/stop`. Note, without signal handling code, `docker stop` will have to wait `10s` before issuing `SIGKILL` to forcefully kill the container in the end.
