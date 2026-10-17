import { useEffect, useState } from 'react'
import * as THREE from 'three'
import type { WindowMode } from '../core/SceneStateMachine'
import type { AssetStatus } from './AssetPipeline'

const WINDOW_VIEW_POSITION: [number, number, number] = [0, 1.75, -2.15]
const WINDOW_VIEW_SIZE: [number, number] = [1.4, 1.2]

export function WindowView({ mode, report }: { mode: WindowMode; report: (status: AssetStatus) => void }) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null)
  const src = mode === 'day' ? '/assets/environment/day.webp' : '/assets/city-night.png'

  useEffect(() => {
    let alive = true
    let loadedTexture: THREE.Texture | null = null
    setTexture(null)
    const loader = new THREE.TextureLoader()
    report({ label: mode === 'day' ? 'Day exterior' : 'Night city plate', src, status: 'loading' })
    loader.load(src, loaded => {
      if (!alive) { loaded.dispose(); return }
      loadedTexture = loaded
      loaded.colorSpace = THREE.SRGBColorSpace
      loaded.anisotropy = 8
      setTexture(loaded)
      report({ label: mode === 'day' ? 'Day exterior' : 'Night city plate', src, status: 'ready' })
    }, undefined, () => { if (alive) report({ label: mode === 'day' ? 'Day exterior' : 'Night city plate', src, status: 'missing' }) })
    return () => { alive = false; loadedTexture?.dispose() }
  }, [src, mode, report])

  return texture ? <mesh name="window-city-image-plate" position={WINDOW_VIEW_POSITION}>
    <planeGeometry args={WINDOW_VIEW_SIZE} />
    <meshBasicMaterial map={texture} toneMapped={false} side={THREE.DoubleSide} />
  </mesh> : null
}
