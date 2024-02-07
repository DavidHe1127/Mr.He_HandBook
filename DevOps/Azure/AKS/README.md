# AKS

## Outbound connectivity

## Fundamentals

- Apart from the main resource group created for cluster itself. Another resource group - Node Resource Group also automatically created to host other AKS components e.g Azure Disk when you create a PV. A load balancer when you create a load balancer service. DO NOT make ANY changes to node resource group. Best to configure deny rule on the group to prevent accidental changes.
- To ensure your cluster operates reliably, you should run at least **2** nodes in the default node pool.

### Node pools

- Recommended to have 2 pools - 1 system node pool and 1 user node pool.
- System node pool for hosting critical system pods such as `CoreDNS` and `metrics-server`. `kubernetes.azure.com/mode: system` label attached to system nodes.
- System nodes allow app pods being scheduled on them but it's not encouraged. System pools osType must be Linux.
- System pools must contain at least one node, and user node pools may contain zero or more nodes.
- User node pool for hosting your application pods.
- An AKS cluster must contain at least one system node pool with at least one node.

## Storage

- Ephemeral OS disks are stored only on the host machine, When you don't explicitly request Azure managed disks for the OS, AKS defaults to ephemeral OS if possible for a given node pool configuration.

## Cert

Two options: a) bring your own and import it to Key Vault b) install `cert-manager` which leverages `let's encrypt` to issue/manage certs for your apps.

## Authentication & Authorization

- 3 options: a) `Local accounts with Kubernetes RBAC`, b) `Azure AD authentication with Kubernetes RBAC`, c) `Azure AD authentication with Azure RBAC`.
- First option has no conn to Azure Entra ID meaning you cannot map users on Entra ID to K8S RBAC system.
- Second option lets you authenticate Entra ID users against the cluster but authorization still needs to be defined in the cluster. More portable.
- Third option lets you manage authentication & authorization using Azure RBAC.

For more see [Azure k8s service rbac options in practice](https://techcommunity.microsoft.com/t5/fasttrack-for-azure/azure-kubernetes-service-rbac-options-in-practice/ba-p/3684275).

### Secret store workflow

- Enable secret store add-on in your cluster. A managed identity is created during the process.
- Grant previous identity admin access to your key vault service through RBAC.
- Create a `SecretProviderClass` resource in your cluster - it defines how secrets should be retrieved from an external secret store and made available to applications running in pods.