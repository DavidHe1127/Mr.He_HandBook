## IAM

- [Role](#role)
  - [Pass role](#pass-role)
  - [service-linked role](#service-linked-role)
- [Policy](#policy)
- [Federated Users](#federated-users)
- [Credentials lookup](#credentials-lookup)
- [Reference](#reference)

### Role

A role consists of 2 parts:

- `Trust Policy` - is a policy that does nothing more than state `who` can assume a role
- `Permissions Policy` - `What` actions can the owner of this role take to `which` resources

Note when creating roles in the console, we don't really worry about trust policy since the service we pick will be served as `who`.

#### Assume a role

Assuming a role means asking Security Token Service (STS) to provide you with a set of temporary credentials -- role credentials -- that are specific to the role you want to assume.

Let's grant `Code Pipeline` service permission to assume a role to be able to perform operations on `Code Build` service.

As shown in the above section, we need to firstly create a role with trust policy and then attach permission policy to the role.

Trust policy:
```json
{
  "Version":"2012-10-17",
  "Statement": {
    "Effect":"Allow",
    "Principal": {
      "Service": "codepipeline.amazonaws.com"
    },
    "Action":"sts:AssumeRole"
  }
}
```

This means `codepipeline` service can assume this role.

Next is permission policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "codebuild:BatchGetBuilds",
        "codebuild:StartBuild"
      ],
      "Resource": "*"
    }
  ]
}
```

For all identities under an account to assume a role, simply specify like this `arn:aws:iam::123456789012:root` in principal field.

#### Pass role

It allows users to determine which role (instance profile) needs to be assigned to instance when launching a new instance.

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

[pass role](https://aws.amazon.com/blogs/security/granting-permission-to-launch-ec2-instances-with-iam-roles-passrole-permission/)

#### Service-linked Role

- Only specific services (trust entities) can assume such role
- Name cannot be changed

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

### Federated Users

External identities are users you manage outside of AWS in your corporate directory, but to whom you grant access to your AWS account using temporary security credentials. They differ from IAM users, which are created and maintained in your AWS account.

Read more around this on [IAM Q&A](https://aws.amazon.com/iam/faqs/)

### Credentials lookup

When used in EC2 instances or containers, it instructs SDK/development tool how to find credentials they need to be able to assume a role specified in `role_arn`. i.e

```
[david-dev]
credential_source = Ec2InstanceMetadata
role_arn = arn:aws:iam::123456789012:role/david-admin
[david-sandbox]
credential_source = Ec2InstanceMetadata
role_arn = arn:aws:iam::123456789012:role/david-sandbox
```
This uses metadata service to retrieve credentials which will be used to assume `david-admin` role. Use case would be dynamically assign role to a build agent to use as per profile in use.

### Reference

- [Role Policy in a nutshell](https://start.jcolemorrison.com/aws-iam-policies-in-a-nutshell/)
- [Setup federated SSO AWS using google apps](https://aws.amazon.com/blogs/security/how-to-set-up-federated-single-sign-on-to-aws-using-google-apps/)
