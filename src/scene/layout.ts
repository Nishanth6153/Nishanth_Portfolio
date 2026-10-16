export interface Vector3Tuple {
  readonly [0]: number;
  readonly [1]: number;
  readonly [2]: number;
}

export const ROOM_DIMENSIONS = {
  width: 5.4,
  depth: 4.8,
  height: 3.1,
  wallThickness: 0.14,
  baseboardHeight: 0.11,
  baseboardDepth: 0.018,
} as const;

export const DESK_LAYOUT = {
  position: [0.35, 0, -1.45] as const,
  width: 1.76,
  depth: 0.84,
  topHeight: 0.74,
  topThickness: 0.038,
  apronHeight: 0.065,
  legThickness: 0.055,
  drawerUnitWidth: 0.44,
  drawerUnitDepth: 0.74,
} as const;

export const CRT_LAYOUT = {
  // Grounded directly on DESK_LAYOUT.topHeight (0.74)
  position: [0.22, 0.74, -1.56] as const,
  rotationY: -0.08,
  swivelBaseRadius: 0.16,
  swivelBaseHeight: 0.035,
  neckWidth: 0.22,
  neckDepth: 0.2,
  neckHeight: 0.045,
  bezelWidth: 0.44,
  bezelHeight: 0.38,
  bezelDepth: 0.12,
  rearHousingWidth: 0.31,
  rearHousingHeight: 0.27,
  rearHousingDepth: 0.28,
  screenWidth: 0.355,
  screenHeight: 0.275,
} as const;

export const KEYBOARD_LAYOUT = {
  position: [0.19, 0.74, -1.16] as const,
  rotationY: -0.04,
  width: 0.45,
  depth: 0.165,
  frontHeight: 0.018,
  rearHeight: 0.032,
} as const;

export const MOUSE_LAYOUT = {
  position: [0.54, 0.74, -1.17] as const,
  rotationY: -0.14,
  padWidth: 0.23,
  padDepth: 0.2,
  padThickness: 0.004,
} as const;

export const TOWER_LAYOUT = {
  // Placed on the right wing of the 1.76m desk surface
  position: [0.88, 0.74, -1.52] as const,
  rotationY: -0.18,
  width: 0.21,
  height: 0.43,
  depth: 0.42,
} as const;

export const SPEAKERS_LAYOUT = {
  left: {
    position: [-0.08, 0.74, -1.52] as const,
    rotationY: 0.18,
  },
  right: {
    position: [0.53, 0.74, -1.52] as const,
    rotationY: -0.22,
  },
  width: 0.095,
  height: 0.2,
  depth: 0.115,
} as const;

export const DESK_LAMP_LAYOUT = {
  position: [-0.34, 0.74, -1.58] as const,
  rotationY: 0.52,
  baseRadius: 0.095,
  baseHeight: 0.028,
  bulbWorldPosition: [-0.19, 1.18, -1.42] as const,
  targetWorldPosition: [0.16, 0.74, -1.28] as const,
} as const;

export const CHAIR_LAYOUT = {
  // Pulled slightly back and angled toward the desk so it invites the viewer in without blocking keyboard/CRT
  position: [0.12, 0, -0.58] as const,
  rotationY: 2.68,
  seatHeight: 0.47,
  seatWidth: 0.5,
  seatDepth: 0.48,
} as const;

export const FLOOR_LAMP_LAYOUT = {
  // Positioned in the right-rear corner to frame the right side of the room with a soft warm secondary rim
  position: [1.85, 0, -1.78] as const,
  baseRadius: 0.18,
  poleHeight: 1.62,
  shadeHeight: 0.28,
  shadeTopRadius: 0.14,
  shadeBottomRadius: 0.24,
} as const;

export const WINDOW_LAYOUT = {
  // Left-rear wall feature providing cool blue-slate rainy city contrast against the warm desk lamp
  wallCenter: [-1.52, 1.58, -2.33] as const,
  width: 1.56,
  height: 1.64,
  frameDepth: 0.14,
  sillWidth: 1.72,
  sillDepth: 0.22,
  sillHeight: 0.045,
  exteriorBackdropOffsetZ: -1.65, // Deep parallax offset behind the window plane
} as const;

export const PROPS_LAYOUT = {
  mug: {
    position: [-0.22, 0.74, -1.18] as const,
    rotationY: 0.8,
  },
  bookStack: {
    position: [-0.36, 0.74, -1.33] as const,
    rotationY: 0.12,
  },
  floppyCase: {
    position: [0.64, 0.74, -1.36] as const,
    rotationY: -0.25,
  },
  bookshelf: {
    position: [-2.32, 0, -0.75] as const,
    rotationY: Math.PI / 2,
    width: 0.96,
    height: 1.78,
    depth: 0.34,
  },
  rug: {
    position: [0.2, 0.003, -0.75] as const,
    width: 2.5,
    depth: 1.85,
  },
} as const;
