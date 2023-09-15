## Cloudfront

- [s3 static website hosting](#static-website-hosting)
- [caching](#caching)
- [lambda@edge](#lambda-edge)

### Static website hosting

- Cloudfront supports 2 types of origins - s3 bucket and custom origin (a web server).
- When using a Static Website endpoint with CloudFront, you still need to have the open bucket policy, as CloudFront needs access to your objects. When configuring CloudFront origin, and you use the S3 static website URL in the Origin, it will show as a Custom Origin.

There are 2 strategies to restrict direct access to s3 origin

#### OAC (origin access control)

Defines who can access the origin. Bucket and its assets can be private and restrict access to only specific CF distribution using a bucket policy.

Key points

- s3 bucket cannot be configured as a website endpoint - don't enable static website hosting.
- Request signing MUST BE enabled. Disabling it means no OAC!!

#### Custom Header (not recommended)


Opt for this option if you don't need the artifact bucket to be private and you don't expect anything other than CloudFront to access the bucket. Warnings, this approach will also block CI's access!

Add a bucket policy to deny access to bucket objects when requests don't have `referer` header. You need to add custom headers to requests on cloudfront. `referer` is a header set by the browser to include the address of the calling site.

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

[For more information](https://repost.aws/knowledge-center/cloudfront-serve-static-website).

### Caching

- controlled by cache key you set in the distribution. Cache key is an ID for every object in the cache. When a viewer's request generates the same cache key that has a match in the cache from previous requests, the response will be served from the edge location (cache).

```
# you specify Accept-Language header and CF will include its value too for cache key
Accept-Language: en-US,en;q=0.5
```

- By default, only domain name of a distribution and url path of the requested object are included in the cache key.
For example, second request below will result in a cache hit. This is because they have same domain name (Host) and url path even though they have different Referers and Cookies. 

```
GET /content/stories/example-story.html?ref=0123abc&split-pages=false HTTP/1.1
Host: d111111abcdef8.cloudfront.net
User-Agent: Mozilla/5.0 Gecko/20100101 Firefox/68.0
Accept: text/html,*/*
Accept-Language: en-US,en
Cookie: session_id=01234abcd
Referer: https://news.example.com/

GET /content/stories/example-story.html?ref=xyz987&split-pages=true HTTP/1.1
Host: d111111abcdef8.cloudfront.net
User-Agent: Mozilla/5.0 AppleWebKit/537.36 Chrome/83.0.4103.116
Accept: text/html,*/*
Accept-Language: en-US,en
Cookie: session_id=wxyz9876
Referer: https://rss.news.example.net/
```

- Use custom cache key with cautions. DO NOT set a cache key that has millions of different variations such as `User-Agent` or `Chookies` which results in almost zero cache hit. 


### Lambda@edge

It intercepts traffic flow into CF and does some logic before forwarding them to your origin.

Use cases:

- Serving Static Website Content as Gzip Compressed Content.
