## Cloudfront

- [s3 static website hosting](#static-website-hosting)
- [lambda@edge](#lambda-edge)

### Static website hosting

- Cloudfront supports 2 types of origins - s3 bucket and custom origin (a web server).
- With s3 bucket origin, use s3 website endpoint rather than s3 rest api endpoint for origin domain when creating a new origin. (recommended by AWS)
- To restrict direct access to s3 origin, add a bucket policy to deny access to bucket objects when requests don't have `referer` header. You need to add custom headers to requests on cloudfront. `referer` is a header set by the browser to include the address of the calling site.

```
{
    "Version": "2012-10-17",
    "Id": "HTTP referer policy example",
    "Statement": [
        {
            "Sid": "test referer header",
            "Effect": "Deny",
            "Principal": "*",
            "Action": [
                "s3:GetObject",
                "s3:GetObjectVersion"
            ],
            "Resource": "arn:aws:s3:::your-website-artifact/*",
            "Condition": {
                "StringNotLike": {
                    "aws:Referer": "CUSTOM_REFERER_HEADER"
                }
            }
        }
    ]
}
```

References

- https://repost.aws/knowledge-center/s3-website-cloudfront-error-403
- https://repost.aws/knowledge-center/cloudfront-serve-static-website

### Lambda@edge

Lambda@Edge is a service that allows you to execute Lambda functions that modify the behaviour of CloudFront specifically. Lambda@Edge simply runs during the request cycle and makes logical decisions that affect the delivery of the CloudFront content.

Use cases:

- Serving Static Website Content as Gzip Compressed Content.
