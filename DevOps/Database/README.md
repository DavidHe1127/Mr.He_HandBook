## Database

- Use UUIDv7 for primary key for high performance to avoid poor index locality issue
- Use UUIDv5 for deterministic unique identifiers based on namespaced values. v7 and v4 are random
