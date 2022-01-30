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
```
