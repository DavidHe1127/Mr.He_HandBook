## Query

### Aggregation operators

`by` used to group results by unique combination of one/more labels.

```
# call_counter_total
call_counter_total{instance="app:3100", job="movies", name="movies", path="/movies", status="200"} 90
call_counter_total{instance="app:3100", job="movies", name="movies", path="/movies", status="403"} 16
call_counter_total{instance="app:3100", job="movies", name="movies", path="/movies", status="404"} 31
call_counter_total{instance="movies", job="movies_test", name="movies", path="/movies", purpose="test", status="200"} 90
call_counter_total{instance="movies", job="movies_test", name="movies", path="/movies", purpose="test", status="403"} 16
call_counter_total{instance="movies", job="movies_test", name="movies", path="/movies", purpose="test", status="404"} 31

# sum (call_counter_total) by (instance, purpose)
{instance="movies", purpose="test"} 137
{instance="app:3100"} 137

# avg (call_counter_total) by (instance, job)
{instance="app:3100", job="movies"} 45.666666666666664
{instance="movies", job="movies_test"} 45.666666666666664

# rate(call_counter_total[1m])
{instance="app:3100", job="movies", name="movies", path="/movies", status="200"} 0.32765996177300444
{instance="app:3100", job="movies", name="movies", path="/movies", status="403"} 0.0910166560480568
{instance="app:3100", job="movies", name="movies", path="/movies", status="404"} 0.07281332483844544

# sum(rate(call_counter_total[1m]))
# Sum of rate of increase for all time series with metric call_counter_total in the past 1 min
{} 0.49150783681939825

# sum without(job)(rate(call_counter_total[1m])) === rate(call_counter_total[1m]) on values except for label discrepancy

# sum vs sum_over_time
request_count{a=1}  1,1,1,1,1
request_count{a=2}  1,1,1,1,1

sum(request_count)
# {} 2,2,2,2,2

sum_over_time(request_count[5s])
# request_count{a=1}  5
# request_count{a=2}  5

# use of Grafana global var. __range is specified in the dashboard time range view (calendar)
# sum of all time series values over set of time.
sum_over_time(METRIC{}[${__range}])
```

### Result Type

- instant vector i.e `prometheus_http_requests_total` which returns a single value with same labels.
- range vector i.e `prometheus_http_requests_total{}[5m]` which returns a set of values for the specified time window.
- scalar. it doesn't have time. i.e `count(http_requests_total)`.


### Example Query

Use [Prometheus Query npm](https://www.npmjs.com/package/prometheus-query) to write your query in js with ease. Alternatively, run query in curl when no access to query expression in web app.

```shell
curl -G \
  --data-urlencode "query=(avg by (instance) (rate(process_cpu_seconds_total{job=\"prometheus\"}[1m])) * 100)" \
  http://localhost:9090/api/v1/query
```

```
# count total number of time series
count({job="aws-cluster-autoscaler", __name__="rest_client_request_duration_seconds_bucket"})

# return top 50 largest metrics with each of its count. used to find out which metric consumes larger resources
topk(50, count by (__name__, job)({__name__=~".+"}))

# set to 0 when vector shows null
count(expression) or on() vector(0)

# aggregate same category of time series
sum(sum_over_time(net_conntrack_dialer_conn_failed_total{dialer_name="prometheus"}[24h]))
```

### Federate with curl

```
curl -G --data-urlencode 'match[]={__name__=~".+"}' http://localhost:9090/federate
```

### Why no samples returned after time series stop being produced for a while?

Either of 2 cases below will mark time series as stale and will not return to query

- A scrape fails then all time series from the previous scrape.
- There's no samples within the 5 minutes before the query.

Sampling in Prom means pull time series from targets. See `sample-data-ingestion` diagram for difference from scaping.

### what is deriv?

In the context of monitoring, a derivative of a metric is the rate at which the metric value changes.

### functions

- `rate/irate/increase/resets` ONLY work properly for counter metrics, as they interpret any decrease in value over time as a counter reset. In the case of the rate()-style functions, these resets will be approximated away and only positive rates are computed, leading to totally incorrect results when using these functions on gauge metrics.
- `delta/idelta/deriv/predict_linear` ONLY work properly for gauge metrics, as they treat increases and decreases in input metrics the same, and don't interpret decreases as counter resets.
