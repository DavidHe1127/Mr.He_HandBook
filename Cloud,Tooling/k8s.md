Kubernetes

- Core
  - [Node](#node)
  - [Pod](#pod)
  - [Cluster](#cluster)
  - [Persistent Volumes](#persistent-volumes)
  - [Deployment](#deployment)
  - [Networking](#networking)
  - [Auth](#auth)
  - [kubectl](#kubectl)
  - [Workloads and objects](#workloads-and-objects)
  - [Summary](#summary)

- [Helm](#helm)

### Node

- Smallest unit of computing hardware in k8s.
- A representation of a single machine in your cluster. i.e either a VM or a bare-metal server in datacenter

### Pod

- Wraps one or more containers into a higher-level structure.
- A Pod always runs on a Node.
- Any containers in the same pod will share the same resources and local network.
- Containers can easily communicate with other containers in the same pod as though they were on the same machine while maintaining a degree of isolation from others.
- Used as the unit of replication in Kubernetes. If your application becomes too popular and a single pod instance can’t carry the load, Kubernetes can be configured to deploy new replicas of your pod to the cluster as necessary. Even when not under heavy load, it is standard to have multiple copies of a pod running at any time in a production system to allow load balancing and failure resistance.

### Cluster

- All nodes pool together their resources to form a more powerful machine.
- K8S intelligently handles distributing work to the individual nodes for you when deploying your program onto cluster.

### Persistent volumes

- Files and app data cannot be saved into local `fs` on pod since app might be running on a different pod everytime it needs to run.
- Local or cloud drives can be attached to the cluster as a Persistent Volume. This can be thought of as plugging an external hard drive in to the cluster.
- Persistent Volumes provide a file system that can be mounted to the cluster, without being associated with any particular node.

### Deployment

- Declare how many replicas of a pod should be running at a time
- When a deployment is added to the cluster, it will automatically spin up the requested number of pods, and then monitor them. If a pod dies, the deployment will automatically re-create it.
- By using `Deployment`, declare the desired state of the system, and it will be managed for you automatically.

### Networking

- Default service type is `ClusterIP` which makes service reachable only from within the cluster.

### Auth

- Any request originated outside of the cluster is authenticated using one of the configured schemes. The most common technique to authenticate requests is through `X.509` certificates
- Service accounts are meant to authenticate processes running within the cluster. Service accounts are associated with pods that make internal calls to the API server.

### Workloads and Objects

- Workloads are objects that set deployment rules for pods. Based on these rules, K8s performs the deployment and updates the `workload` with the current state of the application. `Workloads` let you define the rules for application scheduling, scaling and upgrade.
- Object can be many types such as deployment, pod, service.

### Summary

- Node - a VM
- Pod - a container running on VM
- Cluster - a cluster of VMs

---

### Helm
- Helm uses a packaging format called `Charts`. A Chart is a collection of files that describe k8s resources.
- To install nginx on a Debian-based system you would run `apt install nginx`. Similarly, to install nginx to a k8s cluster, you could simply run `helm install nginx`.
- A package manager for k8s that allows developers and operators to more easily package, configure and deploy applications and services onto clusters.
- Deploying apps to k8s - the powerful and popular container-orchestration system - can be complex. Setting up a single app can involve creating multiple interdependent k8s resources - such as pods, services, deployments and replicasets. Each requires you to write a detailed YAML manifest file.

- Node - a VM
- Pod - a container running on VM
- Cluster - a cluster of VMs

#### kubectl
Community developed tool to interact with your cluster.
