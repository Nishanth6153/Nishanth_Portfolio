/**
 * Scene object placement, local pivots, and model dimensions.
 * Convention: 1 Three.js world unit = 1 metre. Room dimensions are nominal
 * prototype dimensions, not a surveyed building. Camera and light rig settings
 * deliberately remain in their existing modules and are not part of this layout.
 */
export type Vec3 = [number, number, number]
export type Transform = { position: Vec3; rotation: Vec3; scale: Vec3 }
export type BoxSize = [number, number, number]

const transform = (
  position: Vec3,
  rotation: Vec3 = [0, 0, 0],
  scale: Vec3 = [1, 1, 1],
): Transform => ({ position, rotation, scale })

function unitNoise(value: number) {
  const n = Math.sin(value * 127.1 + 311.7) * 43758.5453123
  return n - Math.floor(n)
}

const roomWidth = 5
const roomHeight = 3.2
const roomDepth = 3.8
const wallDepth = 0.12
const windowX = -0.15
const deskFrameX = 0.08
const windowBaseY = 1.35
const windowWidth = 1.1
const windowHeight = 1.55
const rearWallZ = -roomDepth / 2
const windowTopY = windowBaseY + windowHeight
const windowFrame = 0.055

const cityBlockData = [
  { seed: 4, offset: -0.46, width: 0.17, height: 0.40, depth: 0.09, z: -2.48, rows: 3, columns: 3 },
  { seed: 12, offset: -0.25, width: 0.23, height: 0.64, depth: 0.13, z: -2.42, rows: 5, columns: 4 },
  { seed: 23, offset: -0.01, width: 0.18, height: 0.50, depth: 0.10, z: -2.48, rows: 4, columns: 3 },
  { seed: 31, offset: 0.20, width: 0.25, height: 0.71, depth: 0.15, z: -2.39, rows: 5, columns: 4 },
  { seed: 42, offset: 0.43, width: 0.16, height: 0.46, depth: 0.10, z: -2.48, rows: 3, columns: 3 },
  { seed: 51, offset: -0.34, width: 0.27, height: 0.31, depth: 0.16, z: -2.08, rows: 2, columns: 4 },
  { seed: 63, offset: 0.05, width: 0.30, height: 0.39, depth: 0.19, z: -2.02, rows: 3, columns: 4 },
  { seed: 74, offset: 0.37, width: 0.20, height: 0.28, depth: 0.15, z: -2.10, rows: 2, columns: 3 },
]

const cityBlocks = cityBlockData.map(block => {
  const baseY = block.z > -2.2 ? 0.02 : 0.04
  const blockTransform = transform([block.offset, baseY, block.z - rearWallZ])
  const windows: Array<{ key: string; transform: Transform; materialIndex: number }> = []
  for (let row = 0; row < block.rows; row++) {
    for (let col = 0; col < block.columns; col++) {
      if (unitNoise(block.seed + row * 11 + col * 17) < 0.31) continue
      windows.push({
        key: `${row}-${col}`,
        materialIndex: (block.seed + row + col) % 3,
        transform: transform([
          -block.width * 0.34 + col * (block.width * 0.68 / Math.max(1, block.columns - 1)),
          0.09 + row * (block.height * 0.7 / Math.max(1, block.rows - 1)),
          block.depth / 2 + 0.002,
        ]),
      })
    }
  }
  return {
    ...block,
    transform: blockTransform,
    mass: transform([0, block.height / 2, 0]),
    windows,
  }
})

const rainDrops = Array.from({ length: 52 }, (_, i) => {
  const homeX = -windowWidth * 0.46 + unitNoise(i + 2.1) * windowWidth * 0.92
  return {
    homeX,
    x: homeX,
    y: unitNoise(i + 8.7) * windowHeight,
    height: 0.045 + unitNoise(i + 17.3) * 0.15,
    width: 0.0014 + unitNoise(i + 22.8) * 0.0024,
    speed: 0.34 + unitNoise(i + 31.4) * 0.62,
    drift: -0.025 + unitNoise(i + 40.9) * 0.055,
    tilt: -0.11 + unitNoise(i + 53.1) * 0.2,
    brightness: 0.38 + unitNoise(i + 68.2) * 0.58,
  }
})

/** Approximate object-size anchors for future proportion reviews; these are model values. */
export const MODEL_REFERENCES = {
  room: [roomWidth, roomHeight, roomDepth] as BoxSize,
  deskHeight: 0.74,
  chairSeatTop: 0.52,
  crt: [0.62, 0.55, 0.43] as BoxSize,
  keyboard: [0.53, 0.034, 0.205] as BoxSize,
  window: [windowWidth, windowHeight] as [number, number],
  door: null,
} as const

