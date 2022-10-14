## Grafana

- [Annotations](#annotations)
- [Docs](https://www.bookstack.cn/read/Grafana-v8.0-en/cd2752b7a7c9fb15.md)

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

### Template Variable

```
# InstanceType among others is attribute you can choose. Filters key need to begin with `tag:`.
ec2_instance_attribute(ap-southeast-2, InstanceType, { "tag:pulumi:Stack": [ "networking-dev-ap-southeast-2" ] })
```

### Alias in CloudWatch

Instance id will be displayed right next to legend

```
{{InstanceId}}
```
