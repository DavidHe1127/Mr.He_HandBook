## Backup

Use [velero](https://aws.amazon.com/blogs/containers/backup-and-restore-your-amazon-eks-cluster-resources-using-velero/).

Essentially, `velero` pod is deployed in to cluster's data plane. It receives commands (CRD under the hood) sent via `velero` CLI installed on your workstation which performs backup/restores.


