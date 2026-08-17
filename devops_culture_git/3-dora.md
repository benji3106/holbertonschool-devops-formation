# DORA Metrics — In-Class Quiz

## Q1. Match each DORA metric to its definition

- **Deployment Frequency**: how often a team deploys code to production.
- **Lead Time for Changes**: the time between a commit/PR being merged and that change running in production.
- **Change Failure Rate**: the percentage of deployments that cause a failure in production (bug, outage, requiring rollback or hotfix).
- **Time to Restore / MTTR**: the time between an incident being detected in production and the service being restored.

## Q2. A team deploys once a quarter. Which metric is poor?

**Deployment Frequency** is poor here. Deploying once a quarter is typical of a "low performer" profile in DORA research (elite teams deploy multiple times per day). It also means each deployment bundles a large amount of change at once, which increases risk.

## Q3. You shorten the time between merging a PR and shipping it to production. Which metric improves?

**Lead Time for Changes** improves. This is exactly what this metric measures: the delay between a change being merged and that change reaching production.

## Q4. 1 deployment out of 4 causes an incident. Which metric is this, and is a high value good or bad?

This is **Change Failure Rate**: 1/4 = 25%. A high value is **bad**, unlike Deployment Frequency, this metric measures a failure rate, so lower is better. Elite teams typically sit between 0% and 15%, so 25% is considered high and needs improvement.

## Q5. What does the acronym CALMS stand for?

CALMS represents the 5 pillars of DevOps culture:

- **C**ulture — collaboration and trust between dev and ops, no silos.
- **A**utomation — automating everything that can be automated (tests, deployments, infrastructure).
- **L**ean — small changes, short iterations, reducing waste.
- **M**easurement — measuring to steer decisions (this is what DORA metrics are for).
- **S**haring — sharing knowledge, feedback, and incidents openly.

## Q6. True or false: "elite" teams deploy less often but in bigger batches.

**False.** Elite teams do the opposite: they deploy more often, in small batches. Small batches reduce the risk surface of each individual deployment, if a small, isolated change breaks something, it's easy to identify and roll back. A large batch bundling many changes makes it much harder to pinpoint what caused a failure. This is directly connected to the "Lean" pillar of CALMS.

## Q7. Which practice improves MTTR the most?

(a) more manual approval steps
(b) monitoring and alerting plus automated rollback
(c) batching deployments once a month

**(b) Monitoring and alerting plus automated rollback.** MTTR covers both detecting an incident and restoring the service. Monitoring/alerting speeds up detection, and automated rollback speeds up restoration, directly addressing both ends of that timer. (a) and (c) work against MTTR: manual approval steps slow things down, and batching deployments makes failures harder to diagnose when they happen.

## Q8. Among the 4 DORA metrics, which measure throughput and which measure stability?

- **Throughput**: Deployment Frequency, Lead Time for Changes.
- **Stability**: Change Failure Rate, Time to Restore (MTTR).

## Q9. Why do we run blameless post-mortems?

We don't look for someone to blame because it's counterproductive: if people fear punishment, they will hide mistakes or downplay what really happened next time, and the team loses the exact information needed to prevent the incident from happening again. A blameless post-mortem creates the psychological safety for people to explain honestly what happened, including their own mistakes.

It's also based on the assumption that the root cause is almost always systemic (a missing test, unclear process, insufficient alerting, poor documentation) rather than a single person's fault. Blaming an individual never fixes the system that allowed the error to happen in the first place. This connects directly to the "Sharing" pillar of CALMS: incidents should be shared openly, not hidden out of fear.