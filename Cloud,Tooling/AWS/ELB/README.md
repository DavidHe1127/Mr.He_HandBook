## ASG/ALB

- [ASG](#asg)
  - [Scaling Policy](#scaling-policy)
  - [Health Check](#health-check)
  - [Termination Policy](#termination-policy)
  - [lifecycle hooks](#lifecycle-hooks)
  - [Tear down ASG](#tear-down-asg)
  - [Cooldown period](#cooldown-period)
  - [Connection Draining](#connection-draining)
  - [Spot Fleet](#spot-fleet)
  - [Useful write-ups](#useful-write-ups)
- [Load balancer with HA](#load-balancer-with-ha)

### ASG

#### Scaling Policy

- Scale in/out within the boundary of Min/Max capacity
- Desired capacity is subject to change over time but is always between Min/Max capacity range

### Load Balancer with HA
Diagram below explains how load balancer distributes traffic to a target group of instances when being configured with **2** AZs/public subnets.

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

---

### ELB

#### Key facts

- ELB marks an instance `InService` once it passes health check. ELB sends traffic to instance in `InService` status.
- ELB marks an instance `Out of Service` if it fails health check. At this point, ELB will stop sending traffic to it. If ASG is used, it will shut the instance down after health check grace period, replacing it with a new one.
- `In Service` state exists for ELB as well (besides EC2) - as long as one registered target is considered healthy, ELB enters `InService` state.
- When an instance is fully configured and passes the Amazon EC2 health checks, it is attached to the ASG and it enters the `InService` state. The instance is counted against the desired capacity of the ASG.
- If there is no healthy instances for ELB to forward traffic to, it will report `5xx` error straight away

ELB used as health check type in ASG

![asg-elb](asg-elb.svg)

#### Connection Draining

When you enable `Connection Draining` on a load balancer, any back-end instances that you deregister will complete requests that are in progress before deregistration. Likewise, if a back-end instance fails health checks, the load balancer will not send any new requests to the unhealthy instance but will allow existing requests to complete.

#### Spot Fleet

![spot-fleet](how-spot-fleet-works.png)

Refer to [Mixed instance type](https://github.com/DavidHe1127/dockerzon-ecs/tree/master/experiments/mixed-instance-type) for more details.

[Spot instances tips](https://medium.com/swlh/aws-ec2-spot-useful-tips-dc3cd8210028)

#### Useful write-ups

- [Using AWS Application Load Balancer and Network Load Balancer with EC2 Container Service](https://medium.com/containers-on-aws/using-aws-application-load-balancer-and-network-load-balancer-with-ec2-container-service-d0cb0b1d5ae5)


