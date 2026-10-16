import { CameraViewMode } from '../core/SceneStateMachine';

export interface CameraPose {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export const CAMERA_PRESETS: Record<
  CameraViewMode,
  { desktop: CameraPose; mobilePortrait: CameraPose }
> = {
  wide: {
    // Three-quarter cinematic wide angle: balances left rainy window and center-right desk/CRT
    desktop: {
      position: [1.55, 1.68, 1.92],
      target: [-0.22, 1.06, -1.38],
      fov: 36,
    },
    // Portrait mobile pulls back along the view ray and slightly widens FOV without fish-eye distortion
    mobilePortrait: {
      position: [1.95, 1.82, 2.75],
      target: [-0.18, 1.05, -1.35],
      fov: 44,
    },
  },
  desk: {
    // Substantial, intimate CRT + keyboard + lamp + tower framing
    desktop: {
      position: [0.24, 1.06, -0.42],
      target: [0.22, 0.91, -1.48],
      fov: 34,
    },
    mobilePortrait: {
      position: [0.24, 1.11, -0.08],
      target: [0.22, 0.9, -1.45],
      fov: 41,
    },
  },
};

export function getCameraPoseForViewport(
  mode: CameraViewMode,
  aspect: number
): CameraPose {
  const presetGroup = CAMERA_PRESETS[mode];
  if (aspect < 0.95) {
    return presetGroup.mobilePortrait;
  }
  return presetGroup.desktop;
}
