## Route53

- [Public hosted zone](#public-hosted-zone)
- [Private hosted zone](#private-hosted-zone)
- [Alias Record vs CNAME](#alias-record-vs-cname)
- [Zone Delegation](#zone-delegation)
- [Health Check](#health-check)
- Examples
  - [root domain and subdomain config](#root-domain-and-subdomain-config)
- Troubleshooting
  - [xxx server ip address could not be found](#server-ip-address-could-not-be-found)

### Public Hosted Zone

Route53 automatically creates 2 records for you when you create a public hosted zone:

- SOA (Start of Authority)
- NS (name server)

Note, don't change them!

`SOA` shows information like

- The name of the server that supplied data for the zone
- The administrator of the zone
- The current version of data file
- Default number of seconds for the TTL. This value controls how long a DNS resolver or a web browser should cache the record set for. In other words, if this DNS record was changed on the authoritative name server, DNS servers around the world would still show the old value from their cache for up to TTL after the change

A `SOA` record example - `ns-2048.awsdns-64.net. hostmaster.example.com. 1 7200 900 1209600 86400`

`NS` record indicates which DNS server is authoritative for that domain (i.e. which server contains the actual DNS records - those you've added to your hosted zone later on).

When an user visiting `theparrodise.com` the DNS resolution workflow is described as follow:

1. Browser sends a query to `TLD` for authoritative DNS server aka NS server records
2. `TLD` returns NS server record i.e `ns.awsdns.com`
3. Browser then query NS server
4. NS server will return `SOA` which includes name server to use to find all records about the domain. i.e A record

### Private Hosted Zone

- It **MUST BE** associated with a particular VPC. So DNS queries in your VPC can be resolved.
- A set of DNS records to determine how the traffic should be routed within and among your VPCs. i.e traffic hitting `example.com` will be routed to your web server.
- A private hosted zone only responds to queries coming from within the associated VPC and it is not used for hosting a website that need to be publicly accessed.
- Use hosted zone to manage the internal DNS names for our application resources (web servers, application servers, databases, and so forth) without exposing this information to the public Internet.

[More infor](https://www.bogotobogo.com/DevOps/AWS/aws-Route53-DNS-Private-Hosted-Zone.php)

### Alias Record vs CNAME
Allows you to map one DNS name (www.theparrodise.com) to another DNS name (elb1234.elb.amazonaws.com). However, CNAME needs to point to another record.

Very much like `CNAME` except that `CNAME` only works on subdomain not root domain (aka naked domain name or zone apex record). i.e cannot have a `CNAME` record for `example.com`.

**Always** use `alias` record over `CNAME` where possible. Route 53 doesn't charge for alias queries to AWS resources while it does for CNAME queries.

[See more in comparisons](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-choosing-alias-non-alias.html)

### Zone Delegation

You can use it to route traffic to your subdomain i.e `acme.example.com.` See [more](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-routing-traffic-for-subdomains.html#dns-routing-traffic-for-subdomains-new-hosted-zone).

One benefit with it is to use IAM permissions to restrict who can access hosted zone for subdomain. This is not possible with adding records for subdomains in domain hosted zone which is considered another option when routing traffic for subdomain.

### Health Check

- For ELB endpoints, Route 53 evaluates the health of the load balancer itself and the health of your application running on the EC2 instances behind it. If any part of the stack goes down, Route 53 detects the failure, routes traffic away from the load balancer, and directs traffic to other healthy ELB endpoints.
- [How Route53 determines the health of ELB](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-failover-determining-health-of-endpoints.html#dns-failover-determining-health-of-endpoints-monitor-endpoint)

---

### Example

#### [Root Domain and Subdomain Config](http://altitudelabs.com/blog/how-to-set-up-app-subdomain-route-53/)


---

### Troubleshooting

#### server ip address could not be found
This error could happen when you delete and recreate a hosted zone for your domain leading to mismatch between new ns records and old ones.

To confirm, from `registered domains` menu, note down `Name servers` your domain uses and compare with that of your domain `hosted zone`. If they are different, then it could be your problem cause.

Solution is to update ns record in your domain in `registered domains`.

[Reference](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/domain-replace-hosted-zone.html)

