## Monitoring

While you could use k8s sd provided out-of-box in Prometheus as blogged [here](https://blog.sebastian-daschner.com/entries/prometheus-kubernetes-discovery). It's more recommended use [Prometheus Operator](https://prometheus-operator.dev/) to abstract away the lower-level configuration. Prom Operator uses k8s custom resources to simplify the deployment and configuration of Prometheus, Alertmanager, and related monitoring components. Watch [how to use K8S operator](https://www.youtube.com/watch?v=MuHPMXCGiLc) from `19:13`.

See [ServiceMonitorSpec](https://github.com/prometheus-operator/prometheus-operator/blob/master/Documentation/api.md#servicemonitorspec) for more details.

If you look for a more comprehensive solution that covers monitoring, AlertManagers, Grafana etc. Check out [kube-prometheus-stack](https://artifacthub.io/packages/helm/prometheus-community/kube-prometheus-stack) helm chart.

See [Arch diagram](https://github.com/prometheus-operator/prometheus-operator/blob/master/Documentation/troubleshooting.md#overview-of-servicemonitor-tagging-and-related-elements) to understand how it works under the hood.
