## Serverless

- [Thin handler](#thin_handler)
- [Supply event payload](#supply_event_payload)
- [Use Terraform with Serverless](#terraform-with-serverless)
- [Use WAF to protect your service](#use-waf-to-protect-your-service)

### Thin handler

Handler should be as thin as possible and reference utils/modules sitting in different files than handler. If those modules are adequately unit tested, then testing the serverless part of your application (i.e., the handlers) will be easy during the integration tests.

```js
// need to be covered as much as possible by unit tests
const utils = require('../utils');

const createUser = (event, context) => {
  const user = utils.CreateUser(event.user);
  const avatarUrl = utils.updateAvatar(user);

  return {
    statusCode: 200,
    body: 'User Created!'
  };
};
```

### Supply Event Payload

You can supply a mock file as event payload by calling cli. Helpful when your lambda is triggered by another service - i.e file upload to s3. By doing this, no need to upload a file to s3 over and over again to trigger your lambda with event payload returned from file upload.

```shell
$ sls invoke -f resizeImage -p mock.json
```

### Terraform with Serverless

Create resources through terraform and export them to SSM (Systems Manager Parameter Store). Then you can reference them in serverless.

```js
apns_platform: ${ssm:/${self:service}-${opt:stage, 'dev'}/sns/apns/platform}
```

[Integrate terraform into serverless](https://medium.com/swlh/integrating-the-serverless-framework-and-terraform-874215daa8bf)

### Use WAF to protect your service

> AWS WAF gives you control over which traffic to allow or block to your web applications by defining customizable web security rules.
