## How to authenticate terraform to Azure

We recommend using either a `Service Principal` or `Managed Identity` when running Terraform non-interactively (such as when running Terraform in a CI server) - and authenticating using the Azure CLI when running Terraform locally.

For example, with `Service Principal` approach, you need to firstly create a service principal through `app registration` in AD, then assign a sufficient role to this service principal in `Access Control` in the selected `Subscription`.