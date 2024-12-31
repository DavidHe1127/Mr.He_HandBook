0## S3

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

- ACL controls who is granted what access to which resources (bucket or objects). However, a majority of modern use cases in Amazon S3 no longer require the use of ACLs. So it should be disabled as recommended which means bucket owner owns all objects no matter who uploads them. Except in unusual circumstances where you need to control access for each object individually.
- When you create a bucket or an object, Amazon S3 creates a default ACL that grants the resource owner full control over the resource.

### Temp access to an object

Generate presigned url to give unauthorised person temp access to objects in a bucket.

```
aws s3 presign s3://bucket-name/object-key --expires-in 3600
```

### Lifecycle Rules

`expiredObjectDeleteMarker` controls whether or not delete marder should be deleted when no non-current versions of an object exist. This works for current version of an object. To deal with non-current versions, use `noncurrentVersionExpiration`.

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

#### [Access denied when uploading an object](https://repost.aws/knowledge-center/s3-403-forbidden-error)

