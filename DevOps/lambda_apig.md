## Lambda

* [Versioning and Alias](#versioning-alias)

### versioning-alias
* Unless you publish a version, lambda creates and maintains only one version `$LATEST`. To reference it, use qualified ARN:
`arn:aws:lambda:aws-region:acct-id:function:helloworld:$LATEST`.
* Serverless framework publishes a version by default. Version starts with `1` and increments its value by 1 on each function update. Version numbers are never reused.
* Alias is like a pointer to a specific Lambda function version.
Use case
```
Easier support for promotion of new versions of Lambda functions and rollback when needed – After initially creating a Lambda function (the $LATEST version), you can publish a version 1 of it. By creating an alias named PROD that points to version 1, you can now use the PROD alias to invoke version 1 of the Lambda function.

Now, you can update the code (the $LATEST version) with all of your improvements, and then publish another stable and improved version (version 2). You can promote version 2 to production by remapping the PROD alias so that it points to version 2. If you find something wrong, you can easily roll back the production version to version 1 by remapping the PROD alias so that it points to version 1.
```
* ![versioning_aliasing](#versioning_aliasing.png)
