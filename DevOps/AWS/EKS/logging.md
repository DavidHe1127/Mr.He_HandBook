## Logging

Kubernetes doesn’t provide a native solution to collect and store logs. It configures the container runtime to save logs in JSON format on the local filesystem. Container runtime – like Docker – redirects container’s stdout and stderr streams to a logging driver. In Kubernetes, container logs are written to `/var/log/pods/*.log` on the node. Kubelet and container runtime write their own logs to `/var/logs` or to journald, in operating systems with systemd. Then cluster-wide log collector systems like Fluentd can tail these log files on the node and ship logs for retention. These log collector systems usually run as DaemonSets on worker nodes.

### Logging strategies

- For application logging use [fluentd helm chart](https://artifacthub.io/packages/helm/bitnami/fluentd). It mounts `/var/log` into the container via `hostPath` so it has access to logs.
- For control plane logging, it needs to be enabled when creating clusters. The logs are stored in CW log group as `/aws/eks/my-cluster/cluster`. Use CW logs insights to help retrieve logs. See [this](https://aws.amazon.com/premiumsupport/knowledge-center/eks-get-control-plane-logs/).
- Pod's logs are stored in files located at `/var/log/pods` on the host.
- Use [Kubernetes Event Exporter](https://github.com/bitnami/charts/tree/main/bitnami/kubernetes-event-exporter) to export object events to an external storage for longer availability. Events default to 1 hour of lifetime.


