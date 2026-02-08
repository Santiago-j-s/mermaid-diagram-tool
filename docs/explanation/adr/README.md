# Architecture Decision Records (ADRs)

This directory stores architecture and engineering decisions for Mermaid Wave.

## Purpose

Use ADRs to capture decisions that affect system behavior, maintainability, or long-term direction.

## When to write an ADR

- Introducing or replacing core libraries/frameworks.
- Adding/changing API boundaries or integration patterns.
- Making security, data, or deployment tradeoff decisions.
- Establishing standards that future work should follow.

## ADR format

Create one markdown file per decision using this naming pattern:

- `NNNN-short-kebab-title.md`

Use zero-padded numbers and increment for each new ADR.

## Status values

- `Proposed`
- `Accepted`
- `Superseded by NNNN`
- `Deprecated`

## How to add a new ADR

1. Copy `docs/explanation/adr/0000-template.md`.
2. Rename it to the next number and a short kebab-case title.
3. Fill in context, decision, consequences, and alternatives.
4. Add the new ADR to the index table below.

## ADR Index

| ADR                                                    | Title                                                   | Status   |
| ------------------------------------------------------ | ------------------------------------------------------- | -------- |
| [0001](0001-adopt-adr-process.md)                      | Adopt ADR process for technical decisions               | Accepted |
| [0002](0002-replace-mermaid-with-beautiful-mermaid.md) | Replace Mermaid runtime with beautiful-mermaid renderer | Proposed |
