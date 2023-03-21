## Pod

- [Basics](#basics)
- [Deployment](#deployment)
- [Affinity and Anti-affinity](#affinity-and-anti-affinity)
- [Taint & Tolerations](#taint-and-tolerations)
- [Container Liveness and Readiness](#liveness)
- [Pod Disruption Budget](#pod-disruption-budget)
- [Security Group](#security-group)
- [CPU & Memory](#cpu-and-memory)
- Miscels
  - [CrashLoopBackOff](#crash-loop-backoff)

### Basics

Pod cannot self-heal if it has issues. It will get removed by controller when it cannot run anymore.

### Deployment

#### StatefulSet

- Every replica has its own state. Each pod has own PVC. i.e 3 pods means 3 volumes
- Replica pods are not identical! as opposed to deployment. Each pod has its own identity and is not replicable i.e 3 replicas: mysql-0, mysql-1, mysql-2
- When a pod is replaced, it doesn't lose the ID. Storage is re-attached to the new pod
- Support rolling update but not rollback since it's stateful

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

### Affinity and Anti-affinity

To control which node the pod can/cannot run on in particular. Pod affinity is pod-driven policy which means one pod placement is constrained by another pod. This can be useful when needing to make sure 2 same pods are not run on the same node. While node affinity is looking at node only not pod. i.e a pod can only run a node with label `abc`.

- [pod affinity/anti-affinity](http://bazingafeng.com/2019/03/31/k8s-affinity-topologykey/)

### Taint and Tolerations

It tells particular nodes to **ONLY** accept pods with certain tolerations. To restrict pods to certain nodes, use Node affinity.

### Liveness

Liveness probe indicates whether the Container is running. If the liveness probe fails, the kubelet kills the container, and the container is subjected to its restart policy. If a container does not provide a liveness probe, the default state is Success. Also, it doesn’t wait for readiness probes to succeed.

#### Readiness

- Indicates whether the Container is ready to serve traffic.
- A Pod is considered ready when all of its containers are ready.
- One use of this signal is to control which Pods are used as backends for Services. When a Pod is not ready, it is removed from Service load balancers.
- If left undefined, the default state is Success.
- Readiness probes runs on the container during its whole lifecycle - it checks continously, see pod logs.
- Pods failing readiness check will not be killed by kubelet but rather being marked `not ready`.
- When all pods are `not ready` meaning they all fail readiness probes, then your service will receive 0 traffic.

when readiness probe fails:
```
# pod
NAME       READY   STATUS    RESTARTS   AGE
notready   0/1     Running   0          17m

# Events:
Type     Reason     Age                 From    Message
----     ------     ----                ----    -------
Warning  Unhealthy  1s (x21 over 58s)  kubelet  Readiness probe failed: HTTP probe failed with statuscode: 500
```

K8S relies on the readiness probes. During a rolling update, it will keep the old container up and running until the new service declares that it is ready to take traffic. Therefore the readiness probes have to be implemented correctly.

### Pod Disruption Budget

Protect your app from voluntary disruptions including but not restricted to:

- node group replacement
- node scaling up/down

It however doesn't add protection when data centre has an outage.

[Read more](https://innablr.com.au/blog/what-is-pod-disruption-budget-in-k8s-and-why-to-use-it/)
[Demo](https://www.youtube.com/watch?v=e2HjRrmXMDw)

### Security Group

- When you create a cluster, EKS creates a security group that's named `eks-cluster-sg-my-cluster-uniqueID`.
- EKS automatically associate sg to ENI of the nodes in any managed node group that you create.
- If pod doesn't have a custom sg, then it uses the default one.
- As long as pod has a custom sg attached, it will DROP the default one (networking issue might be seen here, so check security group of your pod!).

### CPU and Memory

#### CPU

- **DON'T set limits on CPU, ONLY set requests**
- Set on container level and is aggregated in pod.
```yml
# measuring unit can either be numbers such as 1.0, 0.5 or 500m in millicores.
# 1000 millicores = 1 whole core (vCPU)
# Thinking in ms can better understand measuing unit. k8s uses a cfs_period_us of 100ms (period). In other words, each a CPU request of 1.0 (quota) in k8s represents 100ms of CPU time in 100ms.
# 1 millicore = 1/1000th of a cpu’s time. 1000m = 100ms So if a container's cpu request is set to 4.0 which is 4000 millicore = 400ms cpu time allowed per 100ms. The reason why we get 400ms in a 100ms time frame is each core is capable of doing 100ms of work in a 100ms period – 100ms x 4cores = 400ms.

spec:
  containers:
  - name: app
    image: images.my-company.example/app:v4
    resources:
      requests:
        memory: "64Mi"
        # in every 100ms, 25ms cpu time is alloted to the process
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
```
- Pod scheduling is based on `requests` not `limits`
- Pod will never get scheduled if CPU request > core count of largest node
- Keep CPU at 1 or below and run more replicas to scale out unless apps require multi-core processing such as a multi-threaded database.
- If no `limits` is set, struggling pod can use more cpu if available.
- Use metric server to help figure out consumption requirement.
- CPU percentage is the sum of percentage per core.
- Keep in mind, CPU is a compressible resource. In simple terms, applications will start throttling once they hit the CPU limits. Throttling can adversely affect your application’s performance by making it run slower. Kubernetes will not terminate those apps.

#### Memory

---

### Miscels

#### Pod Restart Policy

`Always` - means that the container will be restarted even if it exited with a zero exit code (i.e. successfully). This is useful when you don't care why the container exited, you just want to make sure that it is always running (e.g. a web server). This is the default.

`OnFailure` - means that the container will ONLY be restarted if it exited with a non-zero exit code (i.e. something went wrong). This is useful when you want accomplish a certain task with the pod, and ensure that it completes successfully - if it doesn't, it will be restarted until it does.

#### CrashLoopBackOff

A commonplace reason it happens

> The Docker container must hold and keep the PID 1 running in it otherwise the container exit (A container exit when the main process exit). In the case of Docker, the process which is having PID 1 is the main process and since it is not running, the docker container gets stopped. When the container gets stopped, the Kubernetes will try to restart it(as we have specified the spec.restartPolicy as "Always").

One workaround is to add a line of `CMD tail -f /dev/null` at the bottom of your docker file to keep it running forever.
