## Networking

- [3 types of IPs](#different-ips)
- [Communications](#communications)
- [kube-proxy](#kube-proxy)
- [DNS](#dns)
- [Container Network Interface](#CNI)
- [Networking Bible](https://medium.com/google-cloud/understanding-kubernetes-networking-services-f0cb48e4cc82)

### Basic Networking

A cluster consists of 2 VPCs: AWS managed VPC for control plane & customer's VPC for data plane.

### Different IPs

- ClusterIP: The IP address assigned to a Service.
- Pod IP: The IP address assigned to a given Pod. This is ephemeral.
- Node IP: The IP address assigned to a given node.

### Communications

- Comm between containers within a pod occur via `localhost:port`. Similar to how `host` network mode works in Docker
- Inter-pods comms occur via pod IP. ip:<container_port>. Considering pod is transient, use service instead which also takes care of load balancing traffic across multiple pods behind the service. It also allows use of service name as hostname to reach the other pod.

[<img src="./inter-pod-comm.png" width="500"/>](./inter-pod-comm.png)

### Kube-proxy

- A container in a pod in `kube-system` namespace
- Primary role is to forward traffic to the pods (registered as endpoints) behind a service. Usually, it runs in `iptables` mode to load balance inbound traffic across a group of pods via round-robin mechanism.

### DNS

externalDNS is running a pod to help expose your services to the outside world by creating DNS records in the DNS providers external to K8S. i.e Route53.

### VPC CNI

- VPC CNI plugin provided via addon assigns each pod an IP address from your VPC.
- It allocates AWS ENI to each node and uses the secondary IP range from each ENI for pods on the node.
- Deployed within each of your Amazon EC2 nodes in a Daemonset with the name `aws-node`.
- When you provision a worker node, the CNI allocates a pool of secondary IP addresses (called warm pool) from the node’s primary ENI. As the pool gets depleted, the CNI attaches another ENI to assign more IP addresses. This process continues until no more ENIs can be attached to the node.
- Max number of pods one node can take depending on instance type. For detail see [this](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-eni.html#AvailableIpPerENI)
- In the event of ips being depleted, consider adding a secondary cidr to the existing VPC. See [this](https://aws.amazon.com/blogs/containers/optimize-ip-addresses-usage-by-pods-in-your-amazon-eks-cluster/).

### Key facts

- Each pod has its unique IP address. So, there are no port conflicts.
- The pods won’t serve traffic until and unless you expose them as a service.
- Creating a service out of pod assigns a NodePort (which is in range 30000-32000) on every node. This port must be unique for every service.
- If a node has multiple pods kube-proxy balances the traffic between those pods.
- Kubernetes imposes the following fundamental requirements on any networking implementation:
  - pods on a node can communicate with all pods on all nodes without NAT
  - agents on a node (e.g. system daemons, kubelet) can communicate with all pods on that node
