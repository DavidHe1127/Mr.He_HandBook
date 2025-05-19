# WAFv2

## Metric Name

Top-level metric is for the whole WebAcl tracking overall metrics for all requests evaluated by the WebACL. On the other hand, rule-level metric is to track metrics for each individual rule.

To see each metric in cloudwatch, follow the path `ALL > WAFV2 > Rule, WebACL` and look for your metric name.

```
{
  "Name": "xyz",
  "DefaultAction": {
    "Allow": {}
  },
  "Description": "WAF ACL",
  "Rules": [
    {
      "Name": "waf-rule",
      "Priority": 400,
      "Statement": {
        "RateBasedStatement": {
          "Limit": 1000,
          "EvaluationWindowSec": 300,
          "AggregateKeyType": "IP"
        }
      },
      "Action": {
        "Count": {}
      },
      "VisibilityConfig": {
        "SampledRequestsEnabled": true,
        "CloudWatchMetricsEnabled": true,
        "MetricName": "dave-acl-test-rule"
      }
    }
  ],
  "VisibilityConfig": {
    "SampledRequestsEnabled": true,
    "CloudWatchMetricsEnabled": true,
    "MetricName": "dave-acl"
  },
}
```
