## Event Bridge

### cross-account access

- Publisher needs to grant receiver perms to manage event rules in publisher account.
- Receiver needs to have an IAM role to allow publisher to publish messages to receiver event bus.
- Receiver needs an event rule to route events to different places

For more see:

- [Resource-based policy EventBus](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-use-resource-based.html)
- [Cross-account access blog post](https://github.com/aws-samples/amazon-eventbridge-resource-policy-samples/tree/main/blog)
