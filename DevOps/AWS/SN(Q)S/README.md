# SNS/SQS

## SNS

- Topic Owner's privileges cannot be removed from topic policy.
- There isn't a way to access messages sent to SNS
- SNS allows subscriptions from a different account than topic owner. Cross-account access is also possible with EventBridge.
Downside of using SNS is it doesn't support event filtering via event pattern - event receiver cannot filter out unwanted events from publisher while EventBridge supports it.
