## SRE

### SLI vs SLA vs SLO

> Assuming that your Service Level Indicators (SLIs) are - `xyz is true`, then the Service Level Objectives (SLOs) which are organization-level objectives will read - `xyz is true for a % of time` and the corresponding Service Level Agreements (SLAs) meant for external/ end users are legal contracts that say - `Promise xyz is true for a % of time, if not then, so and so will be compensated`.

[SLO Tracker](https://faun.dev/c/stories/squadcast/introducing-our-open-source-slo-tracker-a-simple-tool-to-track-slos-and-error-budget/?utm_id=FAUN_DevOpsLinks359_Link_title)

### On-call

- Trust an alarm but need to verify it's not noise.
- Define guidelines for all teams about what warrants an incident along with different levels of severity. This takes guesswork out of the picture, and provides a shared understanding to every team member.
- **Scope the incident** i.e how big the impact is? which environment is affected? which customers are affected? is it a regional/global? Is it us or 3rd service causing the incident? If possible summarise it in incident title.
- Create a dedicated channel, declare incident lead, give context, provide hypotheses/proofs and updates to all stakeholders involved.
- Incident response is a collaborative process. Get early help from others from different teams.
- Don't panic! Panic will inevitably cause scrambling leading up to longer resolution. If panic, try to calm down and follow the incident resolution guideline. If still not helpful, yell for help!
- When not on-call, try to help on-call, they would appreciate your help and you will learn new things during process. This also helps promote a great culture.
- Use incident management tool such as [rootly](https://rootly.com/).
- Some things can’t be taught directly, but have to be built from experience – working on-call shifts and learning from more experienced engineers.
- Escalation shouldn’t feel like giving up on the problem, but a tool that helps provide the most effective solution. Call seasoned on-call in is a good solution.

