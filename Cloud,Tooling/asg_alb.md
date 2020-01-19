## ASG/ALB

- [ASG](#asg)
- [Load balancer with HA](#load-balancer-with-ha)

### ASGA
Instances are registered as targets with a target group. When you plan to use your load balancer with an ASG, you select the target group created from load balancers and
ASG will auto-scale instances in that selected target group.

[Using AWS Application Load Balancer and Network Load Balancer with EC2 Container Service](https://medium.com/containers-on-aws/using-aws-application-load-balancer-and-network-load-balancer-with-ec2-container-service-d0cb0b1d5ae5)

### Load Balancer with HA
Diagram below explains how load balancer distributes traffic to a target group of instances when being configured with 2 AZs/public subnets.

![lb-ha](./lb-vpc-2-tier.png)






