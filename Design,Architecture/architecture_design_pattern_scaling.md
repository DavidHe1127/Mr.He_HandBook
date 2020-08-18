## Architecture Design pattern, scaling strategies and more

- [Microsoft architecture design pattern](#microsoft-architecture-design-pattern)
- [Communication strategies between microservices](#communication-between-microservices)
- [Scaling applications in the cloud](#scaling-applications)
- [Best practices for Developing a Node server](#best-practice-for-developing-node-server)
- [Single source of truth](#single-source-of-truth)
- [Federation Architecture](#federation-architecture)

### Microsoft Architecture Design Pattern

[Microsoft Architecture Design Pattern](https://docs.microsoft.com/en-us/azure/architecture/patterns/bulkhead)

### Communication between microservices

- REST over HTTP(S)
- Messaging over Message Broker (one caveat: single-point-of-failure)
- RPC (cross-language or single-language)

### scaling-applications

- Scaling the web app
  - Vertical scaling - i.e 8GB RAM I3 upgraded to 512GB RAM I7.
  - Horizontal scaling - i.e multiple VM instances.
  - Load balancer placed in front of N vms. Different routing strategies - Round Robin, weighted response time etc.
  - CDN - useful when caching static content files i.e html, css, js.
  - cache i.e key-value pair store such as redis which is used to cache DB query results.
  - Elasticsearch - a full-text search tech. store predefined `search queries` and `their results` in memory.
  - Separate api and frontend
  - Microservices in containers - each single microservice is scalable by itself using orchestrator such as Swarm and K8s.
  - Lambdas (serverless) - use FaaS.
  - Azure API Management - distribute load on different API endpoints or microservices.
  - Event Bus - communication between services is done by dispatching messages. Benefit is message is still available in the       queue even if service is down at the time. Downside is single point of failure - when event bus service is crashed.
  - Pushing tasks to the client side - i.e image resizing
  - Use 3rd service - i.e call a 3rd service for image resizing
  - Caching repeatable HTTP requests and responses - [HTTP Caching](https://github.com/DavidHe1127/Mr.He_HandBook/blob/master/Web%2CNetworking/web_caching.md)

- Scaling the database
  - Cache data queries - buffer cache
  - Table indexing
  - Replicate database (ReadWrite/Read)
  - Sharding
  - Domain Drive Design (DDD) - one db per microservice. That way each db/service can be developed and deployed independently
  - Choose right DB - DynamoDB good for fast read/comparatively slow write. Not good for ad-hoc queries. DynamoDB is OLTP (On-line Transaction Processing) suitable.  SQL on the flip side, like PostgreSQL is more suitable for OLAP heavy requirement (On-line Analytical Processing) which involves lots of ad-hoc queries, complicated queries, aggregated results.

Quoted from [Scaling Applications in the Cloud](https://medium.com/faun/scaling-applications-in-the-cloud-52bb6dfbac4e)

### Best practice for developing Node server

1. Write quality Node.js
  - linting, formatting, type-checking
2. Write a gradient of tests
  - Identify key modules. Write intensive tests for them.
  - Identify "happy path" edge cases and make sure they are covered.
  - Minimal UI testing given its constant-changing nature.
  - Write test for bug fixes!!!
  - Write a few integration tests.
  - Write fewer E2E tests. Cover key paths in your site. For instance, write tests for login, add-to-cart and checkout if it's a online shopping site.

  **The whole point of writing tests is give your confidence to deployment.**
3. Design for stateless. That way it's easy to horizontally scale your app since traffic can be distributed across a group of instances to be served. Rather than being tied to a specific server.
4. Deploy early, deploy often.
  - Deploy 2 servers right away. This helps you spot issues with horizontal scaling.
5. Use Queue(Message bus)
6. Microservices and containers at scale
  - Docker-compose to wire up all independent microservices and spin them up altogether for app local run.
  - K8S to deploy them altogether as a unit in production. [Use Draft - yeoman equivalent for k8s ](https://draft.sh/#whats-draft)
7. Gather services metrics
8. Keep secrets/params in the right place
  - Consider [SSM](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html)

### Single source of truth

- Never hold duplicate data in the app state
- Never store derived data in the state - Any derived data found in the store violates the principle because updates have to made to multiple locations to maintain consistency. Use selector instead.

```js
function filteredProductIds(state, filter) {
  return _.keys(_.pickBy(state.productsById, (product) => {
    if (filter == "ALL_PRODUCTS") return true;
    if (filter == "NO_DISCOUNTS" && product.discount == 0) return true;
    if (filter == "ONLY_DISCOUNTS" && product.discount > 0) return true;
    return false;
  }));  
}
```

- Normalise data

```js
// original from server
{
  "total": 1,
  "offset": 0,
  "orders": [
    {
      "id": "14e743f8-8fa5-4520-be62-4339551383b5",
      "customer": "John Smith",
      "products": [
        {
          "id": "88cd7621-d3e1-42b7-b2b8-8ca82cdac2f0",
          "title": "Blue Shirt",
          "price": 9.99,
          "giftWrap": true,
          "notes": "It's a gift, please remove price tag"
        }
      ],
      "totalPrice": 9.99
    }
  ]
}

// normalised 
{
  "productsById": {
    "88cd7621-d3e1-42b7-b2b8-8ca82cdac2f0": {
      "title": "Blue Shirt",
      "price": 9.99
    },
    "aec17a8e-4793-4687-9be4-02a6cf305590": {
      "title": "Red Hat",
      "price": 7.99
    }
  },
  "ordersById": {
    "14e743f8-8fa5-4520-be62-4339551383b5": {
      "customer": "John Smith",
      "products": {
        "88cd7621-d3e1-42b7-b2b8-8ca82cdac2f0": {
          "giftWrap": true,
          "notes": "It's a gift, please remove price tag"
        }
      },
      "totalPrice": 9.99
    }
  }
}
```
Use [normalizr](https://github.com/paularmstrong/normalizr)

### Federation Architecture

In software engineering context, a federation architecture means allowing interoperability and information sharing among each autonomous system or application in the whole landscape. A example of this is [Apollo Federation Graphql](https://www.apollographql.com/docs/apollo-server/federation/introduction/)