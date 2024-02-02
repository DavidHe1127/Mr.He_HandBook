# Authentication & Authorization

## How to authenticate terraform to Azure

We recommend using either a `Service Principal` or `Managed Identity` when running Terraform non-interactively (such as when running Terraform in a CI server) - and authenticating using the Azure CLI when running Terraform locally.

For example, with `Service Principal` approach, you need to firstly create a service principal through `app registration` in AD, then assign a sufficient role to this service principal in `Access Control` in the selected `Subscription`.

## Migrate legacy applications to Azure

Use Active Directory Domain Services (Azure AD DS)

- A `managed` Active Directory Domain Services.
- Provides classic AD features in a managed service including Group Policy, LDAP, Kereros, domain join.
- Standalone domain **NOT** extension of on-premises AD domain.

## Managed Identity vs Service Principal

- `Service Principal` is an app whose tokens can be used to authenticate and grant access to specific Azure resources from a user-app, service or automation tool, when an organization is using Azure Active Directory.
- `Managed Identities` are in essence 100% identical in functionality and use case compared with `Service Principals`. In fact, they are actually Service Principals.
- What makes `Managed Identities` different though, is: **They are always linked to an Azure Resource**, not to an application or 3rd party connector – They are automatically created for you so you no need for credential management.

For more see [Demystifying service principals managed identities](https://devblogs.microsoft.com/devops/demystifying-service-principals-managed-identities/).
