# Object Layout Inventory — Structure and Position Correction

**Status:** Source/layout audit for the object-structure correction. This is not a visual acceptance report.  
**Source of truth for transforms:** `src/scene/layout.ts` (`LAYOUT`).  
**Unit convention:** 1 Three.js world unit = 1 metre. Positions and rotations below are local to the named parent unless explicitly marked world-space; rotations are radians. An omitted rotation/scale is `[0, 0, 0]` / `[1, 1, 1]`. Mesh dimensions are geometry arguments, not object scale. The room dimensions were retained.

## Scale references recorded in the typed layout

| Reference | Model value | Note |
|---|---:|---|
| Room | 5.0 × 3.2 × 3.8 m | Nominal prototype bounds, not a survey. |
| Desk height | 0.74 m | Desktop top is at y=0.74. |
| Chair seat top | 0.52 m | `MODEL_REFERENCES.chairSeatTop`. |
| CRT housing | 0.62 × 0.55 × 0.43 m | `MODEL_REFERENCES.crt`. |
| Keyboard shell | 0.53 × 0.034 × 0.205 m | `MODEL_REFERENCES.keyboard`. |
| Window aperture | 1.10 × 1.55 m | `MODEL_REFERENCES.window`; opening retained. |
| Door | Not modeled | No door dimensions were invented. |

## Scene-object inventory

The table inventories every named scene assembly and mesh family. Repeated/generated members are counted and use per-instance entries in the cited `LAYOUT` path. All transforms, dimensions, and deterministic instance positions are centralized there; component files assemble/render those values.

