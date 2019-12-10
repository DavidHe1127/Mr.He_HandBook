## ECS

- [Core concepts](#core-concepts)
  - [Task Definition](#task-definition)
  - [Task](#task)
  - [Service](#service)
  - [Cluster](#cluster)
  - [Container Instance](#container-instance)

- [Run a service in cluster](#run-a-service-in-cluster)

### Core Concepts

#### Task Definitions
Blueprint describes how a container should launch. It contains settings like exposed port, docker image, cpu shares, memory requirement, command to run and env vars.

#### Task
This is a running container with the settings defined in the Task Definition. It can be thought of as an `instance` of a Task Definition.

#### Service
Defines long running tasks of the same Task Definition i.e a web application. This can be 1 running container or multiple running containers all using the same Task Definition.

#### Cluster
A logic group of EC2 instances. When an instance launches the `ecs-agent` software on the server it registers the instance to an ECS Cluster. This is easily configurable by setting the ECS_CLUSTER variable.

#### Container Instance
This is just an EC2 instance that has docker and ecs-agent running on it. It's part of ECS cluster.

![ecs arch](ecs-arch.png)


---

### Run a service in cluster

Prerequisites:

- security group
- ssh keypair for ssh into ec2 instance
- ECS relevant IAM roles

1. Create ECS cluster.
2. Store container agent config file on s3. Config file will register a container instance to clusters.
3. Create a container instance using ECS optimized AMIs (container agent & docker engine pre-baked in).
  - Script logic to copy container agent config file over. Load script via ec2 instance user data
4. Write up a task definition and register (upload) it to the cluster
5. Create a service from registered task definition



