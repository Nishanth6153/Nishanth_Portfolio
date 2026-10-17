import * as THREE from 'three'
import type { CameraState } from '../core/SceneStateMachine'
import { CAMERA_TARGETS, type Vec3 } from './layout'

export interface CameraPose { position: THREE.Vector3; target: THREE.Vector3; fov: number }

export function getCameraPose(view: CameraState, aspect: number, focusTarget: Vec3 | null = null): CameraPose {
  if (focusTarget && view !== 'monitor') {
    const target = new THREE.Vector3(...focusTarget)
    const position = target.clone().add(new THREE.Vector3(0, 0.12, 1.55))
    return { position, target, fov: aspect < 0.75 ? 54 : 42 }
  }
  const base = CAMERA_TARGETS[view]
  const fov = aspect < 0.75 ? Math.min(78, base.fov + 16) : aspect < 1 ? base.fov + 8 : base.fov
  return { position: new THREE.Vector3(...base.position), target: new THREE.Vector3(...base.target), fov }
}

export function reducedMotionEnabled() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
}
