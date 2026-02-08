# Reference: Supported Diagram Types

Technical reference for diagram-type support in Mermaid Wave.

## Rendering Support

- Mermaid Wave renders diagrams through the Mermaid library (`hooks/use-mermaid.ts`).
- Any syntax supported by the installed Mermaid runtime can be rendered.
- The project currently depends on `mermaid: latest` (`package.json`).

## In-App Type-Aware Features

The app has extra type-aware behavior for a subset of diagram types.

- `flowchart`
- `sequence`
- `journey`

These are used by:

- Diagram type detection (`lib/mermaid/detectDiagramType.tsx`).
- Friendly error interpretation (`lib/mermaid/getFriendlyErrorMessage.ts`).
- Reference panel content (`components/reference-panel.tsx`, data in `lib/mermaid/examples.ts`).

## Starter Templates vs Reference Panel

### Starter template buttons (home screen)

`lib/mermaid/examples.ts` currently includes starter templates for:

- Flowchart
- Sequence
- User Journey
- Class Diagram
- State Diagram
- ER Diagram
- Gantt Chart
- Pie Chart

### Reference panel categories (cheatsheet)

`lib/mermaid/examples.ts` currently defines reference panel categories for:

- Flowchart
- Sequence
- User Journey

## Practical Implication

- You can still render other Mermaid diagram types if Mermaid supports them.
- For non-detected types, the app falls back to `unknown` for type-specific guidance paths.
- Error guidance quality is strongest for flowchart, sequence, and journey.

## Related docs

- For editor capabilities, see `docs/reference/editor-features.md`.
- For architecture context, see `docs/explanation/architecture-overview.md`.
