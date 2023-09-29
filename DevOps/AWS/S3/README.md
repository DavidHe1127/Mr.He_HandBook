## S3

- [Access object](#access-object)
- [ACL](#acl)
- [Temp access to an object]
- [Lifecycle rules](#lifecycle-rules)
- [Access only specific folder](#access-only-specific-folder)
- [Reduce cost by using a bucket key](#reduce-cost-by-using-a-bucket-key)
- [Multi-part upload](#multi-part-upload)
- [Troubleshooting](#troubleshooting)

### Access Object

Works only for public content.

```
# virtual hosted-style URL
https://bucket-name.s3.region.amazonaws.com/key-name

https://my-bucket.s3.us-west-2.amazonaws.com/puppy.png
```

### ACL

- ACL controls who is granted what access to which resources (bucket/objects). However, a majority of modern use cases in Amazon S3 no longer require the use of ACLs. So it should be disabled as recommended which means bucket owner owns all objects no matter who uploads them.
- Except in unusual circumstances where you need to control access for each object individually.
- When you create a bucket or an object, Amazon S3 creates a default ACL that grants the resource owner full control over the resource.

### Temp access to an object

Generate presigned url to give unauthorised person temp access to objects in a bucket.

```
aws s3 presign s3://bucket-name/object-key --expires-in 3600
```

### Lifecycle Rules

- Objects in S3 standard need to wait for `30` days before allowing to be moved to IA.
- When expiring (delete) objects that haven't finished their minimal stay, S3 will charge you for the whole minimal stay period. i.e Min stay for objs in Glacier storage is `90` days, and if you expire in `80` days, you will be charged for `90` days.
- `Expiration` only applies to current version of objects. It will delete objects in versioning-disabled bucket. For version-enabled buckets, `Expiration` will insert a delete marker on top of current version. This makes delete marker as the current version - "current" version becomes previous version. Now, accessing current version will return `404` as it points to delete marker. To genuinely expire versioned objects, tick `Permanently delete previous versions of objects` in rule actions. You can even turn off bucket versioning if it's not needed.
- Combined rules

> You can combine these S3 Lifecycle actions to manage an object's complete lifecycle. For example, suppose that the objects you create have a well-defined lifecycle. Initially, the objects are frequently accessed for a period of 30 days. Then, objects are infrequently accessed for up to 90 days. After that, the objects are no longer needed, so you might choose to archive or delete them. In this scenario, you can create a S3 Lifecycle rule in which you specify the initial transition action to S3 Intelligent-Tiering, S3 Standard-IA, or S3 One Zone-IA storage, another transition action to S3 Glacier storage for archiving, and an expiration action. As you move the objects from one storage class to another, you save on storage cost. For more information about cost considerations,

### Access only specific folder

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": ["s3:ListBucket"],
      "Effect": "Allow",
      "Resource": ["arn:aws:s3:::mybucket"],
      "Condition": {"StringLike": {"s3:prefix": ["folder1/*"]}}
    },
    {
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Effect": "Allow",
      "Resource": ["arn:aws:s3:::mybucket/folder1/*"]
    }
  ]
}
```
Things to note:
- `ListBucket` that allows listing a bucket operates on the bucket itself (not a path). To restrict access to a specific folder, it's must be set via `s3:prefix`.
- `GetObject` and `PutObject` operate against objects, so the folder can be referenced in the ARN.

### Reduce cost by using a bucket key

Reducing the cost of SSE-KMS with Amazon S3 Bucket Keys. You don't need a bucket key if encryption is Server-side encryption with Amazon S3 managed keys (SSE-S3).

### Multi-part Upload

- Consider using it when object is 100M in size.
- 3 steps - initiation, parts upload, upload completion.
- Once completed by uploading multiple parts of an object, you signal S3 for completion at which point,
S3 will concatenate them into one object.
- `aws s3 cp` and other aws s3 commands that involve uploading objects into an S3 bucket (for example, aws s3 sync or aws s3 mv) also **automatically** perform a multipart upload when the object is large.

### Troulbeshooting

#### Error putting S3 policy: MalformedPolicy: Policy has invalid resource when trying to update bucket policy
Most likely, the resource in the policy doesn't match target bucket's name

