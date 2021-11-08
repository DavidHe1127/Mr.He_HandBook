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
```

### Result Type

- instant vector i.e `prometheus_http_requests_total` which returns a single value with same labels.
- range vector i.e `prometheus_http_requests_total{}[5m]` which returns a set of values for the specified time window.
- scalar. it doesn't have time. i.e `count(http_requests_total)`.


### Example Query

Use [Prometheus Query npm](https://www.npmjs.com/package/prometheus-query)

```
# count total number of time series
count({job="aws-cluster-autoscaler", __name__="rest_client_request_duration_seconds_bucket"})

# top 50 metric count used to find out which metric consumes larger resources
topk(50, count by (__name__, job)({__name__=~".+"}))

# set to 0 when vector shows null
count(expression) or on() vector(0)
```
