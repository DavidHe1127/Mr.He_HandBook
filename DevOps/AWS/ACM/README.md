## ACM

- You cannot install an ACM Certificate directly on your website or application. You must install your certificate by using one of the services integrated with ACM. i.e ELB, CloudFront.
- ACM cannot cross region/account given CMK used to encrypt its private key is unique for each AWS region/account.
- Different accounts can have same domain names.
- Cert validation can be achieved by a) email b) DNS (adding CNAME record to the domain)
