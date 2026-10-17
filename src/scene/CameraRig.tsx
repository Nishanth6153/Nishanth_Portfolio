import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { gsap } from 'gsap'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import type { CameraState } from '../core/SceneStateMachine'
import type { Vec3 } from './layout'
import { getCameraPose, reducedMotionEnabled } from './CameraDirector'

export function CameraRig({ cameraState, cameraRequestId, focusTarget, onInteraction }: {
  cameraState: CameraState
  cameraRequestId: number
  focusTarget: Vec3 | null
  onInteraction: () => void
}) {
  const { camera, size } = useThree()
  const controlsRef = useRef<OrbitControlsImpl>(null!)
  const flightRef = useRef<gsap.core.Timeline | null>(null)
  const initializedRef = useRef(false)
  const aspect = size.width / Math.max(1, size.height)
  const pose = useMemo(() => getCameraPose(cameraState, aspect, focusTarget), [cameraState, aspect, focusTarget])

  useEffect(() => {
    const perspective = camera as THREE.PerspectiveCamera
    const controls = controlsRef.current
    flightRef.current?.kill()
    flightRef.current = null

    const setPose = () => {
      camera.position.copy(pose.position)
      camera.lookAt(pose.target)
      perspective.fov = pose.fov
      perspective.updateProjectionMatrix()
      if (controls) {
        controls.target.copy(pose.target)
        controls.update()
      }
    }

    if (!initializedRef.current || reducedMotionEnabled()) {
      setPose()
      initializedRef.current = true
      if (controls) controls.enabled = cameraState !== 'monitor'
      return
    }

    if (controls) controls.enabled = false
    const timeline = gsap.timeline({ paused: true, onComplete: () => {
      camera.position.copy(pose.position)
      if (controls) {
        controls.target.copy(pose.target)
        controls.enabled = cameraState !== 'monitor'
        controls.update()
      }
      camera.lookAt(pose.target)
      flightRef.current = null
    } })
    timeline.to(camera.position, { x: pose.position.x, y: pose.position.y, z: pose.position.z, duration: 1.2, ease: 'power2.inOut' }, 0)
    if (controls) timeline.to(controls.target, { x: pose.target.x, y: pose.target.y, z: pose.target.z, duration: 1.2, ease: 'power2.inOut' }, 0)
    timeline.to(perspective, { fov: pose.fov, duration: 1.2, ease: 'power2.inOut', onUpdate: () => perspective.updateProjectionMatrix() }, 0)
    flightRef.current = timeline
  }, [camera, cameraRequestId, cameraState, pose])

  useFrame((_, delta) => {
    const timeline = flightRef.current
    if (timeline) {
      timeline.totalTime(Math.min(timeline.totalDuration(), timeline.totalTime() + Math.min(delta, 0.05)))
      camera.lookAt(controlsRef.current?.target ?? pose.target)
    } else if (cameraState !== 'monitor') {
      controlsRef.current?.update()
    }
  })

  useEffect(() => () => { flightRef.current?.kill(); flightRef.current = null }, [])

  return <OrbitControls ref={controlsRef} makeDefault
    enablePan={false} enableRotate={cameraState !== 'monitor'} enableZoom={cameraState !== 'monitor'}
    minDistance={0.92} maxDistance={2.14}
    minAzimuthAngle={-0.48} maxAzimuthAngle={0.48}
    minPolarAngle={1.12} maxPolarAngle={1.96}
    dampingFactor={0.08} rotateSpeed={0.46} zoomSpeed={0.62} enableDamping
    onStart={onInteraction} />
}
