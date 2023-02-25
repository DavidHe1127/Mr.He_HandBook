## AlertManager

- [Alerts DeDupe](#alerts-dedupe)


### Alerts Dedupe

Say we have `group_by: ['alertname', 'severity']`. Two alerts with same lables firing nearly at the same time are grouped:

```
# Prom will generate 2 alerts
alertname: HighCpuUsage
instance: server1
job: myapp
severity: warning

alertname: HighCpuUsage
instance: server2
job: myapp
severity: warning
```

Will result in one notification being sent to the receiver

```
# after dedupe, one notification is sent
[ALERT] HighCpuUsage (2 active)
  - instance: server1
  - instance: server2
```

In this example, `severity` is different.

```
alertname: HighCpuUsage
severity: warning
instance: server1
job: myapp

alertname: HighCpuUsage
severity: critical
instance: server2
job: myapp
```

This will result in 2 separate notifications since we want to group alerts by both `severity` and `alertname`

```
[ALERT] HighCpuUsage - warning (1 active)
  - instance: server1
  - job: myapp

[ALERT] HighCpuUsage - critical (1 active)
  - instance: server2
  - job: myapp
```
