## Solutions

### Monitoring

#### Grafana

When Grafana has access to an aggregated data set, it makes it relatively easy to visualize multiple metrics across multiple application stacks on the same screen, in a dashboard that you can save and refer back to often. Prometheus can visualize individual metrics as graphs, but does not have the same flexibility or extendability as Grafana. Prometheus even links to Grafana in its documentation around visualization, as it knows it has limitations.

#### Prometheus

Prometheus focuses on metrics; not logs. It is great at exposing standard and custom metrics from an application it is monitoring. When it is deployed in a Kubernetes cluster it can discover any pod that is running, and persist any time-series data the application has exposed to its data store. Grafana, on the other hand, cannot define what data is exposed and captured.

### Logging



