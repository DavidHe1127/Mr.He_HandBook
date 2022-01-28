## Grafana

- [Annotations](#annotations)

### Annotations

They can be dynamically added by querying a configured data source and plot out query result onto the graph.

For example, suppose an ES data source stores JSON data:

```json
{
  "app": {
    "name": "david-test"
  }
}
```
you can run query `app.name: "$appname"` with `appname` being the variable that is set to `david-test`. And specify `app.name` in `Tags` field to show `david-test` as tag on the graph.


