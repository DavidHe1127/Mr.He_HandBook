## Pod

- [Basics](#basics)
- [Attach role to pod to allow aws access](#aws-access)
- [Deployment](#deployment)

### Basics

Pod cannot self-heal if it has issues. It will get removed by controller when it cannot run anymore.

### AWS access

See [oicd provider](https://github.com/DavidHe1127/Mr.He_HandBook/blob/master/DevOps/AWS/EKS/security.md#OIDC-provider) for how it works.

First, create trust relationship. Example policy below allow service account named `hello-world-app` to assume role with WebIdentity.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::1234567890123:oidc-provider/my-oidc-provider.example.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "my-oidc-provider.example.com:sub": [
            "system:serviceaccount:default:hello-world-app"
          ]
        }
      }
    }
  ]
}
```

sub format `system:serviceaccount:<namespace>:<service-account-name>`

Next, create iam role with desired perms. `arn:aws:iam::1234567890123:role/my-app-role`

Last, assign role to service account via annotations. And use the service account in pod:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: hello-world-app
  annotations:
    eks.amazonaws.com/audience: aws-iam # Optional and will default to API flags
    eks.amazonaws.com/role-arn: arn:aws:iam::1234567890123:role/my-app-role
---
apiVersion: v1
kind: Pod
metadata:
  name: aws-test
spec:
  serviceAccountName: hello-world-app
  containers:
  - name: aws-cli
    image: mikesir87/aws-cli:v1
    command: ["aws", "s3", "ls"]
```

### Deployment

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

#### ReplicaSet

Use `Deployment` with `replicas` instead.

#### StatefulSet

- Every replica has its own state. Each pod has own PVC. i.e 3 pods means 3 volumes
- Replica pods are not identical! as opposed to deployment. Each pod has its own identity and is not replicable i.e 3 replicas: mysql-0, mysql-1, mysql-2
- When a pod is replaced, it doesn't lose the ID. Storage is re-attached to the new pod
- Support rolling update but not rollback since it's statefulness

```yml
apiVersion: v1
kind: Service
metadata:
  name: nginx
  labels:
    app: nginx
spec:
  ports:
  - port: 80
    name: web
  clusterIP: None
  selector:
    app: nginx
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: web
spec:
  serviceName: "nginx"
  replicas: 2
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: k8s.gcr.io/nginx-slim:0.8
        ports:
        - containerPort: 80
          name: web
        volumeMounts:
        - name: www
          mountPath: /usr/share/nginx/html
  volumeClaimTemplates:
  - metadata:
      name: www
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 1Gi
```


#### DaemonSet

- Some/All nodes each has one copy of pod deployed
- When nodes are added/removed from cluster, pods will be added/gced accordingly
- Deleting a `DaemonSet` will also clean up pods it created.

#### Jobs

- equivalent of one time/standalone task in ECS. It can also run certain a number of times.

