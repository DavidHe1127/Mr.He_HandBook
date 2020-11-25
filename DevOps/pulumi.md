## Pulumi

- [Key Concepts](#key-concepts)

### Key Concepts

#### Stack

An isolated, configurable, independent stack of resources. Often seen as `Pulumi.<stackname>.yaml` in your Pulumi project. One project can have as many stacks as you wish.

#### Project

Typically, a folder that contains `Pulumi.yaml` where you will have definitions of your project.

#### Provider

It enables you to isolate resources to different contexts/environments.

```js
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

```
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
