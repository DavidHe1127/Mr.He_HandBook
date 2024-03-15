# Monitoring

- An agent is only required to collect data from the operating system and workloads on VMs
- Azure Monitor starts automatically collecting metric data for your VM host when you create the VM. To collect logs and performance data from the guest **OS** on the VM, though, you must install the Azure Monitor agent

## AMA (Azure Monitoring Agent)

A successor to MMA (Microsoft Monitoring Agent) aka. Log Analytics Agent. Benefits with new agent include:

- It uses ETL data ingestion pipeline to help with data transformations which is not possible with deprecated agents.
- 25% higher throughput
- Auth with managed identity over workspace id/key with old agents