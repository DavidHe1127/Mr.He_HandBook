## ACM

- You cannot install an ACM Certificate directly on your website or application. You must install your certificate by using one of the services integrated with ACM. i.e ELB, CloudFront.
- ACM cannot cross region/account given CMK used to encrypt its private key is unique for each AWS region/account.
- Different accounts can have same domain names.

### Validation

Cert requesters needs to prove to AWS that they are the owner of the domain ACM issues the cert for.

#### DNS validation

Add designated CNAME record to the DNS system. i.e Add this record to Route53 if requester uses Route53 as DNS server.

#### EMAIL validation

##### via console

If doing so via console, AWS will perform a recursive `MX` record lookup. An `MX` record indicates which servers accept mail for your domain.

> For example, if you use the console to request a certificate for abc.xyz.example.com, ACM first tries to find the MX record for that subdomain. If that record cannot be found, ACM performs an MX lookup for xyz.example.com. If that record cannot be found, ACM performs an MX lookup for example.com. If that record cannot be found or there is no MX record, ACM chooses the original domain for which the certificate was requested (abc.xyz.example.com in this example). ACM then sends email to the following five common system administration addresses for the domain or subdomain + `Domain registrant`, `Technical contact`, `Administrative contact` addresses in WHOIS database.

```
administrator@your_domain_name
hostmaster@your_domain_name
postmaster@your_domain_name
webmaster@your_domain_name
admin@your_domain_name
```

There is no guarantee that apex domain will receive validation email.

##### via cli/api (preferred)

If you are using the RequestCertificate API operation or the request-certificate AWS CLI command, AWS does not perform an MX lookup. In this case you can explicitly specify which domain you wish to receive validation emails. This way, you can warrant validation emails will go to apex domain rather than subdomain. i.e `example.com` rather than `test.example.com`.



