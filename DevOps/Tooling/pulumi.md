## Pulumi

- [Key Concepts](#key-concepts)
- [Facts](#facts)
- [Useful commands](#useful-commands)

### Key Concepts

#### Stack

An isolated, configurable, independent stack of resources. Often seen as `Pulumi.<stackname>.yaml` in your Pulumi project. One project can have as many stacks as you wish.

#### Project

Typically, a folder that contains `Pulumi.yaml` where you will have definitions of your project.

#### Provider

It enables you to isolate resources to different contexts/environments.

```javascript
export const commonProvider = new aws.Provider('dev-ap-southeast-2', {
  region: 'ap-southeast-2',
  profile: 'dev',
});

// cert will be created in ap-southeast-2 under profile dev
let cert = new aws.acm.Certificate("cert", {
    domainName: "foo.com",
    validationMethod: "EMAIL",
}, { provider: commonProvider });

export const provider = new aws.Provider('provider', {
  region: queueRegion,
  profile: queueProfile,
});
```

#### Config

Reads stack infor from `Pulumi.xxx.yaml`. Below example shows how you can use it.

```javascript
// specify stack to use
pulumi up --stack david-test --non-interactive --yes

// Pulumi.david-test.yaml
encryptionsalt: v1:B81Mi6D2s7M=:v1:ZTQVujaJ5Lft2r8K:Ni6SJqmKCeqNdcPmPD2fZP4f7JJJ3A==
config:
  aws:profile: david-dev
  aws:region: ap-southeast-2

// get docker-version
const config = new Config('aws');
// get profile and throw error if not found
config.require('profile');
// get region
config.get('region');
```

---

## Facts

- `pulumi login` is used for state management. i.e `pulumi login s3://kasada-pulumi-state-mgmt` lets you sync your stack state to remote s3 bucket.
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

---

## Useful Commands

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
