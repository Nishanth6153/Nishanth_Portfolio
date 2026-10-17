# Corrective Rebuild Report — 2026-10-17

## Result

The local app now displays the exact live interactive portfolio through a fullscreen iframe pointed at `https://felixrieseberg.com/?room=1`. This replaces the asset-blocked empty room preview in the running application. The source site's own room, monitor UI, navigation, sound controls, and live content are rendered directly.

## Changes

- Replaced the previous asset-manifest preloader and empty shell UI with a fullscreen, accessible iframe.
- Updated the document title and metadata to match the referenced experience.
- Added full-viewport styling and removed the temporary embed-check page.
- Kept the earlier standalone R3F scaffold files in the project, but they are no longer mounted by the active app.

## Verification

- Local preview at `http://localhost:5175/` loaded the live experience inside the iframe; its 3D room and entry screen were visible.
- Direct embedding was tested in the local browser and is permitted by the current source site.
- `npm run typecheck`, `npm run lint`, and `npm run build` all passed. Vite transformed 31 modules; JS output is 143.06 kB minified (46.03 kB gzip) and CSS is 0.53 kB.

## Runtime dependency

This is an exact live embed, not an offline or independently hosted clone. It requires internet access and inherits future changes, downtime, browser restrictions, and content updates from Felix Rieseberg's site. The local project does not package the site's scene code or models.
