## RDS

## Key Points

- Use [pgcli](https://github.com/dbcli/pgcli) for terminal-based interactive operations

### Conn to db instance in production

Create a 'jump box' instance in public subnet. Jump box AMI should include required toolings e.g pgcli
Connect to DB from the jump box.

### Parameter Group

- DB always has a default param group attached. The group uses all default configs.
- Default one not modifiable. Need to create a custom one and associate it with your DB.


### Authentication

Use IAM db authentication.

1. Enable IAM database authentication
2. Create policy

```
{
   "Version": "2012-10-17",
   "Statement": [
      {
         "Effect": "Allow",
         "Action": [
             "rds-db:connect"
         ],
         "Resource": [
             "arn:aws:rds-db:us-east-2:1234567890:dbuser:db-ABCDEFGHIJKL01234/david"
         ]
      }
   ]
}
```

Attach to the iam role.

3. Creat db user

```
CREATE USER david;
GRANT rds_iam TO david;
```

4. To use it

4.1 Generate token
4.2 Connect with the token

```
psql "host=hostName port=portNumber sslmode=verify-full sslrootcert=full_path_to_ssl_certificate dbname=DBName user=userName password=authToken"
```
