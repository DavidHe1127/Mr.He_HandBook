K8s Basic Concepts, learning resources and best practices

- [Basics](#basics)
- [kubectl](#kubectl)

### basics

#### Node

- Smallest unit of computing hardware in k8s.
- A representation of a single machine in your cluster. i.e either a VM or a bare-metal server in datacenter
- 2 types
  - A Master-node type, which makes up the Control Plane, acts as the **brains** of the cluster.
  - A Worker-node type, which makes up the Data Plane, runs the actual container images (via pods).

#### Cluster

- All nodes pool together their resources to form a more powerful machine.
- K8S intelligently handles distributing work to the individual nodes for you when deploying your program onto cluster.

#### Persistent volumes

- Files and app data cannot be saved into local `fs` on pod since app might be running on a different pod everytime it needs to run.
- Local or cloud drives can be attached to the cluster as a Persistent Volume. This can be thought of as plugging an external hard drive in to the cluster.
- Persistent Volumes provide a file system that can be mounted to the cluster, without being associated with any particular node.

#### Pod

- Wraps one or more containers into a higher-level structure.
- A Pod always runs on a Node.
- Any containers in the same pod will share the same resources and local network.
- Containers can easily communicate with other containers in the same pod as though they were on the same machine while maintaining a degree of isolation from others.
- Used as the unit of replication in Kubernetes. If your application becomes too popular and a single pod instance can’t carry the load, Kubernetes can be configured to deploy new replicas of your pod to the cluster as necessary. Even when not under heavy load, it is standard to have multiple copies of a pod running at any time in a production system to allow load balancing and failure resistance.

#### Deployment

- Declare how many replicas of a pod should be running at a time
- When a deployment is added to the cluster, it will automatically spin up the requested number of pods, and then monitor them. If a pod dies, the deployment will automatically re-create it.
- By using `Deployment`, declare the desired state of the system, and it will be managed for you automatically.

#### Objects

k8s objects are entities that are used to represent the state of the cluster.

k8s is always working to make an object’s `current state` equal to the object’s `desired state.` A desired state can describe:

1. What pods (containers) are running, and on which nodes
2. IP endpoints that map to a logical group of containers
3. How many replicas of a container are running

#### Summary

- Node - a VM
- Pod - a container running on VM
- Cluster - a cluster of VMs

#### kubectl
Community developed tool to interact with your cluster.
