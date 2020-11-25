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
