## EC2

- [Basics](#basics)
  - [Internetwork traffic privacy in aws vpc](#internetwork-traffic-privacy-in-aws-vpc)
- [EC2 & EBS cost](#ec2_ebs_cost)
- [Instance Profile](#instance-profile)
- [Instance metadata](#instance-metadata)
- [Best Practice](#best-practice)

### Basics

`Private/Public DNS` as shown on EC2 panel resolves to private/public ip of an instance.
i.e Private DNS hostname `ip-10-156-61-79.ap-southeast-2.compute.internal` resolves to private ip `10.156.61.79`.

### Internetwork traffic privacy in AWS VPC
Amazon security groups and network ACLs don't filter traffic to or from link-local addresses (169.254.0.0/16) or AWS reserved IPv4 addresses (these are the first four IPv4 addresses of the subnet, including the Amazon DNS server address for the VPC). So call to inquire instance metadata does not require
opening port on http.

### EC2 EBS Cost

- `EC2` accrue charges only while they're running.
- `EBS` accrue charges unless they are deleted (NOT ATTACHED!).
- To avoid any charges to `EBS`, make sure have them deleted as well as `snapshots` created from them.
- `EBS snapshots` are billed at a lower rate than active `EBS volumes` are. So for cost effectiveness, you can create `EBS` snapshots from `EBS` volumes and delete active `EBS` volumes. Later, you can restore the `EBS` volumes from the snapshots when needed.

### Instance Profile

- An Instance Profile is a container for a single IAM Role.
- A typical convention is to create an IAM Role and an Instance Profile of the same name for clarity.
- An EC2 Instance cannot be assigned a Role directly, but it can be assigned an Instance Profile which contains a Role.
- The benefits of using an Instance Profile is that you don't need to manage an `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`. Your application no longer needs to worry about how to securely store and access that information.
- To obtain more information about instance profile, you can grab instance profile name first by using `ec2 describe-instance` command returning its value as part of result and then feed it to `aws iam get-instance-profile --instance-profile-name <name here>`.

### Instance metadata

The instance metadata service does not require internet access. `169.254.0.0/16` is a reserved ip block and it is used for local, internal communication.


### Best Practice

