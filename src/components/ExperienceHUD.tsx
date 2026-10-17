import { useEffect, useRef, useState } from 'react'
import { ASSET_CREDITS, SITE } from '../content/site'
import type { AssetStatus } from '../scene/AssetPipeline'
import type { CameraState, PortfolioSection, QualityTier, SceneState, WindowMode } from '../core/SceneStateMachine'

export function ExperienceHUD({ state, statuses, canEnter, hintVisible, onCamera, onSection, onToggleDeskLamp, onToggleFloorLamp,
  onToggleMonitor, onToggleWindow, onQuality, onDebug, onReset, onEnter, onHideHint }: {
  state: SceneState
  statuses: AssetStatus[]
  canEnter: boolean
  hintVisible: boolean
  onCamera: (camera: CameraState) => void
  onSection: (section: PortfolioSection) => void
  onToggleDeskLamp: () => void
  onToggleFloorLamp: () => void
  onToggleMonitor: () => void
  onToggleWindow: (mode: WindowMode) => void
  onQuality: (quality: QualityTier) => void
  onDebug: () => void
  onReset: () => void
  onEnter: () => void
  onHideHint: () => void
}) {
  const [creditsOpen, setCreditsOpen] = useState(false)
  const creditsTrigger = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!creditsOpen) return
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setCreditsOpen(false); creditsTrigger.current?.focus() }
    }
    window.addEventListener('keydown', escape)
    return () => window.removeEventListener('keydown', escape)
  }, [creditsOpen])
  const missing = statuses.filter(asset => asset.status === 'missing')
  const ready = statuses.filter(asset => asset.status === 'ready')
  const loading = statuses.filter(asset => asset.status === 'loading')
  const totalSlots = 23 // 12 GLBs, 8 surface maps, night plate, HDRI and local video probe
  const complete = statuses.length >= totalSlots && loading.length === 0 && missing.length === 0

  if (!state.entered) return <section className="preloader" aria-labelledby="preloader-title">
    <div className="preloader__panel">
      <p className="eyebrow">INTERACTIVE ROOM · 4 × 3.2 × 2.6 METRES</p>
      <h1 id="preloader-title">{SITE.title}</h1>
      <p className="preloader__status" role="status">{!canEnter ? `Preparing scene assets · ${ready.length} resolved` : missing.length ? `Scene rebuild · ${missing.length} required assets missing` : 'Scene ready'}</p>
      <div className="preloader__meter" aria-hidden="true"><span style={{ width: `${Math.min(100, statuses.length / totalSlots * 100)}%` }} /></div>
      <button type="button" className="preloader__enter" onClick={onEnter} disabled={!canEnter}>
        {canEnter ? 'Enter room' : 'Preparing…'}
      </button>
      {!complete && canEnter && <p className="preloader__note">The room shell will open with empty asset mounts. See ASSETS_NEEDED.md for the required licensed models and textures.</p>}
    </div>
  </section>

  return <>
    <a className="skip-link" href="#scene-controls">Skip to scene controls</a>
    <header className="site-header">
      <a className="brand" href="#home" aria-label="Portfolio home">{SITE.name || SITE.title}</a>
      <nav aria-label="Portfolio windows">
        {(['about', 'work', 'posts', 'online', 'video'] as const).map(section =>
          <button key={section} type="button" aria-current={state.camera === 'monitor' && state.section === section ? 'page' : undefined}
            onClick={() => onSection(section)}>{section.toUpperCase()}</button>)}
      </nav>
    </header>

    <nav id="scene-controls" className="camera-controls" aria-label="Camera view">
      {(['room', 'desk', 'monitor'] as const).map(camera => <button key={camera} type="button" aria-pressed={state.camera === camera} onClick={() => onCamera(camera)}>{camera}</button>)}
      <button type="button" onClick={onReset}>Reset view</button>
    </nav>

    <section className="interaction-controls" aria-label="Room interactions">
      <button type="button" aria-label={`Desk lamp ${state.deskLampOn ? 'on' : 'off'}`} aria-pressed={state.deskLampOn} onClick={onToggleDeskLamp}>Desk lamp <b>{state.deskLampOn ? 'ON' : 'OFF'}</b></button>
      <button type="button" aria-label={`Floor lamp ${state.floorLampOn ? 'on' : 'off'}`} aria-pressed={state.floorLampOn} onClick={onToggleFloorLamp}>Floor lamp <b>{state.floorLampOn ? 'ON' : 'OFF'}</b></button>
      <button type="button" aria-label={`Monitor power ${state.monitorOn ? 'on' : 'off'}`} aria-pressed={state.monitorOn} onClick={onToggleMonitor}>Monitor <b>{state.monitorOn ? 'ON' : 'OFF'}</b></button>
      <button type="button" aria-label={`Window view: ${state.windowMode === 'day' ? 'day' : 'night rain'}`} onClick={() => onToggleWindow(state.windowMode === 'day' ? 'night-rain' : 'day')}>Window <b>{state.windowMode === 'day' ? 'DAY' : 'NIGHT · RAIN'}</b></button>
      <label>Quality <select aria-label="Graphics quality" value={state.quality} onChange={event => onQuality(event.currentTarget.value as QualityTier)}><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></label>
      <button type="button" aria-pressed={state.debug} onClick={onDebug}>Bounds / contact check</button>
    </section>

    <div className="scene-hud-footer">
      <div className="scene-hud-hint" onPointerDown={onHideHint} aria-live="polite">{hintVisible ? 'Drag to look · pinch or wheel to zoom · double-click an object to focus' : 'Room view · interactive scene'}</div>
      <div className="scene-hud-actions">
        <span className="asset-status" role="status">{missing.length ? `${missing.length} scene assets missing` : loading.length ? `${loading.length} loading` : 'Scene assets ready'}</span>
        <button ref={creditsTrigger} type="button" onClick={() => setCreditsOpen(true)}>Credits</button>
        {state.camera === 'monitor' && <button type="button" onClick={() => onCamera('room')}>Back to room · Esc</button>}
      </div>
    </div>

    {state.debug && <aside className="asset-debug" aria-label="Asset and floor contact diagnostics">
      <h2>Scene asset diagnostics</h2>
      <p>{ready.length} loaded · {loading.length} loading · {missing.length} missing. Debug boxes show each loaded GLB's bounds.</p>
      <ul>{statuses.map(item => <li key={item.src} data-state={item.status}><span>{item.label}</span><code>{item.status === 'ready' ? item.detail ?? 'contact origin not reported' : item.status === 'missing' ? `Missing · ${item.src}` : 'Loading'}</code></li>)}</ul>
    </aside>}

    {state.camera === 'monitor' && !state.monitorOn && <section className="monitor-off" role="status"><p>Monitor is powered off.</p><button type="button" onClick={onToggleMonitor}>Power on monitor</button><button type="button" onClick={() => onCamera('room')}>Back to room</button></section>}

    {creditsOpen && <div className="dialog-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setCreditsOpen(false) }}>
      <section className="credits-panel" role="dialog" aria-modal="true" aria-labelledby="credits-title">
        <div className="content-panel__topline"><span>ASSET ATTRIBUTION</span><button autoFocus type="button" onClick={() => setCreditsOpen(false)} aria-label="Close credits">×</button></div>
        <h2 id="credits-title">Credits</h2>
        {ASSET_CREDITS.length ? <ul>{ASSET_CREDITS.map(credit => <li key={credit.url}><a href={credit.url} target="_blank" rel="noreferrer">{credit.title}</a> — {credit.author}, {credit.license}</li>)}</ul> : <p>No third-party models or textures are bundled yet. Credits will be populated from the verified source details when the approved assets are added.</p>}
        <button type="button" onClick={() => setCreditsOpen(false)}>Close</button>
      </section>
    </div>}
  </>
}
