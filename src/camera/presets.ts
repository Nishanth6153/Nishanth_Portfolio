import type { CameraViewMode } from '../core/SceneStateMachine'

export type CameraState = CameraViewMode | 'room'

export type CameraVector = readonly [number, number, number]

export interface CameraPoseValues {
  readonly position: CameraVector
  readonly target: CameraVector
  readonly fov: number
}

export interface OrbitBounds {
  readonly minAzimuthAngle: number
  readonly maxAzimuthAngle: number
  readonly minPolarAngle: number
  readonly maxPolarAngle: number
  readonly minDistance: number
  readonly maxDistance: number
}

export interface CameraPresetValues {
  readonly landscape: CameraPoseValues
  readonly portrait: CameraPoseValues
  readonly orbit: OrbitBounds
}

export const CAMERA_PRESETS: Record<CameraState, CameraPresetValues> = {
  wide: {
    landscape: {
      position: [1.55, 1.68, 1.92],
      target: [-0.22, 1.06, -1.38],
      fov: 36,
    },
    portrait: {
      position: [1.95, 1.82, 2.75],
      target: [-0.18, 1.05, -1.35],
      fov: 44,
    },
    orbit: {
      minAzimuthAngle: -0.25,
      maxAzimuthAngle: 0.45,
      minPolarAngle: 1.15,
      maxPolarAngle: 1.65,
      minDistance: 2.55,
      maxDistance: 3.25,
    },
  },
  room: {
    landscape: {
      position: [1.55, 1.68, 1.92],
      target: [-0.22, 1.06, -1.38],
      fov: 36,
    },
    portrait: {
      position: [1.95, 1.82, 2.75],
      target: [-0.18, 1.05, -1.35],
      fov: 44,
    },
    orbit: {
      minAzimuthAngle: -0.25,
      maxAzimuthAngle: 0.45,
      minPolarAngle: 1.15,
      maxPolarAngle: 1.65,
      minDistance: 2.55,
      maxDistance: 3.25,
    },
  },
  desk: {
    landscape: {
      position: [0.24, 1.06, -0.42],
      target: [0.22, 0.91, -1.48],
      fov: 34,
    },
    portrait: {
      position: [0.24, 1.11, -0.08],
      target: [0.22, 0.9, -1.45],
      fov: 41,
    },
    orbit: {
      minAzimuthAngle: -0.25,
      maxAzimuthAngle: 0.25,
      minPolarAngle: 1.25,
      maxPolarAngle: 1.85,
      minDistance: 1.2,
      maxDistance: 1.8,
    },
  },
}

export const CAMERA_TRANSITION_ORBIT = {
  minAzimuthAngle: Math.min(CAMERA_PRESETS.wide.orbit.minAzimuthAngle, CAMERA_PRESETS.desk.orbit.minAzimuthAngle),
  maxAzimuthAngle: Math.max(CAMERA_PRESETS.wide.orbit.maxAzimuthAngle, CAMERA_PRESETS.desk.orbit.maxAzimuthAngle),
  minPolarAngle: Math.min(CAMERA_PRESETS.wide.orbit.minPolarAngle, CAMERA_PRESETS.desk.orbit.minPolarAngle),
  maxPolarAngle: Math.max(CAMERA_PRESETS.wide.orbit.maxPolarAngle, CAMERA_PRESETS.desk.orbit.maxPolarAngle),
  minDistance: Math.min(CAMERA_PRESETS.wide.orbit.minDistance, CAMERA_PRESETS.desk.orbit.minDistance),
  maxDistance: Math.max(CAMERA_PRESETS.wide.orbit.maxDistance, CAMERA_PRESETS.desk.orbit.maxDistance),
} satisfies OrbitBounds

export const CAMERA_VIEWPORT = {
  portraitAspectThreshold: 0.9,
  minimumAspect: 0.35,
  maximumHorizontalFovDegrees: 90,
} as const

export const CAMERA_PROJECTION = {
  near: 0.05,
  far: 40,
} as const

export const CAMERA_INTERACTION = {
  enablePan: false,
  enableZoom: true,
  enableRotate: true,
  enableDamping: false,
  dampingFactor: 0.08,
  rotateSpeed: 0.42,
  zoomSpeed: 0.65,
} as const

export const CAMERA_TRANSITION = {
  durationSeconds: 1.2,
  reducedMotionQuery: '(prefers-reduced-motion: reduce)',
  reducedMotionDurationSeconds: 0,
  maximumFrameDeltaSeconds: 0.05,
} as const

export const CAMERA_IDLE_DRIFT = {
  amplitudePerSecond: 0.0035,
  xFrequency: 0.23,
  yFrequency: 0.31,
  yPhase: 1,
} as const

export const CANVAS_CAMERA = {
  position: [...CAMERA_PRESETS.wide.landscape.position] as [number, number, number],
  fov: CAMERA_PRESETS.wide.landscape.fov,
  near: CAMERA_PROJECTION.near,
  far: CAMERA_PROJECTION.far,
} as const
