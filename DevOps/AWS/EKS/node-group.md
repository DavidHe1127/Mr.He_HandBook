## Node Group

- Create multiple node groups and scope each group to a single Availability Zone. If only one NG, span it across >1 azs.
- Use [Nitro system based instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-types.html#ec2-nitro-instances) which gives you larger range of available IPs for pods.
- Use fewer nodes with larger resources.

