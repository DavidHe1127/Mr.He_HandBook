## EC2

* [EC2 & EBS cost](#ec2_ebs_cost)
* [Best Practice](#best-practice)

### EC2 EBS Cost
  * `EC2` accrue charges only while they're running.
  * `EBS` accrue charges unless they are deleted (NOT ATTACHED!).
  * To avoid any charges to `EBS`, make sure have them deleted as well as `snapshots` created from them.
  * `EBS snapshots` are billed at a lower rate than active `EBS volumes` are. So for cost effectiveness, you can create `EBS` snapshots from `EBS` volumes and delete active `EBS` volumes. Later, you can restore the `EBS` volumes from the snapshots when needed.

### EC2 Best Practice
[Using an IAM Role to Grant Permissions to Applications Running on Amazon EC2 Instances.](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#create-iam-users)
