## General Tips

- Consult `Personal Health Dashboard` for AWS global level events i.e instance stopped by AWS
- Use CW `Logs Insights` to query CloudTrail events of a target service which has log group
i.e

```
fields @timestamp
| sort @timestamp desc
| filter @message like "DeleteNetworkInterface"
| fields eventName,errorCode,errorMessage,userAgent
```
- Use Athena to help with advanced query against events in CloudTrail. Steps are:
1. create a bucket to receive events.
2. create a trail and link it to bucket.
3. create an athena table with the added bucket.

After debugging, turn off logging in trail so that bucket size will stop growing.

- [Service Authorization Ref](https://docs.aws.amazon.com/service-authorization/latest/reference/list_identityandaccessmanagement.html)
