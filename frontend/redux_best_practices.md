## Redux Best Practices

* [Structure for non-trivial apps](#structure-for-non-trivial-apps)
* [Put states in store or not](#put-states-in-store-or-not)

### structure-for-non-trivial-apps
In general, the state is the frontend's database and should be treated as such.
```js
const state = {
  db: {
    books: {},
    recipes: {},
    ingredients: {}
  },
  local: {
    ui: {
      activeRequests: 0
    },
    user: {
      name: 'David',
      accessToken: 'ji318jcjvjslfiqyt'
    }
  },
  vendor: {
    forms: {},
    router: {}
  }
};
```

```js
categories: {
 'xj12jkdsl': {
   type: 'food',
   order: 12
 },
 'jibbji12u': {
   type: 'bread',
   order: 11
 }
}
```

### put-states-in-store-or-not
If most of questions answered `yes` then save it into store. But it is not a must.
* Should this data be persisted across page refresh?
* Should this data be persisted across route changes?
* Is this data used in multiple places in the UI?


