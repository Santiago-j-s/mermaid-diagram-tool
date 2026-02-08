# 0002: Replace Mermaid runtime with beautiful-mermaid renderer

- Status: Proposed
- Date: 2026-02-08

## Context

Mermaid Wave currently renders diagrams through the `mermaid` runtime in the browser. The team wants to improve visual output consistency and simplify renderer internals while keeping the editor workflow stable.

At the same time, the current product surface includes starter templates for diagram types that are not supported by `beautiful-mermaid` (for example Journey, Gantt, and Pie), so migration must avoid abrupt UX breakage.

## Decision

We will migrate the renderer dependency from `mermaid` to `beautiful-mermaid` (installed from npm via pnpm), while preserving the app-facing renderer abstraction in `hooks/use-mermaid.ts`.

- Keep the `useMermaid()` hook contract stable so `app/page.tsx` does not require API changes.
- Implement rendering via `renderMermaid()` from `beautiful-mermaid`.
- Handle unsupported diagram types with explicit, user-friendly messages.
- Follow a phased rollout:
  - Phase 1: renderer swap with compatibility adapter.
  - Phase 2: support-gate and improved unsupported-type messaging.
  - Phase 3: clean up starter templates/docs for unsupported types.

## Consequences

- Better control over rendered SVG styling and a simpler rendering path.
- Potential short-term mismatch between available templates and renderer support until follow-up cleanup lands.
- Existing error interpretation may need tuning because parser error text differs from Mermaid runtime errors.
- Migration remains low-risk for editor architecture because the rendering boundary is already isolated in one hook.

## Alternatives Considered

- Keep `mermaid` as the primary renderer.
  - Rejected because it does not meet the current rendering quality and theming goals.
- Full cutover in one step (remove unsupported templates immediately).
  - Rejected because it increases user-facing change risk and makes rollout less controlled.
- Hybrid long-term renderer (`beautiful-mermaid` + `mermaid` fallback).
  - Rejected as a long-term strategy due to ongoing maintenance complexity; acceptable only as short-lived transition if needed.
