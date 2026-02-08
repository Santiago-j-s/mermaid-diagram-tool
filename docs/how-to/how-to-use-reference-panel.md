# How-to: Use the Reference Panel

Use the built-in Reference Panel (Cheatsheet) to quickly find Mermaid syntax and load working examples into the editor.

## Goal

Open the right-side reference panel, switch diagram categories, and load an example into the editor.

## Steps

1. Open Mermaid Wave.
2. In the top-right header, click `Cheatsheet`.
3. In the right panel, choose a category button:
   - `Flowchart`
   - `Sequence`
   - `User`
4. Expand a syntax item to view:
   - syntax snippet
   - short explanation
5. In the `Example` section, click `Load`.
6. Confirm the editor updates and the preview re-renders.

## What to expect

- Loading from the reference panel replaces current editor content.
- A toast confirms when an example is loaded.
- The loaded code is persisted through local storage autosave.

## Troubleshooting

- If the panel is not visible, click `Cheatsheet` again to toggle it.
- If the preview does not update immediately, wait for the render debounce window.
- If the loaded example shows an error, compare with the syntax snippets in the same category.

## Related docs

- For first-time setup and run instructions, see `docs/how-to/how-to-run-locally.md`.
- For complete feature coverage, see `docs/reference/editor-features.md`.
