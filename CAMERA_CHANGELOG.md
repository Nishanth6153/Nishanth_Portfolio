# Camera and Interaction Notes — Corrective Rebuild

Camera poses and scene dimensions are maintained in `src/scene/layout.ts`. Room, Desk, and Monitor transitions are applied by `src/scene/CameraRig.tsx` with bounded orbit and reduced-motion behavior. These values are scaffold values pending final review with the approved models in place; the old CRT-specific changelog is superseded.

See `ARCHITECTURE.md` for the current render and interaction flow, and `VALIDATION.md` for checks actually performed. The prior prototype's viewport screenshots are not valid evidence for this rebuild.