| Object / mesh family | Parent | Current local position | Rotation / scale | Finding and status |
|---|---|---:|---|---|
| `room-shell` | Scene | `[0, 0, 0]` | identity / identity | 5 × 3.2 × 3.8 m; unchanged. |
| `floor` | `room-shell` | `[0, -0.06, 0]` | identity / identity | Floor top y=0; unchanged. |
| `ceiling` | `room-shell` | `[0, 3.26, 0]` | identity / identity | Room underside y=3.2; unchanged. |
| Rear wall blocks: below, above, left and right of aperture | `room-shell` | `LAYOUT.room.walls.*` | identity / identity | Opening aligns to window; all four blocks retained. |
| `left-wall`, `right-wall` | `room-shell` | `[-2.5, 1.6, 0]`, `[2.5, 1.6, 0]` | identity / identity | Retained. |
| `rear-baseboard` | `room-shell` | `[0, 0.055, -1.825]` | identity / identity | Retained. |
| `window-assembly` | Scene | `[-0.15, 1.35, -1.9]` | identity / identity | New named aperture pivot; child world placements preserved. |
| `city-backdrop` | `window-assembly` | `[0, 0.775, -0.92]` | identity / identity | Exterior plate remains behind 3D city depth; unchanged asset/effect. |
| `city-parallax-layers` | `window-assembly` | `[0, 0, 0]` | identity / identity | Named parent; no scene-depth redesign. |
| `city-block-<seed>` and `city-building-mass-<seed>` (8 blocks) | `city-parallax-layers` | `LAYOUT.window.cityBlocks[*].transform` / `.mass` | identity / identity | Existing generated skyline retained. |
| `city-window-<seed>-<row>-<column>` (62 planes) | Building block | `LAYOUT.window.cityBlocks[*].windows[*].transform` | identity / identity | Existing seeded lit-window pattern retained. |
| `window-glass` | `window-assembly` | `[0, 0.775, 0.036]` | identity / identity | Pane remains in front of the exterior layers. |
| `window-frame-top`, `window-sill`, `window-frame-left`, `window-frame-right`, `window-mullion` | `window-assembly` | `LAYOUT.window.{frameTop,sill,frameLeft,frameRight,mullion}.transform` | identity / identity | Existing frame set retained. |
| `rain-streak-instances` (52 varied instances) | `window-assembly` | Root `[0, 0, 0]`; dynamic member positions in `LAYOUT.window.rain.drops` | Per-drop tilt/size; see `layout.ts` | Animation and rain values retained; no visual effect changes. |
| `desk-assembly` | Scene | `[−0.23, 0, 0]` | identity / identity | Root shifted left 0.23 m so the tabletop center aligns with the window at x=−0.15 m; internal workstation spacing is preserved. |
| `desk-frame` | `desk-assembly` | `[0.08, 0, 0]` | identity / identity | Existing frame-child offset retained; world tabletop center is now x=−0.15 m. |
| `desk-top` | `desk-frame` | `[0, 0.7075, 0]` | identity / identity | 2.18 × 0.065 × 0.86 m; world top y=0.74. |
| `desk-front-apron` | `desk-frame` | `[0, 0.6225, 0.3268]` | identity / identity | Height reduced to meet underside at y=0.675; see change log. |
| `desk-leg-1` … `desk-leg-4` | `desk-frame` | `LAYOUT.desk.legs[*]` | identity / identity | Height corrected to end at desktop underside; floor contact retained. |
| `computer-assembly` | `desk-assembly` | `[0.12, 0.74, 0]` | identity / identity | New named parent; workstation relation retained. |
| `crt-monitor-assembly` | `computer-assembly` | `[0, 0.315, -0.19]` | identity / identity | Housing, screen, stand, controls and vents grouped; CRT design unchanged. |
| CRT housing, bezel, backing, curved screen | `crt-monitor-assembly` | `LAYOUT.desk.crt.{housing,bezel,backing,screen}.transform` | identity / identity | Same components; curved screen still comes from `CrtScreen.tsx`. |
| CRT control panel, 3 buttons, LED, vent, stand neck and foot | `crt-monitor-assembly` | `LAYOUT.desk.crt.*` | identity / identity | Existing meshes retained and named. Foot has a 2.5 mm contact overlap with tabletop, as before. |
| `computer-tower-assembly` | `computer-assembly` | `[-0.74, 0.205, -0.12]` | identity / identity | Final world position `[-0.85, 0.945, -0.12]` after the desk-root shift; lowered 10 mm to rest on desktop. |
| Tower case, face, drive bay, floppy slot, power LED, vents 1–5 | `computer-tower-assembly` | `LAYOUT.desk.tower.*` | identity / identity | All existing pieces retained; no new model or material. |
| `keyboard-mouse-assembly` | `desk-assembly` | `[0.12, 0.74, 0.22]` | identity / identity | New named parent; shell/mouse now contact the desktop. |
| Keyboard shell and keybed | `keyboard-mouse-assembly` | `LAYOUT.desk.keyboard.{shell,keybed}.transform` | identity / identity | Existing geometry retained. |
| `keyboard-key-<row>-<column>` (65 keys) | `keyboard-mouse-assembly` | Generated from `LAYOUT.desk.keyboard.keys` | identity / identity | Named per key; row/column spacing and dimensions centralized. |
| `mouse` | `keyboard-mouse-assembly` | `[0.40, 0.015, 0]` | identity / identity | 8 mm lower than the before-state; now contacts desktop. |
| `desktop-accessories` | `desk-assembly` | `[0, 0.74, 0]` | identity / identity | Existing accessories grouped. |
| `compact-speaker-assembly` (cabinet, cone, cap) | `desktop-accessories` | `[-0.14, 0.11, -0.18]` | identity / identity | Existing grounded speaker retained. |
| `vhs-stack-assembly` (base, cases 1–2) | `desktop-accessories` | `[0.69, 0, -0.18]` | identity / identity | Base retained; upper case lowered 10 mm to close the stack gap. |
| `coffee-mug-assembly` (body, rim, handle) | `desktop-accessories` | `[-0.26, 0.05, 0.02]` | Handle rotation `[π/2, 0, 0]`; others identity | Body lowered 30 mm to the desktop; existing mug retained. |
| `paper-notebook-assembly` (paper, cover) | `desktop-accessories` | `[-0.69, 0, 0.25]` | Child rotation `[-π/2, 0, 0.08]` | Both layers lowered 6 mm; cover/pages retained. |
| `room-props` | Scene | `[0, 0, 0]` | identity / identity | New named parent for existing room props. |
| `desk-lamp-assembly` (base, 2 arms, 2 joints, shade, rim, bulb) | `room-props` | `[-0.91, 0.7375, -0.18]` | identity / identity | Visible assembly moved 2.5 mm down to desktop contact; lamp light settings/position untouched. |
| `floor-lamp-assembly` (pole, base, shade, rim, bulb, point light) | `room-props` | `[1.58, 0, 0.54]` | identity / identity | Visible geometry child offset `[0, -0.0075, 0]` grounds base; point light remains at world `[1.58, 1.40, 0.54]`. |
| `potted-plant-assembly` (pot, saucer, rim, canopy, 5 leaves) | `room-props` | `[0.94, 0.74, -0.28]` | Leaf transforms/scales in `LAYOUT.props.plant.leaves` | Pot already rests on desktop; unchanged. |
| `floor-book-stack` (books 1–3) | `room-props` | `[-1.72, 0, -0.65]` | Middle book `[0, 0, 0.035]`; scales identity | Child centers now `[0.1, 0.0375, 0]`, `[0.1, 0.1198, 0]`, `[0.1, 0.2022, 0]`; floor-grounded and contact-spaced. |
| `lounge-chair-assembly` (seat, back, 3 seams, 2 arms, 4 legs) | `room-props` | `[1.75, 0, 1.05]` | identity / identity | Existing dimensions/placement retained. Backrest local z=−0.26 is on the desk-facing side, so the seat faces +z; whether it should face the workstation or window/room is unresolved. No yaw change without visual direction from the owner. |
| `side-table-assembly` (body, pull, radio, dial) | `room-props` | `[2.12, 0, 0.50]` | identity / identity | Body center lowered 10 mm to floor; existing radio and pull world placements retained. |

