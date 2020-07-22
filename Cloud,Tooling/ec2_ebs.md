## EC2

- [IP and DNS](#ip-and-dns)
- [Reboot](#reboot)
- [Internetwork traffic privacy in aws vpc](#internetwork-traffic-privacy-in-aws-vpc)
- [EC2 & EBS cost](#ec2_ebs_cost)
- [Instance Profile](#instance-profile)
- [Instance metadata](#instance-metadata)
- [EBS](#ebs)
    - [Snapshots](#snapshots)
    - [Use back-up EBS volume](#mount-backup-ebs-volume)
    - [Block devices infor](#block-devices-infor)
- [Best Practice](#best-practice)

### IP and DNS

`Private/Public DNS` as shown on EC2 panel resolves to private/public ip of an instance.
i.e Private DNS hostname `ip-10-156-61-79.ap-southeast-2.compute.internal` resolves to private ip `10.156.61.79`.

### Reboot

Since a reboot happens within the EC2 instance hardware, the state of the EC2 instance does not change from `running`. There is no rebooting state. And there is no mechanism to determine when the OS of your EC2 instance starts and/or completes its reboot other than monitoring messages in system log.

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
- To obtain more information about instance profile, you can grab instance profile name first by using `ec2 describe-instance` command and then feed it to `aws iam get-instance-profile --instance-profile-name <name here>`.

### Instance metadata

The instance metadata service does not require internet access. `169.254.0.0/16` is a reserved ip block and it is used for local, internal communication.

### EBS

#### Snapshots

An EBS snapshot is a backup of a single EBS volume. The EBS snapshot contains all the data stored on the EBS volume at the time the EBS snapshot was created.

An AMI image is a backup of an entire EC2 instance. Associated with an AMI image are EBS snapshots. Those EBS snapshots are the backups of the individual EBS volumes attached to the EC2 instance at the time the AMI image was created.

```
EC2  <-- EBS Volume (Boot) + EBS Volume
                           ^
                           |
         EBS (only of specific volume)
                           ^
                           |
         AMI (Combined snapshots of all volumes, AMI snapshot must have boot volume)
                           ^
                           |
        Launch a new Instance (same installed softwares and configs, different specs)
```

#### Mount backup EBS Volume

It's a 2-step process to use a non-root volume. It needs to be attached to your instance first during instance launch and then mount it from within that instance.

See [Mount your attached ebs volume](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-using-volumes.html) for more details.

#### List block devices information

Use `lsblk`. Note, it removes `/dev/` in front of all device names.
`part` indicate it's a partition.

```shell
NAME        MAJ:MIN RM SIZE RO TYPE MOUNTPOINT
nvme0n1     259:1    0  20G  0 disk
└─nvme0n1p1 259:2    0  20G  0 part /
nvme1n1     259:0    0  40G  0 disk /home/ec2-user/workspace
```

We have 2 devices `/dev/nvme0n1` and `/dev/nvme1n1` with `/dev/nvme0n1` mounted as root device (/) and `/dev/nvme1n1` mounted to `/home/ec2-user/workspace`.

Another example
```shell
NAME    MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
xvda    202:0    0    8G  0 disk
-xvda1  202:1    0    8G  0 part /
xvdf    202:80   0   10G  0 disk
```
This shows `/dev/xvdf` is attached but not mounted.

See more about [mounting](https://gist.github.com/DavidHe1127/7b038d9901ac285af1486f9cc3485ecd)

### Best Practice

