## Azure

### Resource Structure Management

![mgmt](./diagrams/mgmt.jpg)

- Management group <-> AWS OU in the Org
- Subscription <-> AWS Accounts
- Resource Group <-> similar to CFN but not the same. We don't have something similar in AWS

### Azure Roles vs Azure RBAC

Azure roles are used to control access of AD Resources such as users, groups. While Azure RBAC is used to control access to Azure resources.

### Service Plan

An App Service plan defines a set of compute resources for a web app to run.

### App Service

Azure App Service is a fully managed platform as a service (PaaS) for hosting web applications such as REST APIs, and mobile back ends.

### AD Tenant

In simpler terms, an Azure AD tenant is like an organization's user directory or identity store in the cloud. When an organization signs up for Microsoft Azure, they are automatically assigned an Azure AD tenant. This tenant is unique to that organization and is used to store and manage information about its users, groups, and applications.

### Management Group

If your organization has many Azure subscriptions, you may need a way to efficiently manage access, policies, and compliance for those subscriptions. Management groups provide a governance scope above subscriptions. You organize subscriptions into management groups; the governance conditions you apply cascade by inheritance to all associated subscriptions.

Use case scenarios:

- Apply policies to a mgmt group to restrict regions VM can be created in. This policy would be applied to all nested mgmt groups, subscriptions and resources.
- Allow users to have access to multiple subscriptions. e.g Move them under a mgmt group and create an Azure role assignment there.
