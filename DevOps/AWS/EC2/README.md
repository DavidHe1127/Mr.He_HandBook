## EC2

- [How EC2 works](#how-ec2-works)
- [vCPU, threads and core](#vcpu-threads-core)
- [Security Group](#security-group)
- [Reboot](#reboot)
- [Networking](./ec2-networking.md)
- [IMDS(Instance Metadata service)](#IMDS)
- [Metrics](#metrics)
- [Connect to EC2](#connect-to-ec2)
- [Bastion Host](#bastion-host)
- [AMI](#ami)
- [Spot Instance](./spot-instance.md)
- [UserData](#user-data)
- [Notes](#notes)

## [EBS](ebs.md)

## AutoScaling

- [Cooldown](#cooldown)
- [Zone Rebalancing](#zone-rebalancing)

### How EC2 works?

![ec2-arch](ec2-arch.jpg)

Hypervisor is a software to control resources allocations for VMs.

### vCPU, threads and core

vCPU represents a portion of the underlying physical CPU that is assigned to a particular virtual machine (VM).

1 thread = 1 vCPU and 1 core = 2 vCPU/threads. EC2 supports multithreading which enables multiple threads to run concurrently on a single CPU core through logical core(?). With NodeJS app, it will only use one thread/vCPU.

### CPU Arch difference

- The computational performance of AWS’s `ARM` EC2 instances is similar to that of the `x86_64` instances.
- Considering that `ARM` instances are significantly cheaper, the cost effectiveness of `ARM` instances are better than `x86_64` instances.

### Security Group

- For ingress rule, it specifies traffic source and destination port range etc. i.e given `fromPort` 0 and `toPort` 65535 basically means the SG allows conn to any ports from 0 to 65535 inclusive to be established.
- For egress rule, it specifies traffic destination and destination port range etc. i.e given `fromPort` 1025 and `toPort` 2025 basically means the SG allows conn to any ports (on destination service) from 1025 to 2025 inclusive to be established.

### Reboot

Since a reboot happens within the EC2 instance hardware, the state of the EC2 instance does not change from `running`. There is no rebooting state. And there is no mechanism to determine when the OS of your EC2 instance starts and/or completes its reboot.

One thing to note is after instance reboots, volume other than root one will be unmounted!!! You need to mount it back.

[How to mount ebs during boot](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-using-volumes.html)

### IMDS

- Allow app running on EC2 to access AWS resources. Without it, we would have to use hard-coded API keys to enable comm between AWS services and resources. IMDS solves this problem via “temporary security credentials”. These credentials are rotated on a regular basis and managed by the AWS STS service.
- AWS STS enables you to request temporary, limited-privilege credentials for IAM users or for users that you authenticate (federated users).
- IMDS does not require internet access. `169.254.0.0/16` is a reserved ip block and it is used for local, internal communication.
- Use v2 over v1 due to security concerns v1 has [Why v2 more secure?](https://medium.com/@shurmajee/aws-enhances-metadata-service-security-with-imdsv2-b5d4b238454b). i.e IMDSv2 will always reject requests with an `X-Forwarded-For` header that is seeable in requests passed through by reverse proxy services. This layer of protection prevents users from accessing IMDS endpoint from outside EC2 such as via ELB or reverse proxy server that's open to public.
- The AWS SDKs use IMDSv2 calls by default. If the IMDSv2 call receives no response, the SDK retries the call and, if still unsuccessful, uses IMDSv1. This can result in a delay.
- In a container environment, if the hop limit is 1, the IMDSv2 response does not return because going to the container (bridge network other than host network) is considered an additional network hop. To avoid the process of falling back to IMDSv1 and the resultant delay, **in a container environment we recommend that you set the hop limit to 2**.

#### Useful commands:
```sh
# verify IMDSv2 is enabled or not
$ aws ec2 describe-instances --region ap-southeast-2 --instance-id i-0123456789abcdef --query Reservations[0].Instances[0].MetadataOptions
{
    "State": "applied",
    # token is required for v2
    "HttpTokens": "optional",
    "HttpPutResponseHopLimit": 1,
    "HttpEndpoint": "enabled"
}

# v2 is enabled if return code 401
$ curl -w "%{http_code}\n" http://169.254.169.254/
```

![imds](how-imds-work.svg)

Note, If you are on an EC2 that was launched with an IAM role, the AWS CLI will automatically retrieve credentials for you. You do not need to configure any credentials.

### Bastion Host

[Bastion Host setup walkthrough](https://vaughanj10.github.io/creating-a-bastion-host-for-aws/)

### Metrics

EC2 sends metrics to CW through CW agent. Data is sent every 5 minutes by default, or every minute if detailed monitoring is enabled.

- `CPUUtilization` - Recorded as a percentage value that is the amount of allocated EC2 compute units that are currently in use on the instance.

### Connect to EC2

Session manager is the optimal way. One useful command from Instance Connect though is you can send public key to remote server to enable ssh conn even if the instance it's spun up without loading any key. See [send-ssh-public-key](https://docs.aws.amazon.com/cli/latest/reference/ec2-instance-connect/send-ssh-public-key.html). Note, key can be generated locally through ssh-keygen.

### AMI

AMI in one account can be shared with another account by modifying its permissions. If EBS volumes within AMI are encrypted, they can only be shared if encryption is done by Custom CMK NOT AWS managed CMK! Also, make sure you grant proper permissions of encryption CMK to the number of target aws account. This is a required step!

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "kms:DescribeKey",
                "kms:ReEncrypt*",
                "kms:CreateGrant",
                "kms:Decrypt"
            ],
            "Resource": [
                "arn:aws:kms:us-east-1:<111111111111>:key/<key-id of cmkSource>"
            ]
        }
    ]
}
```

### User Data

Scripting UserData with [cloud-config](https://www.digitalocean.com/community/tutorials/an-introduction-to-cloud-config-scripting) is supported in CloudFormation.

```yml
UserData:
  Fn::Base64: !Sub
    - |-
        #cloud-config
        write_files:
        - path: /opt/test/cloudformation/env
          content: |
            STACK_NAME=${AWS::StackName}
            STACK_RESOURCE=Dashboard
            STACK_REGION=${AWS::Region}
```

To have user data script run on reboot, use `cloud-config` to configure user data is always run on reboot via mime multi-part.

```
Content-Type: multipart/mixed; boundary="==BOUNDARY=="
MIME-Version: 1.0

--==BOUNDARY==
Content-Type: text/cloud-config; charset="us-ascii"
MIME-Version: 1.0
Content-Transfer-Encoding: 7bit
Content-Disposition: attachment; filename="cloud-config.txt"

#cloud-config
cloud_final_modules:
- [scripts-user, always]

--==BOUNDARY==
Content-Type: text/x-shellscript; charset="us-ascii"
MIME-Version: 1.0
Content-Transfer-Encoding: 7bit
Content-Disposition: attachment; filename="userdata.txt"

#!/bin/bash

# your user data goes here
/bin/echo "Hello World" >> /tmp/testfile.txt
pwd >> /tmp/testfile.txt
ls -latr >> /tmp/testfile.txt

--==BOUNDARY==--
```

See [cloud-init example](https://github.com/ukayani/cloud-init-example/blob/master/README.md) for more details.

### Notes

- A `stop` and `start` isn't equivalent to a `reboot`. A `start` can put instance on faulty hardware to a healthy one.

---

## AutoScaling

- EC2 sends metrics to CW in every 1 or 5 minutes depending on monitoring type - 5 mins for simple monitoring while 1 min for detailed monitoring. CW will evaluate aggregated metrics and work out if a specific alarm is triggered based on the alarm policy. When a new EC2 is launched, it will not send metrics before monitoring period either 1 or 5 mins has elapsed resulting in `insufficient data`. **Use detailed monitoring to have more frequent updates on resources utilization change**.
- EC2 is considered to be `unhealthy` if its state is in any state of `stopping`, `stopped`, `terminating`, `terminated` other than `running`.
- When each instance is fully configured and passes the Amazon EC2 health checks, it is attached to the Auto Scaling group and it enters the `InService` state. The instance is counted against the desired capacity of the Auto Scaling group.
- A `MaxBatchSize > 100` in the `UpdatePolicy` will break AWS AutoScaling limits.

#### Simple Scaling

You pick ANY CW metric i.e `CPUUtilization`. You specify a SINGLE THRESHOLD beyond which you define how you want to scale accordingly.
```
EXAMPLE: how many EC2 instances do you want to add or remove when selected metric breaches the threshold.
```
The scaling policy then acts.
```
THRESHOLD - add 1 instance when CPUUtilization is between 40% and 50%
```
NOTE: This is the ONLY Threshold. Plus the main issue with simple scaling is that after a scaling activity is started, the policy must wait for the scaling activity or health check replacement to complete and the cooldown period to expire before responding to additional alarms. While Step/target tracking Scaling policy can continue to react to additional alarms.

#### Step Scaling

You specify MULTIPLE thresholds along with different scaling strategies.

```
EXAMPLE:
Threshold A - add 1 instance when CPU Utilization is between 40% and 50%
Threshold B - add 2 instances when CPU Utilization is between 50% and 70%
Threshold C - add 3 instances when CPU Utilization is between 70% and 90%
```

NOTE: There are multiple thresholds

#### Target Tracking

It’s automatic. All you need to do is pick a metric, set the value (target) and that’s it. ASG will maintain that value. In addition, an associated alarm will be created and managed by AWS as part of policy. When being triggered, actions will be performed to normalise the metric value. However you don't have much control over it.

#### Cooldown

- Simple Scaling Policy has 300 secs cooldown by default
- Without cooldown, ASG will continue to add/remove ec2s as per triggering alarm even when an scaling activity is still in progress. i.e ec2 not in `InService` yet.
- With cooldown, ASG will block scaling activities meaning further scaling request will be dropped until cooldown period is expired. After that, new scaling requests can be processed again.
- When the instance enters the `InService` state, the cooldown period starts to count. IMPORTANT! User data might not finish executing at this point!!!
- When multiple:
Two cooldowns 1) Default cooldown 300 secs 2) Scaling-specific cooldown. Scaling-specific cooldown is useful. i.e lesser wait time in scale-in activity. EC2 termination process is faster than launch one so it might not need to wait 5 mins before next ec2 needs to be killed. This leads to faster scale-in experience
- When multiple instances involved in a single scaling activity, cooldown starts when the last instance finishes launching/terminating. i.e Once 1st instance is launched, cooldown steps in.

#### Zone Rebalancing

Explicitly terminate or detach instances can lead to an unbalanced group. So ASG might need to fix it (rebalance the zone) by launching instances in the AZ with fewer ones.

During zone rebalancing, because ASG attempts to launch new instances before terminating the old ones, being at or near the specified maximum capacity could impede or completely halt rebalancing activities. To avoid this problem, the system can temporarily exceed the specified maximum capacity of a group by a 10 percent margin (or by a 1-instance margin, whichever is greater) during a rebalancing activity. The margin is extended only if the group is at or near maximum capacity and needs rebalancing, either because of user-requested rezoning or to compensate for zone availability issues. The extension lasts only as long as needed to rebalance the group (typically a few minutes).
