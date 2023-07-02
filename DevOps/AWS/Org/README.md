## AWS Organisation

- [Service Control Policy](https://aws.amazon.com/blogs/security/how-to-use-service-control-policies-to-set-permission-guardrails-across-accounts-in-your-aws-organization/)

### OrganizationAccountAccessRole

This role will be created in all new accounts created via AWS ControlTower. This role normally has admin access and can be assumed by root. This allows any role that has `sts:AssumeRole` policy in root to use this role.

### Check SCP

Go through each SCP applied to your org when you are denied to do something via a role which has full access. The chances are, one of SCPs might have explicit deny to fail your operation.

### Org Trail

An org trail must be created in a mgmt account or delegated administrator account with sufficient perms.

When you create an org trail, a trail with the name that you give it is created in every AWS account that belongs to your org. Users with CloudTrail permissions in member accounts have access to trail when. However, users in member accounts do not have sufficient permissions to change the org trail in any way.

All logs are stored in a centralised account that only mgmt account has access to.

