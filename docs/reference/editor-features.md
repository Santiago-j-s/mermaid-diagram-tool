# Reference: Editor Features

Technical reference for user-facing capabilities in the Mermaid Wave editor.

## Core Editing

- Monaco-based code editor for Mermaid syntax (`components/text-editor/index.tsx`).
- Built-in Mermaid token highlighting via custom tokens (`components/text-editor/tokens.ts`).
- Undo and redo controls in the editor toolbar.
- Copy-to-clipboard action for current editor content.

## Live Preview

- Diagram render is debounced by 500ms after code changes (`app/page.tsx`).
- Preview supports zoom in, zoom out, reset zoom, and drag-to-pan (`components/diagram-preview.tsx`).
- Fullscreen toggle is available from the preview toolbar.

## Error and Suggestion UX

- Render errors are mapped to friendly messages through `lib/mermaid/getFriendlyErrorMessage.ts`.
- Diagram type detection for error context uses `lib/mermaid/detectDiagramType.tsx`.
- Optional AI fix suggestions are requested through `POST /api/suggest-fix`.
- If AI suggestion fetch fails, client uses a fallback help message (`lib/mermaid/getAISuggestion.tsx`).

## Productivity Features

- Diagram code is persisted in local storage key `mermaid-diagram-code` (`hooks/use-local-storage.ts`).
- Header includes a save timestamp indicator (`components/auto-save-indicator.tsx`).
- Built-in starter templates can load into the editor (`lib/mermaid/examples.ts`).
- Right-side reference panel can load syntax examples directly into the editor (`components/reference-panel.tsx`).

## Export and Theming

- Export actions support both SVG and PNG (`components/export-menu.tsx`).
- Export controls are disabled while the preview is in an error state (`app/page.tsx`).
- Light/dark theme toggle is available in the header (`components/theme-toggle.tsx`).

## Scope Notes

- This page documents current behavior in the main editor screen (`app/page.tsx`).
- API request and response contract details are maintained in Bruno (`bru/suggest-fix.bru`).

## Related docs

- For API details, see `docs/reference/api-suggest-fix.md`.
- For architecture rationale, see `docs/explanation/architecture-overview.md`.
- For first-time usage, see `docs/tutorials/first-diagram.md`.
