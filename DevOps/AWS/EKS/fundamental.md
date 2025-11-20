## Fundamentals

- [Server Side Apply vs Client Side Apply](https://www.howtogeek.com/devops/what-is-kubernetes-server-side-apply-ssa/)

### Controller

A controller is a k8s core component that the following - a control loop that:

- Watches the desired state (what’s declared in YAML),
- Observes the current state (what’s actually running),
- Takes actions to reconcile them.

### Operator

An Operator is basically a custom controller that extends k8s to manage complex applications — not just built-in objects like Pods or Deployments.
It introduces new CRD.
