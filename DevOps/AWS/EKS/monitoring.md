## Monitoring

While you could use k8s sd provided out-of-box in Prometheus as blogged [here](https://blog.sebastian-daschner.com/entries/prometheus-kubernetes-discovery). It's more recommended use [Prometheus Operator](https://prometheus-operator.dev/) to abstract away the lower-level configuration. Prom Operator uses k8s custom resources to simplify the deployment and configuration of Prometheus, Alertmanager, and related monitoring components. Watch [how to use K8S operator](https://www.youtube.com/watch?v=MuHPMXCGiLc) from `19:13`.

See [ServiceMonitorSpec](https://github.com/prometheus-operator/prometheus-operator/blob/master/Documentation/api.md#servicemonitorspec) for more details.

If you look for a more comprehensive solution that covers monitoring, AlertManagers, Grafana etc. Check out [kube-prometheus-stack](https://artifacthub.io/packages/helm/prometheus-community/kube-prometheus-stack) helm chart.

See [architecture diagram](https://github.com/prometheus-operator/prometheus-operator/blob/release/Documentation/custom-metrics-elements.png). Essentially, Prom operator will monitor Prom custom resource and read `ServiceMonitor` objects you've created to monitor your app. Configs in `ServiceMonitor` are then compiled into the Prometheus config file which is served to Prom created by Prom Operator.

### Monitoring Mixins

[It](https://monitoring.mixins.dev/) provides a rich set of alerting/recording rules out of the box. If using `kube-prometheus-stack` helm chart to deploy monitoring solution, included rules are baked in the deployment through turning [flags](https://github.com/prometheus-community/helm-charts/blob/kube-prometheus-stack-35.2.0/charts/kube-prometheus-stack/values.yaml#L33) on/off.

