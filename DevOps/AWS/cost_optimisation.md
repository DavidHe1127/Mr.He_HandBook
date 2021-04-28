## Cost Optimisation

Outline some tips/tricks you can do to help with cost-effective AWS solutions.

### Architecture

#### Select right architecture/services

EKS with microservices might not be suitable in some cases where lambda could be better. Can you use DynamoDB over RDS? If not because of SQL nature, use Aurora over RDS.

#### Scale on demand

Use Application Auto Scaling wherever you can and EC2 Auto Scaling as well.

#### Use well-architected framework

The AWS Well-Architected Framework (WAF) provides best practice guidance on how to properly architect AWS cloud solutions. It’s comprised of five pillars, one of which is Cost Optimisation.

#### Avoid excessive security or resilience

Seek a balanced view of security and resilience requirement against the cost of a solution. i.e you don't need 5 layers of firewall appliances in front of that meme-generating web app.

#### Treat cost-efficiency as one of architecture principles

It's as critical as performance, resilience and security.

#### **Implement an effective tag strategy**

Good resource tagging strategy can help you save money!!! i.e Shut down instances during after business hours if they are not running business-critical services. For instance, boxes in test/dev environment.

---

### Operations

#### Chargeback and showback

Idea is to bill each individual department on resources usage. This will make them accountable for resources consumptions. Enforce cost awareness.

[chargeback and showback](https://en.wikipedia.org/wiki/IT_chargeback_and_showback)

#### Cost analysis and reporting

#### **Cost and utilisation monitoring**

You should be monitoring cost the same way that you monitor performance and capacity. Consider adding cost metrics to your dashboards and monitoring solution. Your operations team should watch any unexpected cost increase or decreases. Ideally, they should also be monitoring utilisation and asking questions when they see resources with low utilisation.

#### Application lifecycle management

Make sure you at least have a process in place to remove resources that are no longer needed.

#### Continuous improvement

Taking an iterative, continuous improvement approach to cost optimisation can be extremely effective. Teams should be encouraged to identify and implement changes that improve cost efficiency. Improvements should be shared across teams, implemented more broadly and fed back into architecture patterns and standards.

---

### Pricing Models

#### Savings Plan

Consider to try [Savings Plan](https://console.aws.amazon.com/cost-management/home?region=us-east-1#/savings-plans/overview)

#### Reserved Instances

Use Savings Plan if resources aren't not supported by Savings Plan. If you commit to running service for 1 or 3 years term, consider to use Reserved Instances to get big discount.

#### Spot Instances

90% off On-Demand pricing. suited for running non-business critical missions such as running jenkins build jobs. Can have interruptions and will get 2-min notification so you can gracefully perform cleanup/backup before ec2s being shut down.

#### Enterprice Discount Program

For enterprise-level businesses, an 18% discount for spending $10M over 3 years. Just make sure you understand that you’re committing to that spend, because use it or not, you’ll pay that amount.

#### Funding and Credits

---

### Cost Management

#### Cost Explorer

It lets you dig into your cloud costs by account, service, tags, etc. You should use it to understand your cost analysis activities and to investigate any unusual or unexpected costs.

#### AWS Cost and Usage Reports

You can get extremely detailed cost data using Cost and Usage Reports (CUR). Reports can be output to S3 or obtained using the CUR API. Reports are broken down by products, resources, usage types, operations and tags. This data can be used to perform cost analysis and reporting.

#### AWS Budgets

Budgets allows you to setup cost or usage budgets that, when breached or forecasted to breach, will notify you. Budgets can be configured for cost, usage, Reserved Instances and Savings Plans. They can be centralised in your AWS Organizations master account and created as code. You should be creating budgets based on your expected cost and usage profile.

#### AWS Trusted Advisor

#### AWS Pricing Calculator

#### AWS Compute Optimizer

---

### Service Optimisation

It includes different considerations applied to different services. Refer to [Perspective 5: Service Optimisation](https://medium.com/slalom-technology/reduce-your-aws-costs-the-complete-guide-a0b47b78a421) for more details
