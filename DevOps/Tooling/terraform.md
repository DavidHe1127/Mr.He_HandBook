## Terraform

- [Typical config](#typical-config)
- [Provider Plugins](#provider-plugins)
- [Terraform important notes](#terraform-notes)
- Notes
  - [Proper escaping](#proper-escaping)
  - [Variable default value](#variable-default-value)
- Tricks
  - [workaround to destroy non-existent resource](#workaround-to-destroy-nonexistent-resource)

### Typical Config

Below shows basic config. Please refer to `lab/terraform-aws` for more basics.

```tf
provider "aws" {
  profile = "qq"
  region  = var.region
}

# use '_' to join words for resource name
resource "aws_key_pair" "terraform_key" {
  key_name   = "learn-terraform"
  public_key = file("~/.ssh/terraform_tutorial_ec2_key.pub")
}

resource "aws_security_group" "terraform_sg" {
  ingress {
    # TLS (change to whatever ports you need)
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "web" {
  key_name        = aws_key_pair.terraform_key.key_name
  ami             = "ami-00a54827eb7ffcd3c"
  instance_type   = "t2.micro"
  security_groups = ["${aws_security_group.terraform_sg.name}"]

  # provisioner only run at the time of resource creation
  # not run to an already-running resource
  provisioner "local-exec" {
    command = "echo ${self.public_ip} > ip_address.txt"
  }

  connection {
    type        = "ssh"
    user        = "ubuntu"
    private_key = file("~/.ssh/terraform_tutorial_ec2_key")
    # Expressions in provisioner blocks cannot refer to their parent resource by name. Instead, they can use the special self object.
    # The self object represents the provisioner's parent resource, and has all of that resource's attributes.
    # For example, use self.public_ip to reference an aws_instance's public_ip attribute
    host = self.public_ip
  }

  # similar to user data for ec2 bootstrap when it's created the first time
  provisioner "remote-exec" {
    inline = [
      "mkdir learn-terraform"
    ]
  }
}

# region var must be defined in a file in the same location
# 'terraform output region' will print output value. Useful for debugging
output "region" {
  value = var.region
}
```

### Provider Plugins
It powers Terraform with provider's functionalities. If you have difficulty fetching provider plugins remotely via `terraform init`, you can alternatively download provider plugin from their site and follow either way to use it.

- `$ terraform init -plugin-dir=<PLUGINS_BINARY_LOCATION>`
- Move plugins directory into `.terraform/`

Terraform talks to AWS by using the supplied AWS credentials with the Terraform AWS Provider Plugin, which under the hood utilises the AWS Go SDK.

### Terraform Notes

- Terraform will query IMDS to find out credentials it needs when you run terraform on an EC2 Instance.
- Prior to a `plan` or `apply` operation, Terraform does a `refresh` to sync the state file with real-world status. So `refresh` might update state file but will not change actual infrastructure. `refresh` command can help you detect drift.
- Change value in resource `name` field is likely to incur resource replacement! i.e When an AWS resource's name immutable, change in terraform will cause resource replacement.
- Comment resources out will instruct terraform to tear down provisioned resource. However, deleting the resource file lets terraform do nothing as it cannot see this change.
- Terraform defers the read action (data block) until the `apply` phase as thus resource that depends on data block will always be marked as `changed` during tf `plan`. But this behaviour has changed as of 0.13. See [Data source deps](https://www.terraform.io/docs/configuration/data-sources.html#data-resource-dependencies)

---

### Proper escaping
Use 3 backslashes to escape double quotes in JSON field value when dealing with tf variables. Single backslash won't work!!!

```tf
instance_attributes = {
  "1" = "{\\\"location\\\": \\\"instanceOne\\\"}"
  "2" = "{\\\"location\\\": \\\"instanceTwo\\\"}"
}
```

Here is how it's parsed:

When it sees the 1st backslash, it will look at the following character to determine the real purpose of the 1st one. As seen in this example, the following character is another backslash. So, the 1st one is treated as an escape character and the second one is a real backslash. `\\ -> \`.

Next, it sees the 3rd backslash and this time, it looks at the next character again and found `"`. As per escape sequence rule, `\"` will be interpreted to just `"`. In the end, `\"` -> `"`.

Considering all interpretations, `\\\"` will become just `\"`.

### Variable default value

A worth noting caveat in terraform, default value for a variable will only be used when this variable it's not set during operations such as `apply` or `plan`. If it's set, terraform will ignore default value even if it's a falsy value like null!

```tf
terraform apply -var="vpc_name=${VPC_NAME}"
```
As explained above, `vpc_name` default value will not be used as it's set in apply.

### Workaround to Destroy nonexistent resource

In case you get stuck when trying to destroy non-existent resource which typically happens if target resource is deleted manually, try the following trick to get out of such situation.

```tf
terraform state rm 'module.nabx-miniapp.aws_kms_key.kms-key'
```

This will remove target resource managed by tf in state file. Following this operation, you should now be able to run destroy command again successfully. Note, underlying resource will not be blown up when running `terraform state rm`.
