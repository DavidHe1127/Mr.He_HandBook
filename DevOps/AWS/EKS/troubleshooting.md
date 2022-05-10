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

### Res stuck in terminating state after deletion

Check `finalizer` in resource definition as it might has value as dependency. `finalizer` is a mechanism to help prevent dependent resource being deleted accidentally. K8S will check regularly and only delete the resource when it's safe to do so.

For quick fix, see [Namespace stuck in terminating state](https://craignewtondev.medium.com/how-to-fix-kubernetes-namespace-deleting-stuck-in-terminating-state-5ed75792647e)

For more details, see[what is k8s finalizer](https://www.howtogeek.com/devops/what-are-finalizers-in-kubernetes-how-to-handle-object-deletions/)


### Delete Custom Resource

In `k9s`, type `crd` to list custom resources and find the one you want to delete.

### Practical guide

https://learnk8s.io/troubleshooting-deployments
