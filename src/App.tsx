import { Component, Suspense, useEffect, useReducer, useState, type ReactNode } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { INITIAL_STATE, sceneReducer, type CameraState } from './core/SceneStateMachine'
import { Room } from './scene/Room'
import { Desk } from './scene/Desk'
import { Window } from './scene/Window'
import { Lighting } from './scene/Lighting'
import { Props } from './scene/Props'
import { CameraRig } from './scene/CameraRig'

function canStartWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
    context?.getExtension('WEBGL_lose_context')?.loseContext()
    return Boolean(context)
  } catch {
    return false
  }
}

function Fallback({ contextLost = false }: { contextLost?: boolean }) {
  return (
    <main className="fallback" role="main">
      <div className="fallback-card">
        <p className="eyebrow">PORTFOLIO · ROOM STUDY</p>
        <h1>{contextLost ? 'The 3D view paused' : '3D is unavailable here'}</h1>
        <p>
          {contextLost
            ? 'The browser reset its graphics context. Reload this preview to try again.'
            : 'This prototype needs WebGL to render its room. Try a current browser with hardware acceleration enabled.'}
        </p>
        <div className="fallback-scene" aria-label="Scene contents">
          <span>Room</span><span>Desk</span><span>Vintage computer</span><span>Night window</span>
        </div>
        {contextLost && <button onClick={() => window.location.reload()}>Reload preview</button>}
      </div>
    </main>
  )
}

class CanvasBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? <Fallback /> : this.props.children }
}

function Scene({ cameraState, cameraRequestId, onContextLost }: {
  cameraState: CameraState
  cameraRequestId: number
  onContextLost: () => void
}) {
  const { gl, scene } = useThree()
  useEffect(() => {
    scene.background = new THREE.Color('#080b12')
    const canvas = gl.domElement
    const handleLost = (event: Event) => {
      event.preventDefault()
      onContextLost()
    }
    canvas.addEventListener('webglcontextlost', handleLost)
    return () => canvas.removeEventListener('webglcontextlost', handleLost)
  }, [gl, scene, onContextLost])

  return (
    <>
      <CameraRig cameraState={cameraState} cameraRequestId={cameraRequestId} />
      <Lighting />
      <Room />
      <Window />
      <Desk />
      <Props />
    </>
  )
}

const INITIAL_CAMERA = { fov: 44, near: 0.05, far: 40, position: [0.05, 2.02, 4.25] as [number, number, number] }

export default function App() {
  const [webGL, setWebGL] = useState<boolean | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [contextLost, setContextLost] = useState(false)
  const [sceneState, dispatch] = useReducer(sceneReducer, INITIAL_STATE)
  const [cameraRequestId, setCameraRequestId] = useState(0)
  const cameraState = sceneState.camera

  useEffect(() => {
    setWebGL(canStartWebGL())
  }, [])

  const selectCamera = (next: CameraState) => {
    dispatch({ type: next === 'room' ? 'GO_ROOM' : 'GO_DESK' })
    setCameraRequestId(request => request + 1)
  }

  if (webGL === false || contextLost) return <Fallback contextLost={contextLost} />

  return (
    <main className="experience" aria-busy={!loaded}>
      {webGL === null && <div className="loading" role="status">Preparing the room…</div>}
      <CanvasBoundary>
        <Canvas
          shadows
          dpr={[1, Math.min(window.devicePixelRatio || 1, 1.75)]}
          gl={{ antialias: true, powerPreference: 'high-performance', alpha: false }}
          camera={INITIAL_CAMERA}
          onCreated={({ gl }) => {
            gl.outputColorSpace = THREE.SRGBColorSpace
            gl.toneMapping = THREE.ACESFilmicToneMapping
            gl.toneMappingExposure = 1.0
            window.setTimeout(() => setLoaded(true), 180)
          }}
          style={{ position: 'absolute', inset: 0, touchAction: 'none' }}
        >
          <Suspense fallback={null}>
            <Scene
              cameraState={cameraState}
              cameraRequestId={cameraRequestId}
              onContextLost={() => setContextLost(true)}
            />
          </Suspense>
        </Canvas>
      </CanvasBoundary>
      {!loaded && webGL && <div className="loading" role="status">Preparing the room…</div>}
      <nav className="camera-presets" aria-label="Camera views">
        <button type="button" aria-pressed={cameraState === 'room'} onClick={() => selectCamera('room')}>Room view</button>
        <button type="button" aria-pressed={cameraState === 'desk'} onClick={() => selectCamera('desk')}>Desk view</button>
      </nav>
      <div className="scene-label" aria-hidden="true">
        <span>PORTFOLIO · ROOM STUDY</span>
        <span className="scene-help">Drag to look <i>·</i> scroll or pinch to zoom</span>
      </div>
      <div className="sr-only" role="status" aria-live="polite">
        Camera view: {cameraState === 'room' ? 'Full room' : 'Desk close-up'}.
      </div>
    </main>
  )
}
