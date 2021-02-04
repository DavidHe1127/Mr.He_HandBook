## ElasticSearch

![elastic-search-arch](./elastic-search-arch.svg)

### Notes

- Each request is processed in a single thread per shard
- A shard is a Lucene Index that has one or more segments to store data on disk. Larger segments are more efficient for storing data.
- A search query must go through all primary shards to be complete. This includes one/more nodes to be visited.
- Ultimate goal is to visit as few nodes as possible
- Mapping should be provided to instruct ES how incoming records should be indexed. However when it's absent, it can be inferred from the record (event) by ES. For example:

```
# record
...
"Kasada": {
  "tenant": "io-247-logging-tenant-portal"
},
...

# mapping
"Kasada": {
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

### References

- [shards-and-replicas](https://stackoverflow.com/questions/15694724/shards-and-replicas-in-elasticsearch)
