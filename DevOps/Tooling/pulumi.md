## Pulumi

- [Facts](#facts)
- [Notes](#notes)
- [Import Resources](#import-resources)
- [Create Custom Resource](#create-custom-resource)
- [Cross-stack reference](#cross-stack-reference)
- [Refresh](#refresh)
- [Command hook with Pulumi Command](https://github.com/pulumi/pulumi-command)
- [Secret Management](#serect-management)
- [Useful commands](#useful-commands)

## Facts

- Pulumi up will never look at realistic resources but only compare your pulumi code with state file. Any diff will be reconciled.
- When updating, Pulumi tries to create new resources before destroying old ones. If there is a resource conflict issue, use `delete_before_update`.
- `pulumi login` is used for state management. i.e `pulumi login s3://parrodise-state` lets you sync your stack state to remote s3 bucket.
- Stacks will be synced back to your configured state management service like s3. i.e `stack ls`will return all stacks managed by s3.
- Provider plugins will be installed into `.pulumi/plugins` folder upon installing deps like `@pulumi/aws`. In case run into plugin related error, i.e version mismatch simply delete `plugins` folder and reinstall it.
- Unless `name` is specified in `Resource Args`, Pulumi will suffix resource with an unique UUID to identify it.
```js
new aws.ecr.Repository(
  `david-repository`, // will generate something like david-repository-e0cdd77
  {
    name: 'ecr-repo' // this will prevent uuid generation
  })
```

## Notes

- Do not use supported provider as namesapce when defining custom configs:
```
config:
  # not ok
  auth0:custom_config: dave.dev
  # ok
  auth0-configuration:custom_config: dave.dev
```
- Use `--force` to delete stack state file even if registered resources still exist. It's now your responsibility to remove resources.
- If there is any error occurred during `up`, all proposed changes will not be made.


## Import resources

- Once imported, delete `import` identifier in resources
- Must fully specify resource configs even non-functional one like resource description, failing to do so will cause `Pulumi` not to be able to find the existing resource.

## Create Custom Resource

```js
export class Foo extends pulumi.ComponentResource {
  constructor(name, args, opts) {
    // project:component to avoid naming conflicts
    super('project:Foo', name, args, opts: pulumi.ComponentResourceOptions);
    // provider not required and is inferred from provider in opts
    let siteBucket = new aws.s3.Bucket(bucketName, {}, { parent: this });
    // The call to registerOutputs typically happens at the very end of the component resource’s constructor.
    // It also tells Pulumi that the resource is done registering children resources and should be considered fully constructed
    // so always register outputs even if nothing to be registered
    this.registerOutputs({
      bucketName: siteBucket.bucketDomainName
    });
  }
}

// use it
const foo = new Foo('foo', {}, {
  provider
});

// access output property
foo.bucketName
```

## Cross-stack reference

Stacks need to reside in the same backend path. e.g `s3://david-pulumi/cross-stack-ref-test/`.

```
// reference output from stack-ref-child stack
const stackRef = new pulumi.StackReference('stack-ref-test', {
  name: 'stack-ref-child',
});
```

## Refresh

- If resources are removed in reality but their state still exists, refresh will remove the state from state file.
- If resources are removed in reality but their code still exists, refresh will add the resources back. A subsequent `up` command is still needed to make suggested changes.

## Secret Management

Either use one of built-in encryption providers i.e `awskms` and `passphrase` or use SSM secured string or Secret Manager. With built-in encryption providers option, encrypted values are kept alongside your code while the latter option, encrypted values are kept on remote storage and decrypted when used.

---

## Useful Commands/Snippets

```shell
# export state (stack)
pulumi stack export --stack auth0-configuration-dev > auth0-configuration-dev.json

# import state (stack) into an existing stack
AWS_PROFILE=david pulumi stack import --file auth0-configuration-dev.json --stack auth0-configuration-dev

# create secret. This command will create a secret entry in config file
#
# auth0:client_secret:
#    secure: xxxxxxxx
#
AWS_PROFILE=david pulumi config set --secret auth0:client_secret xjfiwLKDI

# set kms key to be used for secrets encryption/decryption
AWS_PROFILE=david pulumi stack init new-stack --secrets-provider="awskms://alias/ExampleAlias?region=us-east-1"
```
