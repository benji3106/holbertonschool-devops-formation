# Merge Conflict Resolution

## What was in conflict

The `version` line was the only conflict: `feature/scale-up` (HEAD) had `version: 1.1.0`, while `feature/dark-mode` had `version: 2.0.0`.

## Why that line, and not the others

Both branches also touched `config.yml`, but `replicas` and `feature_dark_mode` merged automatically with no conflict. This is because each branch only modified one of those two lines: `feature/scale-up` changed `replicas` but left `feature_dark_mode` untouched, and `feature/dark-mode` changed `feature_dark_mode` but left `replicas` untouched. Git compares files line by line, so when only one branch modifies a given line, Git can safely apply that change on its own.

A conflict only happens when **the same line** is modified **differently** by both branches. That's exactly the case for `version`: both branches changed it, but to two different values, so Git had no way to guess which one to keep.

## Resolution choice

I kept `version: 2.0.0` (the target version for this release), while preserving the automatically merged changes: `replicas: 4` and `feature_dark_mode: true`. This combines both features (scaling and dark mode) under the new version number.