## CDK

- A construct can represent a single AWS resource or an abstraction of multiple AWS resources
- An env in cdk represents an unique combination of account/region
- Context is the way for CDK to cache values retrieved from AWS during synthesis so CDK will keep using the same value. The goal is to prevent unintended changes.
- Asset are files, lambda source code, docker images that can be bundled into your app. CDK generates them into `cdk.out` directory during synthesis.
- Tokens represent values that can only be resolved at a later time in the app lifecycle. i.e `${TOKEN[Bucket.Name.1234]}`

### Best Practices

- Use props to allow full configurability for constructs and stacks. Don't use env vars - it creates hidden dependencies
- Don't change logical id on stateful resources which might result in resource replacement
- Use Aspect to enforce default security/compliance practices. Or use scp/permission boundary
- Build reusable constructs or use existing ones from construct hub
- Separate stateless and stateful resources into different stacks

