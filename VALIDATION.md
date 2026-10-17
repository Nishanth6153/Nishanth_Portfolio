# Validation Log — 2026-10-17

## Exact live embed

- Local preview at `http://localhost:5175/` displayed the source site's interactive room inside the fullscreen iframe.
- Direct embedding is accepted by the current source site.
- The iframe shows the current room entry state and retains the source site's own navigation and interactions.

## Code checks

- `npm run typecheck`: passed.
- `npm run lint`: passed with `--max-warnings=0`.
- `npm run build`: passed; 31 modules transformed; JS 143.06 kB minified / 46.03 kB gzip; CSS 0.53 kB.

## Limits

The result depends on internet access and the source site's current availability and content. This is an embed, not a standalone copy. The prior `evidence/` screenshots are excluded because they show the earlier rejected local scene scaffold.
