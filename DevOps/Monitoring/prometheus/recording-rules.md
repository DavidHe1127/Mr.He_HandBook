## Recording Rules

It allows us to precompute frequently needed or computationally expensive expressions and save their result as a new set of time series. Querying the precomputed result will then often be much faster than executing the original expression every time it is needed.

Example:

```
# original query - total increase of res in the past 30s grouped by status_code
sum(increase(xxx_http_responses_total{cfn_stack="$stack"}[30s])) by (status_code)

# recording rule - Get per-second average increment over last 1m. Multiply by n to get a value of n length of time
- record: 'cfn_stack:xxx_http_responses_total:rate1m'
  expr: |
    # without removes the listed labels from the result vector
    sum without(
      instance
    )
    (
      rate(
        xxx_http_responses_total[1m]
      )
    )

# new query in grafana: * 30 = 30s of increments
# sum is used to aggregate values by dimensions. e.g by status_code label in this example
sum by(status_code) (cfn_stack:xxx_http_response_total:rate1m{cfn_stack="$stack"}) * 30
```

[Recording rules docs](https://prometheus.io/docs/practices/rules/)
