## ElasticSearch

- [Architecture](#architecture)
- [Mapping](#mapping)
- [Queries](#queries)
- [Index Alias](#index-alias)
- [Data Streams](#data-streams)
- [Text analysis](#text-analysis)
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

## Queries

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

## Index Alias

It allows search across multiple indices.
```
curl -XPOST 'http://localhost:9200/_aliases' -d '{
  "actions" : [
    { "add" : { "index" : "day10", "alias" : "week12" } },
    { "add" : { "index" : "day11", "alias" : "week12" } },
    { "add" : { "index" : "day12", "alias" : "week12" } }
  ]
}'
```

## Data Streams

See [definition](https://www.elastic.co/guide/en/elasticsearch/reference/current/data-streams.html). Best suited for logs, events, metrics, and other continuously generated data. If data needs to be updated/deleted frequently, use `Index Alias` instead as you cannot perform these actions to Data Streams directly.

## Text Analysis

ES performs text analysis when indexing or searching **text** field. During indexing, entire string is split into chunks (tokens) which is called tokenizing. Likewise, when searching, analysis will apply again before searching.

```
GET /_analyze?analyzer=standard&text=We are madewithlove
# 3 tokens will be stored in an inverted index
{
  "tokens": [
     {
        "token": "we"
     },
     {
        "token": "are"
     },
     {
        "token": "madewithlove"
     }
  ]
}

# both queries below finds result
{
  "query": {
    "term": {
      "name": "we"
    }
  }
}

{
  "query": {
    "match": {
      "name": "we are madewithlove"
    }
  }
}
```

## text vs keyword

- `string` is split into `text` and `keyword` since ES5.0
- When `text` is used, the value is broken down into individual tokens at indexing to allow for partial matching aka full text search. i.e for value `this is good`, each single substring gets indexed such that you can search by any of them (`this`, `is` or `good`) to get the whole string.
- When `keyword` is used, the value is not analyzed and indexed as is. Consequently, for string `this is good`, you have to enter the whole string to be able to get searching result. Good use cases are states i.e enter NSW rather than NS.
- In summary, use `text` for full text search whilst `keyword` for structured content such as IDs, email addresses, hostnames, status codes, zip codes, or tags.

## Notes

- Each request is processed in a single thread per shard
- A shard is a Lucene Index that has one or more segments to store data on disk. Larger segments are more efficient for storing data.
- A search query must go through all primary shards to be complete. This includes one/more nodes to be visited.
- Ultimate goal is to visit as few nodes as possible
- A record should comply with [ECS](https://www.elastic.co/guide/en/ecs/current/ecs-using-ecs.html) where `@timestamp` and `message` fields should be present containing timestamp infor and message respectively. Otherwise, `failed to find message` message might display during query.
- If a field can either be a number or string in one index, to avoid type mismatch error, consider using `keyword` as type.

## References

- [shards-and-replicas](https://stackoverflow.com/questions/15694724/shards-and-replicas-in-elasticsearch)
- [ES field explosion](https://medium.com/handy-tech/elasticsearch-field-explosion-ca0a21f97a4a)
