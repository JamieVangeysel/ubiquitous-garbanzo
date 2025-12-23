# Contributing Guidelines

Thanks for contributing. This project is opinionated, staged, and intentionally structured. Please act accordingly.

If you ignore this document, your contribution will still be reviewed, but with visible disappointment.

---

## Project Philosophy

- One system, one source of truth
- No duplicated business logic
- Schema-first, not vibes-first
- Changes must align with the roadmap stages
- Breaking changes are allowed early, not silently later

---

## Repository Structure (High-Level)

```
/backend Fastify backend (Node.js + TypeScript)
/frontend Angular frontend
/scripts Log ingestion scripts
/docs/adr Architecture Decision Records
```

Do not freestyle new top-level folders.

---

## Development Setup

### Prerequisites

- Node.js (LTS)
- MSSQL Server
- MQTT broker
- Auth0 tenant (for local development)
- Angular CLI

Each subproject may contain additional setup instructions.

---

## Branching Strategy

- `master` is always deployable
- Feature work happens in `feature/<short-description>`
- Fixes go in `fix/<short-description>`

No direct commits to `master`.

---

## Commit Guidelines

- Write meaningful commit messages
- One logical change per commit
- If your commit message looks like a cry for help, rewrite it

Example:

`feat(backend): add aggregated query endpoint for temperature history`

---

## Code Standards

### Backend

- TypeScript is mandatory
- No `any` unless there is a very good reason
- Fastify plugins should be isolated and reusable
- Business logic does not live in route handlers

### Frontend

- Angular best practices apply
- No logic in templates beyond basic bindings
- State management must be explicit

### Database

- Schema changes require an ADR
- Migrations must be reversible
- No silent data loss

---

## Architecture Decisions

Any non-trivial architectural change **must** include an ADR.

If you change:

- Database schema
- Authentication flow
- Messaging patterns (MQTT topics, payloads)
- Module boundaries

You write an ADR. No exceptions.

---

## Pull Requests

A PR should:

- Reference the roadmap stage it applies to
- Describe what changed and why
- Note breaking changes explicitly
- Include migration steps if applicable

PRs without context will be reviewed slowly and skeptically.

---

## Testing Expectations

- New features should include tests where practical
- Critical logic must be testable
- “Works on my machine” is not a test strategy

---

## Final Note

This project is built incrementally and deliberately.  
Respect the structure, document decisions, and don’t introduce cleverness that future-you will regret.
