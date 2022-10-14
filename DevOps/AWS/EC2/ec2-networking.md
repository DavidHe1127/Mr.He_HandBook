### Networking

#### internetwork-traffic-privacy-in-aws-vpc

Amazon security groups and network ACLs don't filter traffic to or from link-local addresses (169.254.0.0/16) or AWS reserved IPv4 addresses (these are the first four IPv4 addresses of the subnet, including the Amazon DNS server address for the VPC). So call to inquire instance metadata does not require
opening port on http.

#### Network Bandwith

Instances with `up to x Gbps` basically means they have a baseline bandwith. To meet additional demand, they can use a network I/O credit mechanism to burst beyond their baseline bandwidth. Instances can use burst bandwidth for a limited time, typically from 5 to 60 minutes, depending on the instance size.

See [baseline network bandwidth chart](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/general-purpose-instances.html#general-purpose-network-performance)

### ENI

- Represents virtual/logical networking interface.
- Security Group is attached to ENI to enable firewall on traffic whereas EIP is associated with ENI.
- Check `Description` to help discover the resource ENI is attached to.

### IP and DNS

`Private/Public DNS` as shown on EC2 panel resolves to private/public ip of an instance.
i.e Private DNS hostname `ip-10-156-61-79.ap-southeast-2.compute.internal` resolves to private ip `10.156.61.79`.

### EIP and Public IPv4

- `EIP` is basically a public and static IPv4.
- `EIP` will remain yours until you explicitly release it. If it's not attached to any instance, you will be charged.
- When you associate an Elastic IP address with an instance or its primary network interface, the instance's public IPv4 address (if it had one) is released back into Amazon's pool of public IPv4 addresses. You cannot reuse a public IPv4 address, and you cannot convert a public IPv4 address to an Elastic IP address.
- You cannot auto-assign a public IP address if you specify more than one network interface in your instance. Use `EIP` in this case.
