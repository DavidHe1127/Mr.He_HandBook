## ELB key points

* ELBs are engineered to not be a `single point of failure`. A single ELB will have multiple IPs which correspond to multiple ELB instances behind the scenes. Each for one `AZ`. That is why ELB deployment require at least 2 `AZ`s.