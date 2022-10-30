## Design Resilient Apps

A resilient app will continue to work even if part of its components fall through.

Example architecture

React Client ---> Microservice(resilient) ---> 3rd party API

Below are patterns one can use to make their apps more resilient!

### Exponential backoff

Make sure jitter is used! It will add random numbers to the backoff so the retries from client don't cluster.

### Circuit breaker

After x number of exceptions, serve pre-defined fallback result which effectively stops calls to the 3rd party API for y mins. After stoppage expires, new calls are again forwarded to the 3rd API.
