import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import * as THREE from 'three'
import type { WindowMode } from '../core/SceneStateMachine'
import type { AssetStatus } from './AssetPipeline'

const HDRI_PATH = '/assets/hdri/interior-studio-2k.hdr'

export function EnvironmentRig({ mode, report }: { mode: WindowMode; report: (status: AssetStatus) => void }) {
  const { scene } = useThree()
  useEffect(() => {
    let alive = true
    let loadedTexture: THREE.DataTexture | null = null
    const previousEnvironment = scene.environment
    report({ label: 'Neutral interior HDRI', src: HDRI_PATH, status: 'loading' })
    new RGBELoader().load(HDRI_PATH, texture => {
      if (!alive) { texture.dispose(); return }
      loadedTexture = texture
      texture.mapping = THREE.EquirectangularReflectionMapping
      scene.environment = texture
      report({ label: 'Neutral interior HDRI', src: HDRI_PATH, status: 'ready' })
    }, undefined, () => {
      if (alive) report({ label: 'Neutral interior HDRI', src: HDRI_PATH, status: 'missing' })
    })
    return () => {
      alive = false
      if (scene.environment === loadedTexture) scene.environment = previousEnvironment
      loadedTexture?.dispose()
    }
  }, [report, scene])

  useEffect(() => {
    scene.background = new THREE.Color(mode === 'day' ? '#75879a' : '#101621')
    scene.environmentIntensity = mode === 'day' ? 0.24 : 0.12
  }, [mode, scene])
  return null
}
