## Troubleshooting

### error: You must be logged in to the server (Unauthorized)

Most likely the auth used to create cluster and call `kubectl` is different. Make sure the same user/role is used.

```shell
# check what role is used
aws sts get-caller-identity

# then update kubeconfig with that role
aws eks update-kubeconfig --name dev-apse1-dave --region ap-southeast-1 --profile david-adm --role-arn <role>
```
