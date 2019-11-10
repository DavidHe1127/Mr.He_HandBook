## VPC

- [NAT Gateway](#nat-gateway)
  - [NAT Gateway vs IP gateway](#nat-gateway-vs-ip-gateway)
- [Cost](#cost)

### NAT Gateway

Enable instances in a private subnet to connect to the internet or other AWS services, but prevent the internet from initiating a connection with those instances.

[Detailes about IGW and NATs](https://medium.com/awesome-cloud/aws-vpc-difference-between-internet-gateway-and-nat-gateway-c9177e710af6)

### NAT Gatway vs IP Gateway
Attaching an IGW to a VPC allows instances with public IPs to access the internet, while NATs allow instances with no public IPs to access the internet.

### Cost
VPC themselves are free but you need to pay for the services running within it. i.e NAT gateway, internet gateway, EC2s.

- [Use vpc endpoint to save money](https://medium.com/nubego/how-to-save-money-with-aws-vpc-endpoints-9bac8ae1319c)
