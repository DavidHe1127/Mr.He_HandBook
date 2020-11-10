## ElasticSearch

![elastic-search-arch](./elastic-search-arch.svg)

### Other notes

- Each request is processed in a single thread per shard
- A shard is a Lucene Index that has one or more segments to store data on disk. Larger segments are more efficient for storing data.
- A search query must go through all primary shards to be complete. This includes one/more nodes to be visited.
- Ultimate goal is to visit as few nodes as possible

### References

- [shards-and-replicas](https://stackoverflow.com/questions/15694724/shards-and-replicas-in-elasticsearch)
