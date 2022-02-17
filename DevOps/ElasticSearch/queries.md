## ElasticSearch

- `term` does exact match and no analyzing involved.

```
#
...
{
  "xxx": {
    "tenant": "uat"
  }
}
...

# value must exactly match
{
  "query": {
    "term": {
      "xxx.tenant": {
        "value": "uat"
      }
    }
  }
}
```

Queries example:

```shell
# events per day aggregates
GET logs/_search
{
  # return zero hits array
  "size": 0,
  "aggs": {
    "YOUR_AGG_NAME": {
      "date_histogram": {
        "field": "@timestamp",
        "calendar_interval": "day"
      }
    }
  }
}

# sub aggregates
GET logs/_search
{
  "size": 1,
  "aggs": {
    "YOUR_AGG_NAME": {
      "date_histogram": {
        "field": "@timestamp",
        "calendar_interval": "hour"
      },
      # aggregates of unique client ip within each hour bucket
      "aggs": {
        "SUB_AGG_NAME": {
          "cardinality": {
            "field": "clientip.keyword"
          }
        }
      }
    }
  }
}
```
