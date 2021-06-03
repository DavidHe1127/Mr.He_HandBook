## DevTools

- [curl](curl.md)
- [create-react-app](create-react-app.md)
- [git](git.md)
- [lerna](lerna.md)
- [linting](linting.md)
- [npm](npm.md)
- [sonarqube](#sonarqube)

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

## SonarQube

```properties
# multiple rule exceptions separated by ,
sonar.issue.ignore.multicriteria=e1
# https://rules.sonarsource.com/javascript/RSPEC-1848
sonar.issue.ignore.multicriteria.e1.ruleKey=typescript:S1848
sonar.issue.ignore.multicriteria.e1.resourceKey=src/**/*
```
