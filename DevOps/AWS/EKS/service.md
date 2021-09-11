## Service

Services allow your applications to receive traffic from internal/external(outside cluster but still within the same network)/internet.

- [Types](#types)
- [Ingress](#ingress)
- [Key Points](#key-points)

### Types

- ClusterIP
- NodePort
- LoadBalancer

#### ClusterIP

Exposes the Service on a cluster-internal IP. Choosing this value makes the Service only reachable from within the cluster. This is the default type. i.e fluentd service can be accessed on Node via:

```
# via service's clusterIP
http://<service_clusterIP>:<service_port>/fluentd.healthcheck?json=%7B%22ping%22%3A+%22pong%22%7D
# or via pod's ip
http://<pod_ip>:<container_port>/fluentd.healthcheck?json=%7B%22ping%22%3A+%22pong%22%7D
```

#### NodePort

Exposes the Service on each Node's IP at a static port (the NodePort). A ClusterIP Service, to which the NodePort Service routes, is automatically created. Traffic flows to VMs(NodeIP) via NodePort --> Service(ClusterIP) via port --> Pod(PodIP) via targetPort/containerPort.

```yaml
# NodePort service
kind: Service
apiVersion: v1
metadata:
  name: hostname-service
spec:
  # Expose the service on a static port on each node
  # so that we can access the service from outside the cluster
  type: NodePort
  # target pods via label
  selector:
    app: echo-hostname
  ports:
    # nodePort - a static port assigned on each the node. optional port ranging from 30000–32767 will be picked if not specified
    # port - port exposed internally in the cluster
    # targetPort - the container port to send requests to
    - nodePort: 30163
      port: 8080
      targetPort: 80
```

```yaml
# Deployment
kind: Pod
apiVersion: v1
metadata:
  name: hostname-pod-102
  labels:
    app: echo-hostname
    app-version: v102
spec:
  containers:
    - name: nginx-hostname
      image: kubegoldenguide/nginx-hostname:1.0.2
      ports:
        - containerPort: 80
```

Once deployed, service can be accessed from outside of cluster via NodeIP:NodePort (an IP assigned to the service). If node is assigned a public ip, then service can be accessed via public ip from internet. Should not be used in Production environment.

#### LoadBalancer

Exposes the Service externally using a cloud provider's load balancer. NodePort and ClusterIP Services, to which the **external load balancer** routes, are automatically created.

When using AWS, this will create a load balancer which proxies traffic to all EC2s of the TargetGroup tied to it and then via NodePort Service to all pods.

Remarkable downsid is each service will have a dedicated load balancer created for it resulting in large bills.

### Ingress (Production-ready)

Not a service – it merely describes a set of rules for the Kubernetes Ingress Controller to create a Load Balancer, its Listeners, and routing rules for them.

#### Ingress

It is an API object that provides routing rules to manage external users' access to the services in a cluster. It's comprised of Ingress API Object and Ingress Controller.

```
---
apiVersion: v1
kind: Service
metadata:
  name: "nginx-service"
  namespace: "default"
spec:
  ports:
    - port: 80
  type: NodePort
  selector:
    app: "nginx"
---
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: "nginx-ingress"
  annotations:
    kubernetes.io/ingress.class: alb
    alb.ingress.kubernetes.io/scheme: internet-facing
  labels:
    app: "nginx"
spec:
  rules:
  - http:
      paths:
      - path: /svc1.html
        backend:
          serviceName: "nginx-1-service"
          servicePort: 80
      - path: /svc2.html
        backend:
          serviceName: "nginx-2-service"
          servicePort: 80
```

#### Ingress Controller

It watches API Server for changes to Ingress resource and creates ALB (external to cluster) with configured rules it reads from Ingress. It runs as a pod in cluster. For HA, it's deployed 2 replicas onto 2 selected nodes.

**Note, seems Nginx ingress controller does things differently, it also takes care of traffic load balancing?

#### Components

Take EKS as an example, when creating an Ingress, an external ALB (managed by Ingress and located outside of cluster) is created alongside other resources such as TargetGroup, Listeners, Rules etc.

![ingress](./ingress_arch.png)

---

### Key Points

- The reason we say LoadBalancer type is a superset of NodePort is because, creating a LoadBalancer service automatically creates a NodePort service which in turn creates a ClusterIP service automatically too. The superset additionally creates other resources. i.e for LoadBalancer type, it creates an external load balancer in AWS.


### References

- [Ingress vs load-balancer](https://stackoverflow.com/questions/45079988/ingress-vs-load-balancer)
- [Ingress 101](https://oteemo.com/ingress-101-what-is-kubernetes-ingress-why-does-it-exist/)
