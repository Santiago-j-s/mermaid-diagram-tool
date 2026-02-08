# Explanation: Renderer Migration Spec (Mermaid -> beautiful-mermaid)

This document defines the migration plan to replace Mermaid Wave's current renderer (`mermaid`) with `beautiful-mermaid` installed from npm using pnpm.

## Status

- Proposed
- Target window: next minor release

## Motivation

- Improve visual output quality and theme control.
- Simplify runtime rendering path by using a pure TypeScript SVG renderer with no DOM dependency.
- Keep the editor UX and rendering contract stable while changing internals.

## Current State

- Rendering is initialized and invoked in `hooks/use-mermaid.ts`.
- Editor orchestration calls `renderDiagram(code, containerId)` from `app/page.tsx`.
- Starter templates include types outside `beautiful-mermaid` support (for example Journey, Gantt, Pie).

## Target State

- `useMermaid()` remains the app-facing abstraction (no caller API change in `app/page.tsx`).
- `renderDiagram()` internally uses `renderMermaid()` from `beautiful-mermaid`.
- Renderer dependency in `package.json` is `beautiful-mermaid` (installed with pnpm).
- Documentation and in-app type messaging match real support.

## Scope

### In scope

- Renderer library swap in the existing hook.
- Dependency updates in `package.json` and lockfile.
- Diagram support handling for unsupported types.
- Regression testing for preview and exports.
- Documentation updates in `docs/`.

### Out of scope

- Rework of editor UI, AI suggestion API, or Monaco integration.
- Adding new diagram parsers to `beautiful-mermaid`.
- Major redesign of export pipeline.

## Diagram Support Policy

`beautiful-mermaid` currently supports: flowchart, state, sequence, class, ER.

Mermaid Wave currently exposes additional starter templates and guidance for unsupported types. To avoid user-facing breakage during migration, use a two-step policy:

1. **Migration release:** keep unsupported templates visible but show a clear, friendly unsupported-type error in preview.
2. **Follow-up release:** remove unsupported templates from starter buttons and update reference docs to supported types only.

This enables quick renderer replacement now, with controlled UX cleanup next.

## Technical Design

### 1) Dependency changes

- Add: `beautiful-mermaid` (pnpm package).
- Remove: `mermaid`.

### 2) Hook-level adapter

- Keep `UseMermaidReturn` stable:
  - `isReady`
  - `renderDiagram(code, containerId)` returning `{ svg } | { error }`
- Replace dynamic `import("mermaid")` initialization with dynamic `import("beautiful-mermaid")`.
- Ignore `containerId` in implementation (preserved for compatibility with existing caller code).

### 3) Render options mapping

- Define shared render options in the hook (font, transparent mode, optional color defaults).
- Keep initial options minimal to reduce behavior drift.

### 4) Unsupported type handling

- Extend diagram type detection to distinguish supported vs unsupported categories.
- Before render, short-circuit unsupported types with an explicit error message:
  - Example: `"This diagram type is not supported by the current renderer yet. Supported: flowchart, state, sequence, class, ER."`
- Feed that message through existing friendly-error UI path.

### 5) Export compatibility

- Preserve SVG export path unchanged.
- Validate PNG export with new SVG output (font loading, dimensions, background behavior).

## Implementation Plan

### Phase 1: Core swap

- Install `beautiful-mermaid` via pnpm.
- Refactor `hooks/use-mermaid.ts` to use `renderMermaid()`.
- Remove Mermaid runtime initialization and config.

### Phase 2: Support-gate behavior

- Update diagram type detection utilities to classify unsupported templates early.
- Return clear renderer-support errors instead of generic parse failures.

### Phase 3: UX and docs alignment

- Update docs that currently imply full Mermaid compatibility.
- Add migration notes in architecture/support docs.
- Plan follow-up cleanup of unsupported starter templates and reference panel entries.

### Phase 4: Validation and release

- Run lint/build and manual smoke tests.
- Release behind normal deployment flow.

## Acceptance Criteria

- Rendering works for flowchart, state, sequence, class, and ER diagrams.
- Existing `app/page.tsx` call site requires no API changes.
- Unsupported types surface a clear message in preview (not a crash/blank panel).
- SVG and PNG export still function for supported diagrams.
- Docs correctly describe runtime renderer and support matrix.

## Test Plan

- Automated:
  - `pnpm lint`
  - `pnpm build`
- Manual smoke checks:
  - Render each supported type from starter templates.
  - Verify error UI for Journey/Gantt/Pie.
  - Export SVG and PNG for at least flowchart and sequence examples.
  - Toggle theme and confirm diagram remains readable.

## Risks and Mitigations

- **Risk:** Unsupported diagram regressions become user-visible.
  - **Mitigation:** Explicit unsupported-type messaging + follow-up template cleanup.
- **Risk:** Visual diffs alter export expectations.
  - **Mitigation:** Validate sample outputs and communicate renderer change in release notes.
- **Risk:** Error-message quality decreases due to different parser errors.
  - **Mitigation:** Normalize common parser failures in friendly-error mapping.

## Rollback Plan

- Revert dependency swap (`beautiful-mermaid` -> `mermaid`).
- Restore previous `hooks/use-mermaid.ts` implementation.
- Keep docs rollback patch ready with prior support-language.

## Documentation Updates Required

- `docs/explanation/architecture-overview.md`
- `docs/reference/supported-diagram-types.md`
- `docs/index.md` (add this spec)
