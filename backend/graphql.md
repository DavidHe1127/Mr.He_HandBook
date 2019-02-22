## GraphQL

* [Query Resolver](#query-resolver)
* [GraphQL middleware jobs](#graphql-middleware-jobs)
* [N+1 problem](#n+1-problem)

### query-resolver
![Query Execution](./links/query_execution.png)

A few things to note
* Root field (user) resolver will have parent `null` since it is the first resolver
* `parent` argument in the 2nd resolvers will be `{id: 'abc', name: 'Sarah'}` which is returned from 1st resolver
* Step 3 and 4 happen in parallel
* No need for fields id and name to have resolvers, since they are really easy to be inferred by `GraphQL.js`
* If a field is another type, then the resolver for that type will be run to resolve it until the scalar type is finally reached

### graphql-middleware-jobs
Graphql middleware like `apollo-server-restify` basically does two things:
* Ensure `queries` and `mutations` included in the body of incoming POST requests can be executed by `GraphQL.js`.
It needs to parse out the query and forward it to the `graphql` function for execution.
* Attach the result of operations to the response object to be returned to the client.

### n+1-problem
Say you have schema and resolvers as follow:

```graphql
type User {
  id: ID
  address: Address
}
type Address {
  id: ID
  street: String
  city: String
}
```

```graphql
const resolvers = {
  query: {
    allUsers: (root) => {
      return db.users.all()
    }
  },
  User: {
    address: (user) => {
      return db.addresses.fromId(user.addressId)
    }
  }
}
```

And you query like this:

```graphql
query getUserList {
  allUsers {         # fetches users (1 query)
    id
    address {        # fetches address for each user (N queries for N users)
      id
      street
    }
  }
}
```

As you would expect, `User.address` resolver is executed `N` times resulting in multiple access to data store!!!
