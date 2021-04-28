## S3

- [Access object](#access-object)
- [Multi-part upload](#multi-part-upload)

### Access Object

Works only for public content.

```
# virtual hosted-style URL
https://bucket-name.s3.region.amazonaws.com/key-name

https://my-bucket.s3.us-west-2.amazonaws.com/puppy.png
```

### Multi-part Upload

- Consider using it when object is 100M in size.
- 3 steps - initiation, parts upload, upload completion.
- Once completed by uploading multiple parts of an object, you signal S3 for completion at which point,
S3 will concatenate them into one object.
