# Asset Status

The active app does not bundle any of Felix Rieseberg's site assets. `src/App.tsx` loads the live portfolio from `https://felixrieseberg.com/?room=1` in a fullscreen iframe. The browser retrieves the original scene and assets from that site when online.

The prior model-first rebuild's source manifest and asset research remain represented in `src/scene/layout.ts` and in the earlier history, but are not required by the active iframe implementation. Do not treat the inactive scaffold as the currently rendered experience.

A self-contained replica would need authorization and the complete independently distributable scene package, including models, textures, shaders, environment, video/audio, and content.
