## Parameter Store

- If using AWS managed CMK key to encrypt/decrypt secured string param, you don't need below policies unless a Customer Managed CMK is used.

```
"kms:Decrypt",
"kms:Encrypt",
```

### Fetch SSM param dynamically in CFN

```yaml
# doesn't support versioning. Always the latest version is fetched
SomeParam:
  Description: test
  Type: AWS::SSM::Parameter::Value<String>
  Default: '/path/to/ssm'

# or via dynamic resolution
VpcId: '{{resolve:ssm:/ops/networking/main/vpc_id:latest}}'

# downside of second option is you cannot use function on it as function is evaluated prior to resolution is.
# this won't work!
SubnetIds: !Split [',', '{{resolve:ssm:/ops/networking/main/vpc_id:latest}}']

# with option 1
SubnetIds: !Split [',', !Ref SomeParam]
```
