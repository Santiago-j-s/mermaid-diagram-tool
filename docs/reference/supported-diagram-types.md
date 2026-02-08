# Reference: Supported Diagram Types

Technical reference for diagram-type support in Mermaid Wave.

## Rendering Support

- Mermaid Wave renders diagrams through `beautiful-mermaid` (`hooks/use-mermaid.ts`).
- The project currently depends on `beautiful-mermaid` (`package.json`).
- Renderer-supported diagram types are:
  - Flowchart (`graph`, `flowchart`)
  - Sequence (`sequenceDiagram`)
  - State (`stateDiagram`, `stateDiagram-v2`)
  - Class (`classDiagram`)
  - ER (`erDiagram`)

## In-App Type-Aware Features

The app has extra type-aware behavior for a subset of diagram types in friendly error handling and references.

- `flowchart`
- `sequence`
- `journey`

These are used by:

- Diagram type detection (`lib/mermaid/detectDiagramType.tsx`).
- Friendly error interpretation (`lib/mermaid/getFriendlyErrorMessage.ts`).
- Reference panel content (`components/reference-panel.tsx`, data in `lib/mermaid/examples.ts`).

## Starter Templates vs Reference Panel

### Starter template buttons (home screen)

The home screen currently shows starter templates for:

- Flowchart
- Sequence
- Class Diagram
- State Diagram
- ER Diagram

### Reference panel categories (cheatsheet)

`lib/mermaid/examples.ts` currently defines reference panel categories for:

- Flowchart
- Sequence
- User Journey

## Practical Implication

- Unsupported templates (Journey, Gantt, Pie) are hidden from starter buttons.
- Journey still appears in the reference panel, but its example load action is disabled under the current renderer.
- For non-detected types, the app falls back to `unknown` for type-specific guidance paths.
- Error guidance quality is strongest for flowchart, sequence, and journey.

## Related docs

- For editor capabilities, see `docs/reference/editor-features.md`.
- For architecture context, see `docs/explanation/architecture-overview.md`.
