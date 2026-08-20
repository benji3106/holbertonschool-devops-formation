# Conventional Commits — git log output

```
d2a82e3 (HEAD -> main, origin/main, origin/HEAD) chore: ignore setup shell scripts
acc188e docs: add blameless post-mortem for Friday-night incident
3c5c899 docs: answer DORA metrics quiz
3c0206e docs: add merge conflict resolution explanation
f93a382 feat: add environment setup verification
c0739ec Initial commit
```

## Commit types used

- **feat**: introduces a new feature or capability to the project (e.g. a new file, a new piece of functionality).
- **docs**: changes documentation only — README files, markdown deliverables, comments — with no impact on actual code behavior.
- **chore**: maintenance work that doesn't affect application logic, such as configuration files, tooling setup, or ignore rules (`.gitignore` here).

Other common Conventional Commits types, not used in this log but part of the standard:

- **fix**: patches a bug in the codebase.
- **refactor**: restructures existing code without changing its external behavior (no new feature, no bug fix).
- **test**: adds or corrects tests, with no change to production code.