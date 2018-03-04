## GraphQL

* [Query Resolver](#query-resolver)
* [GraphQL middleware jobs](#graphql-middleware-jobs)



### query-resolver
![Query Execution](./links/query_execution.png)

A few things to note
* Root field (user) resolver will have parent `null` since it is the first resolver
* `parent` argument in the 2nd resolvers will be `{id: 'abc', name: 'Sarah'}` which is returned from 1st resolver
* Step 3 and 4 happen in parallel
* No need for fields id and name to have resolvers, since they are really easy to be inferred by `GraphQL.js`

### graphql-middleware-jobs
Graphql middleware like `apollo-server-restify` basically does two things:
* Ensure `queries` and `mutations` included in the body of incoming POST requests can be executed by `GraphQL.js`.
It needs to parse out the query and forward it to the `graphql` function for execution.
* Attach the result of operations to the response object to be returned to the client.
