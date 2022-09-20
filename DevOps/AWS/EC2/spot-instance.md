# Spot Instances

## Allocation Strategy

While it can be specified to use spot instances through launch template, a preferred option is through auto-scaling group. Because any changes made to it require a new version of template while it's not the case when setting it through auto-scaling group.

### lowest-price

in auto-scaling group:
```json
{
  "AutoScalingGroupName": "dave-spot-alloc-test",
  "MixedInstancesPolicy": {
    "LaunchTemplate": {
      "LaunchTemplateSpecification": {
        "LaunchTemplateName": "dave-spot-instance-alloc-test",
        "Version": "$Latest"
      },
      "Overrides": [
        {
          "InstanceType": "t2.small"
        },
        {
          "InstanceType": "t2.micro"
        },
        {
          "InstanceType": "t3.large"
        }
      ]
    },
    "InstancesDistribution": {
      "OnDemandPercentageAboveBaseCapacity": 0,
      "SpotAllocationStrategy": "lowest-price",
      "SpotInstancePools": 2
    }
  },
}
```

Instance pool is a group of instances with same type/os/az.

`SpotInstancePools` tells ASG the different number of instance pools it can provision instances from in each **AZ**. In the above example config, `t3.large` will not be provisioned unless its price is > `t2.small` and `t2.micro` when pool value is `2`. More example, if pool is set `1`, then only `t2.micro` will be used. Set it to `3` to make sure each instance type is allocated per az.

> Drawback is if all specified instance types have low capacities, it's a high risk users would lose them all due to terminations. Consider using capacity-optimized strategy.

Specify a high number of pools like `10` when using this strategy.

### capacity-optimized/capacity-optimized-prioritized (Recommended)

- Higher price but fewer interruptions in contrast to `lowest-price`.
- It accounts for pool capacity depth but not spot prices.
- `capacity-optimized-prioritized` makes the overrides order matter - try to fulfill the request using instances in order but still optimizes for capacity first.

#### Capacity Rebalancing (ONLY for capacity-oriented strategy)

Proactively attempting to replace spot instances emitting `rebalance recommendation` signals - notifies you when a Spot Instance is at high risk of interruption. Signals are fired off from instances and sent to Amazon EventBridge.

It can arrive sooner than 2-min interruption notice.

When there is a risky instance, ASG will spin up a new instance and follow normal process to replace the risky one - detach it from elb, drain conns, run shutdown hook etc.
