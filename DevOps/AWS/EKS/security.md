## Security

- [User Account vs Service Account](#user-account-vs-service-account)
- [RBAC](#RBAC)
- [OIDC provider](#OIDC-provider)
- [PodSecurityPolicy](#psp)
- [Pod Security Context](#pod-security-context)
- [References](#references)

### User Account vs Service Account

User Account allows us, humans, to access the given Kubernetes cluster to perform administrative tasks or a developer accessing the cluster to deploy applications etc.

A Service Account is an identity that is attached to the processes running within a pod. It is used to authenticate machine level processes to get access to our Kubernetes cluster.

### RBAC

Defines and controls who can access what within the cluster. It's implemented via `rbac.authorization.k8s.io`.

3 groups:
- Subjects - User/Group/Service Account
- Operations - list/get/post/delete etc
- Resources - Pods/Nodes/ConfigMaps etc

Operations are executed against API server.

- 4 components:
  - Role - defines namespace level resources access
  - ClusterRole - cluster level which applies to all namespaces. be careful!
  - RoleBinding - similar to IAM role assumption
  - ClusterRoleBinding
- Only `allow` rules no `deny` ones
- Role always applies to a particular `namespace`. You must set `namespace` on the role. While `ClusterRole` must be non-namespaced, applies to all namespaces within a cluster.
- Either ClusterRole/Role binding acts similar to IAM role assumption in AWS.
- You can bind a role to a service account in a namespace for authorizations.

### OIDC Provider

OIDC - OpenID Connect - a standard to authenticate users.

Why do we need OIDC Provider in our cluster? The OIDC provider you create in your cluster is responsible for validating JWT. It contains signing keys for `ProjectedServiceAccountToken` validation.

How it works? K8S automatically issues `ProjectedServiceAccountToken` which is a valid OIDC JWT for pod. Pod then passes this token to `AssumeRoleWithWebIdentity` API operation to assume the IAM role. AWS STS validates identity token with OIDC provider. Once succeeded, pod will receive temp credentials for making calls to AWS resources.

https://pnguyen.io/posts/eks-iam-roles-for-service-accounts/#step-7-aws-sts-validate-identity-token-with-oidc-provider
https://blogs.halodoc.io/iam-roles-for-service-accounts-2/

#### Referring to resources

```
# to grant perms to access GET /api/v1/namespaces/{namespace}/pods/{name}/log
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: pod-and-pod-logs-reader
rules:
- apiGroups: [""]
  resources: ["pods", "pods/log"]
  verbs: ["get", "list"]
  # or access a ConfigMap called my-configmap
  resources: ["configmaps"]
  resourceNames: ["my-configmap"]
```

#### Referring to subjects

A RoleBinding or ClusterRoleBinding binds a role to subjects. Subjects can be groups, users or ServiceAccounts.

```
subjects:
# user
- kind: User
  name: "alice@example.com"
  apiGroup: rbac.authorization.k8s.io
# group
- kind: Group
  name: "frontend-admins"
# default service account in kube-system namespace
- kind: ServiceAccount
  name: default
  namespace: kube-system
```

### PodSecurityPolicy

- A cluster-level resource
- Restrictive rule set enforced on pod for security hardening. Once enabled, any attempts to run pods that don't satisfy PsP will be denied into cluster. i.e Disallow container to run as a root. Common workflow is 1) create allowed rules, 2) create role to use it c) bind the role to cluster.
- It is not a container run-time security platform that can detect violations and shutdown pods.

As recommended by k8s, bind the PsP to the entire namesapce.

```
- kind: Group
  apiGroup: rbac.authorization.k8s.io
  name: system:serviceaccounts:<authorized namespace>
```

See [example code](./examples/psp.yaml).

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
