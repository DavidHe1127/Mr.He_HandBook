## Autoscaling

- [HorizontalPodAutoscaler](#HorizontalPodAutoscaler)
- [Prometheus Adapter](#prometheus-adapter)
- [KEDA](#keda)

### HorizontalPodAutoscaler

- Standard k8s resource. No pre-install required. However, k8s-metric-server is still needed to be installed.
- Doesn't apply for DaemonSet
- Deploy more pods to cope with increased workload
- When workload decreases, HPA will scale resources back down below configured minimum number of pods
- Don't set replicas on deployment. See [this](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/#migrating-deployments-and-statefulsets-to-horizontal-autoscaling)

```
apiVersion: autoscaling/v1
kind: HorizontalPodAutoscaler
metadata:
  name: image-registry
  namespace: default
spec:
  maxReplicas: 7
  minReplicas: 3
  scaleTargetRef:
    apiVersion: apps.openshift.io/v1
    kind: DeploymentConfig
    name: image-registry
  targetCPUUtilizationPercentage: 75
status:
  currentReplicas: 5
  desiredReplicas: 0
```

### Prometheus Adapter

Helps us to leverage the metrics collected by Prometheus and use them to make scaling decisions. HPA can only scale based on CPU/Mem.

### KEDA

#### Why?

HPA only reacts to resource-based metrics such as CPU or memory usage or custom metrics.

#### K8S Metric Server

The K8S metrics-server fetches resource metrics from the `kubelets` and exposes them in the Kubernetes API server through the Metrics API for use by the HPA and VPA.

#### Concept

KEDA is an event-driven autoscaling solution acts as a k8s metrics server that exposes rich event data provided by an external solution (scalers). It drives the HPA to scale. KEDA can scale standard K8S objects and also custom resource

KEDA is more proactive. It monitors your event source and feeds this data back to the HPA resource as a custom metric for you. This way, KEDA can scale any container based on the number of events that need to be processed, before the CPU or memory usage goes up. You can also explicitly set which deployments KEDA should scale for you. So, you can tell it to only scale a specific application.

#### Components

- Agent - KEDA activates and deactivates k8s Deployments to scale to and from zero on no events. This is one of the primary roles of the `keda-operator` container that runs when you install KEDA.
- Metrics - KEDA acts as a k8s metrics server that exposes rich event data like queue length or stream lag to the HPA to drive scale in/out.

KEDA will create HPA for you.

#### ReadMe

- [intro to keda by IBM](https://developer.ibm.com/articles/introduction-to-keda/)
