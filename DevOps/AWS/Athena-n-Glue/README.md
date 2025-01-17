™## Athena

- [Key concepts](#key-concepts)

### Key Concepts

- `Table` - defines your dataset location/schema/data format etc. See information a table holds in `Create Table From S3 bucket data` option.
- `Database` - logical grouping of tables.
- Use `Glue` to help automatically create table and data schema. You can also use athena if you want to manually create table columns.
- Query result is stored in S3.
- Json file as input must not have newline char.

### Queries

```SQL
# useridentity
# {type=AssumedRole, principalid=AROAR25ITIYE, nested={arn=abc}}
SELECT useridentity.type FROM "<DB>"."<TABLE>" WHERE useridentity.type like 'A%' AND useridentity.nested.arn = 'abc' LIMIT 10;

# resources
# [{accountid=12777, type=AWS::IAM::Role}]
SELECT resource_unnested FROM "<DB>"."<TABLE>" CROSS JOIN UNNEST(resources) AS T(resource_unnested) WHERE resource_unnested.accountid = '12777' LIMIT 10;

# search in a particular file
# make sure the path is within the scope of search (table) location or you'd have no result returned
SELECT * FROM "<DB>"."<TABLE>"
WHERE "$path" = 's3://particular-path/location/something.json.gz'
limit 2

# search in a particular path
SELECT * FROM "<DB>"."<TABLE>"
WHERE ("$path" LIKE 's3://particular-path/year/2023/%' OR "$path" LIKE 's3://particular-path/year/2022/%')
limit 2

```

---

## Glue

- [Key concepts](#key-concepts)

- `SerDe` is used by hive to convert a row of data into different columns so that you can query. It's focused on the file content format.
- `Input/OutputFormat` on the other hand is focused on the file format.