## Before → after transform change log

All y-values are metres. “Before” refers to the source and genuine 520×684 screenshots captured before this correction; “after” is the current source transform, not a screenshot-verified appearance.

| Object | Before | After | Reason |
|---|---|---|---|
| Desk assembly root / tabletop center | Root x `0`; tabletop center x `+0.08 m`; window center x `−0.15 m` | Root x `−0.23 m`; tabletop center x `−0.15 m`; frame-child offset remains `+0.08 m` | The explicit desk-under-window alignment is now exact while all child positions remain unchanged relative to the desk. |
| Desk apron | Center y 0.635; height 0.13; top y 0.700, bottom y 0.570 | Center y 0.6225; height 0.105; top y 0.675, bottom y 0.570 | Meet tabletop underside at y=0.675 while preserving apron bottom. |
| Four desk legs | Center y 0.370; height 0.740; top y 0.740 | Center y 0.3375; height 0.675; top y 0.675 | End at tabletop underside rather than pass through the 65 mm slab; floor contact retained. |
| Tower root (world) | `[-0.62, 0.955, -0.12]` | `[-0.85, 0.945, -0.12]` | Moved with the centered desk assembly and lowered 10 mm; case bottom now y=0.74. |
| Keyboard shell center / mouse center (world) | y 0.765 / 0.763 | y 0.757 / 0.755 | Lower 8 mm; both now contact desktop. |
| Mug body center (world) | y 0.820 | y 0.790 | Lower 30 mm; bottom now y=0.74. |
| Notebook paper / cover (world) | y 0.748 / 0.746 | y 0.742 / 0.740 | Lower both 6 mm, retaining their 2 mm spacing. |
| Upper VHS case center (world) | y 0.833 | y 0.823 | Lower 10 mm to close the 10 mm stack gap. |
| Desk-lamp visible base bottom | y 0.7425 | y 0.7400 | Lower visible assembly 2.5 mm to desktop; light unchanged. |
| Floor-lamp visible base bottom | y 0.0075 | y 0.0000 | Lower visible-only geometry 7.5 mm; light remains fixed. |
| Book centers (child-local y) | 0.180, 0.265, 0.350 | 0.0375, 0.1198, 0.2022 | Ground first book; close gaps with the middle rotation accounted for. |
| Side-table body center | y 0.370 | y 0.360 | Lower 10 mm so body bottom reaches floor y=0. |

