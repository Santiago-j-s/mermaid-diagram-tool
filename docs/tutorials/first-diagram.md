# Tutorial: Create Your First Diagram

This tutorial helps you create, preview, and export your first Mermaid diagram.

## Before you start

Make sure the app is running locally.

```bash
pnpm dev
```

Then open `http://localhost:3000`.

## Step 1: Load a starter template

1. In the top area, find the template buttons.
2. Click `Flowchart`.
3. Confirm code appears in the editor panel.

You should see a rendered diagram in the preview panel.

## Step 2: Make a small change

In the editor, change one node label.

For example, change this line:

```text
A[Start] --> B{Decision}
```

to:

```text
A[Begin] --> B{Decision}
```

Wait a moment for the live preview to update.

## Step 3: Try an intentional syntax error

Delete one closing bracket, for example:

```text
A[Begin --> B{Decision}
```

The preview should show an error message with a quick fix suggestion.

Now restore the bracket to make the diagram valid again.

## Step 4: Export your diagram

1. Use the export buttons near the editor/preview area.
2. Click `SVG` or `PNG`.
3. Confirm the file downloads.

You created, validated, and exported your first Mermaid diagram.

## Next step

If you want a task-focused guide next, continue with the upcoming how-to pages listed in `docs/index.md`.
