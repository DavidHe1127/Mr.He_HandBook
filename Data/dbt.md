## APIG

- [is_incremental](#is_incremental())

## is_incremental()

dbt determines whether a run is incremental or a full (complete) rebuild primarily through the built-in is_incremental() macro.
This macro returns True only when all three of these conditions are true at the same time:

- The target table already exists in the database (i.e. this is not the very first run of the model)
- The --full-refresh flag was not passed (neither via CLI: dbt run --full-refresh, nor via dbt build --full-refresh, etc.)
- The model is configured with materialized = 'incremental' (in the model's config() block or in dbt_project.yml)
