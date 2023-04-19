## Node

- [Graceful shutdown](#graceful-shutdown)

### Graceful shutdown

It helps kubelet detect the shutdown so that pod eviction initiated by `kubelet` is given extra time to complete. Kubelet will also update the `Ready` condition of the node to `false` with a message `Node Shutting Down`, thereby ensuring new workloads will not get scheduled to the node. Before graceful shutdown feature, when shutting down a node, you need to:

- Cordon the existing node: This operation marks the nodes as unschedulable. Kubernetes stops scheduling new Pods to these nodes once you mark them as unschedulable.
- Drain the existing node: This operation evicts the workloads running on the nodes of the gracefully.

Abrupt shutdown will cause that services talking to those pods might see errors.

When the system is about to shut down, the kubelet can delay that shutdown for a configurable, short duration to allow your pods extra time to terminate.

Pods are split into two categories: "regular" and "critical". Critical pods are those that have priorityClassName set to system-cluster-critical or system-node-critical; all other pods are considered regular. i.e logging DaemonSet is considered to be critical one.

During the graceful node shutdown, regular pods are terminated first, followed by critical pods.

### Node Termination Handler

It will call K8S APIs to cordon node to ensure no more workload is scheduled there, drain it (finish in-flight transactions), remove existing work. Your app will also be notified with `SIGTERM` to give your app time for having a graceful shutdown. A final `SIGKILL` is also sent 30 seconds apart to kill the process.