## Deliberately unchanged / remaining review points

- No mesh family was added or removed. Existing city, rain, CRT, and prop geometry remains; new groups and mesh names organize it. No clear duplicate/orphan/unreferenced geometry was identified in the source audit; none was deleted.
- Room dimensions, window aperture, city/rain effects, camera values/controls, renderer exposure/tone mapping, all lights, all material definitions/colors/textures, CRT screen appearance, and the visual design were deliberately left unchanged in this task.
- The tabletop center is now x=−0.15 m, aligned with the window center; the original +0.08 m frame-child offset remains, and the desk assembly root is x=−0.23 m. All child spacing was preserved.
- The chair retains its identity yaw and position. Its backrest is toward the desk, so its current seat faces +z; whether it should instead face the workstation or window/room is a Creative Director decision. The reference recording was unavailable, so no direction was invented.
- The source-level bounds/contact review finds the furniture within the 5 × 3.2 × 3.8 m shell; city layers are intentionally outside the room behind the window. This does not prove that the rendered scene has no clipping, visible intersections, or z-fighting.
- The CRT stand foot retains the pre-existing 2.5 mm overlap at the tabletop contact. Chair supports and the side-table radio also overlap their supported surfaces intentionally for physical attachment, not as coplanar surfaces.
- `door: null` in `MODEL_REFERENCES` records that no door is modeled; no door size was invented.
- Exact per-instance generated city-window, keyboard-key, leaf, chair-part, light, and rain values are in `src/scene/layout.ts`; source screenshots and browser checks are recorded in `VALIDATION.md`.

## CRT Polish Update

- **Assembly Root:** `crt-monitor-assembly` remains parented to `computer-assembly` with local transform `[0, 0.315, -0.19]` and identity rotation/scale, preserving the existing position and outer footprint (`0.62 × 0.55 × 0.43 m`).
- **Grounding:** The stand foot bottom now contacts the desktop at local `y = -0.315` (world `y = 0.740 m`), eliminating the previous 2.5 mm desktop interpenetration with zero floating, zero interpenetration, and zero z-fighting. A thin dark contact patch (`crt-stand-contact-patch`) rests flush at `y = -0.3146`.
- **Hierarchy & Named Meshes:**
  - `crt-housing` (group):
    - `crt-front-bezel`: procedural extruded beveled front frame with inner screen aperture.
    - `crt-rear-shell`: procedural tapered rear chassis lofts down towards rear apex.
    - `crt-top-vents`: 5 recessed ventilation slat slots on rear top slope.
    - `crt-rear-vents`: 6 ventilation slots on rear chassis cap.
    - `crt-rear-socket`: power socket boss plate.
    - `crt-power-cable`: curved procedural tube cable dropping behind desk.
  - `crt-screen-assembly` (group):
    - `crt-screen-backing`: dark backing plane behind the glass.
    - `curved-crt-startup-screen`: convex curved plane with barrel displacement, edge vignette, soft phosphor luminescence, anti-glare tuned material, and unchanged startup terminal text.
  - `crt-controls` (group):
    - `crt-control-tray`: recessed lower chin control tray.
    - `crt-badge`: brandless dark debossed badge.
    - `crt-knob-assembly-1`..`3`: 3 rotary adjustment dials with indicator marks.
    - `crt-power-button`: tactile beveled rocker power switch.
    - `crt-power-led`: miniature 3D green indicator LED lens.
  - `crt-stand` (group):
    - `crt-stand-contact-patch`: dark desktop contact patch.
    - `crt-stand-foot`: tapered plinth base with chamfered corners.
    - `crt-stand-swivel-collar`: cylindrical swivel collar ring.
    - `crt-stand-hinge`: tilt knuckle housing with side hinge pivot caps.



## Later camera Step 1 update (2026-10-15)

This camera-only work occurred after the object-structure correction recorded above; it did not alter the object layout, chair direction, lighting, materials, CRT, window, or rain. `src/camera/presets.ts` is now the typed source for the Room/Desk landscape and portrait camera poses, projection and orbit limits. `App.tsx`, `CameraDirector.ts`, and `CameraRig.tsx` consume that configuration. Exact values and source-bound sampling results are in `VALIDATION.md`.

