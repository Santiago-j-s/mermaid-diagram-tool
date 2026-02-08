# Reference: AI Fix Suggestion API

Endpoint used by the editor to request Mermaid syntax fix suggestions.

## API Contract

Use Bruno as the source of truth for request and response formats.

- Collection: `bru/bruno.json`
- Request: `bru/suggest-fix.bru`
- Endpoint: `POST /api/suggest-fix`
- Full request/response examples live in the `docs` block inside `bru/suggest-fix.bru`.

## Behavior Notes

- The route calls `generateText` from the Vercel AI SDK with `openai("gpt-4o-mini")`.
- The prompt asks for a concise, beginner-friendly answer under 100 words.
- If `lineNumber` is present, the prompt emphasizes that line.
- The endpoint currently does not enforce request schema validation in the route handler.

## Client Usage

- Client helper: `lib/mermaid/getAISuggestion.tsx`
- Called when rendering fails in: `app/page.tsx`
- On non-OK responses, client returns fallback text:
  - `Check the reference guide for syntax examples and common patterns.`

## Related docs

- For guided usage, see `docs/tutorials/first-diagram.md`.
- For local setup, see `docs/how-to/how-to-run-locally.md`.
