import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { glassMat, trimMat } from './materials'
import { LAYOUT } from './layout'

const windowLayout = LAYOUT.window
const rainLayout = windowLayout.rain
const drops = rainLayout.drops

const cityMassMaterials = [
  new THREE.MeshStandardMaterial({ color: '#18212c', roughness: 0.96 }),
  new THREE.MeshStandardMaterial({ color: '#202936', roughness: 0.93 }),
  new THREE.MeshStandardMaterial({ color: '#121b24', roughness: 0.97 }),
]
const windowGlowMaterials = [
  new THREE.MeshBasicMaterial({ color: '#94744f', toneMapped: false }),
  new THREE.MeshBasicMaterial({ color: '#667c8d', toneMapped: false }),
  new THREE.MeshBasicMaterial({ color: '#7b674d', toneMapped: false }),
]

function CityDepth() {
  return (
    <group name="city-parallax-layers" position={windowLayout.cityRoot.position} rotation={windowLayout.cityRoot.rotation} scale={windowLayout.cityRoot.scale}>
      {windowLayout.cityBlocks.map((building, buildingIndex) => {
        const material = cityMassMaterials[buildingIndex % cityMassMaterials.length]
        return (
          <group
            key={building.seed}
            name={`city-block-${building.seed}`}
            position={building.transform.position}
            rotation={building.transform.rotation}
            scale={building.transform.scale}
          >
            <mesh
              name={`city-building-mass-${building.seed}`}
              position={building.mass.position}
              rotation={building.mass.rotation}
              scale={building.mass.scale}
              material={material}
            >
              <boxGeometry args={[building.width, building.height, building.depth]} />
            </mesh>
            {building.windows.map(cityWindow => (
              <mesh
                key={cityWindow.key}
                name={`city-window-${building.seed}-${cityWindow.key}`}
                position={cityWindow.transform.position}
                rotation={cityWindow.transform.rotation}
                scale={cityWindow.transform.scale}
                material={windowGlowMaterials[cityWindow.materialIndex]}
              >
                <planeGeometry args={windowLayout.cityWindowSize.slice(0, 2) as [number, number]} />
              </mesh>
            ))}
          </group>
        )
      })}
    </group>
  )
}

function RainStreaks() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const positions = useRef(drops.map(drop => ({ x: drop.x, y: drop.y })))

  useEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return
    drops.forEach((drop, i) => {
      const p = positions.current[i]
      dummy.position.set(p.x, p.y, rainLayout.z)
      dummy.rotation.z = drop.tilt
      dummy.scale.set(drop.width, drop.height, rainLayout.depthThickness)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
      mesh.setColorAt(i, new THREE.Color().setRGB(drop.brightness, drop.brightness, drop.brightness))
    })
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [dummy])

  useFrame((_, delta) => {
    const mesh = meshRef.current
    if (!mesh) return
    const step = Math.min(delta, 0.05)
    drops.forEach((drop, i) => {
      const p = positions.current[i]
      p.y -= drop.speed * step
      p.x += drop.drift * step
      if (p.y < -rainLayout.bottomMargin) {
        p.y = windowLayout.height + drop.height
        p.x = drop.homeX
      }
      if (p.x < -windowLayout.width * rainLayout.xMargin) p.x = windowLayout.width * rainLayout.xMargin
      if (p.x > windowLayout.width * rainLayout.xMargin) p.x = -windowLayout.width * rainLayout.xMargin
      dummy.position.set(p.x, p.y, rainLayout.z)
      dummy.rotation.z = drop.tilt
      dummy.scale.set(drop.width, drop.height, rainLayout.depthThickness)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh
      ref={meshRef}
      name="rain-streak-instances"
      position={rainLayout.root.position}
      rotation={rainLayout.root.rotation}
      scale={rainLayout.root.scale}
      args={[undefined, undefined, drops.length]}
      frustumCulled={false}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#afc1d2" transparent opacity={0.34} toneMapped={false} depthWrite={false} />
    </instancedMesh>
  )
}

export function Window() {
  const texture = useLoader(THREE.TextureLoader, '/assets/city-night.png')
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  texture.repeat.set(0.31, 1)
  texture.offset.set(0.345, 0)
  const cityMaterial = useMemo(() => new THREE.MeshBasicMaterial({ map: texture, color: '#a7b3c4', toneMapped: false, side: THREE.DoubleSide }), [texture])
  const window = windowLayout

  return (
    <group name="window-assembly" position={window.root.position} rotation={window.root.rotation} scale={window.root.scale}>
      <mesh name="city-backdrop" position={window.backdrop.transform.position} rotation={window.backdrop.transform.rotation} scale={window.backdrop.transform.scale} material={cityMaterial}>
        <planeGeometry args={window.backdrop.size.slice(0, 2) as [number, number]} />
      </mesh>
      <CityDepth />
      <mesh name="window-glass" position={window.glass.transform.position} rotation={window.glass.transform.rotation} scale={window.glass.transform.scale} material={glassMat}>
        <planeGeometry args={window.glass.size.slice(0, 2) as [number, number]} />
      </mesh>
      <mesh name="window-frame-top" position={window.frameTop.transform.position} rotation={window.frameTop.transform.rotation} scale={window.frameTop.transform.scale} material={trimMat}>
        <boxGeometry args={window.frameTop.size} />
      </mesh>
      <mesh name="window-sill" position={window.sill.transform.position} rotation={window.sill.transform.rotation} scale={window.sill.transform.scale} castShadow material={trimMat}>
        <boxGeometry args={window.sill.size} />
      </mesh>
      <mesh name="window-frame-left" position={window.frameLeft.transform.position} rotation={window.frameLeft.transform.rotation} scale={window.frameLeft.transform.scale} material={trimMat}>
        <boxGeometry args={window.frameLeft.size} />
      </mesh>
      <mesh name="window-frame-right" position={window.frameRight.transform.position} rotation={window.frameRight.transform.rotation} scale={window.frameRight.transform.scale} material={trimMat}>
        <boxGeometry args={window.frameRight.size} />
      </mesh>
      <mesh name="window-mullion" position={window.mullion.transform.position} rotation={window.mullion.transform.rotation} scale={window.mullion.transform.scale} material={trimMat}>
        <boxGeometry args={window.mullion.size} />
      </mesh>
      <RainStreaks />
    </group>
  )
}
