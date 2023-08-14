## Access Control

- [App registration](#application-in-azure-ad)
- [Azure Roles vs Azure RBAC](#azure-roles-vs-azure-rbac)
- [AD Tenant](#ad-tenant)
- [RBAC](#rbac)

### Application in Azure AD

An application could be a web frontend, an API server, a function app etc. For an application to be authenticated/authorised to interact with other Azure resources, it needs to be registered in AD - namely App registrations. Upon registration, an application container created alongside 2 objects:

- application object that represents your app. This object holds all the app settings.
- service principal that acts as an `identity entity` for your application. It's your application's service principal if your application needs to access other resources.

Example use cases

- Allow Azure DevOps to access your subscription
- Want to access key vault service from within a VM

### Azure Roles vs Azure RBAC

Azure roles are used to control access of AD Resources such as users, groups. While Azure RBAC is used to control access to Azure resources.

### AD Tenant

In simpler terms, an Azure AD tenant is like an organization's user directory or identity store in the cloud. When an organization signs up for Microsoft Azure, they are automatically assigned an Azure AD tenant. This tenant is unique to that organization and is used to store and manage information about its users, groups, and applications.

### RBAC

It includes

- Security Principal - who has access. can be an user, a group of users, a service or managed identity
- Scope - how much access
- Role Definition

Role assignment grants the access

![Role assignment](https://learn.microsoft.com/en-us/azure/role-based-access-control/media/overview/rbac-overview.png)