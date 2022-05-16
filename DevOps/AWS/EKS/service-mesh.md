## Service Mesh

Typically deployed as a sidecar proxy to application code. Platform layer implementation (not application level).

It provides rich features that service-dns driven comms don't provide. For example, in Linkerd:

- It applies dynamic routing rules to determine which destination the requester actually intended. Should the call be routed to a service on the local cluster or on remote one? To the current version or to a canary one? Each of these decision points can be configured dynamically by the operator, allowing for techniques like failover and canary deploys.
- From the set of possible endpoints to that destination (which Linkerd keeps up to date based on Kubernetes service discovery information), Linkerd chooses the instance most likely to return a fast response based on a variety of factors, including whether it’s currently serving a request as well as its recent history of latency.
- Linkerd checks to see if a usable TCP connection to that destination already exists in its connection pool. If not, Linkerd creates it, transparently using mTLS to ensure both confidentiality (encryption) and authenticity (identity validation) of both sides of the connection. Even if the communication is happening over HTTP/1.1, Linkerd may automatically establish an HTTP/2 connection to the proxy on the remote side in order to multiplex requests across a single connection.
- Linkerd attempts to send the request over the connection, recording the latency and response type of the result. If the instance is down, unresponsive, or fails to process the request, Linkerd retries the request on another instance—but only if it knows the request is idempotent and the retry budget is available. If an instance is consistently returning errors, Linkerd evicts it from the load balancing pool, to be retried later.
- Linkerd captures every aspect of the request and response in the form of metrics and distributed tracing, which are emitted and stored in a centralized metrics system and reported to the operator via Linkerd’s dashboards and CLI tools.
