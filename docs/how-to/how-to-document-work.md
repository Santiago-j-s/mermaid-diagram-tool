# How-to: Document Existing and Future Work

Use this guide when documenting product or engineering changes in Mermaid Wave.

## Goal

Add documentation that is easy to find, accurate, and consistent with the Diataxis structure used in this project.

## Choose the right doc type (Diataxis)

- `Tutorials`: learning path for first-time users.
- `How-to`: task-oriented steps to achieve a concrete outcome.
- `Reference`: factual behavior, contracts, and system facts.
- `Explanation`: architecture, rationale, tradeoffs, and constraints.

## Steps for each documentation change

1. Identify the work being shipped (feature, behavior change, API change, or architecture change).
2. Pick exactly one small documentation task for the cycle.
3. Create or update one page in the appropriate Diataxis section.
4. Update `docs/index.md` so the page is discoverable.
5. Keep scope tight: one page per cycle when possible.

## API documentation rule

- Keep request/response formats in Bruno as the source of truth.
- Update Bruno files (for example `bru/*.bru`) when API contracts change.
- In markdown, reference Bruno and focus on behavior/context notes instead of duplicating payload schemas.

## What to document for existing work

- User-facing workflows (how-to pages).
- Core capabilities and current behavior (reference pages).
- System flow and design decisions (explanation pages).
- Onboarding path for new users (tutorial pages).

## What to document for future changes

- New features: add/update how-to and reference entries.
- API updates: update Bruno contract first, then related reference notes.
- Architectural shifts: update explanation pages with rationale and constraints.
- UX workflow changes: update affected tutorials/how-to guides.

## Quality checklist before commit

- Page uses the correct Diataxis category.
- `docs/index.md` links to the new/updated page.
- Claims match the current code behavior.
- API contracts are not duplicated in markdown when Bruno already defines them.
- Wording is concise and task-focused.

## Commit conventions

- Use Conventional Commits (for docs changes, prefer `docs:`).
- Include a clear body that explains the intent and impact of the documentation update.

## Related docs

- Documentation home: `docs/index.md`
- API contract reference pattern: `docs/reference/api-suggest-fix.md`
- API contract source of truth: `bru/suggest-fix.bru`
