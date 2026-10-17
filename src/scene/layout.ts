export type Vec3 = readonly [number, number, number]
export interface ModelPlacement {
  id: string
  label: string
  src: string
  position: Vec3
  rotation: Vec3
  scale: Vec3
  layer: 'hero' | 'secondary'
  interactive?: 'desk-lamp' | 'floor-lamp' | 'monitor' | 'window'
}

export const ROOM_SIZE = { width: 4, depth: 3.2, height: 2.6 } as const

// Every placement uses metres. GLB contract: Y-up, front toward +Z, origin at
// the object's contact point (or geometric center for wall-mounted assets).
export const DESK_POSITION: Vec3 = [0, 0, -1.15]
export const DESK_ROTATION: Vec3 = [0, 0, 0]
export const DESK_SCALE: Vec3 = [1, 1, 1]
export const DESK_SIZE = { width: 1.4, depth: 0.7, height: 0.75 } as const

export const MONITOR_POSITION: Vec3 = [0, 0.75, -1.39]
export const MONITOR_ROTATION: Vec3 = [0, 0, 0]
export const MONITOR_SCALE: Vec3 = [1, 1, 1]
export const MONITOR_SCREEN_LOCAL_POSITION: Vec3 = [0, 0.29, 0.026]
export const MONITOR_SCREEN_SIZE = { width: 0.57, height: 0.32 } as const

export const KEYBOARD_POSITION: Vec3 = [0, 0.75, -0.905]
export const KEYBOARD_ROTATION: Vec3 = [0, 0, 0]
export const KEYBOARD_SCALE: Vec3 = [1, 1, 1]
export const MOUSE_POSITION: Vec3 = [0.38, 0.75, -0.91]
export const MOUSE_ROTATION: Vec3 = [0, 0, 0]
export const MOUSE_SCALE: Vec3 = [1, 1, 1]

export const DESK_LAMP_POSITION: Vec3 = [-0.53, 0.75, -1.25]
export const DESK_LAMP_ROTATION: Vec3 = [0, 0, 0]
export const DESK_LAMP_SCALE: Vec3 = [1, 1, 1]
export const FLOOR_LAMP_POSITION: Vec3 = [1.62, 0, -1.12]
export const FLOOR_LAMP_ROTATION: Vec3 = [0, 0, 0]
export const FLOOR_LAMP_SCALE: Vec3 = [1, 1, 1]
export const CHAIR_POSITION: Vec3 = [0, 0, -0.03]
export const CHAIR_ROTATION: Vec3 = [0, Math.PI, 0]
export const CHAIR_SCALE: Vec3 = [1, 1, 1]
export const PLANT_POSITION: Vec3 = [0.53, 0.75, -1.24]
export const PLANT_ROTATION: Vec3 = [0, -0.3, 0]
export const PLANT_SCALE: Vec3 = [1, 1, 1]
export const BOOKS_POSITION: Vec3 = [-0.28, 0.75, -1.25]
export const BOOKS_ROTATION: Vec3 = [0, 0, 0]
export const BOOKS_SCALE: Vec3 = [1, 1, 1]
export const MUG_POSITION: Vec3 = [-0.48, 0.75, -0.93]
export const MUG_ROTATION: Vec3 = [0, 0, 0]
export const MUG_SCALE: Vec3 = [1, 1, 1]
export const DESK_ITEMS_POSITION: Vec3 = [0.56, 0.75, -0.94]
export const DESK_ITEMS_ROTATION: Vec3 = [0, 0, 0]
export const DESK_ITEMS_SCALE: Vec3 = [1, 1, 1]
export const WINDOW_FRAME_POSITION: Vec3 = [0, 1.75, -1.56]
export const WINDOW_FRAME_ROTATION: Vec3 = [0, 0, 0]
export const WINDOW_FRAME_SCALE: Vec3 = [1, 1, 1]

export const MONITOR_LOCAL_SCREEN_WIDTH = 0.57
export const MONITOR_LOCAL_SCREEN_HEIGHT = 0.32

export const MODEL_PLACEMENTS: readonly ModelPlacement[] = [
  { id: 'desk', label: 'Desk', src: '/assets/models/desk.glb', position: DESK_POSITION, rotation: DESK_ROTATION, scale: DESK_SCALE, layer: 'hero' },
  { id: 'monitor', label: 'Monitor', src: '/assets/models/monitor-27in.glb', position: MONITOR_POSITION, rotation: MONITOR_ROTATION, scale: MONITOR_SCALE, layer: 'hero', interactive: 'monitor' },
  { id: 'keyboard', label: 'Keyboard', src: '/assets/models/keyboard.glb', position: KEYBOARD_POSITION, rotation: KEYBOARD_ROTATION, scale: KEYBOARD_SCALE, layer: 'secondary' },
  { id: 'mouse', label: 'Mouse', src: '/assets/models/mouse.glb', position: MOUSE_POSITION, rotation: MOUSE_ROTATION, scale: MOUSE_SCALE, layer: 'secondary' },
  { id: 'desk-lamp', label: 'Desk lamp', src: '/assets/models/desk-lamp.glb', position: DESK_LAMP_POSITION, rotation: DESK_LAMP_ROTATION, scale: DESK_LAMP_SCALE, layer: 'secondary', interactive: 'desk-lamp' },
  { id: 'floor-lamp', label: 'Floor lamp', src: '/assets/models/floor-lamp.glb', position: FLOOR_LAMP_POSITION, rotation: FLOOR_LAMP_ROTATION, scale: FLOOR_LAMP_SCALE, layer: 'secondary', interactive: 'floor-lamp' },
  { id: 'chair', label: 'Ergonomic chair', src: '/assets/models/ergonomic-chair.glb', position: CHAIR_POSITION, rotation: CHAIR_ROTATION, scale: CHAIR_SCALE, layer: 'hero' },
  { id: 'plant', label: 'Plant', src: '/assets/models/plant.glb', position: PLANT_POSITION, rotation: PLANT_ROTATION, scale: PLANT_SCALE, layer: 'secondary' },
  { id: 'books', label: 'Books', src: '/assets/models/books.glb', position: BOOKS_POSITION, rotation: BOOKS_ROTATION, scale: BOOKS_SCALE, layer: 'secondary' },
  { id: 'mug', label: 'Mug', src: '/assets/models/mug.glb', position: MUG_POSITION, rotation: MUG_ROTATION, scale: MUG_SCALE, layer: 'secondary' },
  { id: 'desk-items', label: 'Desk items', src: '/assets/models/desk-items.glb', position: DESK_ITEMS_POSITION, rotation: DESK_ITEMS_ROTATION, scale: DESK_ITEMS_SCALE, layer: 'secondary' },
  { id: 'window', label: 'Window frame and glass', src: '/assets/models/window-frame.glb', position: WINDOW_FRAME_POSITION, rotation: WINDOW_FRAME_ROTATION, scale: WINDOW_FRAME_SCALE, layer: 'secondary', interactive: 'window' },
] as const

export const CAMERA_TARGETS = {
  room: { position: [0, 1.43, 2.52] as Vec3, target: [0, 1.13, -0.95] as Vec3, fov: 47 },
  desk: { position: [0, 1.28, 0.62] as Vec3, target: [0, 1.08, -1.04] as Vec3, fov: 43 },
  monitor: { position: [0, 1.08, -0.12] as Vec3, target: [0, 1.04, -1.363] as Vec3, fov: 34 },
} as const

