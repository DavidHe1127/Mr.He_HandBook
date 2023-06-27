## VPC

- [Isolated Subnet](#isolated-subnet)
- [ENI](#eni)
- [NAT Gateway](#nat-gateway)
- [Security Group](#security-group)
- [CIDR](#cidr)
- [Inter-vpc comms](#inter-vpc-comms)
- [VPC Endpoint and Endpoint Service](#vpc-endpoint-and-endpoint-service)
- [Public IP vs Elastic iP](#public-ip-vs-elastic-ip)
- [Accessibility and Reachability](#accessibility-and-reachability)
- [Check overlapping of two cidrs](#check-overlapping-of-two-cidrs)


### Isolated Subnet

A private subnet is one that is configured to use a NAT Gateway (NAT) so that it can reach the internet, but which prevents the internet from initiating connections to it. An isolated subnet is one that cannot reach the internet either through an IGW or with NAT.

### ENI

- Each instance in your VPC has a default network interface (the primary network interface or eth0) that is assigned a private IPv4 address from the IPv4 address range of your VPC. You cannot detach a primary network interface from an instance. You can create and attach an additional network interface to any instance in your VPC.
- ENI cannot be detached when it's associated and used by a resource - i.e VPCE. To remove ENI, you need to delete parent service.

### NAT Gateway

- Create per-az NAT Gateway to reduce cross-az data transfer. i.e instance and NAT Gateway in different AZs.
- 55,000 simultaneous connections to each destination (distinct ip + port combination). If threshold is crossed, then you will see `ErrorPortAllocation` issue.
- Connected to a single subnet corresponding to a particular AZ. e.g all conns from ec2 in az-a will be established to that az's NATG.

[Reduce cost of NAT Gateway](https://www.stephengrier.com/reducing-the-cost-of-aws-nat-gateways/)

### Security Group

When creating a security group for a subnet, it basically means next time an EC2 instance gets launched, that security group should be attached to the ENI of the instance.

### CIDR

- Multiple VPCs in one account can have same cidr range. However, overlapped cidr range will preclude vpc peering when needed. As of `08/2017`, VPC allows customers to expand their VPCs by adding secondary IPv4 address ranges (CIDRs).
- Subnets within one VPC cannot have cidrs overlapped since AWS will treat the 2 subnets as one continuous network.
- AWS allows you specify a CIDR block between `/16` and `/28`. The largest, `/16`, provides you with `65,536` IP addresses and the smallest possible allowed CIDR block, `/28`, provides you with `16` IP addresses.

### Public IP vs Elastic IP
Public IP addresses are dynamic - i.e if you stop/start your instance you get reassigned a new public IP.

Elastic IPs get allocated to your account and stay the same - it's up to you to attach them to any instance or not. you could say they are `static public ip addresses`. To avoid charge over using elastic ip, make sure it's attached to an instance. It will incur charges if it's detached.

### Accessibility and Reachability

Use **Network Access Analyzer** to find out unintended network access points to your VPC and help you improve your security.
**VPC Reachability Analyzer** helps you troubleshoot if connectivity is enabled between 2 endpoints.

### Inter-VPC comms

- [Shared VPC](https://aws.amazon.com/blogs/architecture/using-vpc-sharing-for-a-cost-effective-multi-account-microservice-architecture/)
- VPC Peering
- VPC Endpoint Service via private link
- Transit Gateway (could be costly!)

### VPC Endpoint and Endpoint Service

- It Enables you to privately connect your VPC to supported AWS services and VPC endpoint services powered by AWS PrivateLink without requiring an internet gateway, NAT device, VPN connection, or AWS Direct Connect connection.
- VPC endpoints are virtual devices. They are horizontally scaled, redundant, and highly available Amazon VPC components that allow communication between instances in an Amazon VPC and services without imposing availability risks or bandwidth constraints on network traffic.

To connect to S3 via VPCE, setup a VPC endpoint in your VPC - consumer and point it to S3 VPCES address - provider.

![vpce](./vpce.png)

#### Custom VPC Endpoint Service

- You can also turn your own application in a VPC into a VPCEs powered by AWS PrivateLink. That way, other AWS principals can create a connection from their VPC to your endpoint service using an interface VPC endpoint. You are service provider while others are service consumers.
- It also allows services residing in different VPCs to talk with each other via AWS PrivateLink. i.e The owner of VPC B has a service endpoint (vpce-svc-1234) with an associated Network Load Balancer that points to the instances in subnet B as targets. Instances in subnet A of VPC A use an interface endpoint to access the services in subnet B.
- The service provider can also configure a private DNS name so consumers can access the service using an existing DNS name. This practice requires providers to prove they have control over the domain. Basically, a `TXT` record containing DNS endpoint service domain infor needs to be added to a **public** hosted zone. Then verify the domain ownership. See [Private DNS names for endpoint services
](https://docs.aws.amazon.com/vpc/latest/userguide/verify-domains.html).

> ProTip: One can use VPC Peering to bridge the gap between service provider/consumer. It conveniently removes the need for adding a new endpoint everytime a new service is added to provider's VPC.

![vpce-service](vpce-service.png)

#### AWS VPC Endpoint services

![aws-vpce-services](aws-vpce-services.png)

#### Security Group

It controls the traffic to the endpoint network interface from resources in your VPC.

#### Policy

Policy below allows lambda within your vpc to publish messages to SNS through a private link (vpc endpoint).

```json
{
  "Statement": [{
    "Action": ["sns:Publish"],
    "Effect": "Allow",
    "Resource": "arn:aws:sns:region:account:topic-name",
    "Principal": {
      "Service": "lambda.amazonaws.com"
    }
  }]
}
```

### Check overlapping of 2 CIDRs

Use Python package `ipaddr`

```shell
>>> import ipaddr
>>> n1 = ipaddr.IPNetwork('192.168.1.0/24')
>>> n2 = ipaddr.IPNetwork('192.168.2.0/24')
>>> n3 = ipaddr.IPNetwork('192.168.2.0/25')
>>> n1.overlaps(n2)
False
>>> n2.overlaps(n3)
True
```
