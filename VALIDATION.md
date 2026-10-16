# Validation Log — Object Structure and Position Correction

## Summary

- **Production build:** passed (`tsc --noEmit` and Vite build).
- **Dependency changes:** none; `package.json` and `package-lock.json` were not changed.
- **Before screenshots:** genuine browser captures from the existing Room and Desk presets at 520×684 CSS pixels.
- **After screenshot:** not captured. The In-App Browser could not navigate/reload the local Vite preview at `http://localhost:5174/`; navigation failed before a usable rendered page or screenshot was returned. No alternate or generated image is presented as an after capture.
- **Visual acceptance:** not verified. No conclusion is claimed about actual visible intersections, clipping, z-fighting, silhouettes, or material/light appearance.

## Production build

Command: `npm run build` (`tsc --noEmit && vite build`)  
Result: **passed** — Vite 5.4.21 transformed 630 modules and built in 6.21 seconds after the desk-centering correction.

| Output | Size | Gzip |
|---|---:|---:|
| `dist/index.html` | 0.59 kB | 0.36 kB |
| CSS | 3.31 kB | 1.29 kB |
| JavaScript | 1,021.08 kB | 282.34 kB |
| JavaScript source map | 3,198.81 kB | — |

Vite emitted its advisory that a minified JavaScript chunk exceeds 500 kB. No dependency was added.

## Screenshot evidence

| State | Viewport | File | Result |
|---|---:|---|---|
| Before — Desk preset | 520×684 CSS px | `N:\PROJECTS\Portfolio\.work\object-structure-correction\before-desk-520x684.png` | Genuine In-App Browser capture before the source edits. |
| Before — Room preset | 520×684 CSS px | `N:\PROJECTS\Portfolio\.work\object-structure-correction\before-room-520x684.png` | Genuine In-App Browser capture before the source edits. |
| After — Desk preset | 520×684 CSS px | Not created | Local-preview browser navigation failed; no rendered page observation was returned. |
| After — Room preset | 520×684 CSS px | Not created | Local-preview browser navigation failed; no rendered page observation was returned. |

The same two camera presets and the same viewport dimensions were requested for the after pass. The captures are not comparable because the after images could not be obtained. The owner-supplied wide screenshot remains a separate conversation baseline; it was not reopened for this task.

## Source-level checks

- The shared `src/scene/layout.ts` declares the 1-unit = 1-metre convention, room/model reference dimensions, named object transforms, generated city-window placements, keyboard-key placement parameters, and rain-instance values.
- Room, window, desk, and prop components now consume the shared layout. The desk root x is `windowX - deskFrameX = −0.23 m`; with the preserved +0.08 m frame child offset, the tabletop center is −0.15 m, equal to the window center. Internal workstation positions move together. The apron/legs meet the desktop underside by their recorded dimensions; floor furniture/desk props have contact-aware positions; stack gaps were closed as recorded in `OBJECT_LAYOUT_INVENTORY.md`.
- Source-level dimensions/positions place the furniture inside the nominal 5 × 3.2 × 3.8 m room. City backdrops/building layers intentionally remain outside the room behind the window. This is not a rendered collision/clipping test.
- The chair stays at `[1.75, 0, 1.05]` with identity yaw. Its backrest local z is `−0.26`, on the desk-facing side, so the seat faces +z. Whether that direction is intentional (toward the room/window) or should face the workstation requires owner review; the unavailable recording does not resolve it.
- SHA-256 comparison confirms `App.tsx`, `CameraDirector.ts`, `CameraRig.tsx`, `CrtScreen.tsx`, `Lighting.tsx`, `materials.ts`, `index.css`, `package.json`, `package-lock.json`, `index.html`, `vite.config.ts`, and `city-night.png` are byte-identical to the pre-correction archive. Component-local material constructors/colors in the touched scene files were preserved; the floor-lamp point light retains its color, intensity, distance, decay and local position `[0, 1.40, 0]` (world position `[1.58, 1.40, 0.54]`). Only the light-position expression now reads from the shared layout.
- No object was added or removed. Existing families were organized and named. No clear duplicate/orphan/unreferenced mesh was identified; no cleanup deletion was made.
- The frame-child offset remains +0.08 m, while the desk root shift −0.23 m places the tabletop center at x=−0.15 m, aligned with the window center. This is source-coordinate validation only; the rendered after-layout remains visually unverified.

