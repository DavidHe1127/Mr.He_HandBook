## GraphQL

- [graphql-unfriendly use cases](#graphql-unfriendly-use-cases)
- [Query Resolver](#query-resolver)
- [GraphQL middleware jobs](#graphql-middleware-role)
- [N+1 problem](#n+1-problem)
- [Resolver Deisgn](#resolver-design)
- [Custom Scalar Type](#custom-scalar-type)
- [Pass vars to mutation/query in playground](#pass-vars-in-playground)
- [Field argument](#field-argument)
- [Fetch schema from remote](#fetch-schema-from-remote)
- [Fragments](#fragments)
- [Schema design tips](#schema-design-tips)

### Graphql-unfriendly use cases

Weigh up the usage of graphql when dealing with below use cases:

- Recurisve data - tree-structure menu with any depth
- Arbitrary data - free-form data i.e arbitrary values contained object

### Query Resolver
![Query Execution](./query_execution.png)

A few things to note

- Root field (user) resolver will have parent `null` since it is the first resolver
- `parent` argument in the 2nd resolvers will be `{id: 'abc', name: 'Sarah'}` which is returned from 1st resolver
- Step 3 and 4 happen in parallel
- No need for fields id and name to have resolvers, since they are really easy to be inferred by `GraphQL.js`
- If a field is another type, then the resolver for that type will be run to resolve it until the scalar type is finally reached
- GraphQL server has a default resolver will look in root to find a property with the same name as the field. So you don't have to specify resolvers for every single filed:

```graphql
query user {
  user {
    name # don't need a resolver and default resolver will find out what needs to return by looking at root - which is user object containing name field
  }
}
```

### Graphql Middleware Role

Graphql middleware like `apollo-server-restify` basically does two things:

- Ensure `queries` and `mutations` included in the body of incoming POST requests can be executed by `GraphQL.js`.
  It needs to parse out the query and forward it to the `graphql` function for execution.
- Attach the result of operations to the response object to be returned to the client.

### N+1 Problem

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
  allUsers {
    # Fetch N users
    id
    address {
      # Another 1 query to fetch address for each one of N users
      id
      street
    }
  }
}
```

As you would expect, `User.address` resolver is executed `N` times resulting in multiple access to data store!!!

### Resolver Design

Don't do this:

```graphql
export default {
  Query: {
    event: async (root, { id }) => await getEvent(id)
  },
  Event: {
    attendees: async (root, { id }) => await getAttendeesFromEvent(id)
  }
}
```

Do this:

```graphql
export default {
  Query: {
    event: (root, { id }) => ({ id })
  },
  Event: {
    title: async ({ id }) => {
      const {title} = await getEvent(id);
    },
    attendees: async ({ id }) => await getAttendeesFromEvent(id)
  }
}
```

The problem with first design is you still need to fetch entire event object even though users only ask for event attendees. i.e

```graphql
{
  event(id: "xxx") {
    attendees
  }
}
```

### Custom Scalar Type

```js
// First, create a new scalar type
const Image = new GraphQLScalarType({
  name: 'Image',
  description: 'An Image Scalar',
  serialize: value => isImage(value),
  parseLiteral: ast => {},
  parseValue: value => value
});

// Second, define it in resolver
const resolvers = {
  Image: Image,
  Query: {
    image: () =>
      'https://uploads.codesandbox.io/uploads/user/8d35d7c1-eecb-4aad-87b0-c22d30d12081/l2nh-cat.jpeg',
    notImage: () => 'https://codesandbox.io/s/4qlo54l7k9'
  }
};

// third, use it!
const schemaString = `
  scalar Image

  type Query {
    image: Image,
    notImage: Image
  }
`;

const jsSchema = makeExecutableSchema({
  typeDefs: schemaString,
  resolvers: resolvers
});
```

- `serialize` - called when the value of the type is going to be sent to the client as a response.
- `parseLiteral` - called when reading input from inline:
  ```graphql
  query {
    allUsers(first: 10) {
      id
    }
  }
  ```
  Input value will be transformed to AST which is then served as input to the function. Parsed value needs to be returned as a result.
- `parseValue` - called when input value is fed through JSON:

  ```graphql
  query ($howMany: YourCustomType) {
    users(first: $howMany) {
      id
    }
  }

  // vars
  {
    "howMany": {
      "thisMany": 10
    }
  }
  ```

  Function gets the input as JSON and returns whatever the query resolver should use.

Basically, you need to implement both methods in order for input to be correctly retrieved.
[Create custom GraphQL types](https://medium.com/yld-engineering-blog/create-custom-graphql-types-999f009d3f46)

### Pass vars in playground

```graphql
mutation addNavMenu($input: createNavMenuInput!) {
  putNavMenu(input: $input) {
    message
  }
}
```

vars

```graphql
{
  "input": {
      "navMenu": [
        { "id": "me1", "title": "Menu Expander 1" },
        { "id": "me2", "title": "Menu Expander 2" }
      ],
    "profileId": "789"
  }
}
```

### Field argument

```graphql
type Query {
    course(id: Int!): Course
}

type Course {
    id: Int!
    title: String!
    author(lowercase: Boolean! = true): String!
}

// query
{
  course(id: 1) {
    title
    author(lowercase: false)
  }
}
```

### Fetch schema from remote

Consider tools like [this](https://github.com/prisma/get-graphql-schema) to fetch schema remotely when you want to centralize your schema in one place for the sake of maintenance.

### Fragments

Two different use cases:

1. Incorporating a fragment by reference

```graphql
query Foo {
  user(id: 4) {
    ...userFields
  }
}

fragment userFields on User {
  name
  sex
}

// compiled down to

query Foo {
  user(id: 4) {
    name
    sex
  }
}
```

2. Inline fragments

```graphql
interface Node {
  id: ID!
  createdAt: DateTime!
  updatedAt: DateTime
}

type Galaxy implements Node {
  id: ID!
  createdAt: DateTime!
  updatedAt: DateTime
  name: String
  planets: [Planet]
  stars: [Star]
}

type Star implements Node {
  id: ID!
  createdAt: DateTime!
  updatedAt: DateTime
  name: String
  class: StellarClassEnum
}

type Query {
  node(
    id: ID!
  ): Node
}

// query
query getPlanet($id: ID!) {
  node(id: $id) {
    ... on Galaxy {
      id
      name
      description
      createdAt
      updatedAt
    }

    ... on Star {
      id
      name
      description
    }
  }
}
```

Server will determine whether to return `Galaxy` or `Star` at the runtime based on whether the requested object is a `Galaxy` or `Star`.

Read [this](https://www.apollographql.com/docs/apollo-server/features/unions-interfaces/) for resolver implementation which is able to figure out what type it needs to resolve to with little help from `__resolveType` field.

### Schema design tips

- Prefer Object types over simpler structure

```graphql
# bad
type CalendarEvent {
  name: String!
  owner: User!
  # first item is start, second item is end
  timeRange: [DateTime!]!
  timeRangeInPast: Boolean!
}

# good
type CalendarEvent {
  name: String!
  owner: User!
  timeRange: TimeRange!
}

type TimeRange {
  start: DateTime!
  end: DateTime!
  isInPast: Boolean!
}
```

- be specific with naming

```graphql
# bad! Generic name means if we introduce another comment stuff, we then need to be specific to avoid collision
# Not only that, we also lose the ease of remembering what Comment is about - a Post comment or a Photo comment?
type Comment {
  name: String!
}

# good
type PostComment {
  name: String!
}

type PhotoComment {
  name: String!
}
```

- avoid overusing custom scalars

Recursive data structure is hard to model in Graphql. i.e tree-structure menu. It's tempting for us to use Custom Scalar to address modeling. However, introduction of Custom Scalar sources a few problems:

1. Lose introspection ability - clients cannot work out the data shape i.e what fields and their types are available.
2. Server does not know how this data is used by our integrators. Cannot deprecate custom scalars.












