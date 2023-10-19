## Networking

- [Default outbound access](#default-outbound-access)
- [Private Endpoint](#private-endpoint)
- [AZ-900 exam study notes](#az-900-study-notes)
    - [Express Route](#expressroute)
    - [Application Gateway](#application-gateway)
    - [VPN Gateway](#vpn-gateway)

### Default outbound access

> On 30/09/2025 default outbound access for VMs will be retired

- If no explicit outbound connectivity is defined in NSG for VMs, Azure will automatically assigns an Azure managed public ip to them to give them access to internet.
- However, this behaviour is implicit and **NOT RECOMMENDED**.
- Define rules explicitly and use NAT Gateway for VMs to reach internet.

### Private endpoint

- A private endpoint has a private ip allocated from its hosting subnet of your vnet. This ip is used for conns to Azure services. 
- A private DNS zone is created when adding a private link to an Azure service e.g `privatelink.blob.core.windows.net` is created when adding a private endpoint conn in storage account.
- The zone contains records enabling Azure service when being resolved from within the subnet to the ip of private endpoint:
```
StorageAccountA.blob.core.windows.net	CNAME	StorageAccountA.privatelink.blob.core.windows.net
StorageAccountA.privatelink.blob.core.windows.net	A	10.1.1.5
```
- When resolving from outside of the vnet, it's resolved to the public ip of storage account service.
- **important** After you create a private DNS zone in Azure, you'll need to link it to a VNET to grant VMs within that VNET access to records in the private DNS zone. In addition, make sure you associate private zone group with private endpoint by adding a new config item in private endpoint's DNS config so that private endpoint can update DNS records in the private zone automatically when there is updates.
- By default, network policies such as NSG doesn't apply to private endpoint - comms can still happen without defining Allow rules in subnet NSG. But you can enable it at subnet level.

## AZ-900 study notes
---

### VPN Gateway

- Virtual network gateway that sends encrypted traffic between your VNET and your on-premises location across a public connection.
- 2 types - VPN & ExpressRoute
- You must create a gateway subnet where gateway vms are deployed and configured with the required VPN gateway settings. Never deploy irrelevant resources in the gateway subnet. Gateway subnet MUST BE named `GatewaySubnet`.
- Gateway subnet sizing recommended to be larger than `/27` so that gateway vms can have enough IPs to assign to them.
- A complementary gateway is needed on on-premise network to accept vpn connections.

### Application Gateway

- Equivalent of AWS ALB in Azure - supports URL path/request header routing decisions. Load balancer in Azure does L4 routing similar to NLB in AWS.
- Supports multi-site hosting up to 100 sites that all share the same application gateway instance.

### ExpressRoute

- Connect your on-premises to your Azure privately with high bandwidth, low latency, high scalability.

