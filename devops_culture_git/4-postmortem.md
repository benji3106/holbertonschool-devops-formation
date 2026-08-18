# Post-Mortem — The Friday Night Incident (PixelCart)

## 1. Factual timeline

- **Occurred**: Friday, 5:52 pm : a typo was introduced in the database URL configuration value during a manual deployment.
- **Detected**: Saturday, 9:15 am : Inès discovers the customer complaints. Note: a customer had already reported the issue publicly at 8:30 pm on Friday, but nobody on the team saw it until the next morning, since there was no automated alerting.
- **Resolved**: Saturday, 11:40 am : after locating the typo and manually fixing the configuration file, the service was restored.

Total downtime: approximately 15 hours (5:52 pm Friday to 9:15 am Saturday spent undetected, plus ~2h20 to diagnose and fix once discovered).

## 2. Systemic causes (zero finger-pointing)

- **No automated deployment pipeline**: deployments were done manually over SSH, with files copied and configuration edited by hand directly on the production server, leaving no safety net to catch mistakes before they reach production.
- **No staging environment matching production**: there was no reliable way to test a change before deploying it, testing happened "roughly" on a local machine that did not mirror production.
- **No monitoring or alerting**: nothing actively watched the health of the service after deployment. The team learned about the outage only because a customer happened to post about it publicly, and even then nobody saw the post until the next morning.
- **No change history and no rollback mechanism**: once the issue was found, there was no record of what had actually changed and no simple way to revert, forcing a manual diagnosis and fix instead of a quick rollback.

## 3. Three priority actions

1. **Set up automated monitoring and alerting on the checkout service.** This is the highest priority because it addresses the single biggest contributor to the incident's length: roughly 15 hours passed with nobody on the team aware anything was wrong. Automated alerts would have shortened detection from ~15 hours to a few minutes, independent of any other fix.

2. **Build an automated deployment pipeline with change history and rollback capability.** Manual SSH deployments were the direct cause of the typo, and the lack of a change history is what turned the fix into a multi-hour manual investigation. An automated pipeline with versioning would prevent this class of manual configuration error and allow a rollback in seconds instead of a hand-diagnosed fix.

3. **Create a staging environment that mirrors production.** This would have caught the typo before it ever reached production, preventing the incident from happening in the first place rather than just shortening it. It's ranked third because unlike the first two actions, no environment can guarantee catching every possible issue : the ability to detect and recover quickly (actions 1 and 2) remains the more critical safety net.

## 4. DORA metric impacted by each problem

- **No monitoring/alerting** → degrades **Time to Restore (MTTR)**: without detection, the timer to restore service doesn't even start until a customer complains.
- **No automated pipeline / no rollback** → degrades **Deployment Frequency**: manual, error-prone deployments discourage frequent, confident shipping, and encourage risky ad-hoc changes like this one.
- **No staging environment** → degrades **Change Failure Rate**: without a reliable way to test changes before production, a higher proportion of deployments end up causing incidents.