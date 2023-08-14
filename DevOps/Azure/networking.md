## Networking

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
