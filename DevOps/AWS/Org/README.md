## AWS Organisation

- [Service Control Policy](https://aws.amazon.com/blogs/security/how-to-use-service-control-policies-to-set-permission-guardrails-across-accounts-in-your-aws-organization/)

### OrganizationAccountAccessRole

This role will be created in all new accounts created via AWS ControlTower. This role normally has admin access and can be assumed by root. This allows any role that has `sts:AssumeRole` policy in root to use this role.

### Check SCP

Go through each SCP applied to your org when you are denied to do something via a role which has full access. The chances are, one of SCPs might have explicit deny to fail your operation.
