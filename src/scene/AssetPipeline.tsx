import { Html } from '@react-three/drei'
import { useEffect, useMemo, useRef, useState, type Dispatch } from 'react'
import { useFrame } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { gsap } from 'gsap'
import * as THREE from 'three'
import type { SceneAction } from '../core/SceneStateMachine'
import type { CameraState, PortfolioSection, WindowMode } from '../core/SceneStateMachine'
import type { ModelPlacement, Vec3 } from './layout'
import { MONITOR_SCREEN_LOCAL_POSITION } from './layout'
import { MonitorDesktop } from './MonitorDesktop'

export type AssetStatus = { label: string; src: string; status: 'loading' | 'ready' | 'missing'; detail?: string }

interface AssetPipelineProps {
  placements: readonly ModelPlacement[]
  monitorOn: boolean
  deskLampOn: boolean
  floorLampOn: boolean
  debug: boolean
  videoTexture: THREE.VideoTexture | null
  report: (status: AssetStatus) => void
  dispatch: Dispatch<SceneAction>
  onFocus: (position: Vec3) => void
  camera: CameraState
  section: PortfolioSection
  windowMode: WindowMode
  videoElement: HTMLVideoElement | null
  videoAvailable: boolean
  onSection: (section: PortfolioSection) => void
}