The new camera poses and sampled orbit ranges fit the nominal room-shell bounds and sampled camera positions stay in front of the desk according to the geometry-based source check. This is not a rendered collision test or proof of visual framing; the browser could not load the local preview. No screenshot-based acceptance is claimed. The lounge chair remains at `[1.75, 0, 1.05]` with identity yaw and faces `+z`; its intended facing direction is still a Creative Director decision.

## Inspection and CRT Area Quality Pass (2026-10-15)

- **Source of truth sync:** Updated `LAYOUT.desk.crt` in `src/scene/layout.ts` to fully model and parameterize all components of the polished CRT assembly (`chassis`, `bezel`, `screen`, `controls`, `vents`, `stand`, `cables`). `CrtMonitor.tsx` now imports and consumes `LAYOUT.desk.crt`, eliminating disconnected inline magic numbers.
- **Speaker Collision Correction:** Relocated `desktop-accessories -> compact-speaker-assembly` from `[-0.14, 0.11, -0.18]` to `[-0.42, 0.11, -0.18]`, resolving the critical interpenetration where the speaker was embedded inside the CRT monitor chassis. The speaker now sits grounded on the desk surface between the tower and monitor with a dedicated contact shadow patch (`speaker-contact-patch`).
- **Mug Rim Rotation Bug Fix:** Added `[Math.PI / 2, 0, 0]` rotation to `coffee-mug-assembly -> mug-rim`, changing the torus from an incorrect vertical hoop to a realistic horizontal rolled ceramic rim.
- **Notebook Surface Grounding:** Elevated `paper-notebook-assembly -> notebook-cover` to local `y = 0.0015` and pages to `y = 0.0035`, eliminating coplanar z-fighting with the tabletop surface at `y = 0.740`.
- **CRT Stand Concentric Alignment:** Updated `createStandPlinthGeometry` to center at `zCenter = 0.015`, aligning the plinth foot concentrically with the swivel collar, tilt hinge, and contact patch. Grounded the contact patch at `y = -0.3142` (0.8 mm contact clearance).
- **CRT Monitor Enhancements:**
  - Added procedural `createInnerBezelLipGeometry` producing `crt-inner-bezel-lip` recessed inside the bezel, creating an authentic stepped frame holding the glass.
  - Added procedural curved `crt-signal-cable` (`TubeGeometry`) connecting the CRT rear video port across the rear desk surface to the computer tower.
- **CRT Screen Overhaul:**
  - Canvas resolution doubled to 1280 × 896 with crisp typography, restrained phosphor halo (`shadowBlur: 6-8`), fine 1px scanlines every 4px, and dark radial tube vignette.
  - Screen material tuned with `MeshPhysicalMaterial` (`roughness: 0.28`, `clearcoat: 0.20`, `clearcoatRoughness: 0.26`, `emissiveIntensity: 0.36`, `toneMapped: true`), eliminating harsh desk-lamp specular blowout while maintaining vivid phosphor contrast.
- **Keyboard & Mouse Optimization:**
  - Replaced 65 individual key meshes with a single `instancedMesh` (`keyboard-keys-instanced`) featuring realistic staggered row offsets and a wide space bar (slashing 64 draw calls).
  - Low-wedge keyboard case tilted forward 0.04 rad with non-slip rubber feet and grounding patch (`keyboard-contact-patch`).
  - Added procedural curved `keyboard-cable` (`TubeGeometry`) running from the keyboard rear to the tower.
  - Corrected mouse dimensions (`[0.068, 0.028, 0.102]`, radius `0.011`), added tactile central button split (`mouse-button-split`), and mouse cord (`mouse-cable`).
- **Computer Tower Quality Pass:**
  - Upgraded front panel with 5.25" optical bay, 3.5" floppy drive with slot/LED/eject, 3D tactile power switch with bezel boss, reset switch, 3D cylindrical power LED lens, and amber HDD activity LED lens.
  - Added desktop contact patch (`tower-contact-patch`).

