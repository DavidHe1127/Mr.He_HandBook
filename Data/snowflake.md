## Combining access through primary and secondary roles

For example, imagine:

- The primary role can `SELECT` from database A.
- A secondary role can `SELECT` from database B.

```sql
USE ROLE ROLE_1;
USE SECONDARY ROLES ROLE_2;

-- now you can write query that has access to both data sets without role switch
```
