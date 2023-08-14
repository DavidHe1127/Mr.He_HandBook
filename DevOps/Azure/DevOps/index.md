## Pipeline

### Basics

- `Release` is a classic way of doing CD. A modern way is to use `Pipeline` (yaml file) to configure both CI/CD.
- Stage has jobs which include steps (tasks). Task is pre-packaged script that performs a specific action.
- Resource Manager Service Conn is a configuration that allows ADO pipelines to securely connect and interact with Azure resources such as a subscription. You must specify the service principal you want to use to connect to Azure. Service Principal is an application within Azure Active Directory, which is authorized to access resources in Azure. This access is restricted by the roles assigned to the service principal, giving you control over which resources can be accessed and at which level. Think of App as a service account.
