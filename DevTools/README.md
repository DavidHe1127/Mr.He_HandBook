## DevTools

- [curl](curl.md)
- [create-react-app](create-react-app.md)
- [git](git.md)
- [lerna](lerna.md)
- [linting](linting.md)
- [npm](npm.md)

## YAML templating

```yml
- &multitenant_job
  job_name: 'dev'
  honor_labels: true
  metrics_path: '/federate'

- <<: *multitenant_job
  job_name: 'prod'

- *multitenant_job
```

will parsed to

```json
[
  {
    "honor_labels": true,
    "metrics_path": "/federate",
    "job_name": "dev"
  },
  {
    "honor_labels": true,
    "metrics_path": "/federate",
    "job_name": "prod"
  },
  {
    "honor_labels": true,
    "metrics_path": "/federate",
    "job_name": "dev"
  }
]
```
