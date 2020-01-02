## Terraform & Ansible

- Core Concepts
  - [Typical config](#typical-config)
- [Terraform vs Ansible](#terraform-vs-ansible)

### Terraform vs Ansible

`Terraform` is primarily used for resource provisioning while `Ansible` is used to configure them.
Think of `Terraform` as a tool to create a foundation, `Ansible` to put the house on top and then the application gets deployed however you wish (can be Ansible too).


### Typical Config

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
