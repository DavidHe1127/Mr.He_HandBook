## CloudFormation

* [Basics](#basics)


### Basics

- logical ID - i.e MyEC2Instance
- physical ID - i.e i-28f9ba55 (CF auto generates and assigns to the instance)

- Ref
  - when specify parameter's logical name, it returns value of parameter.
  - when specify resource's logical name, it returns a value that you can typically use to refer to that resource, such as physical ID. Sometimes, it can also be a identifier such as ip addr for an `AWS::EC2::EIP`.

```yml

---

# specify KeyName at runtime (when stack is being created)
Parameters:
  KeyName:
    Description: The EC2 Key Pair to allow SSH access to the instance
    Type: 'AWS::EC2::KeyPair::KeyName'

  WordPressUser:
    Default: admin
    NoEcho: true
    Description: The WordPress database admin account user name
    Type: String
    MinLength: 1
    MaxLength: 16
    AllowedPattern: "[a-zA-Z][a-zA-Z0-9]*"

# like switch/case, pre-define static values for CF to pick from to avoid getting it from user input which is error-prone.
# See !FindInMap for example use case
Mappings:
  RegionMap:
    us-east-1:
      AMI: ami-76f0061f
    us-west-1:
      AMI: ami-655a0a20
    eu-west-1:
      AMI: ami-7fd4e10b
    ap-southeast-1:
      AMI: ami-72621c20
    ap-northeast-1:
      AMI: ami-8e08a38f

Resources:
  Ec2Instance:
    Type: 'AWS::EC2::Instance'
    Properties:
      SecurityGroups:
        # refer to InstanceSecurityGroup physical id
        - !Ref InstanceSecurityGroup
      # literal string key pair mykey MUST exist in the region where stack is being created or creation will fail
      KeyName: mykey
      # refer to input parameter
      KeyName: !Ref KeyName
      ImageId: !FindInMap
        - RegionMap
        # pseudo parameter enables you to get the region where the stack is created
        - !Ref 'AWS::Region'
        - AMI

    # first create myBucket followed by Ec2Instance
    DependsOn: myBucket

  InstanceSecurityGroup:
    Type: 'AWS::EC2::SecurityGroup'
    Properties:
      GroupDescription: Enable SSH access via port 22
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: '22'
          ToPort: '22'
          CidrIp: 0.0.0.0/0

  myBucket:
    Type: 'AWS::S3::Bucket'

  myDistribution:
      Type: 'AWS::CloudFront::Distribution'
      Properties:
        DistributionConfig:
          Origins:
            # take 2 params, resource logical name & attribute name to be retrieved
            - DomainName: !GetAtt
                - myBucket
                - DomainName
              Id: myS3Origin
              S3OriginConfig: {}
          Enabled: 'true'
          DefaultCacheBehavior:
            TargetOriginId: myS3Origin
            ForwardedValues:
              QueryString: 'false'
            ViewerProtocolPolicy: allow-all

  ElasticLoadBalancer:
    Type: 'AWS::ElasticLoadBalancing::LoadBalancer'
    Properties:
      AvailabilityZones: !GetAZs ''
      Instances:
        - !Ref Ec2Instance1
        - !Ref Ec2Instance2
      Listeners:
        - LoadBalancerPort: '80'
          InstancePort: !Ref WebServerPort
          Protocol: HTTP
      HealthCheck:
        # string concatenation. 1nd param is delimiter, 2nd param is an array of values
        # example belows produces HTTP:8888/
        Target: !Join
          - ''
          - - 'HTTP:'
            - !Ref WebServerPort
            - /
        HealthyThreshold: '3'
        UnhealthyThreshold: '5'
        Interval: '30'
        Timeout: '5'

  # Contains declarations for the values that you want to have available after the stack is created. It's a convenient way to capture important information about your resources or input parameters
  # example below produces http://mywptests-elasticl-1gb51l6sl8y5v-206169572.us-east-2.elb.amazonaws.com/wp-admin/install.php
  Outputs:
    InstallURL:
      Value: !Join
        - ''
        - - 'http://'
          - !GetAtt
            - ElasticLoadBalancer
            - DNSName
          - /wp-admin/install.php
      Description: Installation URL of the WordPress website
    WebsiteURL:
      Value: !Join
        - ''
        - - 'http://'
          - !GetAtt
            - ElasticLoadBalancer
            - DNSName

```
