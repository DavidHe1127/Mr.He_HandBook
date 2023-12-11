# AKS

## Outbound connectivity

## Fundamentals

- Apart from the main resource group created for cluster itself. Another resource group - Node Resource Group also automatically created to host other AKS components e.g Azure Disk when you create a PV. A load balancer when you create a load balancer service. DO NOT make ANY changes to node resource group. Best to configure deny rule on the group to prevent accidental changes.
- To ensure your cluster operates reliably, you should run at least **2** nodes in the default node pool.



## Storage

- Ephemeral OS disks are stored only on the host machine, When you don't explicitly request Azure managed disks for the OS, AKS defaults to ephemeral OS if possible for a given node pool configuration.
