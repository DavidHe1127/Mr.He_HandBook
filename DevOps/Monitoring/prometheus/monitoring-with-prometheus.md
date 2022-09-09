# Monitoring with Prometheus Book Learning notes

## General

- Include metrics and monitoring for each component of your app in the course of adding user stories/app specs.
Don't wait until the end of a project or just before deployment.
- Design a top-down monitoring plan based on value.

```
+------------+
|            |
|  Business  |
|  Logic     |
|            |
+------------+
      |
+-----|------+
|            |
|            |
|Application |
|            |
|            |
+------------+
      |
+-----|------+
|            |
|    OS      |
|            |
|            |
+------------+
```

Prioritise monitoring based on app value. i.e monitoring checkouts > 1000AUD first, before moving down to 200 response rate. OS-level metrics should still be considered but come last.
- Instead of monitoring 200 res code, consider monitoring for correctness of a service first. For example, monitor the content or rates of a business transaction.
- You should monitor your app frequently enough to:
  • Identify faults or anomalies.
  • Meet human response time expectations—you want to find the fault before your users report the fault.
  • Provide data at sufficient granularity for identifying performance issues and trends.
- A lot of useful information can be understood by understanding the rate of change between two values. For example, the number of logins is marginally interesting, but create a rate from it and you can see the number of logins per second, which should help
identify periods of site popularity
- When measuring latency it's often a good idea to display a graph that shows:
  • The 50th percentile, or median.
  • The 99th percentile.
  • The max value.

## Monitoring Methodologies

### USE namely Utilization Saturation and Errors (focuses on host-level monitoring)

- Summarized as for every resource, check utilization, saturation, and errors.
- Most effective for the monitoring of resources that suffer performance issues under high utilization
or saturation.

  • A `resource` - A component of a system. In Gregg’s definition of the model it’s
  traditionally a physical server component like CPUs, disks, etc., but many
  folks also include software resources in the definition.
  • Utilization - The average time the resource is busy doing work. It’s usually
  expressed as a percentage over time.
  • Saturation - The measure of queued work for a resource, work it can’t process
  yet. This is usually expressed as queue length.
  • Errors - The scalar count of error events for a resource.


### Four Golden Signals (focuses more on app-level monitoring)

• Latency - The time taken to service a request, distinguishing between the latency of successful and failed requests. A failed request, for example, might return with very low latency skewing your results.
• Traffic - The demand on your system—for example, HTTP requests per
second or transactions for a database system.
• Errors - The rate that requests fail, whether explicit failures like HTTP
500 errors, implicit failures like wrong or invalid content being returned,
or policy-based failures—for instance if you’ve mandated that failures over
30ms should be considered errors.
• Saturation - The “fullness” of your application or the resources that are
constraining it—for example, memory or IO. This also includes impending
saturation, such as a rapidly filling disk.

## Notification

A good build of notification system presents following basics:

- What problems to notify on
- Who to tell about a problem
- How to tell them
- How often to tell them
- When to stop telling them, do something else, or escalate to someone else.
- Alerts need to be concise, articulate, accurate, digestible and actionable
- **Notifications are ready by humans not computers**

## Configuration

- Only configure scrape intervals globally and keep resolution consistent! Resolution is the period in time that each data point in the series covers. e.g 5mins, 30mins.
- When Prom runs a job, the very first step initiated is service discovery. This populates the list of targets and metadata labels that the job will scrape.

### Why relabelling?

In a centralized, complex monitoring environment you sometimes don’t control all the resources you are monitoring and the monitoring data they expose. Relabelling allows you to control, manage, and potentially standardize metrics in
your environment. Some of the most common use cases are.

• Dropping unnecessary metrics.
• Dropping sensitive or unwanted labels from the metrics.
• Adding, editing, or amending the label value or label format of the metrics.

The easiest way to remember the two phases are: `relabel_configs` happens before the scrape and `metric_relabel_configs` happens after the scrape.

**Remember that labels are uniqueness constraints for time series. If you drop a label and that results in duplicate time series, you will have issues!**

### Recording rule

`level:metric:operations` - where level represents the aggregation level and labels of the rule output.

## Alerting

The most common anti-pattern seen in alerting approaches is sending too many alerts. Too many alerts is the monitoring equivalent of "the boy who cried wolf". Recipients will become numb to alerts and tune them out. Crucial alerts are often buried in floods of unimportant updates. For reasons why sending too many alerts, refer to 182p in the book.

Good alerting has some key characteristics:
- An appropriate volume of alerts that focus on symptoms not causes - Noisy alerting results in alert fatigue and, ultimately, alerts being ignored. It’s easier to fix under-alerting than over-alerting.
- The right alert priority should be set. If the alert is urgent then it should be routed quickly and simply to the party responsible for responding. If the alert isn’t urgent, we should send it with an appropriate tempo, to be responded to when required.
- Alerts should include appropriate context to make them immediately useful.