## Limitations and next check

Run the active project in the owner's accessible browser and capture the updated Room and Desk presets at the same 520×684 viewport, then compare with the linked before captures. At the intended larger viewports, inspect visual grounding, wall/window clearance, CRT/table contact, chair/table silhouettes, z-fighting, and responsive framing. Until those screenshots exist, treat all such visual outcomes as **unverified**. The project still lacks a confirmed canonical Antigravity worktree/repository; do not assume this review/build copy is the release source.
- **Visual acceptance:** not verified. No conclusion is claimed about actual visible intersections, clipping, z-fighting, silhouettes, or material/light appearance. The chair's intended facing direction also remains an owner decision, not a verified defect.


## Subsequent browser retry

A fresh Vite preview on `127.0.0.1:5175` reported ready, but the In-App Browser timed out with `ERR_CONNECTION_TIMED_OUT`; navigation to the inherited `localhost:5174` preview had also failed. No after screenshots were captured at 520×684, 1912×867, or 390×844. Visual comparison and acceptance remain pending; compilation success is not visual verification. The temporary 5175 preview was stopped after this retry.


## Latest validation — camera Step 1 (2026-10-15)

This addendum is the latest result for the user-designated project at `N:\PROJECTS\Portfolio-Milestone-1`. Earlier sections above document the separate object-structure correction and its validation; they do not describe the camera update below.

### Changed application files and source behavior

- Added `src/camera/presets.ts`; updated `src/scene/CameraDirector.ts`, `src/scene/CameraRig.tsx`, and `src/App.tsx`.
- Room remains the initial camera state and Desk remains the secondary state. `App.tsx` derives its initial camera from the Room configuration rather than a duplicate pose literal. Landscape and portrait poses, per-preset controls, transition envelope, projection, responsive FOV constraints, interaction settings, and reduced-motion behavior are centralized in `presets.ts`.
- Implemented source values (geometry-derived and **not visually tuned or approved through rendered review**):

| Preset | Landscape position / target / FOV | Portrait position / target / FOV | Orbit bounds: azimuth, polar, distance |
|---|---|---|---|
| Room | `[1.4, 1.8, 1.65]` / `[0.85, 1.5, -1.45]` / `54°` | `[0.05, 1.8, 1.65]` / `[0.05, 1.5, -1.45]` / `64°` | `−0.25…0.45 rad`, `1.15…1.65 rad`, `2.55…3.25 m` |
| Desk | `[-0.08, 1.24, 1.55]` / `[-0.03, 1.093, -0.022]` / `42°` | `[-0.1, 1.22, 1.55]` / `[-0.03, 1.093, -0.022]` / `60°` | `−0.25…0.25 rad`, `1.25…1.85 rad`, `1.2…1.8 m` |

- Other centralized settings: camera near/far `0.05/40`; portrait aspect threshold `0.9`; minimum aspect `0.35`; maximum horizontal FOV `90°`; transitions use the existing `1.2 s` cosine easing; reduced-motion duration `0 s`; user panning disabled, rotate/zoom enabled, OrbitControls damping explicitly disabled.
- During flights, a derived union envelope spans azimuth `−0.25…0.45 rad`, polar `1.15…1.85 rad`, and distance `1.2…3.25 m`. Camera position, controls target and FOV interpolate together; a new request starts from the current pose. These are source-level behaviors, not browser-observed tests. OrbitControls angle/distance bounds do not implement arbitrary mesh collision detection.
- The source-level sampled pose-envelope check evaluated min/mid/max azimuth and polar angles at minimum/maximum distances. Room landscape camera positions ranged x `0.046…2.264`, y `1.243…2.828`, z `0.646…1.800`; Room portrait x `−0.754…1.464`, y `1.243…2.828`, z `0.646…1.800`; Desk x `−0.475…0.415`, y `0.597…1.661`, z `1.081…1.778`. All sampled positions passed the nominal inner shell envelope and forward-of-desk clearance checks used in the script. This is a bounded source-math sample—not a collision simulation, render, or proof against visual clipping/occlusion.
- Native Room/Desk buttons remain in `App.tsx`; source includes active-state accessibility attributes. Keyboard, focus, reduced-motion, transition interruption, resize, and touch behavior were **not** runtime-tested.

### Production build

