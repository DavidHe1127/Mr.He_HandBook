## Docker Logging

### Architecture

![docker-logging](docker-logging.svg)

### Notes
- When a container application emits logs, they are sent to the application’s `stdout` and `stderr` output streams. The container’s logging driver can access these streams and send the logs to a file, a log collector running on the host, or a log management service endpoint. i.e `fluentd` can be configured as log driver to catch `stdout/stderr` logs and have them forward to `fluentd` container running as sidecar process. 

By default, Docker uses a `json-file` driver - configured on daemon, which reads logs from `stdout/stderr` and writes them to a container-specific file using JSON format on the host. i.e `/var/lib/docker/containers/<container id>/<container id>-json.log` on Linux host. To access logs from terminal, use `docker logs` command. Also note, this command works only with json-file Logging driver.
- 3 types of logs - container(app)/daemon/host logs.
- Never keep logs on the Docker host because they can build up over time and eat into your disk space
- Use sidecar pattern. Also ensure app and sidecar are working as a single deployment unit.
![sidecar](./sidecar.png)
- Docker logging drivers don’t support multi-line logs like error stack traces.
- Only the logs being emitted from main process (PID=1) are logged against the log file. Logs from other processes like those inited via `docker exec` are not.

### Use logging driver

A logging driver enables application containers to send their logs to the logging service running as a sidecar container on the same host. For example, you can use `fluentd` as a logging driver:

```shell
docker run --name david-test-fluentd --log-driver=fluentd --log-opt tag={{.Name}} ubuntu echo "..."
```
This will tag all log output with container name such that you can identify and route them to preferred destinations.

```config
<match david-test-fluentd>
  @type stdout
</match>
```

### Get most recent logs

```shell
# show logs from last 5 hours
docker logs <container_id> -f --since 5h
```

### References

- [Docker Logs](https://sematext.com/guides/docker-logs/)
