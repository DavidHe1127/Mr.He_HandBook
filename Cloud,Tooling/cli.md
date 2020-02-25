### CLI

- [Set default profile](#set-default-profile)
- [Show lib caller identity](#show-lib-caller-identity)
- [Use query to narrow down returned result](#use-query)

### Set Default profile

```shell
$ export AWS_DEFAULT_PROFILE=qq
```
This will set it temporarily. It's gone after shell closed. For permanent approach, put that line in `.bash_profile` under user home dir.

### Show lib caller identity

```shell
$ aws sts get-caller-identity
{
    "Account": "216659404274", 
    "UserId": "AIDATE4PIEXZI56MKRECO", 
    "Arn": "arn:aws:iam::216659404274:user/david-adm"
}
```

### Use query

```shell
$ aws sts get-caller-identity --query Account --output text
```
[More infor](https://docs.aws.amazon.com/cli/latest/userguide/cli-usage-output.html#text-output)
