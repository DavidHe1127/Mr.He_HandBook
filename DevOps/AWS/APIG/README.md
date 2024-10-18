## APIG

- [Prime Book](https://www.alexdebrie.com/posts/api-gateway-elements/#roadmap-the-three-basic-parts)

### Stage and Deployment

- Deployment is a snapshot of your API at a point.
- Any changes to your API needs to be re-deployed except for stage settings.
- Deploying changes means associate your deployment with a stage.
- You cannot create a stage without specifying a deployment. However you can create a deployment without the stage.
- Testing feature doesn't hornor authorization/throttling settings.

### REST API vs HTTP API

REST API has more features and is more powerful than HTTP API. See [detailed comparisons](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html).

One thing to note, private integration (making APIG private and allow access from outside VPC) for REST API doesn't support using ALB.

### Integrations

- `HTTP_PROXY` - No request/response manipulations required. Only passthrough. No need to worry about integration request/response.
- `HTTP` - Integration request/response is required. Allows request/response manipulations.
- `AWS_PROXY` (lambda)

### Lambda Proxy vs Lambda Integration

Lambda Proxy Integration means a) lambda receives the whole request without transformations from APIG and b) response message & status code is set in lambda.

Lambda integration does things opposite - req/res transformations and status code are set in APIG

### REST Api endpoint types

#### Edge-optimized

- apig **remains** in the region you've deployed.
- client reqs travel to the nearest edge location first before getting sent to your regional apig via AWS private network.
- Suitable for geographically dispersed clients

#### Regional

- client requests need to traverse the public internet to reach your regional apig adding large latency if client is geographically far from your apig.
