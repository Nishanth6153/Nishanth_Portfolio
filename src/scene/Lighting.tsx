import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { gsap } from 'gsap'
import * as THREE from 'three'
import type { QualityTier, WindowMode } from '../core/SceneStateMachine'

interface LightingProps {
  deskLampOn: boolean
  floorLampOn: boolean
  monitorOn: boolean
  windowMode: WindowMode
  quality: QualityTier
}

export function Lighting({ deskLampOn, floorLampOn, monitorOn, windowMode, quality }: LightingProps) {
  const deskSpot = useRef<THREE.SpotLight>(null!)
  const floorSpot = useRef<THREE.SpotLight>(null!)
  const monitorSpill = useRef<THREE.PointLight>(null!)
  const deskTarget = useRef<THREE.Object3D>(null!)
  const floorTarget = useRef<THREE.Object3D>(null!)
  const timelines = useRef<gsap.core.Timeline[]>([])

  useEffect(() => {
    const desk = gsap.timeline({ paused: true }).to(deskSpot.current, { intensity: deskLampOn ? 22 : 0, duration: 0.3, ease: 'power2.inOut' })
    const floor = gsap.timeline({ paused: true }).to(floorSpot.current, { intensity: floorLampOn ? 8 : 0, duration: 0.3, ease: 'power2.inOut' })
    const monitor = gsap.timeline({ paused: true }).to(monitorSpill.current, { intensity: monitorOn ? 2.2 : 0, duration: 0.3, ease: 'power2.inOut' })
    timelines.current = [desk, floor, monitor]
    for (const timeline of timelines.current) timeline.paused(true)
    return () => { timelines.current.forEach(timeline => timeline.kill()); timelines.current = [] }
  }, [deskLampOn, floorLampOn, monitorOn])

  useEffect(() => {
    if (deskSpot.current && deskTarget.current) deskSpot.current.target = deskTarget.current
    if (floorSpot.current && floorTarget.current) floorSpot.current.target = floorTarget.current
  }, [])

  useFrame((_, delta) => {
    for (const timeline of timelines.current) {
      if (timeline.progress() < 1) timeline.totalTime(Math.min(timeline.totalDuration(), timeline.totalTime() + delta))
    }
  })

  const day = windowMode === 'day'
  const shadowSize = quality === 'high' ? 2048 : quality === 'medium' ? 1024 : 512
  return (
    <group name="photometric-light-rig">
      <hemisphereLight name="window-sky-ambient" args={[day ? '#dceaff' : '#9ba9c2', '#524538', day ? 0.72 : 0.2]} />
      <ambientLight name="room-base-fill" color={day ? '#f5e9d6' : '#a8b5d2'} intensity={day ? 0.48 : 0.18} />
      <directionalLight name="window-daylight" color={day ? '#fff1d8' : '#8da6ce'} intensity={day ? 1.8 : 0.55}
        position={[-0.2, 2.45, -1.3]} castShadow shadow-mapSize={[shadowSize, shadowSize]} shadow-bias={-0.0002} shadow-normalBias={0.02} />
      <object3D ref={deskTarget} name="desk-lamp-aim-point" position={[-0.15, 0.75, -0.65]} />
      <object3D ref={floorTarget} name="floor-lamp-aim-point" position={[1.1, 0.7, -0.55]} />
      <spotLight ref={deskSpot} name="desk-lamp-spot" color="#ffd09a" position={[-0.53, 1.42, -1.25]} intensity={0}
        distance={2.1} angle={0.55} penumbra={0.75} decay={2} castShadow shadow-mapSize={[512, 512]} />
      <spotLight ref={floorSpot} name="floor-lamp-spot" color="#ffc882" position={[1.62, 1.9, -1.12]} intensity={0}
        distance={3.4} angle={0.72} penumbra={0.9} decay={2} castShadow={false} />
      <pointLight ref={monitorSpill} name="monitor-screen-spill" color="#8da9ff" position={[0, 1.08, -1.22]}
        intensity={0} distance={1.9} decay={2} />
    </group>
  )
}
