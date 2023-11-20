## Pipeline

### Basics

- `Release` is a classic way of doing CD. A modern way is to use `Pipeline` (yaml file) to configure both CI/CD.
- Stage has jobs which include steps (tasks). Task is pre-packaged script that performs a specific action.
- Resource Manager Service Conn is a configuration that allows ADO pipelines to securely connect and interact with Azure resources such as a subscription. You must specify the service principal you want to use to connect to Azure. Service Principal is an application within Azure Entra ID, which is authorized to access resources in Azure. This access is restricted by the roles assigned to the service principal, giving you control over which resources can be accessed and at which level. Think of App as a service account.
- `Release` pipeline allows you to specify source of build artifact e.g choosing another repo where a build pipeline is configured to build & publish app artifacts. It can automatically discover the artifact and use it for other tasks. You must include a `Publish Artifacts` task in your build pipeline.
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