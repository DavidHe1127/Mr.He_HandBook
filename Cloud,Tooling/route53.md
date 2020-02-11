## Route53

- [Private hosted zone](#private-hosted-zone)

### Private Hosted Zone

- A set of DNS records to determine how the traffic should be routed within and among your VPCs. i.e traffic hitting `example.com` will be routed to your web server.
- A private hosted zone only responds to queries coming from within the associated VPC and it is not used for hosting a website that need to be publicly accessed.
- Use hosted zone to manage the internal DNS names for our application resources (web servers, application servers, databases, and so forth) without exposing this information to the public Internet.

[More infor](https://www.bogotobogo.com/DevOps/AWS/aws-Route53-DNS-Private-Hosted-Zone.php)


