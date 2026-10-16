/**
 * Minimal typed scene state retained for the existing portfolio prototype.
 * This milestone exposes only the approved room and desk camera presets.
 */

export type CameraState = 'room' | 'desk'

export type OverlayState =
  | 'none'
  | 'credits'

export type ContentState =
  | 'none'
  | 'about'
  | 'work'
  | 'posts'
  | 'online'

export interface SceneState {
  camera: CameraState
  overlay: OverlayState
  content: ContentState
  isTransitioning: boolean
}

export type SceneAction =
  | { type: 'GO_ROOM' }
  | { type: 'GO_DESK' }
  | { type: 'OPEN_CONTENT'; content: ContentState }
  | { type: 'CLOSE_CONTENT' }
  | { type: 'OPEN_CREDITS' }
  | { type: 'CLOSE_CREDITS' }
  | { type: 'TRANSITION_START' }
  | { type: 'TRANSITION_END' }
  | { type: 'ESC' }

export const INITIAL_STATE: SceneState = {
  camera: 'room',
  overlay: 'none',
  content: 'none',
  isTransitioning: false,
}

export function sceneReducer(state: SceneState, action: SceneAction): SceneState {
  switch (action.type) {
    case 'GO_ROOM':
      return { ...state, camera: 'room', content: 'none' }
    case 'GO_DESK':
      return { ...state, camera: 'desk', content: 'none' }
    case 'OPEN_CONTENT':
      return { ...state, content: action.content }
    case 'CLOSE_CONTENT':
      return { ...state, content: 'none' }
    case 'OPEN_CREDITS':
      return { ...state, overlay: 'credits' }
    case 'CLOSE_CREDITS':
      return { ...state, overlay: 'none' }
    case 'TRANSITION_START':
      return { ...state, isTransitioning: true }
    case 'TRANSITION_END':
      return { ...state, isTransitioning: false }
    case 'ESC':
      if (state.overlay !== 'none') return { ...state, overlay: 'none' }
      if (state.content !== 'none') return { ...state, content: 'none' }
      if (state.camera !== 'room') return { ...state, camera: 'room' }
      return state
    default:
      return state
  }
}
