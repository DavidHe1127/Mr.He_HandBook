## S3

- [Access object](#access-object)
- [Lifecycle rules](#lifecycle-rules)
- [Multi-part upload](#multi-part-upload)

### Access Object

Works only for public content.

```
# virtual hosted-style URL
https://bucket-name.s3.region.amazonaws.com/key-name

https://my-bucket.s3.us-west-2.amazonaws.com/puppy.png
```

### Lifecycle Rules

- Objects in S3 standard need to wait for `30` days before allowing to be moved to IA.
- When expiring (delete) objects that haven't finished their minimal stay, S3 will charge you for the whole minimal stay period. i.e Min stay for objs in Glacier storage is `90` days, and if you expire in `80` days, you will be charged for `90` days.
- `Expiration` only applies to current version of objects. It will delete objects in versioning-disabled bucket. For version-enabled buckets, `Expiration` will insert a delete marker on top of current version. This makes delete marker as the current version - "current" version becomes previous version. Now, accessing current version will return `404` as it points to delete marker. To genuinely expire versioned objects, tick `Permanently delete previous versions of objects` in rule actions. You can even turn off bucket versioning if it's not needed.
- Combined rules

> You can combine these S3 Lifecycle actions to manage an object's complete lifecycle. For example, suppose that the objects you create have a well-defined lifecycle. Initially, the objects are frequently accessed for a period of 30 days. Then, objects are infrequently accessed for up to 90 days. After that, the objects are no longer needed, so you might choose to archive or delete them. In this scenario, you can create a S3 Lifecycle rule in which you specify the initial transition action to S3 Intelligent-Tiering, S3 Standard-IA, or S3 One Zone-IA storage, another transition action to S3 Glacier storage for archiving, and an expiration action. As you move the objects from one storage class to another, you save on storage cost. For more information about cost considerations,

### Multi-part Upload

- Consider using it when object is 100M in size.
- 3 steps - initiation, parts upload, upload completion.
- Once completed by uploading multiple parts of an object, you signal S3 for completion at which point,
S3 will concatenate them into one object.
- `aws s3 cp` and other aws s3 commands that involve uploading objects into an S3 bucket (for example, aws s3 sync or aws s3 mv) also **automatically** perform a multipart upload when the object is large.
