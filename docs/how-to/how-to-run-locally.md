# How-to: Run Mermaid Wave Locally

Use this guide when you need a local development environment for Mermaid Wave.

## Prerequisites

- Node.js `>=22`
- `pnpm` installed

## Run the app

From the project root, install dependencies and start the dev server.

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Verify it works

Confirm these checks:

1. The editor loads and shows Mermaid code.
2. The preview panel renders a diagram.
3. Changing code updates the preview.
4. Theme toggle switches light and dark modes.

## Optional quality checks

Run lint and production build:

```bash
pnpm lint
pnpm build
```

## Troubleshooting

- If install fails, verify your Node version is `>=22`.
- If port `3000` is busy, stop the existing process and rerun `pnpm dev`.
- If the preview does not render, refresh the page and check the browser console for Mermaid errors.

## Related docs

For a guided first run inside the app, follow `docs/tutorials/first-diagram.md`.
