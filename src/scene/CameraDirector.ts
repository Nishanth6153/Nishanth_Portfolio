import * as THREE from 'three'

export type PoseName = 'room' | 'desk'

export interface CameraPose {
  target: THREE.Vector3
  position: THREE.Vector3
  fov: number
}

export const ORBIT_LIMITS = {
  minPolarAngle: 0.78,
  maxPolarAngle: 1.82,
  minAzimuthAngle: -0.82,
  maxAzimuthAngle: 0.82,
  minDistance: 1.35,
  maxDistance: 7.2,
  dampingFactor: 0.08,
  rotateSpeed: 0.42,
  zoomSpeed: 0.65,
} as const

/** Returns a vertical perspective FOV while capping extreme horizontal spread. */
export function adaptFov(baseFov: number, aspect: number): number {
  const safeAspect = Math.max(aspect, 0.35)
  const base = THREE.MathUtils.degToRad(baseFov)
  const horizontal = 2 * Math.atan(Math.tan(base / 2) * safeAspect)
  const desiredHorizontal = Math.min(horizontal, THREE.MathUtils.degToRad(88))
  return THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(desiredHorizontal / 2) / safeAspect))
}

/** Explicit room landing and desk close-up poses, with a portrait-safe composition. */
export function buildPoses(aspect = 16 / 9): Record<PoseName, CameraPose> {
  if (aspect < 0.9) {
    const roomTarget = new THREE.Vector3(0.05, 1.50, 0)
    const deskTarget = new THREE.Vector3(0.05, 1.00, -0.12)
    return {
      room: {
        target: roomTarget,
        position: new THREE.Vector3(0.05, 2.18, 5.46),
        fov: 50,
      },
      desk: {
        target: deskTarget,
        position: new THREE.Vector3(0.05, 1.24, 3.40),
        fov: 54,
      },
    }
  }

  const roomTarget = new THREE.Vector3(0.05, 1.58, 0)
  const deskTarget = new THREE.Vector3(0.05, 1.02, -0.12)
  return {
    room: {
      target: roomTarget,
      position: new THREE.Vector3(0.05, 2.02, 4.25),
      fov: 44,
    },
    desk: {
      target: deskTarget,
      position: new THREE.Vector3(-0.08, 1.24, 1.72),
      fov: 36,
    },
  }
}

export function easeInOutCos(t: number): number {
  return 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, t)))
}

export interface FlyState {
  fromPos: THREE.Vector3
  fromTarget: THREE.Vector3
  toPos: THREE.Vector3
  toTarget: THREE.Vector3
  fromFov: number
  toFov: number
  elapsed: number
  duration: number
}

export const FLY_DURATION = 1.2
