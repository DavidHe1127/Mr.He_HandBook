## Autoscaling

- [HorizontalPodAutoscaler](#HorizontalPodAutoscaler)

### HorizontalPodAutoscaler

- Doesn't apply for DaemonSet
- Deploy more pods to cope with increased workload
- When workload decreases, HPA will scale resources back down below configured minimum number of pods

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
