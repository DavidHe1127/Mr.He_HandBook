## Security

- [PodSecurityPolicy](#psp)
- [Pod Security Context](#pod-security-context)
- [References](#references)

### PodSecurityPolicy (deprecated in favour of PSA/PSS)

- A cluster-level resource
- Restrictive rule set enforced on pod for security hardening. Once enabled, any attempts to run pods that don't satisfy PsP will be denied into cluster. i.e Disallow container to run as a root. Common workflow is 1) create allowed rules, 2) create role to use it c) bind the role to cluster.
- It is not a container run-time security platform that can detect violations and shutdown pods.

As recommended by k8s, bind the PsP to the entire namesapce.

```
# the resource role is applied to
- kind: Group
  apiGroup: rbac.authorization.k8s.io
  name: system:serviceaccounts:<authorized namespace>
```

See [example code](./examples/psp.yaml).

> Note Amazon EKS clusters with Kubernetes version 1.13 or higher have a default pod security policy named `eks.privileged`. This policy has no restriction on what kind of pod can be accepted into the system, which is equivalent to running Kubernetes with the PodSecurityPolicy controller disabled.

### PSA/PSS (successor to PsP)

- PSS = security rules (Privileged / Baseline / Restricted)
- PSA = the Kubernetes admission controller that enforces those rules using namespace labels

### SecurityContext

- Similar to Policy in PsP but defined per pod.

```yaml
# UID/GID 0 refers to root
# All processes in containers run as userID 1000, groupID 3000 and all files created by processes owned by group 2000
spec:
  securityContext:
    runAsUser: 1000
    runAsGroup: 3000
    fsGroup: 2000
```

- [Read more](https://cloud.tencent.com/developer/article/1748675)

### References

- [PsP](https://medium.com/devops-dudes/a-detailed-guide-to-kubernetes-podsecuritypolicy-in-aws-eks-71c66ded6375)
