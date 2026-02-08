# Explanation: Architecture Overview

This page explains how Mermaid Wave is structured and why the current architecture was chosen.

## System Shape

Mermaid Wave is a Next.js App Router application where the main editor experience runs client-side.

- The editing page lives in `app/page.tsx`.
- Mermaid rendering runs in the browser through `hooks/use-mermaid.ts`.
- The backend surface is intentionally small: `POST /api/suggest-fix` in `app/api/suggest-fix/route.ts`.

This design favors low-latency editing and immediate visual feedback.

## Core Runtime Flow

1. User edits Mermaid code in `components/text-editor/index.tsx`.
2. Code state is persisted with `hooks/use-local-storage.ts`.
3. A debounced render in `app/page.tsx` calls `renderDiagram` from `hooks/use-mermaid.ts`.
4. The rendered SVG is shown in `components/diagram-preview.tsx`.
5. On errors, the app generates human-friendly guidance through `lib/mermaid/getFriendlyErrorMessage.ts` and can request AI help through `lib/mermaid/getAISuggestion.tsx`.

## Main Layers

### App Layer

- `app/layout.tsx` wires global providers, metadata, analytics, and toasts.
- `app/page.tsx` composes feature components and owns top-level editor state.

### Feature Layer

- Editor: `components/text-editor/*`
- Preview: `components/diagram-preview.tsx`
- Reference sidebar: `components/reference-panel.tsx`
- Export controls: `components/export-menu.tsx`

### Domain Layer

- Examples and syntax references: `lib/mermaid/examples.ts`
- Diagram type detection: `lib/mermaid/detectDiagramType.tsx`
- Error interpretation: `lib/mermaid/getFriendlyErrorMessage.ts`
- Export helpers: `lib/export-utils.ts`

### UI Foundation

- Shared primitives in `components/ui/*`
- Theme tokens and visual system in `app/globals.css`

## Why This Approach

- Client-side Mermaid rendering avoids server rendering overhead for each edit.
- Local storage preserves user work with minimal complexity.
- A dedicated API route is used only where server-side access is needed (LLM call for fix suggestions).
- Clear separation between feature components and domain helpers keeps behavior easier to evolve.

## Known Constraints

- `app/page.tsx` currently carries a lot of orchestration logic.
- Friendly error handling is strongest for flowchart, sequence, and journey diagrams.
- API request/response contract details are maintained in Bruno instead of duplicated markdown.

## Related docs

- For first-run user flow, see `docs/tutorials/first-diagram.md`.
- For local development setup, see `docs/how-to/how-to-run-locally.md`.
- For API contract details, see `bru/suggest-fix.bru` and `docs/reference/api-suggest-fix.md`.
