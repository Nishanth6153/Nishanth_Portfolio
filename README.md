# Interactive Portfolio Room Study — Object Structure Correction

This is the existing Milestone 1 React + TypeScript + Vite + Three.js / React Three Fiber project, continued in place. This pass organized the existing room scene into named assemblies and corrected measured contact/stacking positions. It did not start a replacement project or add portfolio features.

## Run locally

Requirements: Node.js 20+ and npm 10+. The included `package-lock.json` is unchanged.

```powershell
npm install
npm run dev -- --host 127.0.0.1 --port 5174 --strictPort
```

Open the local URL printed by Vite. For a production build:

```powershell
npm run typecheck
npm run build
npm run preview -- --host 127.0.0.1
```

## What changed in this pass

- Added `src/scene/layout.ts` as the typed source for room, window, desk, workstation, and prop positions, rotations, scales, and key model dimensions. Convention: 1 world unit = 1 metre.
- Grouped existing meshes beneath named room, window, desk, computer, CRT, tower, keyboard/mouse, accessory, lamp, plant, chair, book-stack, and side-table assemblies.
- Shifted the desk root left 0.23 m so the tabletop center aligns with the window center at x=−0.15 m; the existing +0.08 m frame offset and all child spacing remain intact.
- Corrected measured desk-frame contact geometry, grounded the tower/keyboard/mouse/mug/notebook/lamps/books/side-table, and closed the upper VHS-case gap.
- Preserved existing mesh families and their design; no props, models, dependencies, or assets were added or removed.
- Left the chair's identity rotation unchanged: its current backrest placement faces +z, but whether it should face the workstation or window/room is an owner design decision that the unavailable recording cannot resolve.
- During that earlier object-structure correction pass, camera values/controls, lighting, exposure/tone mapping, materials, colors, textures, CRT effects, city layers, and rain were unchanged. The later camera-only Step 1 update is recorded below.

See [OBJECT_LAYOUT_INVENTORY.md](./OBJECT_LAYOUT_INVENTORY.md) for the named scene inventory, model-scale references, and the exact before-to-after transform log. The workspace-level handover at `N:\PROJECTS\Portfolio\PROJECT_STATUS_AND_HANDOVER.md` records what remains unverified and the unresolved chair-facing choice.

## Screenshot and validation status

Genuine **before** screenshots were captured at 520×684 CSS pixels using the existing Room and Desk presets and are stored in the task evidence folder. A same-size **after** screenshot was not captured: In-App Browser navigation to the live local preview failed, so there is no rendered after-image and no visual claim is made about intersections, clipping, or z-fighting. The production TypeScript/Vite build did pass; see [VALIDATION.md](./VALIDATION.md).

## Project boundaries

The project remains a real-time 3D room. The existing Room/Desk camera presets, static CRT startup display, city depth, and instanced rain remain as previously implemented. Full portfolio navigation, terminal interaction, audio, hotspots, and broader content remain out of scope. The active output folder is still a Manus review/build copy; its canonical Antigravity/release ownership and Git worktree are not established.


## Latest update — camera Step 1 (2026-10-15)

The owner directed this work to continue directly in `N:\PROJECTS\Portfolio-Milestone-1`; the existing React/TypeScript/Vite/Three.js/React Three Fiber project was retained. A typed single source of camera configuration was added at `src/camera/presets.ts`, and the existing `App.tsx`, `CameraDirector.ts`, and `CameraRig.tsx` now consume it. The Room remains the initial state and Desk remains the secondary state. Presets are responsive, camera/target/FOV transitions remain interruptible, orbit limits are per-preset with a transition envelope, and camera motion honors `prefers-reduced-motion`. No package or dependency changes were made. See `VALIDATION.md` for exact source values and the final build.

**Visual verification is still pending.** The In-App Browser could not reach the local preview. No genuine current Room/Desk captures at 1912×867 or Room portrait capture at 390×844 were obtained, and no browser interaction/console test is claimed. The existing 520×684 before images predate the object-layout correction and are not a current camera baseline. Source-level checks and a passing production build do not verify visual framing or runtime behavior.
