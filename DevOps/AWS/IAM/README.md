## IAM

- [Pass role](#pass-role)
- [service-linked role](#service-linked-role)
- [Policy](#policy)
- [Conditions](#conditions)
- [Federated Users](#federated-users)
- [Credentials lookup](#credentials-lookup)
- [Permission Boundary](#permission-boundary)
- [Managing Server Certs](#managing-server-certs)
- [Resource Cross-Account access](#resource-cross-account-access)

- [Tips](#tips)
- [Reference](#reference)

### Assume a role

Assuming a role means asking Security Token Service (STS) to provide you with a set of temporary credentials -- role credentials -- that are specific to the role you want to assume.

For all identities under an account to be able to assume a role, simply specify `arn:aws:iam::123456789012:root` in the principal field.

### Pass role

It grants the service a principal launches the permission to assume a role to perform other actions on your behalf. It's a permission not an API call which indicates it won't be captured by `CloudTrail`. To help find out what services need `PassRole`, take away granted `PassRole` and look into the error.

One example is help users determine which role (instance profile) needs to be assigned to instance when launching a new instance.

```json
{
   "Version": "2012-10-17",
   "Statement": [{
      "Effect":"Allow",
      "Action":["ec2:*"],
      "Resource":"*"
    },
    {
      "Effect":"Allow",
      "Action":"iam:PassRole",
      "Resource":"arn:aws:iam::123456789012:role/S3Access"
    }]
}
```

Above example means when the user launches an EC2 instance, that user is allowed to associate only the `S3Access` role with the instance. When an application is running in the instances that are launched by this user, that application can perform only the actions that are permitted by whatever is defined in the `S3Access` role.

[pass role](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_passrole.html)

#### Service-linked Role

- Only specific services (trust entities) can assume such role
- Streamline role setup as it has pre-defined perms attached so you don't need to manually add required perms
- Different than service role which is assumed by a specific service but perms need to be manually added.

### Policy

In human understandable words, we use `IAM` to control who (Principal) can (Allow) or cannot (Deny) do what (Action) on which resource (Resource) and when (Condition).

i.e policy below can be interpreted as - LambdaProvisioningRole is allowed to do those actions on all resources.

Note, you can also restrict allowed actions to one specific resource i.e david-kms-key.

```yml
KeyPolicy:
  Version: 2012-10-17
  Id: Account Root Access
  Statement:
    - Sid: Allow use of the key
      Effect: Allow
      Principal:
        AWS: !Sub '${LambdaProvisioningRole.Arn}'
      Action:
        - 'kms:Decrypt'
        - 'kms:Encrypt'
        - 'kms:GenerateDataKey*'
        - 'kms:DescribeKey'
      Resource: '*'
```

#### Resource-based Policy vs Identity-based Policy

Identity-based Policy

- Attached to an IAM user, group, or role.
- It defines **who** is **allowed/denied** to do **what** on which **resources**.
- Cannot have `Principal`. Policies applied to those entities being attached to.

Resource-based Policy

- Attached to a resource.
- It defines **what** actions is **allowed/denied** on which **resource** by **who** or which **resource**
- Can have `Principal`.

### Conditions

```
{
  "Version": "2012-10-17",
  "Statement": {
    "Effect": "Deny",
    "Action": "*",
    "Resource": "*",
    "Condition": {
      "NotIpAddress": {
        "aws:SourceIp": ["192.168.21.55/32"]
      },
      "Bool": {
        "aws:ViaAWSService": "false"
      }
    }
  }
}
```

can be interpreted as

```
if (sourceIp !== "192.168.21.55/32" && viaAWSService === false) {
  deny actions
}
```

in other words, if the call is made by an AWS service, the policy doesn't apply. Policy applies only if the call is made from an user/role AND principal ip is not `192.168.21.55/32`. It's useful when you want to force IAM user/role to use specific IP to interact with services but don't want to force the same thing onto AWS services.

#### aws:CalledVia* and aws:ViaAWSService

Consider a call to reading a piece of data in a DynamoDB table, encrypted with a KMS key. In order to decrypt the data, DynamoDB will have to call kms:Decrypt - and this will be done using the credentials of the principal that asked for the data to be read from the DynamoDB table. Therefore - that principal will have to have permissions to the DynamoDB table AND to kms:Decrypt on the KMS key which has to be used to decrypt it.

```
// specify the ssm must be the service asking for the KMS to provide the key
'kms:ViaService': ['ssm.ap-southeast-2.amazonaws.com']
```

Service Role and Service Linked Role are direct caller to other services.

#### PrincipaIsAWSService vs aws:ViaAWSService

The difference between them is the `PrincipaIsAWSService` will have a service principal, such as `cloudtrail.amazonaws.com` while the `viaAWSService` would use an IAM Principal (IAM role or User, but not a service role or service-linked role).

The exact evaluation for aws:PrincipalIsAWSService: "The request context key is set to true when a service uses a service principal to perform a direct action on your resources. The context key is set to false if the service uses the credentials of an IAM principal to make a request on the principal's behalf. It is also set to false if the service uses a service role or service-linked role to make a call on the principal's behalf."

The exact evaluation for aws:ViaAWSService: "The request context key returns true when a service uses the credentials of an IAM principal to make a request on behalf of the principal. The context key returns false if the service uses a service role or service-linked role to make a call on the principal's behalf. The request context key also returns false when the principal makes the call directly."

### Federated Users

External identities are users you manage outside of AWS in your corporate directory, but to whom you grant access to your AWS account using temporary security credentials. They differ from IAM users, which are created and maintained in your AWS account.

Read more around this on [IAM Q&A](https://aws.amazon.com/iam/faqs/)

### Credentials lookup

When used in EC2 instances or containers, it instructs SDK/development tool how to find credentials they need to be able to assume a role specified in `role_arn`. i.e

```
[aws-dev]
credential_source = Ec2InstanceMetadata
role_arn = arn:aws:iam::123456789012:role/david-dev
```
This uses metadata service to retrieve credentials which will be used to assume `david-dev` role. Use case would be dynamically assign role to a build agent to use as per profile in use.

Similarly, you can also get temp credentials through a source profile:

```
[profile marketingadmin]
role_arn = arn:aws:iam::123456789012:role/marketingadminrole
source_profile = user1
```
When using `marketingadmin` as `AWS_PROFILE` in CLI, CLI automatically looks up the credentials for the linked `user1` profile and uses them to request temporary credentials for the specified `marketingadminrole`. The CLI uses the `sts:AssumeRole` operation in the background to accomplish this.


### Permission Boundary

Set the maximum permissions that an identity-based policy can grant to an IAM entity. It doesn't grant actual permissions - same as SCP A typical use case scenario: You designate user A to create users for you. You can create a permission boundary that sets the max permissions new users will have and mandate the attachment of permission boundary to new users. Such that, A can only create new users if permission boundary is attached to users role policy.

```json
...
{
    "Sid": "CreateOrChangeOnlyWithBoundary",
    "Effect": "Allow",
    "Action": [
        "iam:CreateUser",
        "iam:DeleteUserPolicy",
        "iam:AttachUserPolicy",
        "iam:DetachUserPolicy",
        "iam:PutUserPermissionsBoundary",
        "iam:PutUserPolicy"
    ],
    "Resource": "*",
    "Condition": {"StringEquals":
        {"iam:PermissionsBoundary": "arn:aws:iam::123456789012:policy/XCompanyBoundaries"}}
}
...
```

### Managing Server Certs

Use ACM most of the time. Use IAM to manage certs ONLY when:

- You must support HTTPS connections in a Region that is not supported by ACM
- Certificate algorithms and key sizes that aren't currently supported by ACM or the associated AWS resources

By and large, if cert is not compatible with ACM, use IAM. Trusted Advisor also exposes `IAM Server Certificates` service limit metric for this use case.

### Resource cross-account access

Suppose ec2 in account B needs to access ssm param in account A:

- Create a new role in A account with GetParameter perm + set account B as truster in trust relationship
- Add allow AssumeRole to iam role attached to ec2 to assume role created in previous step
- On ec2 terminal, create a new profile
```
[profile cross-account-access]
role_arn = arn:aws:iam::222222222222:role/role-in-a-account
credential_source = Ec2InstanceMetadata
```
- Make the call `aws ssm get-parameter --profile cross-account-access --region ap-southeast-2 --name '/david/token' --with-decryption --queryParameter.Value --output text`
- To return to original role, call cli without `--profile`

### Tips

- Use [IAM Access Analyzer](https://docs.aws.amazon.com/IAM/latest/UserGuide/access-analyzer-policy-generation.html) to help you refind the perms granted to a role. e.g generate policy with required perms from cloudtrail logs. This can prevent you perms overprovisioning. Based on experience, looks like it's smart at identifying over-provisioned actions but not resources?

```
// role with permissive policy
"s3:*"

// generated policy
"s3:GetObject",
"s3:GetObjectVersion",
"s3:ListBucket"
```
- When using CFN to manage your resources and you don't want to let it use your credentials, it's considered a good practice to assign a service role to CFN. So that only CFN is allowed to use it and the role cannot be inadvertently removed.

### Reference

- [Role Policy in a nutshell](https://start.jcolemorrison.com/aws-iam-policies-in-a-nutshell/)
- [Setup federated SSO AWS using google apps](https://aws.amazon.com/blogs/security/how-to-set-up-federated-single-sign-on-to-aws-using-google-apps/)
