## Networking

- 2 modes - `kubenet` and `cni`. Use `cni` for prod env as `kubenet` is suitable for dev only. With `kubenet`, network resources such as vnet and subnets are created, configured and managed by Azure while creating the cluster. [Ref](https://learn.microsoft.com/en-au/azure/aks/concepts-network#azure-virtual-networks).
