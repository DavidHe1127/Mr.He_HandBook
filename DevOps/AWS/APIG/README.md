## APIG

- [Prime Book](https://www.alexdebrie.com/posts/api-gateway-elements/#roadmap-the-three-basic-parts)

### Integrations

- `HTTP_PROXY` - connect to a public endpoint. We can implement things like rate limiting, throttling in APIG. APIG will capture and forward
all requests to the connected backend.
- `AWS_PROXY` (lambda)

### Lambda Proxy vs Lambda Integration

Lambda Proxy Integration means a) lambda receives the whole request without transformations from APIG and b) response message & status code is set in lambda.

Lambda integration does things opposite.
