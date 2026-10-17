import { useEffect, useMemo, useState } from 'react'
import * as THREE from 'three'
import type { AssetStatus } from './AssetPipeline'
import { ROOM_SIZE } from './layout'

type PbrMaps = { map?: THREE.Texture; normalMap?: THREE.Texture; roughnessMap?: THREE.Texture; aoMap?: THREE.Texture }
type MapKey = keyof PbrMaps
const MAP_FILES: readonly [string, MapKey][] = [['albedo.webp', 'map'], ['normal.webp', 'normalMap'], ['roughness.webp', 'roughnessMap'], ['ao.webp', 'aoMap']]
const FLOOR_REPEAT: [number, number] = [2.4, 2]
const WALL_REPEAT: [number, number] = [2, 1.4]

function usePbrMaps(folder: string, repeat: [number, number], report: (status: AssetStatus) => void): PbrMaps {
  const [maps, setMaps] = useState<PbrMaps>({})
  useEffect(() => {
    let active = true
    const loaded: PbrMaps = {}
    const loader = new THREE.TextureLoader()
    MAP_FILES.forEach(([filename, key]) => {
      const src = `${folder}/${filename}`
      loader.load(src, texture => {
        if (!active) { texture.dispose(); return }
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(...repeat)
        texture.anisotropy = 8
        texture.colorSpace = key === 'map' ? THREE.SRGBColorSpace : THREE.NoColorSpace
        loaded[key] = texture
        setMaps({ ...loaded })
        report({ label: `${folder} · ${filename}`, src, status: 'ready' })
      }, undefined, () => {
        if (active) report({ label: `${folder} · ${filename}`, src, status: 'missing' })
      })
    })
    return () => { active = false; Object.values(loaded).forEach(texture => texture?.dispose()) }
  }, [folder, repeat, report])
  return maps
}

function makeMaterial(color: string, maps: PbrMaps) {
  return new THREE.MeshStandardMaterial({ color, map: maps.map, normalMap: maps.normalMap, roughnessMap: maps.roughnessMap, aoMap: maps.aoMap, roughness: 0.82, metalness: 0 })
}

const WALL_THICKNESS = 0.12
const FLOOR_POSITION: [number, number, number] = [0, 0, 0]
const FLOOR_SIZE: [number, number, number] = [ROOM_SIZE.width, 0.08, ROOM_SIZE.depth]
const CEILING_POSITION: [number, number, number] = [0, ROOM_SIZE.height, 0]
const CEILING_SIZE: [number, number, number] = [ROOM_SIZE.width, 0.08, ROOM_SIZE.depth]
const REAR_WALL_Z = -ROOM_SIZE.depth / 2
const REAR_WALL_LOWER_POSITION: [number, number, number] = [0, 0.575, REAR_WALL_Z]
const REAR_WALL_LOWER_SIZE: [number, number, number] = [ROOM_SIZE.width, 1.15, WALL_THICKNESS]
const REAR_WALL_UPPER_POSITION: [number, number, number] = [0, 2.475, REAR_WALL_Z]
const REAR_WALL_UPPER_SIZE: [number, number, number] = [ROOM_SIZE.width, 0.25, WALL_THICKNESS]
const REAR_WALL_LEFT_POSITION: [number, number, number] = [-1.7, 1.75, REAR_WALL_Z]
const REAR_WALL_RIGHT_POSITION: [number, number, number] = [1.7, 1.75, REAR_WALL_Z]
const REAR_WALL_WINDOW_SIDE_SIZE: [number, number, number] = [0.6, 1.2, WALL_THICKNESS]
const LEFT_WALL_POSITION: [number, number, number] = [-ROOM_SIZE.width / 2, ROOM_SIZE.height / 2, 0]
const RIGHT_WALL_POSITION: [number, number, number] = [ROOM_SIZE.width / 2, ROOM_SIZE.height / 2, 0]
const SIDE_WALL_SIZE: [number, number, number] = [WALL_THICKNESS, ROOM_SIZE.height, ROOM_SIZE.depth]

export function Room({ report }: { report: (status: AssetStatus) => void }) {
  const floorMaps = usePbrMaps('/assets/textures/wood-floor', FLOOR_REPEAT, report)
  const wallMaps = usePbrMaps('/assets/textures/wall-plaster', WALL_REPEAT, report)
  const floorMaterial = useMemo(() => makeMaterial('#6b5540', floorMaps), [floorMaps])
  const wallMaterial = useMemo(() => makeMaterial('#b7a38b', wallMaps), [wallMaps])
  useEffect(() => () => { floorMaterial.dispose(); wallMaterial.dispose() }, [floorMaterial, wallMaterial])
  return <group name="room-shell-4m-x-3_2m-x-2_6m">
    <mesh name="wood-floor-shell" position={FLOOR_POSITION} receiveShadow material={floorMaterial}><boxGeometry args={FLOOR_SIZE} /></mesh>
    <mesh name="plaster-ceiling-shell" position={CEILING_POSITION} receiveShadow material={wallMaterial}><boxGeometry args={CEILING_SIZE} /></mesh>
    <mesh name="plaster-rear-lower" position={REAR_WALL_LOWER_POSITION} receiveShadow material={wallMaterial}><boxGeometry args={REAR_WALL_LOWER_SIZE} /></mesh>
    <mesh name="plaster-rear-upper" position={REAR_WALL_UPPER_POSITION} receiveShadow material={wallMaterial}><boxGeometry args={REAR_WALL_UPPER_SIZE} /></mesh>
    <mesh name="plaster-rear-window-left" position={REAR_WALL_LEFT_POSITION} receiveShadow material={wallMaterial}><boxGeometry args={REAR_WALL_WINDOW_SIDE_SIZE} /></mesh>
    <mesh name="plaster-rear-window-right" position={REAR_WALL_RIGHT_POSITION} receiveShadow material={wallMaterial}><boxGeometry args={REAR_WALL_WINDOW_SIDE_SIZE} /></mesh>
    <mesh name="plaster-left-wall" position={LEFT_WALL_POSITION} receiveShadow material={wallMaterial}><boxGeometry args={SIDE_WALL_SIZE} /></mesh>
    <mesh name="plaster-right-wall" position={RIGHT_WALL_POSITION} receiveShadow material={wallMaterial}><boxGeometry args={SIDE_WALL_SIZE} /></mesh>
  </group>
}
