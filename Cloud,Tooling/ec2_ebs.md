## EC2

- [Basics](#basics)
- [EC2 & EBS cost](#ec2_ebs_cost)
- [Instance Profile](#instance-profile)
- [Best Practice](#best-practice)

### Basics

`Private/Public DNS` as shown on EC2 panel resolves to private/public ip of an instance.
i.e Private DNS hostname `ip-10-156-61-79.ap-southeast-2.compute.internal` resolves to private ip `10.156.61.79`.

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

### Best Practice

[Using an IAM Role to Grant Permissions to Applications Running on Amazon EC2 Instances.](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#create-iam-users)
