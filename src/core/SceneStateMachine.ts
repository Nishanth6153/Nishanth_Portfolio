export type CameraState = 'room' | 'desk' | 'monitor'
export type WindowMode = 'night-rain' | 'day'
export type QualityTier = 'high' | 'medium' | 'low'
export type PortfolioSection = 'about' | 'work' | 'posts' | 'online' | 'video'

export interface SceneState {
  camera: CameraState
  section: PortfolioSection
  windowMode: WindowMode
  quality: QualityTier
  deskLampOn: boolean
  floorLampOn: boolean
  monitorOn: boolean
  debug: boolean
  entered: boolean
}

export const INITIAL_STATE: SceneState = {
  camera: 'room',
  section: 'about',
  windowMode: 'night-rain',
  quality: 'high',
  deskLampOn: true,
  floorLampOn: true,
  monitorOn: true,
  debug: false,
  entered: false,
}

export type SceneAction =
  | { type: 'SET_CAMERA'; camera: CameraState }
  | { type: 'SET_SECTION'; section: PortfolioSection }
  | { type: 'TOGGLE_DESK_LAMP' }
  | { type: 'TOGGLE_FLOOR_LAMP' }
  | { type: 'TOGGLE_MONITOR' }
  | { type: 'TOGGLE_WINDOW' }
  | { type: 'SET_QUALITY'; quality: QualityTier }
  | { type: 'TOGGLE_DEBUG' }
  | { type: 'ENTER' }
  | { type: 'RESET' }
  | { type: 'ESC' }

export function sceneReducer(state: SceneState, action: SceneAction): SceneState {
  switch (action.type) {
    case 'SET_CAMERA': return { ...state, camera: action.camera }
    case 'SET_SECTION': return { ...state, section: action.section, camera: 'monitor' }
    case 'TOGGLE_DESK_LAMP': return { ...state, deskLampOn: !state.deskLampOn }
    case 'TOGGLE_FLOOR_LAMP': return { ...state, floorLampOn: !state.floorLampOn }
    case 'TOGGLE_MONITOR': return { ...state, monitorOn: !state.monitorOn }
    case 'TOGGLE_WINDOW': return { ...state, windowMode: state.windowMode === 'day' ? 'night-rain' : 'day' }
    case 'SET_QUALITY': return { ...state, quality: action.quality }
    case 'TOGGLE_DEBUG': return { ...state, debug: !state.debug }
    case 'ENTER': return { ...state, entered: true }
    case 'RESET': return { ...INITIAL_STATE, entered: state.entered }
    case 'ESC': return { ...state, camera: 'room' }
    default: return state
  }
}
