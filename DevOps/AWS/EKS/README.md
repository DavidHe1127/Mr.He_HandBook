# EKS

- [Architecture](#architecture)
- [Useful code snippets](useful-code-snippet)

## Architecture

### Control Plane

![Diagram](./k8s-control-plane.svg)

#### API Server

Contact point for control plane. It's how you can interact with your cluster. It validates users requests and process them if valid. Use `kubectl` or REST API for communication.
You can even use a 3rd k8s provider for interaction too.

```
// Pulumi communicates with the API Server using the official Kubernetes client-go library
export const provider = new kubernetes.Provider('main', {
  kubeconfig: {
    ...
  }
});
```

### Data Plane

![Diagram](./k8s-master-worker-comm.svg)


## Useful code snippet


```shell
# grant perms for entity to interact with cluster
aws eks update-kubeconfig --name cluster-name --profile david-adm
```
