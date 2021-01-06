## CloudFormation

- [Basics](#basics)
  - [Tagging](#tagging)
- [cross-stack reference](#cross-stack-reference)
- Tools
  - [lono - Preview changes, like Terraform plan](https://lono.cloud/reference/lono-cfn-preview/)
- [Troubleshooting](#troubleshooting)
- Tips
  - [Use deploy command](#use-deploy-command)
  - [Use !Sub not !Join](https://theburningmonk.com/2019/05/cloudformation-protip-use-fnsub-instead-of-fnjoin/)
  - [Practical way to debug user data](#debug-user-data)

### Basics

- Parameter name - Use Pascal case and begin with an uppercase letter. i.e VPCZoneIdentifier
- logical ID - i.e MyEC2Instance
- physical ID - i.e i-28f9ba55 (CF auto generates and assigns to the instance)

- Ref
  - when specify parameter's logical name, it returns value of parameter.
  - when specify resource's logical name, it returns a value that you can typically use to refer to that resource, such as physical ID. Sometimes, it can also be a identifier such as ip addr for an `AWS::EC2::EIP`.

- Templates have to be uploaded to s3 before being referenced in CF.
- To update stack, we cannot edit the earlier version directly. We have to re-upload a new version of the template and AWS will be able work out **what's needed to be changed (change set)** by comparing the two. Change set will then be executed to apply the change.

#### Tagging

CF automatically creates the following stack-level tags with the prefix `aws::`:

```
aws:cloudformation:logical-id
aws:cloudformation:stack-id
aws:cloudformation:stack-name
```

All stack-level tags, including automatically created tags, are propagated to resources that CF supports.

#### Typical Example

```yml

---

AWSTemplateFormatVersion: 2010-09-09

Parameters:
  VPCES:
    Type: 'AWS::SSM::Parameter::Value<String>'
    Description: VPCEs
    Default: '/logging/dev/serviceName'
  # to be removed
  VPC:
    Description: VPCID
    Type: String
  # to be removed
  Subnet:
    Description: Subnet
    Type: String
Conditions:
  CreateLoggingServiceVPCE: !Not [!Equals [!Ref VPCES, ""]]
Resources:
  LoggingServiceVPCE:
    Type: AWS::EC2::VPCEndpoint
    Condition: CreateLoggingServiceVPCE
    Properties:
      SecurityGroupIds:
        - !Ref LoggingServiceVPCESecurityGroup
      ServiceName: !Ref VPCES
      # SubnetIds:
      #   - !Ref PrivateSubnet0
      #   - !Ref PrivateSubnet1
      SubnetIds:
        - !Ref Subnet
      VpcEndpointType: Interface
      VpcId: !Ref VPC

  LoggingServiceVPCESecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Condition: CreateLoggingServiceVPCE
    Properties:
      GroupDescription: VPCE Security Group
      GroupName: test-logging-io-49
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 24223
          ToPort: 24224
          # !GetAtt VPC.CidrBlock
          CidrIp: 10.0.0.0/16
      SecurityGroupEgress:
        - IpProtocol: tcp
          FromPort: 24223
          ToPort: 24224
          CidrIp: 0.0.0.0/0
      VpcId: !Ref VPC
      Tags:
        - Key: Usage
          Value: !Sub
            - 'Used by ${VPC}'
            - { VPC: !Ref VPC }
Outputs:
  LoggingServiceVPCEId:
    Value: !Ref LoggingServiceVPCE
```

### cross-stack reference
It allows you to share resources created in one stack with another stack.

Source stack:

```yaml
Resources:
  myVPC:
    Type: 'AWS::EC2::VPC'
    ...

Outputs:
  vpcID:
    Value: !Ref myVPC
      Export:
        Name:
          Fn::Sub: "${AWS::StackName}-VpcID"
```

Reference Stack

```yaml
Parameters:
  SourceStackName:
    Type: String
Resources:
  mySUBNET:
    Type: 'AWS::EC2::Subnet'
    Properties:
      VpcId:
        Fn::ImportValue:
          Fn::Sub: "${SourceStackName}-VpcID"
      ...
```

```shell
aws cloudformation create-stack \
    --stack-name reference-stack \
    --template-body file://reference-stack.yaml \
    --parameters file://params.json
```

params.json

```json
[
  {
    "ParameterKey": "SourceStackName",
    "ParameterValue": "source-stack"
  }
]
```

### Troubleshooting

**Q**: Error out when deploying lambda through serverless framework `[CREATE_FAILED [AWS::Lambda::Function - YourlambddLambdaFunction]`

**A**: Go to cf console and search for failed events of your cf. They will review errors in detail.

**Q** Error - When calling the CreateChangeSet operation ... stack XXX is in ROLLBACK_COMPLETE state and can not be updated

**A** If a stack fails to be created for any reasons, cf will execute a rollback to delete all previously created resources. The stack itself remains in a `ROLLBACK_COMPLETE` state to enable users to inspect and debug the problems. It is not possible to retry with this stack again. Users have to delete the stack on their own.

### Tips

#### Use Deploy Command
Use `deploy` over `create-stack` as the former not only does create a new stack but also updates an existing stack (by using a change set). However `create-stack` can only be used when you create a brand new/non-existent resource stack. In essence, `deploy` is a combination of `create-stack` and `update-stack`.

Change set is a way to inform users of proposed changes they will have when updating a stack. It helps them understand what's going to be changed and discover any unexpected changes adding more confidence to deployment.

```shell
$ aws cloudformation deploy

$ aws cloudformation create-stack
```

#### Debug user data
Heads-up! Make sure you have created a stack SUCCESSFULLY before going through debugging process. If you know your user data is faulty in some places, comment them out to unblock creation process since you cannot update a failed stack. Once creation is done, have problematic code restored and follow process below for debugging.

The most practical way is edit current template in place through designer. Also ensure template is shown in `yaml` format making editing easier. Once completes editing, download the updated template and replace current template with downloaded one. Bonus, keep using downloaded file for more editing and upload it to replace current template.

When inline editing, ensure to leave blank line between comments and code:

```shell

# this is comment

set +e
```

Otherwise, code will be merged into comment as so `# this is comment set +e`
