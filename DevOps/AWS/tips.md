## General Tips

- Consult `Personal Health Dashboard` for AWS global level events i.e instance stopped by AWS
- Use CW `Logs Insights` to query CloudTrail events.
i.e

```
fields @timestamp
| sort @timestamp desc
| filter @message like "DeleteNetworkInterface"
| fields eventName,errorCode,errorMessage,userAgent
```
