## Job

- Pods used in jobs *must* use a `restartPolicy` of `OnFailure` or `Never`. OnFailure = Re-run the container in the same pod while Never = Run the container in a new pod


### CronJob

- Sometimes, in rare cases, CronJob could run more than once at the specified frequency. To solve that, use

```
backoffLimit: 0
restartPolicy: Never
concurrencyPolicy: Forbid
```
