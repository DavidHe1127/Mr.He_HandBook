## ElasticSearch

- [Architecture](#architecture)
- [Mapping](#mapping)
- [text vs keyword](#text-vs-keyword)
- [Notes](#notes)
- [References](#references)

## Architecture

![elastic-search-arch](./elastic-search-arch.svg)

## Mapping

Mapping (schema) should be provided to instruct ES how incoming records should be indexed. However when it's absent, it can be inferred from the record (event) by ES. For example:
```
# record
...
"Parrodise": {
  "tenant": "io-247-logging-tenant-portal"
},
...

# mapping
"Parrodise": {
  "properties": {
    "tenant": {
      "type": "text",
      "fields": {
        "keyword": {
          "type": "keyword",
          "ignore_above": 256
        }
      }
    }
  }
}
```

The default total limit for fields in index is `1000`. It can be bumped up through settings. With dynamic mapping, fields not described in the index will be added automatically on the fly which increases the chance of exceeding the limit.

```
// contrived record
{
  "p": "v1.http",
  "tag": "Client-Response",
  "clientResp": {
    "statusCode": 400,
    "contentLength": 11,
    "headers": {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Expires": "0",
    }
  }
}

// 6 fields
p
tag
clientResp.statusCode
clientResp.contentLength
clientResp.headers.Cache-Control
clientResp.headers.Expires
```

Use Explicit Mappings (certain fields) + Dynamic Templates (unknown fields).

## text vs keyword

- `string` is split into `text` and `keyword` since ES5.0
- When `text` is used, the value is broken down into individual terms at indexing to allow for partial matching aka full text search. i.e for value `this is good`, each single substring gets indexed such that you can search by any of them (`this`, `is` or `good`) to get the whole string.
- When `keyword` is used, the value is not analyzed and indexed as is. Consequently, for string `this is good`, you have to enter the whole string to be able to get searching result. Good use cases are states i.e enter NSW rather than NS.
- In summary, use `text` for full text search whilst `keyword` for structured content such as IDs, email addresses, hostnames, status codes, zip codes, or tags.

## Notes

- Each request is processed in a single thread per shard
- A shard is a Lucene Index that has one or more segments to store data on disk. Larger segments are more efficient for storing data.
- A search query must go through all primary shards to be complete. This includes one/more nodes to be visited.
- Ultimate goal is to visit as few nodes as possible
- A record should comply with [ECS](https://www.elastic.co/guide/en/ecs/current/ecs-using-ecs.html) where `@timestamp` and `message` fields should be present containing timestamp infor and message respectively. Otherwise, `failed to find message` message might display.

## References

- [shards-and-replicas](https://stackoverflow.com/questions/15694724/shards-and-replicas-in-elasticsearch)
- [ES field explosion](https://medium.com/handy-tech/elasticsearch-field-explosion-ca0a21f97a4a)
