## Helm

- Helm uses a packaging format called `Charts`. A Chart is a collection of files that describe k8s resources.
- To install nginx on a Debian-based system you would run `apt install nginx`. Similarly, to install nginx to a k8s cluster, you could simply run `helm install nginx`.
- A package manager for k8s that allows developers and operators to more easily package, configure and deploy applications and services onto clusters.
- Deploying apps to k8s - the powerful and popular container-orchestration system - can be complex. Setting up a single app can involve creating multiple interdependent k8s resources - such as pods, services, deployments and replicasets. Each requires you to write a detailed YAML manifest file.

- Node - a VM
- Pod - a container running on VM
- Cluster - a cluster of VMs
