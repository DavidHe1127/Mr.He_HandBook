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

## Application and Service Principal

- like class (app) and instance (service principal) in OO.
- When you register your application with Microsoft Entra ID, you're creating an identity configuration for your application that allows it to integrate with Microsoft Entra ID.
- An application object is used as a template to create one or more service principal objects in every tenant where the application is used. The service principal object defines what the app can actually do in a specific tenant, who can access the app, and what resources the app can access.
- The service principal object defines what the app can actually do in the specific tenant, who can access the app, and what resources the app can access.
- Visit `Enterprise applications` for all managed service principals. 