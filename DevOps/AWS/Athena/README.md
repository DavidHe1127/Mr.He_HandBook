## Athena

- [Key concepts](#key-concepts)

### Key Concepts

- `Table` - defines your dataset location/schema/data format etc. See information a table holds in `Create Table From S3 bucket data` option.
- `Database` - logical grouping of tables.

### Queries

```SQL
# useridentity
# {type=AssumedRole, principalid=AROAR25ITIYE}
SELECT useridentity.type FROM "<DB>"."<TABLE>" where useridentity.type like 'A%' limit 10;

# resources
# [{accountid=12777, type=AWS::IAM::Role}]
SELECT resource_unnested FROM "<DB>"."<TABLE>" CROSS JOIN unnest(resources) AS T(resource_unnested) where resource_unnested.accountid = '12777' limit 10;
```
