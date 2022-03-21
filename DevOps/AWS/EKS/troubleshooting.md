## Troubleshooting

### error: You must be logged in to the server (Unauthorized)

Most likely the auth used to create cluster and call `kubectl` is different. Make sure the same user/role is used.

```shell
# check what role is used
aws sts get-caller-identity

# then update kubeconfig with that role
aws eks update-kubeconfig --name dev-apse1-dave --region ap-southeast-1 --profile david-adm --role-arn <role>
```

### Pod logs

When something goes wrong, always remember to check pod logs for clue.

### VPC cni issue

Run this command to pull logs out of `cni` plugin. Keep eyes peeled for obvious errors in `message` and `ipamd.log` files.

```shell
sudo bash /opt/cni/bin/aws-cni-support.sh
```

### Port forwarding

It allows you to use a resource name to select a matching pod to port forward to. For example, port forward via a StatefulSet resource.

```
kubectl port-forward -n=monitoring sts/prometheus-kube-prometheus-stack-prometheus 9090
```


### Practical guide

https://learnk8s.io/troubleshooting-deployments