function AssetModel({ placement, monitorOn, deskLampOn, floorLampOn, debug, videoTexture, report, dispatch, onFocus,
  camera, section, windowMode, videoElement, videoAvailable, onSection }: {
  placement: ModelPlacement
  monitorOn: boolean
  deskLampOn: boolean
  floorLampOn: boolean
  debug: boolean
  videoTexture: THREE.VideoTexture | null
  report: AssetPipelineProps['report']
  dispatch: AssetPipelineProps['dispatch']
  onFocus: AssetPipelineProps['onFocus']
  camera: CameraState
  section: PortfolioSection
  windowMode: WindowMode
  videoElement: HTMLVideoElement | null
  videoAvailable: boolean
  onSection: AssetPipelineProps['onSection']
}) {
  const [object, setObject] = useState<THREE.Group | null>(null)
  const [hovered, setHovered] = useState(false)
  const [localBox, setLocalBox] = useState<THREE.Box3 | null>(null)
  const bulbTimeline = useRef<gsap.core.Timeline | null>(null)
  const [rainTexture, setRainTexture] = useState<THREE.Texture | null>(null)

  useEffect(() => {
    let alive = true
    const loader = new GLTFLoader()
    report({ label: placement.label, src: placement.src, status: 'loading' })
    loader.load(placement.src, gltf => {
      if (!alive) {
        disposeScene(gltf.scene)
        return
      }
      const asset = gltf.scene
      asset.name = placement.id
      asset.traverse(node => {
        if (!(node instanceof THREE.Mesh)) return
        node.castShadow = true
        node.receiveShadow = true
        node.material = Array.isArray(node.material)
          ? node.material.map(material => material.clone())
          : node.material.clone()
      })
      asset.updateMatrixWorld(true)
      setObject(asset)
      const bounds = new THREE.Box3().setFromObject(asset)
      setLocalBox(bounds)
      const contactDelta = bounds.min.y
      report({ label: placement.label, src: placement.src, status: 'ready', detail: placement.id === 'window'
        ? 'centered at the 1.4 × 1.2 m aperture'
        : `contact ${Math.abs(contactDelta) <= 0.02 ? 'PASS' : 'CHECK'} · Δ ${contactDelta.toFixed(3)} m` })
    }, undefined, error => {
      if (!alive) return
      const detail = error instanceof Error ? error.message : 'Asset file could not be loaded.'
      report({ label: placement.label, src: placement.src, status: 'missing', detail })
    })
    return () => { alive = false }
    // Each slot points to one immutable local GLB path.
  }, [placement.id, placement.label, placement.src, report])

  useEffect(() => {
    if (!object) return
    object.traverse(node => {
      if (!(node instanceof THREE.Mesh)) return
      const materials = Array.isArray(node.material) ? node.material : [node.material]
      const isScreen = `${node.name} ${materials.map(material => material.name).join(' ')}`.toLowerCase().includes('screen')
      if (isScreen) {
        if (!monitorOn) {
          materials.forEach(material => {
            if (material instanceof THREE.MeshStandardMaterial || material instanceof THREE.MeshPhysicalMaterial) {
              material.color.set('#020304')
              material.roughness = 0.12
              material.metalness = 0.1
              material.map = null
              material.emissiveMap = null
            }
            material.needsUpdate = true
          })
        } else if (videoTexture) {
          materials.forEach(material => {
            if (material instanceof THREE.MeshStandardMaterial || material instanceof THREE.MeshPhysicalMaterial) {
              material.map = videoTexture
              material.emissiveMap = videoTexture
              material.emissive.set('#ffffff')
              material.emissiveIntensity = 0.35
              material.roughness = 0.28
              material.needsUpdate = true
            }
          })
        }
      }
    })
  }, [object, placement.id, deskLampOn, floorLampOn, monitorOn, videoTexture])

  useEffect(() => {
    if (!object || (placement.id !== 'desk-lamp' && placement.id !== 'floor-lamp')) return
    const isOn = placement.id === 'desk-lamp' ? deskLampOn : floorLampOn
    const bulbs: THREE.MeshStandardMaterial[] = []
    object.traverse(node => {
      if (!(node instanceof THREE.Mesh) || !`${node.name} ${Array.isArray(node.material) ? node.material.map(material => material.name).join(' ') : node.material.name}`.toLowerCase().includes('bulb')) return
      const materials = Array.isArray(node.material) ? node.material : [node.material]
      materials.forEach(material => {
        if (material instanceof THREE.MeshStandardMaterial || material instanceof THREE.MeshPhysicalMaterial) {
          material.emissive.set('#ffd59a')
          bulbs.push(material)
        }
      })
    })
    const timeline = gsap.timeline({ paused: true })
    bulbs.forEach(material => timeline.to(material, { emissiveIntensity: isOn ? 2.2 : 0, duration: 0.3, ease: 'power2.inOut' }, 0))
    bulbTimeline.current = timeline
    return () => { timeline.kill(); if (bulbTimeline.current === timeline) bulbTimeline.current = null }
  }, [object, placement.id, deskLampOn, floorLampOn])

  useEffect(() => {
    if (!object) return
    object.traverse(node => {
      if (!(node instanceof THREE.Mesh)) return
      const materials = Array.isArray(node.material) ? node.material : [node.material]
      const isBulb = `${node.name} ${materials.map(material => material.name).join(' ')}`.toLowerCase().includes('bulb')
      if (isBulb) return
      materials.forEach(material => {
        if (!(material instanceof THREE.MeshStandardMaterial || material instanceof THREE.MeshPhysicalMaterial)) return
        const record = material.userData.hoverBase as { color: THREE.Color; intensity: number } | undefined
        if (!record) material.userData.hoverBase = { color: material.emissive.clone(), intensity: material.emissiveIntensity }
        const base = material.userData.hoverBase as { color: THREE.Color; intensity: number }
        material.emissive.copy(base.color)
        if (hovered) { material.emissive.add(new THREE.Color('#4b351c')); material.emissiveIntensity = Math.max(base.intensity, 0.16) }
        else material.emissiveIntensity = base.intensity
      })
    })
  }, [object, hovered])

  useEffect(() => {
    if (!object || placement.id !== 'window') return
    let alive = true
    let loadedTexture: THREE.Texture | null = null
    const loader = new THREE.TextureLoader()
    report({ label: 'Animated rain normal', src: '/assets/textures/rain-normal.webp', status: 'loading' })
    loader.load('/assets/textures/rain-normal.webp', texture => {
      if (!alive) { texture.dispose(); return }
      loadedTexture = texture
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set(1.5, 2)
      texture.colorSpace = THREE.NoColorSpace
      setRainTexture(texture)
      report({ label: 'Animated rain normal', src: '/assets/textures/rain-normal.webp', status: 'ready' })
    }, undefined, () => { if (alive) report({ label: 'Rain normal map', src: '/assets/textures/rain-normal.webp', status: 'missing' }) })
    return () => { alive = false; loadedTexture?.dispose() }
  }, [object, placement.id, report])

  useEffect(() => {
    if (!object || placement.id !== 'window') return
    object.traverse(node => {
      if (!(node instanceof THREE.Mesh) || !node.name.toLowerCase().includes('glass')) return
      const materials = Array.isArray(node.material) ? node.material : [node.material]
      materials.forEach(material => {
        if (material instanceof THREE.MeshStandardMaterial || material instanceof THREE.MeshPhysicalMaterial) {
          material.normalMap = windowMode === 'night-rain' ? rainTexture : null
          material.needsUpdate = true
        }
      })
    })
  }, [object, placement.id, rainTexture, windowMode])

  useFrame((_, delta) => {
    const bulb = bulbTimeline.current
    if (bulb && bulb.progress() < 1) bulb.totalTime(Math.min(bulb.totalDuration(), bulb.totalTime() + delta))
    if (!object || placement.id !== 'window' || windowMode !== 'night-rain') return
    object.traverse(node => {
      if (!(node instanceof THREE.Mesh) || !node.name.toLowerCase().includes('glass')) return
      const materials = Array.isArray(node.material) ? node.material : [node.material]
      materials.forEach(material => {
        if ((material instanceof THREE.MeshStandardMaterial || material instanceof THREE.MeshPhysicalMaterial) && material.normalMap) {
          material.normalMap.offset.y = (material.normalMap.offset.y - delta * 0.025) % 1
        }
      })
    })
  })

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : ''
    return () => { document.body.style.cursor = '' }
  }, [hovered])

  useEffect(() => () => {
    if (object) disposeScene(object)
  }, [object])

  const boxHelper = useMemo(() => localBox ? new THREE.Box3Helper(localBox, '#ff4664') : null, [localBox])
  useEffect(() => () => { boxHelper?.geometry.dispose(); (boxHelper?.material as THREE.Material | undefined)?.dispose() }, [boxHelper])

  if (!object) return null

  const activate = (event: { stopPropagation: () => void; object?: THREE.Object3D }) => {
    event.stopPropagation()
    const clickedName = event.object?.name.toLowerCase().replace(/[\s_-]/g, '') ?? ''
    switch (placement.interactive) {
      case 'desk-lamp': dispatch({ type: 'TOGGLE_DESK_LAMP' }); break
      case 'floor-lamp': dispatch({ type: 'TOGGLE_FLOOR_LAMP' }); break
      case 'monitor':
        if (clickedName.includes('powerbutton')) dispatch({ type: 'TOGGLE_MONITOR' })
        else dispatch({ type: 'SET_CAMERA', camera: 'monitor' })
        break
      case 'window': dispatch({ type: 'TOGGLE_WINDOW' }); break
      default: break
    }
  }
  const focus = (event: { stopPropagation: () => void }) => {
    event.stopPropagation()
    onFocus(placement.position)
  }

  return (
    <>
      <group
        name={`${placement.id}-placement`}
        position={placement.position as [number, number, number]}
        rotation={placement.rotation as [number, number, number]}
        scale={placement.scale as [number, number, number]}
        onClick={placement.interactive ? activate : undefined}
        onDoubleClick={focus}
        onPointerOver={event => { event.stopPropagation(); setHovered(true) }}
        onPointerOut={() => setHovered(false)}
      >
        <primitive object={object} />
        {debug && boxHelper && <primitive object={boxHelper} />}
        {placement.id === 'monitor' && camera === 'monitor' && monitorOn &&
          <Html transform occlude position={MONITOR_SCREEN_LOCAL_POSITION as [number, number, number]} center distanceFactor={1.2}>
            <MonitorDesktop section={section} video={videoElement} videoAvailable={videoAvailable} onSection={onSection} />
          </Html>}
        {hovered && <Html position={[0, Math.max(0.5, localBox?.max.y ?? 0.5), 0]} center distanceFactor={8}>
          <span className="scene-tooltip">{placement.label}{placement.interactive ? ' · click to interact · double-click to focus' : ' · double-click to focus'}{debug && localBox ? ` · ground Δ ${localBox.min.y.toFixed(3)} m` : ''}</span>
        </Html>}
      </group>
    </>
  )
}

export function AssetPipeline(props: AssetPipelineProps) {
  return <group name="glb-scene-assets">{props.placements.map(placement =>
    <AssetModel key={placement.id} placement={placement} monitorOn={props.monitorOn} deskLampOn={props.deskLampOn}
      floorLampOn={props.floorLampOn} debug={props.debug} videoTexture={props.videoTexture} report={props.report}
      dispatch={props.dispatch} onFocus={props.onFocus} camera={props.camera} section={props.section}
      windowMode={props.windowMode} videoElement={props.videoElement} videoAvailable={props.videoAvailable} onSection={props.onSection} />
  )}</group>
}

function disposeScene(root: THREE.Object3D) {
  const textures = new Set<THREE.Texture>()
  root.traverse(node => {
    if (!(node instanceof THREE.Mesh)) return
    node.geometry.dispose()
    const materials = Array.isArray(node.material) ? node.material : [node.material]
    materials.forEach(material => {
      for (const value of Object.values(material)) if (value instanceof THREE.Texture && !(value instanceof THREE.VideoTexture)) textures.add(value)
      material.dispose()
    })
  })
  textures.forEach(texture => texture.dispose())
}
