## Logging

For application logging use [fluentd helm chart](https://artifacthub.io/packages/helm/bitnami/fluentd).

For control plane logging, it needs to be enabled when creating clusters. The logs are stored in CW log group as `/aws/eks/my-cluster/cluster`. Use CW logs insights to help retrieve logs. See [this](https://aws.amazon.com/premiumsupport/knowledge-center/eks-get-control-plane-logs/).
