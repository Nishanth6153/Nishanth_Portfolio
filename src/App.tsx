import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { sceneStateMachine, SceneState } from './core/SceneStateMachine';
import { CameraRig } from './scene/CameraRig';
import { Lighting } from './scene/Lighting';
import { Room } from './scene/Room';
import { Window } from './scene/Window';
import { Desk } from './scene/Desk';
import { CrtScreen } from './scene/CrtScreen';
import { Props } from './scene/Props';
import { PORTFOLIO_CONTENT } from './core/content';

function checkWebGLAvailable(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl2') || canvas.getContext('webgl'))
    );
  } catch {
    return false;
  }
}

export const App: React.FC = () => {
  const [sceneState, setSceneState] = useState<SceneState>(() =>
    sceneStateMachine.getState()
  );
  const [webglSupported] = useState<boolean>(() => checkWebGLAvailable());

  useEffect(() => {
    const unsubscribe = sceneStateMachine.subscribe(setSceneState);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sceneStateMachine.getState().viewMode === 'desk') {
        sceneStateMachine.setViewMode('wide');
      } else if (e.key === 'Enter' && document.activeElement === document.body) {
        sceneStateMachine.toggleViewMode();
      } else if (e.key === ' ' && document.activeElement === document.body) {
        e.preventDefault();
        sceneStateMachine.toggleViewMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      unsubscribe();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!webglSupported) {
    return (
      <main className="webgl-fallback" role="main">
        <div className="fallback-terminal">
          <h1>{PORTFOLIO_CONTENT.osBanner}</h1>
          <p>{PORTFOLIO_CONTENT.systemHeader}</p>
          <ul>
            {PORTFOLIO_CONTENT.statusLines.map((line, idx) => (
              <li key={idx}>{line}</li>
            ))}
          </ul>
        </div>
      </main>
    );
  }

  return (
    <div className="portfolio-viewport">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.08,
        }}
        camera={{ position: [1.55, 1.68, 1.92], fov: 36, near: 0.1, far: 25 }}
      >
        <color attach="background" args={['#090d16']} />
        <fog attach="fog" args={['#090d16', 4.8, 12.5]} />

        <CameraRig
          viewMode={sceneState.viewMode}
          reducedMotion={sceneState.reducedMotion}
        />
        <Lighting crtPowered={sceneState.crtPowered} />

        <group>
          <Room />
          <Window />
          <Desk />
          <CrtScreen
            powered={sceneState.crtPowered}
            onTogglePower={() => sceneStateMachine.toggleCrtPower()}
          />
          <Props />
        </group>
      </Canvas>

      {/* Minimal, accessible camera & CRT controls */}
      <header className="hud-overlay" aria-label="Scene Camera Controls">
        <div className="hud-brand">
          <span className="hud-dot" />
          <span>LATE-90s WORKSTATION</span>
        </div>
        <nav className="hud-controls">
          <button
            type="button"
            className={`hud-btn ${sceneState.viewMode === 'wide' ? 'active' : ''}`}
            onClick={() => sceneStateMachine.setViewMode('wide')}
            aria-pressed={sceneState.viewMode === 'wide'}
          >
            Wide Room
          </button>
          <button
            type="button"
            className={`hud-btn ${sceneState.viewMode === 'desk' ? 'active' : ''}`}
            onClick={() => sceneStateMachine.setViewMode('desk')}
            aria-pressed={sceneState.viewMode === 'desk'}
          >
            Desk / CRT View
          </button>
          <button
            type="button"
            className="hud-btn secondary"
            onClick={() => sceneStateMachine.toggleCrtPower()}
            aria-pressed={sceneState.crtPowered}
          >
            CRT: {sceneState.crtPowered ? 'ON' : 'OFF'}
          </button>
        </nav>
      </header>
    </div>
  );
};

export default App;
