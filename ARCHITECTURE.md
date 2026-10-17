# Architecture

`src/App.tsx` mounts one fullscreen iframe pointed at `https://felixrieseberg.com/?room=1`. The browser loads the original site, so the room renderer, 3D assets, copy, navigation, sound behavior, keyboard controls, and updates remain the source site's implementation.

The iframe has an accessible title and allows autoplay/fullscreen for the interactions initiated inside the referenced experience. The outer document has no overlay controls so it does not alter the source site's layout. It requires network access.

A prior standalone React Three Fiber scene scaffold remains in `src/scene/`, but the active app does not load it. The local package does not include a standalone copy of Felix Rieseberg's scene assets or source implementation.
