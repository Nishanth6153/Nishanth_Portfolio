# Dependencies

## Runtime

- React and React DOM 18: UI and state.
- Three.js 0.169 and React Three Fiber 8: real-time rendering.
- Drei 9: camera controls, projected accessible DOM, and scene helpers.
- GSAP 3.15.0 (exact): paused camera and lamp transition timelines, manually stepped by the R3F frame loop.

## Development

Vite 5, TypeScript 5, ESLint 10, and typescript-eslint provide the local dev server, compilation, and static lint checks. See `package.json` and `package-lock.json` for exact resolved versions.

No downloaded model, postprocessing, decoder, or audio package has been added. GLB assets use Three.js `GLTFLoader`; texture assets use built-in loaders.
