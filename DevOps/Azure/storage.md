## Storage

- Storage Account = Unique Azure namespace
- Every object in Azure has its own web address. i.e Given a storage account called acloudguru, for blob storage, you'd have `acloudguru.blob.core.windows.net`.
- Storage account has blob containers inside it for you to store blob data in.

### types

- blob (S3), Disk (EBS), File (EFS)
- File storage use case: your on-premise file system runs out of space and you want to extend it. Or completely replace on-prem file system with it.
- Archive storage is blob storage, so the same tools will work for both.