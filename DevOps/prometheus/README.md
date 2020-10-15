## Prometheus

### Concepts

- TSDB (Time-series DB)
- `Instrumentation` in Prometheus terms means adding client libraries to your application in order for them to expose metrics to Prometheus
- Pull metrics from targets aka metric scraping
- Metrics can be scraped by several ways including
  - `Instrument` your app. It basically means you use their out-of-box library to collect and send metrics to server during scraping
  - Use an `Exporter` that is a binary running alongside the application you want to obtain metrics from. The exporter exposes Prometheus metrics, commonly by converting metrics that are exposed in a non-Prometheus format into a format that Prometheus supports.
  - Use `Pushgateway`. Occasionally you will need to monitor components which cannot be scraped. The Prometheus `Pushgateway` allows you to push time series from short-lived service-level batch jobs to an intermediary job which Prometheus can scrape.

![prometheus-metrics-scraping](prometheus-metrics-scraping.png)
![ways-gather-metrics](ways-gather-metrics.png)

### Job vs Instance vs Target

`Job` is a collection of instances with the same purpose. An `instance` is a `<host>:<port>` representation. While `target` is an object that holds information such as what labels to apply, any authentication required to connect, or other information that defines how the scrape will occur.

![jobs-instances](jobs-instances.png)
