## IAM

### IAM in a nutshell
### Rules

#### Policy
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

#### Role
Role consists of 2 parts:

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

cli wise, the above 2 steps can be coded as below:

```shell
# trust policy
aws iam create-role --role-name CodePipelineExampleRole \
--assume-role-policy-document '{"Version":"2012-10-17","Statement":{"Effect":"Allow","Principal":{"Service":"codepipeline.amazonaws.com"},"Action":"sts:AssumeRole"}}'

# permission policy
aws iam put-role-policy --role-name CodePipelineExampleRole \
--policy-name CodePipelineExamplePolicy \
--policy-document file://some-policy.json
```

[Reference](https://start.jcolemorrison.com/aws-iam-policies-in-a-nutshell/)

---

### Rules

- If there is no `Principal` in the policy it means policy applies to whatever users/groups have been assigned this policy