Command: `npm run build` (`tsc --noEmit && vite build`) in `N:\PROJECTS\Portfolio-Milestone-1`  
Result: **passed** — TypeScript check passed; Vite 5.4.21 transformed 633 modules and built in 7.09 seconds.

| Output | Size | Gzip |
|---|---:|---:|
| `dist/index.html` | 0.59 kB | 0.35 kB |
| CSS | 3.31 kB | 1.29 kB |
| JavaScript | 1,027.46 kB | 284.73 kB |
| JavaScript source map | 3,231.74 kB | — |

Vite emitted its standard warning that the minified JavaScript chunk exceeds 500 kB. No dependency was added; `package.json` and the lockfile were not edited in this camera task.

### Browser and visual status

The Vite preview reported ready on port 5177, but the In-App Browser timed out before returning a usable rendered page. Earlier retry attempts at ports 5174 and 5175 also failed to produce an observation; the 5175 browser attempt returned `ERR_CONNECTION_TIMED_OUT`. No genuine current screenshots were captured at **1912×867 Room**, **1912×867 Desk**, or **390×844 Room**. The stored 520×684 images are pre-object-correction references, not this Step 1 baseline. No visual comparison, browser console/network inspection, camera-limit interaction, transition interruption, resize, accessibility, or device test is claimed. Treat all framing, clipping, collision, occlusion, and rendered appearance as **unverified** pending a real browser review.

## Inspection and CRT Area Quality Pass (2026-10-15)

### Summary of Results
- **Inspection & Fixes:** Completed full inspection (read-only audit, issue classification), corrections of genuine structural/placement/geometry mistakes (Part B), and quality improvements of CRT area objects (Part C).
- **Production Build:** Passed (`npm run build`: `tsc --noEmit && vite build`). 0 errors.
- **Genuine Browser Verification:** Successfully connected to the live application in the browser at viewport 1536 × 730 px.
- **Before and After Evidence:** Captured genuine Before screenshots (Room view, Desk view, CRT screen close-up) and After screenshots (Room view, Desk view, CRT screen macro close-up) at the exact same viewport (1536 × 730 px).
- **Draw Call Reduction:** Scene draw calls reduced from ~255 to ~193 (~62 fewer draw calls) by converting individual keyboard keycap meshes to a unified `InstancedMesh`.
- **Runtime Performance & Interaction:** Rapid switching between Room View and Desk View verified smooth with interruptible transitions; zero console errors or warnings; zero per-frame heap allocations; proper disposal on unmount.

### Production Build Metrics
Command: `npm run build` (`tsc --noEmit && vite build`) in `n:\PROJECTS\Portfolio-Milestone-1`
Result: **passed** — TypeScript check clean (0 errors); Vite transformed 633 modules.

| Output | Size | Gzip |
|---|---:|---:|
| `dist/index.html` | 0.59 kB | 0.36 kB |
| `dist/assets/index-BzovZEvu.css` | 3.31 kB | 1.29 kB |
| `dist/assets/index-B6G3lHOu.js` | 1,034.82 kB | 286.49 kB |

### Screenshot Evidence (All at 1536 × 730 px viewport)
- Before Room View: `before_room_view.png`
- Before Desk View: `before_desk_view.png`
- Before CRT Close-Up: `before_crt_screen_closeup.png`
- After Room View: `after_room_view.png`
- After Desk View: `after_desk_view.png`
- After CRT Macro Close-Up: `after_crt_screen_closeup.png`

### Verified Runtime Checks
1. **Speaker Footprint:** Verified no longer clipping into CRT chassis; cleanly grounded at `x = -0.42` between tower and monitor.
2. **Coffee Mug Rim:** Verified horizontal rolled ceramic rim; vertical hoop defect eliminated.
3. **CRT Screen Legibility:** Verified 1280 × 896 canvas with anti-glare tuned `MeshPhysicalMaterial` (`toneMapped: true`), crisp typography, restrained phosphor halo, and no specular washout.
4. **CRT Stand Grounding:** Verified concentric alignment at `z = 0.015` and clean contact shadow grounding on the desk.
5. **Keyboard & Cables:** Verified staggered rows with spacebar rendered in 1 draw call via `InstancedMesh`, ergonomic low-wedge slope, and procedural continuous cables connecting to the tower.
6. **Tower Detailing:** Verified 5.25" and 3.5" drive bays, tactile power/reset switches, and 3D power/HDD indicator LEDs.

