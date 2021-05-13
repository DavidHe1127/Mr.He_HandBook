## Monitoring

- [EC2](#ec2)
- [Prometheus](./prometheus)

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
