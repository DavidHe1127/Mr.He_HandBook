## ASG/ALB

- [ASG](#asg)
  - [Scaling Policy](#scaling-policy)
- [Load balancer with HA](#load-balancer-with-ha)

### ASG
Instances are registered as targets with a target group. When you plan to use your load balancer with an ASG, you select the target group created from load balancers and
ASG will auto-scale instances in that selected target group.

[Using AWS Application Load Balancer and Network Load Balancer with EC2 Container Service](https://medium.com/containers-on-aws/using-aws-application-load-balancer-and-network-load-balancer-with-ec2-container-service-d0cb0b1d5ae5)

#### Scaling Policy

- `Desired Capacity` tells the number of instances auto scaling need to provision
- `Min/Max Capacity` tells the minimum/maximum number of instances ASG needs to have at any given time

`Scaling Policies` tell auto scaling to change the `Desired Capacity` within the `min/max` boundary.

For example, an Amazon CloudWatch alarm triggered by CPU exceeding a given threshold could be configured to trigger a Scaling Policy. The Scaling Policy could be configured with a rule of Add 1 instance, which would cause the Desired Capacity to increment by 1. (Note: Desired Capacity will always stay within the boundaries of the Min and Max, so a scaling policy might not actually change the Desired Capacity.)

### Load Balancer with HA
Diagram below explains how load balancer distributes traffic to a target group of instances when being configured with 2 AZs/public subnets.

![lb-ha](./lb-vpc-2-tier.png)






