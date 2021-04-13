## Backpressure

### Example

In the context of between-server comms, when one server (requesting server) is sending requests to another (accepting server) faster than it can process them.

### Consequences

- Conns refused
- Memory depletion i.e eat up all memory to be able to process reqs. Backpressure could also propagate to requesting servers as well. i.e fluentd keeps retrying all failed reqs causing memory bloat since accepting servers are not able to keep up with sent requests.

### Solutions

#### Requesting side

- Slow down reqs generated *best option*
- Buffer (accumulate incoming data spikes temporarily). More precisely, buffer reqs in files rather than memory.

#### Accepting side

- Drop (sample a percentage of the incoming data)
