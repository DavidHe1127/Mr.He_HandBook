## CloudFormation

- [Basics](#basics)
  - [User Data Property](#user-data-property)
  - [Typical example](#typical-example)
  - [cross-stack reference](#cross-stack-reference)
  - [cfn-init vs user data](#cfn-init-vs-user-data)
- Tools
  - [lono - Preview changes, like Terraform plan](https://lono.cloud/reference/lono-cfn-preview/)
- Tips
  - [Use !Sub not !Join](https://theburningmonk.com/2019/05/cloudformation-protip-use-fnsub-instead-of-fnjoin/)
  - [Practical way to debug user data](#debug-user-data)

### Basics

- !Ref
  - when specify parameter's logical name, it returns value of parameter.
  - when specify resource's logical name, it returns a value that you can typically use to refer to that resource, such as physical ID. Sometimes, it can also be a identifier such as ip addr for an `AWS::EC2::EIP`.

- Templates have to be uploaded to s3 before being referenced in CF.
- To update stack, we cannot edit the earlier version directly. We have to re-upload a new version of the template and AWS will be able work out **what's needed to be changed (change set)** by comparing the two. Change set will then be executed to apply the change.


#### User Data Property

- Scripts entered in UserData are run by `root` so `sudo` is not required. In case files are created and needed to be accessed by non-root users, modify permissions accordingly.
- Check `/var/log/cloud-init-output.log` on EC2 instance for `cloud-init` output.
- To update instance user data, instance MUST stop first.

```
UserData:
  Fn::Base64: !Sub
    - |
      #!/bin/bash -xe
      foo=${foo}
      baz=${baz}
    - foo: !Ref Foo
      baz: !Ref Baz
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

Reference Stack:

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

One noticeable caveat is `You can't modify or remove an output value that is referenced by another stack.`. So use it with caution!


### cfn-init vs user-data

A major benefit of `AWS::CloudFormation::Init` over UserData is that the former is updatable -- if you modify the `AWS::CloudFormation::Init` section, CloudFormation will update your EC2 instance in place, whereas if you modify the UserData property of an EC2 resource in your template and update your stack, CloudFormation will replace that EC2 instance.

Use `cfn-init` to do prep work before user-data.

---

### Tips

#### Reduce use of cross-stack as possibly as you can

Cross-stack creates deps making modification/deletion to one stack harder. If output from one stack is required in another, put them in `ssm` for access.

If a stack is truly long-lived, and the output values static i.e networking stack, the values depended on could also be hard coded into the dependent template.

#### Debug user data

Heads-up! Make sure you have created a stack SUCCESSFULLY before going through debugging process. If you know your user data is faulty in some places, comment them out to unblock creation process since you cannot update a failed stack. Once creation is done, have problematic code restored and follow process below for debugging.

The most practical way is edit current template in place through designer. Also ensure template is shown in `yaml` format making editing easier. Once editing is complete, hit create stack - cloud icon with a up arrow to update changed stack.

When inline editing, ensure to leave blank line between comments and code:

```shell

# this is comment

set +e
```

Otherwise, code will be merged into comment as so `# this is comment set +e`

#### Use AWS:Include to help with de-dupe

```
# main.yml

Resources
  SentinelLaunchTemplate:
    Type: 'AWS::EC2::LaunchTemplate'
    Properties:
      LaunchTemplateName: abc-2843-test
      LaunchTemplateData:
        BlockDeviceMappings:
          - DeviceName: /dev/xvda
            Ebs:
              DeleteOnTermination: true
              VolumeType: gp3
        MetadataOptions:
          HttpEndpoint: enabled
          HttpTokens: required
        Fn::Transform:
          Name: AWS::Include
          Parameters:
            Location: !Sub "s3://multi-arch-user-data/user-data.yml"

# user-data.yml

ImageId: !Ref ImageId
UserData:
  Fn::Base64:
    Fn::Sub: |
      #!/bin/bash
      echo "${ImageId}"

```

#### Use !If to avoid duplicate

```
Overrides:
  !If
  - UseSecondaryArch
  - - InstanceRequirements:
        AcceleratorCount:
          Max: 0
        BareMetal: excluded
        BurstablePerformance: excluded
        InstanceGenerations:
          - current
        LocalStorage: included
        MemoryGiBPerVCpu:
          Min: 2
        MemoryMiB:
          Min: 1
        OnDemandMaxPricePercentageOverLowestPrice: 50
        SpotMaxPricePercentageOverLowestPrice: 100
        VCpuCount:
          Min: 4
          Max: 8
      LaunchTemplateSpecification:
        LaunchTemplateId: !Ref xxxTemplate
        Version: !GetAtt xxxTemplate.LatestVersionNumber
  - - InstanceRequirements:
        AcceleratorCount:
          Max: 0
        BareMetal: excluded
        BurstablePerformance: excluded
        InstanceGenerations:
          - current
        LocalStorage: included
        MemoryGiBPerVCpu:
          Min: 2
        MemoryMiB:
          Min: 1
        OnDemandMaxPricePercentageOverLowestPrice: 50
        SpotMaxPricePercentageOverLowestPrice: 100
        VCpuCount:
          Min: 4
          Max: 8
```
