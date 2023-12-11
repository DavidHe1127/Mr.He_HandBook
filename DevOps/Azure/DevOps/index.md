## Pipeline

### Basics

- Resource Manager Service Conn is a configuration that allows ADO pipelines to securely connect and interact with Azure resources such as a subscription. You must specify the service principal you want to use to connect to Azure. Service Principal is an application within Azure Entra ID, which is authorized to access resources in Azure. This access is restricted by the roles assigned to the service principal, giving you control over which resources can be accessed and at which level. Think of App as a service account.
- Release pipeline supports release creation automation triggered by a new build artifact. However, creating a new release doesn't mean publish apps to different stages - you'd need to set up triggers for app to be deployed to stages.
- Use `pipeline artifact` when using yaml pipeline. Use `build artifact` only for classic pipeline as it's older and slower in terms of artifact upload/download.

```
# pipeline artifact
- task: PublishPipelineArtifact@1
  displayName: 'Publish pipeline artifact'
  ...


# build artifact
- task: PublishBuildArtifacts@1
  inputs:
    pathtoPublish: '$(Build.ArtifactStagingDirectory)'
    artifactName: drop
  ...
```

- ADO pipeline supports self-hosted agents - bring your own machine and install agent on it.

### Environments

- ADO environments aren't available in classic pipelines. For classic pipelines, deployment groups offer similar functionality.


### Variables & Variable Group

- Secret variables (encrypted variables and key vault variables) cannot be accessed directly in scripts,instead, they must be passed as arguments to a task.