export const LAYOUT = {
  units: '1 world unit = 1 metre',
  room: {
    root: transform([0, 0, 0]),
    width: roomWidth,
    height: roomHeight,
    depth: roomDepth,
    wallDepth,
    floor: { transform: transform([0, -0.06, 0]), size: [roomWidth, 0.12, roomDepth] as BoxSize },
    ceiling: { transform: transform([0, roomHeight + 0.06, 0]), size: [roomWidth, 0.12, roomDepth] as BoxSize },
    walls: {
      rearBelowWindow: { transform: transform([0, windowBaseY / 2, rearWallZ]), size: [roomWidth, windowBaseY, wallDepth] as BoxSize },
      rearAboveWindow: { transform: transform([0, (windowTopY + roomHeight) / 2, rearWallZ]), size: [roomWidth, roomHeight - windowTopY, wallDepth] as BoxSize },
      rearLeftOfWindow: { transform: transform([(-windowWidth / 2 + windowX - roomWidth / 2) / 2, (windowBaseY + windowTopY) / 2, rearWallZ]), size: [roomWidth / 2 + windowX - windowWidth / 2, windowHeight, wallDepth] as BoxSize },
      rearRightOfWindow: { transform: transform([(windowX + windowWidth / 2 + roomWidth / 2) / 2, (windowBaseY + windowTopY) / 2, rearWallZ]), size: [roomWidth / 2 - windowX - windowWidth / 2, windowHeight, wallDepth] as BoxSize },
      left: { transform: transform([-roomWidth / 2, roomHeight / 2, 0]), size: [wallDepth, roomHeight, roomDepth] as BoxSize },
      right: { transform: transform([roomWidth / 2, roomHeight / 2, 0]), size: [wallDepth, roomHeight, roomDepth] as BoxSize },
    },
    rearBaseboard: { transform: transform([0, 0.055, rearWallZ + 0.075]), size: [roomWidth, 0.11, 0.04] as BoxSize },
  },
  window: {
    root: transform([windowX, windowBaseY, rearWallZ]),
    cityRoot: transform([0, 0, 0]),
    width: windowWidth,
    height: windowHeight,
    frame: windowFrame,
    backdrop: { transform: transform([0, windowHeight / 2, -0.92]), size: [windowWidth * 1.02, windowHeight * 1.02, 0] as BoxSize },
    glass: { transform: transform([0, windowHeight / 2, 0.036]), size: [windowWidth, windowHeight, 0] as BoxSize },
    frameTop: { transform: transform([0, windowHeight + windowFrame / 2, 0.07]), size: [windowWidth + windowFrame * 2, windowFrame, 0.09] as BoxSize },
    sill: { transform: transform([0, -windowFrame / 2, 0.085]), size: [windowWidth + windowFrame * 2, windowFrame, 0.14] as BoxSize },
    frameLeft: { transform: transform([-windowWidth / 2 - windowFrame / 2, windowHeight / 2, 0.07]), size: [windowFrame, windowHeight + windowFrame, 0.09] as BoxSize },
    frameRight: { transform: transform([windowWidth / 2 + windowFrame / 2, windowHeight / 2, 0.07]), size: [windowFrame, windowHeight + windowFrame, 0.09] as BoxSize },
    mullion: { transform: transform([0, windowHeight / 2, 0.078]), size: [0.025, windowHeight, 0.075] as BoxSize },
    cityBlocks,
    cityWindowSize: [0.012, 0.018, 0] as BoxSize,
    rain: { root: transform([0, 0, 0]), z: 0.045, xMargin: 0.48, bottomMargin: 0.04, depthThickness: 0.001, drops: rainDrops },
  },
  desk: {
    root: transform([windowX - deskFrameX, 0, 0]),
    width: 2.18,
    depth: 0.86,
    topThickness: 0.065,
    frameRoot: transform([deskFrameX, 0, 0]),
    top: { transform: transform([0, 0.7075, 0]), size: [2.18, 0.065, 0.86] as BoxSize },
    apron: { transform: transform([0, 0.6225, 0.3268]), size: [2.08, 0.105, 0.07] as BoxSize },
    legs: [
      transform([-0.96, 0.3375, -0.35]), transform([0.96, 0.3375, -0.35]),
      transform([-0.96, 0.3375, 0.35]), transform([0.96, 0.3375, 0.35]),
    ],
    legSize: [0.055, 0.675, 0.055] as BoxSize,
    computerRoot: transform([0.12, 0.74, 0]),
    crtRoot: transform([0, 0.315, -0.19]),
    crt: {
      housing: { transform: transform([0, 0, 0]), size: [0.62, 0.55, 0.43] as BoxSize },
      bezel: { transform: transform([0, 0.018, 0.221]), size: [0.62 * 0.84, 0.55 * 0.72, 0.022] as BoxSize },
      backing: { transform: transform([0, 0.02, 0.233]), size: [0.62 * 0.80, 0.55 * 0.68, 0] as BoxSize },
      screen: { transform: transform([0, 0.02, 0.24]), size: [0.62 * 0.765, 0.55 * 0.635, 0] as BoxSize },
      controlPanel: { transform: transform([0, -0.55 * 0.39, 0.224]), size: [0.62 * 0.76, 0.048, 0.022] as BoxSize },
      controlButtons: [-0.13, -0.095, -0.06].map(x => transform([x, -0.55 * 0.39, 0.238])),
      led: { transform: transform([0.62 * 0.30, -0.55 * 0.39, 0.238]), radius: 0.006 },
      buttonRadius: 0.007,
      standNeck: { transform: transform([0, -0.29, 0.015]), size: [0.14, 0.13, 0.14] as BoxSize },
      standFoot: { transform: transform([0, -0.30, 0.035]), size: [0.30, 0.035, 0.22] as BoxSize },
      vent: { transform: transform([-0.62 * 0.30, -0.55 * 0.39, 0.237]), size: [0.075, 0.006, 0.006] as BoxSize },
      screenWidth: 0.62 * 0.765,
      screenHeight: 0.55 * 0.635,
    },
    towerRoot: transform([-0.74, 0.205, -0.12]),
    tower: {
      case: { transform: transform([0, 0, 0]), size: [0.29, 0.41, 0.39] as BoxSize },
      face: { transform: transform([0, 0, 0.201]), size: [0.225, 0.355, 0.018] as BoxSize },
      driveBay: { transform: transform([0, 0.115, 0.213]), size: [0.17, 0.035, 0.009] as BoxSize },
      floppySlot: { transform: transform([0, 0.052, 0.213]), size: [0.15, 0.012, 0.008] as BoxSize },
      power: { transform: transform([0.08, -0.105, 0.214]), radius: 0.008 },
      vents: Array.from({ length: 5 }, (_, i) => transform([-0.04 + i * 0.02, -0.14, 0.214])),
      ventSize: [0.009, 0.012, 0.007] as BoxSize,
    },
    keyboardRoot: transform([0.12, 0.74, 0.22]),
    keyboard: {
      shell: { transform: transform([0, 0.017, 0]), size: [0.53, 0.034, 0.205] as BoxSize },
      keybed: { transform: transform([0, 0.035, 0]), size: [0.46, 0.006, 0.148] as BoxSize },
      keys: { rows: 5, columns: 13, firstX: -0.211, stepX: 0.035, firstZ: -0.06, stepZ: 0.027, y: 0.041, size: [0.025, 0.006, 0.018] as BoxSize },
      mouse: { transform: transform([0.40, 0.015, 0]), size: [0.074, 0.03, 0.105] as BoxSize, radius: 0.025 },
    },
    accessoriesRoot: transform([0, 0.74, 0]),
    speakerRoot: transform([-0.14, 0.11, -0.18]),
    speaker: {
      cabinet: { transform: transform([0, 0, 0]), size: [0.12, 0.22, 0.14] as BoxSize },
      cone: { transform: transform([0, 0.025, 0.072]), radius: 0.042 },
      cap: { transform: transform([0, 0.025, 0.074]), radius: 0.024 },
    },
    vhsRoot: transform([0.69, 0, -0.18]),
    vhs: {
      base: { transform: transform([0, 0.025, 0]), size: [0.26, 0.05, 0.17] as BoxSize },
      cases: [transform([0, 0.055, 0]), transform([0, 0.083, 0])],
      caseSize: [0.25, 0.028, 0.17] as BoxSize,
    },
    mugRoot: transform([-0.26, 0.05, 0.02]),
    mug: {
      body: { transform: transform([0, 0, 0]), topRadius: 0.045, bottomRadius: 0.038, height: 0.10 },
      rim: { transform: transform([0, 0.052, 0]), radius: 0.039, tube: 0.004 },
      handle: { transform: transform([0.055, 0.01, 0.0], [Math.PI / 2, 0, 0]), radius: 0.025, tube: 0.006 },
    },
    notebookRoot: transform([-0.69, 0, 0.25]),
    notebook: {
      pages: { transform: transform([0, 0.002, 0], [-Math.PI / 2, 0, 0.08]), size: [0.28, 0.34, 0] as BoxSize },
      cover: { transform: transform([0, 0, 0], [-Math.PI / 2, 0, 0.08]), size: [0.29, 0.35, 0] as BoxSize },
    },
  },
  props: {
    root: transform([0, 0, 0]),
    deskLampRoot: transform([-0.91, 0.7375, -0.18]),
    deskLamp: {
      base: { transform: transform([0, 0.03, 0]), topRadius: 0.075, bottomRadius: 0.09, height: 0.055 },
      lowerArm: { transform: transform([0.11, 0.27, 0], [0, 0, -0.32]), radiusTop: 0.012, radiusBottom: 0.014, length: 0.44 },
      upperArm: { transform: transform([0.22, 0.46, 0], [0, 0, 0.25]), radiusTop: 0.011, radiusBottom: 0.014, length: 0.36 },
      lowerJoint: { transform: transform([0.11, 0.27, 0]), radius: 0.027 },
      upperJoint: { transform: transform([0.22, 0.46, 0]), radius: 0.024 },
      shade: { transform: transform([0.27, 0.58, 0]), topRadius: 0.055, bottomRadius: 0.15, height: 0.16 },
      shadeRim: { transform: transform([0.27, 0.525, 0]), radius: 0.15, tube: 0.009 },
      bulb: { transform: transform([0.27, 0.525, 0]), radius: 0.033 },
    },
    floorLampRoot: transform([1.58, 0, 0.54]),
    floorLamp: {
      visibleOffset: transform([0, -0.0075, 0]),
      pole: { transform: transform([0, 0.83, 0]), topRadius: 0.014, bottomRadius: 0.018, height: 1.65 },
      base: { transform: transform([0, 0.035, 0]), topRadius: 0.17, bottomRadius: 0.20, height: 0.055 },
      shade: { transform: transform([0, 1.58, 0]), topRadius: 0.06, bottomRadius: 0.23, height: 0.32 },
      shadeRim: { transform: transform([0, 1.42, 0]), radius: 0.23, tube: 0.009 },
      bulb: { transform: transform([0, 1.405, 0]), radius: 0.027 },
      light: { transform: transform([0, 1.40, 0]) },
    },
    plantRoot: transform([0.94, 0.74, -0.28]),
    plant: {
      canopyRoot: transform([0, 0, 0]),
      pot: { transform: transform([0, 0.07, 0]), topRadius: 0.065, bottomRadius: 0.052, height: 0.14 },
      saucer: { transform: transform([0, 0.008, 0]), radius: 0.074, height: 0.016 },
      rim: { transform: transform([0, 0.14, 0]), radius: 0.055, height: 0.012 },
      leaves: [
        { transform: transform([-0.045, 0.20, 0], [0.12, 0.25, -0.72], [0.75, 1.45, 0.36]) },
        { transform: transform([0.045, 0.22, 0.01], [-0.08, -0.25, 0.68], [0.72, 1.42, 0.34]) },
        { transform: transform([-0.035, 0.29, -0.015], [0.22, 0.3, -0.34], [0.7, 1.48, 0.32]) },
        { transform: transform([0.035, 0.31, 0.02], [-0.18, -0.2, 0.4], [0.72, 1.5, 0.32]) },
        { transform: transform([0, 0.36, -0.012], [0.06, 0.05, 0.04], [0.66, 1.5, 0.3]) },
      ],
      leafRadius: 0.062,
    },
    bookStackRoot: transform([-1.72, 0, -0.65]),
    books: {
      positions: [transform([0.1, 0.0375, 0]), transform([0.1, 0.1198, 0], [0, 0, 0.035]), transform([0.1, 0.2022, 0])],
      size: [0.42, 0.075, 0.31] as BoxSize,
      radius: 0.018,
    },
    chairRoot: transform([1.75, 0, 1.05]),
    chair: {
      cushionsRoot: transform([0, 0, 0]),
      armrestsRoot: transform([0, 0, 0]),
      legsRoot: transform([0, 0, 0]),
      seat: { transform: transform([0, 0.43, 0]), size: [0.72, 0.18, 0.66] as BoxSize, radius: 0.085 },
      back: { transform: transform([0, 0.78, -0.26]), size: [0.72, 0.68, 0.16] as BoxSize, radius: 0.09 },
      seams: [-0.18, 0, 0.18].map(x => transform([x, 0.78, -0.174])),
      seamSize: [0.003, 0.42, 0.002] as BoxSize,
      arms: [transform([-0.34, 0.57, 0]), transform([0.34, 0.57, 0])],
      armSize: [0.10, 0.24, 0.65] as BoxSize,
      legs: [transform([-0.28, 0.20, -0.25]), transform([0.28, 0.20, -0.25]), transform([-0.28, 0.20, 0.25]), transform([0.28, 0.20, 0.25])],
      legTopRadius: 0.026,
      legBottomRadius: 0.038,
      legHeight: 0.4,
    },
    sideTableRoot: transform([2.12, 0, 0.50]),
    sideTable: {
      body: { transform: transform([0, 0.36, 0]), size: [0.42, 0.72, 0.38] as BoxSize },
      pull: { transform: transform([0, 0.43, 0.196]), size: [0.09, 0.018, 0.012] as BoxSize },
      radio: { transform: transform([0, 0.77, 0]), size: [0.27, 0.12, 0.21] as BoxSize },
      dial: { transform: transform([0, 0.77, 0.111]), radius: 0.025 },
    },
  },
} as const
