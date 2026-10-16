import { useEffect, useMemo, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import type { CameraState } from '../core/SceneStateMachine'
import {
  adaptFov,
  buildPoses,
  easeInOutCos,
  FLY_DURATION,
  ORBIT_LIMITS,
  type FlyState,
} from './CameraDirector'

interface CameraRigProps {
  cameraState: CameraState
  cameraRequestId: number
}

const DRIFT_AMP = 0.0035

export function CameraRig({ cameraState, cameraRequestId }: CameraRigProps) {
  const { camera, size } = useThree()
  const controlsRef = useRef<OrbitControlsImpl>(null!)
  const flyRef = useRef<FlyState | null>(null)
  const previousStateRef = useRef<CameraState | null>(null)
  const previousRequestRef = useRef<number | null>(null)
  const previousLayoutRef = useRef<string | null>(null)
  const timeRef = useRef(0)
  const aspect = size.width / Math.max(1, size.height)
  const poses = useMemo(() => buildPoses(aspect), [aspect])

  useEffect(() => {
    const pose = poses[cameraState]
    const perspective = camera as THREE.PerspectiveCamera
    const layoutKey = `${Math.round(size.width)}x${Math.round(size.height)}`
    const initial = previousStateRef.current === null
    const layoutChanged = previousLayoutRef.current !== null && previousLayoutRef.current !== layoutKey
    const stateChanged = previousStateRef.current !== cameraState
    const requestChanged = previousRequestRef.current !== cameraRequestId

    previousLayoutRef.current = layoutKey
    previousStateRef.current = cameraState
    previousRequestRef.current = cameraRequestId

    if (initial) {
      camera.position.copy(pose.position)
      perspective.fov = adaptFov(pose.fov, aspect)
      perspective.updateProjectionMatrix()
      if (controlsRef.current) {
        controlsRef.current.target.copy(pose.target)
        controlsRef.current.enabled = true
        controlsRef.current.update()
      }
      return
    }

    if (!layoutChanged && !stateChanged && !requestChanged) return

    const controls = controlsRef.current
    flyRef.current = {
      fromPos: camera.position.clone(),
      fromTarget: controls ? controls.target.clone() : pose.target.clone(),
      toPos: pose.position.clone(),
      toTarget: pose.target.clone(),
      fromFov: perspective.fov,
      toFov: adaptFov(pose.fov, aspect),
      elapsed: 0,
      duration: FLY_DURATION,
    }
    if (controls) controls.enabled = false
  }, [camera, cameraRequestId, cameraState, poses, size.height, size.width, aspect])

  useFrame((_, delta) => {
    timeRef.current += delta
    const camera3d = camera as THREE.PerspectiveCamera
    const controls = controlsRef.current
    const flight = flyRef.current

    if (flight) {
      flight.elapsed = Math.min(flight.elapsed + Math.min(delta, 0.05), flight.duration)
      const progress = easeInOutCos(flight.elapsed / flight.duration)
      camera.position.lerpVectors(flight.fromPos, flight.toPos, progress)
      if (controls) {
        controls.target.lerpVectors(flight.fromTarget, flight.toTarget, progress)
        controls.update()
      }
      camera3d.fov = flight.fromFov + (flight.toFov - flight.fromFov) * progress
      camera3d.updateProjectionMatrix()

      if (flight.elapsed >= flight.duration) {
        flyRef.current = null
        if (controls) {
          controls.enabled = true
          controls.update()
        }
      }
      return
    }

    if (cameraState === 'room') {
      const time = timeRef.current
      camera.position.x += Math.sin(time * 0.23) * DRIFT_AMP * delta
      camera.position.y += Math.sin(time * 0.31 + 1) * DRIFT_AMP * delta
    }
    if (controls) controls.update()
  })

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableZoom
      enableRotate
      dampingFactor={ORBIT_LIMITS.dampingFactor}
      rotateSpeed={ORBIT_LIMITS.rotateSpeed}
      zoomSpeed={ORBIT_LIMITS.zoomSpeed}
      minDistance={ORBIT_LIMITS.minDistance}
      maxDistance={ORBIT_LIMITS.maxDistance}
      minPolarAngle={ORBIT_LIMITS.minPolarAngle}
      maxPolarAngle={ORBIT_LIMITS.maxPolarAngle}
      minAzimuthAngle={ORBIT_LIMITS.minAzimuthAngle}
      maxAzimuthAngle={ORBIT_LIMITS.maxAzimuthAngle}
      makeDefault
    />
  )
}
