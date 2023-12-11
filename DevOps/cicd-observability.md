# Observability

DORA metrics - DevOps Research and Assessment (DORA).

- Deployment frequency (DF): How often an organization successfully releases to production
- Mean Lead time for changes (MLT): The time it takes from code commit to code running in production
- Mean time to recover (MTTR): How long it takes to restore service after a service incident or a defect
- Change failure rate (CFR): The percentage of changes that cause a failure

To collect and make use of these metrics, you'll need to:

- Collect data on CI/CD pipeline runs
- Index and store the data for fast query and retrieval
- Visualize the data with custom dashboards
- Build reports and set alert rules on the data
