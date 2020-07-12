## ASG/ALB

- [ASG](#asg)
  - [Scaling Policy](#scaling-policy)
  - [Health Check](#health-check)
  - [Termination Policy](#termination-policy)
  - [lifecycle hooks](#lifecycle-hooks)
  - [Tear down ASG](#tear-down-asg)
  - [Cooldown period](#cooldown-period)
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

#### Health Check

- By default, ASG will consider an instance healthy if it passes instance status check
- Change health check type to be `ELB` so an instance is seen as healthy ONLY if it passes both ALB and EC2 health check
- Unhealthy instances will be killed and replaced by ASG
- If you attach multiple load balancer target groups, all of them must report that the instance is healthy in order for it to consider the instance healthy. If any one of them reports an instance as unhealthy, the Auto Scaling group replaces the instance, even if other ones report it as healthy

Use case scenario: In an ECS application fronted with ALB. ALB health check will fail when putting a container instance on `DRAINING` mode. However, instance is still seen as healthy by ASG since it passes status check. Therefore, ASG will do nothing. To fix it, set `health check type` to be `ELB` which will turn this instance to an unhealthy one as it fails ALB health check. Now, ASG will see and action to replace this unhealthy instance.

#### Termination Policy

Use it to control which instances need to be terminated when scale in. i.e `OldestLaunchTemplate` tells ASG to terminate instances launched by the oldest launch template. Useful when phasing out old instances after updates.

⚠️⚠️⚠️ Termination policy will be applied to AZ with most instances first i.e imbalanced AZs before other balanced AZs. For example, suppose you have 2 instances in `2a` and 1 instance in `2b`, termination policy will be applied to `2a` first to take one of two instances down. Consequently, you have 2 instances left. If desired count is 2, then ASG will stop looking further at `2b` even if you are expected to terminate another one in `2b` during a ami update process.

#### Lifecycle Hooks

Use it when you need to perform some custom tasks berfore launching/terminating instances in scale out/in respectively.
See [this](https://docs.aws.amazon.com/autoscaling/ec2/userguide/lifecycle-hooks.html) for more details.

#### Tear down ASG

When you delete an Auto Scaling group, its `desired, minimum, and maximum` values are set to 0. As a result, the instances are terminated.

#### Cooldown period

No `cooldown period` - Say we have an ASG to scale in/out on some cloudwatch alarms. In an event of scaling out activity, ASG will add a new instance to the group and instance takes 3 mins to come up and become ready to serve traffic. During this period of time, alarm is likely to be triggered again which is causing ASG to add more instances. It's a big waste as we might only need one additional instance but not 2!!!.

Now, with help from `cooldown period` defaults to 5 mins, after the scaling activity is exercised, all subsequent scale-out requests will be blocked until `cooldown period` time is elapsed. After it's expired, scale-out activities will begin again. But, if alarm goes off after previous instance is in service, which indicates the launched instance is sufficient to bring metric back down, then the group will remain at that size. In this example, it will be 2.

Automatically applies to `dynamic scaling` and optionally to manual scaling but not supported for `scheduled scaling`.


