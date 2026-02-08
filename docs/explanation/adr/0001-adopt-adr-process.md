# 0001: Adopt ADR process for technical decisions

- Status: Accepted
- Date: 2026-02-08

## Context

The project is evolving quickly, and decisions are currently scattered across PR descriptions and commit messages. This makes it hard to understand why key choices were made, especially for future contributors.

## Decision

We will maintain Architecture Decision Records in `docs/explanation/adr/`.

- Each decision gets one markdown file.
- ADRs use incremental numeric IDs and kebab-case titles.
- New ADRs should be linked from `docs/explanation/adr/README.md`.

## Consequences

- Decision history is discoverable in one place.
- Tradeoffs and rationale remain available after implementation.
- Contributors have a clear standard for documenting future technical decisions.

## Alternatives Considered

- Keep decision history only in PRs and commit messages.
  - Rejected because rationale becomes fragmented and harder to find.
- Keep a single rolling decisions page.
  - Rejected because individual decisions become harder to track and supersede.
