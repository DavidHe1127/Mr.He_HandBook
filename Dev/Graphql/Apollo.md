## Apollo

- [Considerations when working with Fragments on unions and interfaces](#fragments-on-unions-n-interfaces)

### Fragments on unions n interfaces

When query inline fragments on an interface for example, Apollo Client is unable to know Character is an interface and both `Human` and `Droid` implements `Character` interface:

```gql
// schema.server.gql
interface Character {
  id: ID!
  name: String!
  friends: [Character]
}

type Human implements Character {
  id: ID!
  name: String!
  friends: [Character]
  height: Int
}

type Droid implements Character {
  id: ID!
  name: String!
  friends: [Character]
  primaryFunction: String
}

// client query
{
  search(text: "an") {
    __typename
    ... on Character {
      name
    }
    ... on Human {
      height
    }
    ... on Droid {
      primaryFunction
    }
  }
}
```

This is why by default, Apollo Client's cache will use a heuristic fragment matcher, which assumes that a fragment matched if the result included all the fields in its selection set, and didn't match when any field was missing.

