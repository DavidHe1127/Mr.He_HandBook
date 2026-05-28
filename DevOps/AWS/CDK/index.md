## CDK

- Tokens represent values that can only be resolved at a later time in the app lifecycle. i.e `${TOKEN[Bucket.Name.1234]}`

### Best Practices

- Use props to allow full configurability for constructs and stacks. Don't use env vars - it creates hidden dependencies
- Don't change logical id on stateful resources which might result in resource replacement
- Use Aspect to enforce default security/compliance practices. Or use scp/permission boundary
- Build reusable constructs or use existing ones from construct hub
- Separate stateless and stateful resources into different stacks

### Recover from a failed deployment caused by accidental teardown of a resource from console

Typically, missing resource will cause dependant resources fail to update leaving the stack in `UPDATE_ROLLBACK_FAILED`. Choose `Continue update rollback` option from `Stack actions` dropdown, skip dependant resources and confirm. Once complete, stack should be in `UPDATE_ROLLBACK_COMPLETE` state allowing further operations. Now, changing any attribute of missing resource that will force a replacement. Re-run cdk deploy should recover the broken stack.

### Security Guide (very important)

- https://github.com/aws/aws-cdk/wiki/Security-And-Safety-Dev-Guide
