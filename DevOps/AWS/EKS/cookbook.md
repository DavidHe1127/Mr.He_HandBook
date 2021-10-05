### Add new cluster to work with

```
aws eks --region ap-southeast-2 update-kubeconfig --name <YOUR_CLUSTER_NAME>
```

### Deploy 3-tier web application

Frontend should be deployed as `NodePort` service fronted with `Ingress` resource. Backend API should be deployed as `ClusterIP` making it accessible only within the cluster. Frontend can reach backend through `<service>.<namespace>.svc.cluster.local` notation. Scaling is also possible here.
