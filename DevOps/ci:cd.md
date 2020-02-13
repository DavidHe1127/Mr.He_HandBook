## CI/CD

- [Blue & Green](#blue-n-green-deployment)
- [Canary](#canary-deployment)
- [How to Become a DevOps](https://medium.com/@devfire/how-to-become-a-devops-engineer-in-six-months-or-less-part-2-configure-a2dfc11f6f7d)
- [Tooling](#tooling)
  - [Jenkins](#jenkins)

### Blue N Green Deployment
It aims for zero downtime & risk safe deployment.

Blue-green deployment is a technique that reduces downtime and risk by running two identical production environments called Blue and Green.

At any time, only one of the environments is live, with the live environment serving all production traffic. For this example, Blue is currently live and Green is idle.

As you prepare a new version of your software, deployment and the final stage of testing takes place in the environment that is not live: in this example, Green. Once you have deployed and fully tested the software in Green, you switch the router so all incoming requests now go to Green instead of Blue. Green is now live, and Blue is idle.

[Cloudfoundry](https://docs.cloudfoundry.org/devguide/deploy-apps/blue-green.html)

### Canary Deployment
Canary deployment is like blue-green, except it’s more risk-averse. Instead of switching from blue to green in one step, you use a phased approach.

With canary deployment, you deploy a new application code in a small part of the production infrastructure. Once the application is signed off for release, only a few users are routed to it. This minimizes any impact.

With no errors reported, the new version can gradually roll out to the rest of the infrastructure.

Read Deployment Best Practices!!
[Canary Deployment](https://dev.to/mostlyjason/intro-to-deployment-strategies-blue-green-canary-and-more-3a3)

---

### Jenkins

```jenkinsfile
pipeline {
    agent any
    // env var values cannot be re-assigned once defined here!!!
    // to woraround this issue, rather than defining them in environment block
    // put them inside stage block like so env.BUILD_TARGET = 'nginx'
    environment {
        BUILD_TARGET = "nginx"
    }
}


```


