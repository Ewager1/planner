# Development Workflow

## Task Scope
- Work on one GitHub issue at a time.
- Follow the issue's acceptance criteria.
- Do not implement unrelated features or refactors.
- If the task requires expanding scope, stop and explain why.

## Git and GitHub
- Start each task from the latest main branch.
- Create a dedicated branch using:
  - `feat/<issue-number>-<short-description>`
  - `fix/<issue-number>-<short-description>`
  - `chore/<issue-number>-<short-description>`
- Never commit directly to main.
- Add every new GitHub issue to the `planner` GitHub Project (Project #5).
- Verify that the issue appears in the project before considering issue creation complete.
- Create a pull request targeting main.
- Never merge a pull request.
- Do not force-push or delete remote branches without approval.

## Quality
- Add or update tests for changed behavior.
- Run the relevant tests, lint, typecheck, and build checks.
- Inspect the final diff for unrelated changes.
- Report failing checks rather than claiming success.
- Do not bypass or weaken checks to make a PR pass.

## Pull Requests
- Reference the GitHub issue.
- Summarize the changes.
- Explain how they were verified.
- Disclose known limitations or incomplete work.
- Keep the PR open for human review.

## Safety
- Do not change repository settings or permissions unless requested.
- Do not add dependencies without explaining their purpose.
- Do not introduce secrets or credentials into source control.
- Do not deploy or publish releases unless explicitly requested.

## Project Instructions

- Use docs/project-spec.md as the source of truth
  for application requirements and architecture.
- Read the relevant specification sections before
  implementing features.
- Follow the acceptance criteria in the assigned
  GitHub Issue.
- Keep changes within the issue's scope.
- Never merge pull requests into main.
-  Read docs/project-spec.md for application requirements.
- Read docs/project-plan.md for development phases and dependencies.
- Follow the assigned GitHub Issue's acceptance criteria.
