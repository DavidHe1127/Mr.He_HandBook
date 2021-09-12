## Networking

- [3 types of IPs](#different-ips)

### Different IPs

- ClusterIP: The IP address assigned to a Service.
- Pod IP: The IP address assigned to a given Pod. This is ephemeral.
- Node IP: The IP address assigned to a given node.

### Comms

- Comm between containers within a pod occur via `localhost:port`. Similar to how `host` network mode works in Docker
- Inter-pods comms occur via pod IP. ip:<container_port>. Considering pod is transient, use service instead which also takes care of load balancing traffic across multiple pods behind the service. It also allows use of service name as hostname to reach the other pod.

[<img src="./inter-pod-comm.png" width="500"/>](./inter-pod-comm.png)

