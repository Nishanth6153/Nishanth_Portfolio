# Felix Rieseberg Portfolio Mirror

This Vite app presents the live interactive portfolio at [felixrieseberg.com](https://felixrieseberg.com/) in a fullscreen iframe. That gives the local page the exact current 3D room, monitor content, navigation, sound controls, and interaction behavior without reconstructing or substituting the author's scene assets.

## Run locally

Requires Node.js 20+ and npm 10+.

```powershell
npm install
npm run dev
```

Open the Vite URL, normally `http://localhost:5173/`. The embedded experience requires an internet connection and may change when the source site changes. The local project does not contain a standalone copy of the remote scene.

## Checks

```powershell
npm run typecheck
npm run lint
npm run build
```

The previous standalone Three.js scene scaffold remains in `src/scene/` but is not mounted by the current `App.tsx`. It can be resumed if you later want an independently hosted recreation using assets you own or have permission to use.
