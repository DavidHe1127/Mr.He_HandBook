## Fundamentals

- [Server Side Apply vs Client Side Apply](https://www.howtogeek.com/devops/what-is-kubernetes-server-side-apply-ssa/)

### What is a controller?

A K8S component whose primary function is to ensure that the desired state is maintained, even in the face of failures and other disruptions. For example, a Deployment controller ensures that a specified number of replicas of a Pod are running at all times, and will automatically create or delete replicas as needed to achieve that desired state.
