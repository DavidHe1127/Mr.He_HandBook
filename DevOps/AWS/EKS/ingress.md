## Ingress

Not a service – it merely describes a set of rules for the Kubernetes Ingress Controller (usually a pod) to create a Load Balancer external to your cluster e.g ALB on AWS, its Listeners, and routing rules for them.

[See example](./examples/ingress.yaml).

### Ingress Controller

It watches API Server for changes to Ingress resource and creates ALB (external to cluster) with configured rules it reads from Ingress. It runs as a pod in cluster. For HA, it's deployed 2 replicas onto 2 selected nodes. It's implemented through [AWS Load Balancer Controller](https://docs.aws.amazon.com/eks/latest/userguide/aws-load-balancer-controller.html)


- To set tags on target group only, set `'alb.ingress.kubernetes.io/tags': 'AAA=BBBB'` in backend service's annotations.

### Components

Take EKS as an example, when creating an Ingress, an external ALB (managed by Ingress and located outside of cluster) is created alongside other resources such as TargetGroup, Listeners, Rules etc.

[<img src="./ingress_arch.png" height="800"/>](./ingress_arch.png)

### TLS

Generally, steps include:

- Obtain a tls cert
- Create a tls secret resource with inclusion of cert and key files
- Modify ingress to load cert/key from the secret
```
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - something.cpw.com.au
    secretName: something.cpw.com.au
```

In [AWS Load Balancer Controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/v2.4/guide/ingress/cert_discovery/), TLS cert for ALB Listeners can be automatically discovered from `tls` and `host` field in Ingress rules, if `alb.ingress.kubernetes.io/certificate-arn` left unspecified. Taking wildcard cert as an example, setting `game2048.*.eks-use1.prod.abc.io` as host will help controller discover and attach the wildcard cert `*.eks-use1.prod.abc.io` to the ALB it's created.

