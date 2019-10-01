## Architecture Design pattern, scaling strategies and more

- [Microsoft architecture design pattern](#microsoft-architecture-design-pattern)
- [Communication strategies between microservices](#communication-between-microservices)
- [Scaling applications in the cloud](#scaling-applications)

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
  - cache i.e redis used to cache DB query results.
  - Elasticsearch - store predefined `search queries` and `their results` in memory.
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
