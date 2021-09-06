## Pod

- [Attach role to pod to allow aws access](#aws-access)

### AWS access

See [oicd provider](https://github.com/DavidHe1127/Mr.He_HandBook/blob/master/DevOps/AWS/EKS/security.md#OIDC-provider) for how it works.

First, create trust relationship. Example policy below allow service account named `hello-world-app` to assume role with WebIdentity.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::1234567890123:oidc-provider/my-oidc-provider.example.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "my-oidc-provider.example.com:sub": [
            "system:serviceaccount:default:hello-world-app"
          ]
        }
      }
    }
  ]
}
```

sub format `system:serviceaccount:<namespace>:<service-account-name>`

Next, create iam role with desired perms. `arn:aws:iam::1234567890123:role/my-app-role`

Last, assign role to service account via annotations. And use the service account in pod:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: hello-world-app
  annotations:
    eks.amazonaws.com/audience: aws-iam # Optional and will default to API flags
    eks.amazonaws.com/role-arn: arn:aws:iam::1234567890123:role/my-app-role
---
apiVersion: v1
kind: Pod
metadata:
  name: aws-test
spec:
  serviceAccountName: hello-world-app
  containers:
  - name: aws-cli
    image: mikesir87/aws-cli:v1
    command: ["aws", "s3", "ls"]
```
