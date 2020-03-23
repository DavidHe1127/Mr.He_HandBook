## Terraform & Ansible

- Core Concepts
  - [attributes vs arguments](#attributes-vs-arguments)
  - [Typical config](#typical-config)
  - [Play with built-in func](#play-with-built-in-func)
  - [Provider Plugins](#provider-plugins)
- [Terraform vs Ansible](#terraform-vs-ansible)
- Notes
  - [Proper escaping](#proper-escaping)

### Terraform vs Ansible

`Terraform` is primarily used for resource provisioning while `Ansible` is used to configure them.
Think of `Terraform` as a tool to create a foundation, `Ansible` to put the house on top and then the application gets deployed however you wish (can be Ansible too).

### Attributes vs Arguments

```tf
resource "aws_instance" "web" {
  key_name        = aws_key_pair.terraform_key.key_name
  ami             = "ami-00a54827eb7ffcd3c"
  instance_type   = "t2.micro"
  ...
}

# key_name, ami, instance_type are all arguments.
# while attribute refers to resulting values upon creation of resource.
# You can reference them by aws_instance.web.public_id
```

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

For more example codes, look for `dockerzon-ecs/infra`.

---

### Play with built-in func

```shell
$ terraform console

> list("hello", "world")
[
  "hello",
  "world",
]
>
```

### Provider Plugins
It powers Terraform with provider's functionalities. If you have difficulty fetching provider plugins remotely via `terraform init`, you can alternatively download provider plugin from their site and follow either way to use it.

- `$ terraform init -plugin-dir=<PLUGINS_BINARY_LOCATION>`
- Move plugins directory into `.terraform/`

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









