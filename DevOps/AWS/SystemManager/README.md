## Parameter Store

- If using AWS managed CMK key to encrypt/decrypt secured string param, you don't need below policies unless a Customer Managed CMK is used.

```
"kms:Decrypt",
"kms:Encrypt",
```
