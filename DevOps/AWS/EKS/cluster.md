## Cluster

- [K8S API server endpoint accessibility](#k8s-api-server-endpoint-accessbility)

### k8s api server endpoint accessbility

Enable both public/private access such that you can access cluster resources directly from your workstation (public access enabled). Use RBAC to control who is allowed to access the resources instead.

### Cluster AutoScaling (CAS)

Read [this](https://docs.aws.amazon.com/eks/latest/userguide/autoscaling.html).

### Security Group

It's required for comms between your worker nodes (data plane) and k8s control plane.

