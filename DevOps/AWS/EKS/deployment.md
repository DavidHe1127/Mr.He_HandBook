# Deployment

A way to manage a set of pods so that you don't have to manage each pod individually. i.e use `deployment` workload type to define stateless app manifest.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  # num of pods
  replicas: 3
  # manage pods labelled nginx
  selector:
    matchLabels:
      app: nginx
  template:
    # label pods with nginx
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
```

- Mainly used for stateless applications.
- Only one Persistence Volume Claim created. So all pods will share it. Same file/volume shared by all pods.
- Support rolling update and rollback

### ReplicaSet

Use `Deployment` with `replicas` instead.

### StatefulSet

- Every replica has its own state. Each pod has own PVC. i.e 3 pods means 3 volumes
- Support rolling update but not rollback since it's statefulness

### DaemonSet

- Some/All nodes each has one copy of pod deployed
- When nodes are added/removed from cluster, pods will be added/gced accordingly
- Deleting a `DaemonSet` will also clean up pods it created.

### Jobs

- equivalent of one time/standalone task in ECS. It can also run certain a number of times.
