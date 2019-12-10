## ECS

- [Core concepts](#core-concepts)
  - [Task Definition](#task-definition)
  - [Task](#task)
  - [Service](#service)
  - [Cluster](#cluster)
  - [Container Instance](#container-instance)

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
