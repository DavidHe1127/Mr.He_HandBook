## Monitoring

- [General](#general)
- [On-Call](#on-call)
- [EC2](#ec2)
- [Prometheus](./prometheus)
- [Articles](#articles)

### General

4 golden signals:

- Saturation - how overloaded your server is. i.e `ELB: max(SurgeQueueLength) and sum(SpilloverCount)` or `ALB: sum(RejectedConnectionCount)`.
- Latency - response time
- Error rate
- Traffic - rps. For distributed systems, it can also help you plan capacity ahead to meet upcoming demand

Some tips:

- Start with static alerts - alert on static metric value. i.e when rps is above 1000.
- Use percentile i.e 95th Percentile latency as if that value is acceptable then it means 95% customers are happy. p99 is the maximum value of the remaining 99%. The 95th percentile means that 95 percent of the data is lower than this value and 5 percent of the data is higher than this value.
- Use anomaly detection. Try CloudWatch anomaly detection when metric follows a pattern.
- Test to see how your alerting reacts by turning it on but not raising incidents. i.e put it on suppress mode which generates alarms but not page people.
- Collate metrics and plot them out in graphs in one page so you can visually correlate them in time. DataDog/Grafana
- Enrich your metrics with tags/events, such as deployments, auto-scale events, restarts, and more. i.e annotations in Grafana

### On-call

- Trust an alarm but need to verify it's not noise.
- Define guidelines for all teams about what warrants an incident along with different levels of severity. This takes guesswork out of the picture, and provides a shared understanding to every team member.
- **Scope the incident** i.e how big the impact is? which environment is affected? which customers are affected? is it a regional/global? Is it us or 3rd service causing the incident? If possible summarise it in incident title.
- Create a dedicated channel, declare incident lead, give context, provide hypotheses/proofs and updates to all stakeholders involved.
- Incident response is a collaborative process. Get early help from others from different teams.
- Don't panic! Panic will inevitably cause scrambling leading up to longer resolution. If panic, try to calm down and follow the incident resolution guideline. If still not helpful, yell for help!
- When not on-call, try to help on-call, they would appreciate your help and you will learn new things during process. This also helps promote a great culture.

### EC2

3 dimensions to monitor:

- Disk I/O
- Network
- CPU
- Memory (CW doesn't collect it)

#### Disk I/O

Why? Help you ensure chosen instance type's disk IOPS and throughput matches app needs. 4 main metrics are `DiskReadOps`, `DiskWriteOps`, `DiskReadBytes` and `DiskWriteBytes`.

`DiskReadOps` and `DiskWriteOps` can help determine if degraded perf is caused by consistently high IOPS. If disk reqs outrun provisioned IOPS for a while, they will be queued. Consider SSD if HDD is used Or attach more vols.

`DiskReadBytes` and `DiskWriteBytes` can help reveal app-level issues. Too much read might indicate your app would benefit from adding a caching layer. Prolonged unexpected read/write levels could also mean req queuing and slowdowns if your disk is undersized to handle workload.

#### Network

EBS is networked drives. Different instance types provide different limits for both `network bandwidth` and `max transmission unit` (the largest amount of data can be sent in a single packet).

NetworkIn/NetworkOut(Bytes) - Number of bytes received/sent out on all network interfaces by the instance.

NetworkPacketsIn/NetworkPacketsOut(Count) - Number of packets received/sent out on all network interfaces by the instance.

High network metric values will cause high CPU.

#### CPU

Why? help ensure that your instances are appropriately sized for your workload. Note that CW measures the % utilization of the virtualized processing capacity of the instance - the `compute units`. It does not report CPU usage of the underlying hardware that the instance is being hosted on.

`T2` instances are capable of bursting meaning it can use processing power above a standard baseline level for short periods of time. This is ideal for app that are not generally CPU intensive but may benefit from higher CPU capacity for brief intervals.

Tip: If CPUUtilization is at high % sometimes, it is fine. However, if it never goes above 50%, it could mean it's over-provisioned.

### Articles

- [Monitoring SRE golden signals](https://www.infoq.com/articles/monitoring-SRE-golden-signals/)
- [What I wish I knew about incident management](https://ronaknathani.com/blog/2020/11/what-i-wish-i-knew-about-incident-management/)
