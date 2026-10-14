# Planner

A simple Todo App built with React and TypeScript, primarily as an experiment in AI-assisted software development using OpenAI Codex.

## Why This Project Exists

The Todo App itself isn't particularly important.

It's a deliberately small, relatively unpolished application with basic task management functionality. The goal wasn't to build something technically impressive or production-ready.

Instead, this project explores a different question:

> How effectively can an AI coding agent participate in a structured software development workflow, from planning and implementation through testing, code review, and delivery?

Rather than simply asking Codex to "build a Todo App," the project was approached using specifications, development phases, GitHub Issues, coding instructions, automated verification, and pull requests.

The development process is the primary subject of this repository.

## What We're Exploring

### 1. Planning Before Implementation

The project began by defining its requirements and breaking them into manageable development phases.

Rather than giving Codex one large, ambiguous instruction, the work was divided into GitHub Issues with specific responsibilities and acceptance criteria.

### 2. Giving an Agent Persistent Context

The repository contains documentation that describes both the application requirements and the development workflow.

- [Project Specification](docs/project-spec.md): Defines what the application should do, its technology stack, and its constraints.
- [Development Plan](docs/project-plan.md): Breaks the project into phases, tickets, and dependencies.
- [AGENTS.md](AGENTS.md): Establishes development conventions, scope restrictions, quality requirements, and GitHub workflow instructions.

These documents provide shared context for development and reduce the need to repeat requirements in every prompt.

### 3. Issue-Driven Development

GitHub Issues serve as individual units of work.

The intended workflow is:

1. Select an issue with clearly defined acceptance criteria.
2. Create a dedicated Git branch.
3. Have Codex implement the requested changes.
4. Run the relevant tests and quality checks.
5. Create a pull request.
6. Review the changes or delegate approval within explicitly defined limits.
7. Merge the work and continue to the next ticket.

The objective is to evaluate how reliably an agent can maintain scope and follow a repeatable engineering process.

### 4. Verification and Safeguards

An important part of the experiment is evaluating how much confidence automated checks can provide when an agent writes the code.

The development workflow uses:

- TypeScript type checking
- ESLint
- Vitest and React Testing Library
- GitHub Actions
- Pull-request diffs
- Ticket acceptance criteria

These safeguards help identify problems, but passing automated checks does not guarantee that the implementation is correct.

### 5. Agent Autonomy

Another part of the experiment is exploring different levels of autonomy.

This includes both tightly controlled workflows, where changes require manual approval, and more autonomous workflows, where Codex receives explicit permission to complete multiple tickets, merge qualifying pull requests, and continue working.

The goal is to understand the advantages, limitations, and risks of delegating increasingly complex development responsibilities to an agent.

## The Application

Planner supports basic task management:

- Creating tasks with scheduled dates and times
- Editing existing tasks
- Deleting tasks
- Marking tasks complete or incomplete
- Displaying tasks chronologically
- Persisting task data in browser localStorage

## Technology Stack

- React
- TypeScript
- Vite
- CSS Modules
- Browser localStorage
- Vitest
- React Testing Library
- GitHub Actions

There is no backend server, database, authentication system, or cloud synchronization.

These omissions are intentional. Keeping the application simple allows the experiment to focus on the development workflow.

## Running Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Run verification:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

## Final Perspective

This repository is intended to document an evolving experiment in agent-assisted software engineering.

The interesting results aren't necessarily the features of the final application. They're the decisions, processes, safeguards, mistakes, and lessons involved in building it with an AI coding agent.

The Todo App is the test subject. The development workflow is the project.
