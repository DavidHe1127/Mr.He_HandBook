## Recording Rules

Example:

```
# original query - total increase of res in the past 30s grouped by status_code
sum(increase(xxx_http_responses_total{cfn_stack="$stack"}[30s])) by (status_code)

# recording rule - Get per-second increment over last 1m. Multiply by n to get a value of n length of time
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

# new query in grafana - * 30 = 30s of increments
# by - keeps only status_code label
sum by(status_code) (cfn_stack:xxx_http_response_total:rate1m{cfn_stack="$stack"}) * 30
```

[Recording rules docs](https://prometheus.io/docs/practices/rules/)
