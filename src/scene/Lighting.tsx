import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { DESK_LAMP_LAYOUT, FLOOR_LAMP_LAYOUT, CRT_LAYOUT, WINDOW_LAYOUT } from './layout';

interface LightingProps {
  crtPowered: boolean;
}

export const Lighting: React.FC<LightingProps> = ({ crtPowered }) => {
  const deskSpotRef = useRef<THREE.SpotLight>(null);
  const windowDirRef = useRef<THREE.DirectionalLight>(null);

  const deskSpotTarget = useMemo(() => {
    const obj = new THREE.Object3D();
    obj.position.set(...DESK_LAMP_LAYOUT.targetWorldPosition);
    return obj;
  }, []);

  const windowTarget = useMemo(() => {
    const obj = new THREE.Object3D();
    obj.position.set(0.15, 0.72, -1.25);
    return obj;
  }, []);

  useEffect(() => {
    if (deskSpotRef.current) {
      deskSpotRef.current.target = deskSpotTarget;
    }
    if (windowDirRef.current) {
      windowDirRef.current.target = windowTarget;
    }
  }, [deskSpotTarget, windowTarget]);

  return (
    <group name="scene-lighting">
      <primitive object={deskSpotTarget} />
      <primitive object={windowTarget} />

      {/* Deep slate-blue ambient base so shadows retain form without pitch-black crushing */}
      <ambientLight color="#182438" intensity={0.34} />

      {/* Cool sky vs warm floor bounce hemisphere fill */}
      <hemisphereLight args={['#3b5e82', '#261b14', 0.38]} position={[0, 3, 0]} />

      {/* Cool blue-slate city/moonlight directional key through the rainy window */}
      <directionalLight
        ref={windowDirRef}
        color="#6da4cc"
        intensity={1.15}
        position={[
          WINDOW_LAYOUT.wallCenter[0] - 0.5,
          WINDOW_LAYOUT.wallCenter[1] + 0.45,
          WINDOW_LAYOUT.wallCenter[2] - 0.9,
        ]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.00035}
        shadow-normalBias={0.02}
        shadow-camera-near={0.5}
        shadow-camera-far={7.5}
        shadow-camera-left={-2.6}
        shadow-camera-right={2.6}
        shadow-camera-top={2.4}
        shadow-camera-bottom={-2.4}
      />

      {/* Cool window aperture fill light for window frame & wall edges */}
      <pointLight
        color="#5e96bf"
        intensity={0.62}
        distance={3.6}
        decay={2}
        position={[
          WINDOW_LAYOUT.wallCenter[0] + 0.1,
          WINDOW_LAYOUT.wallCenter[1],
          WINDOW_LAYOUT.wallCenter[2] + 0.22,
        ]}
      />

      {/* Primary Warm Amber Desk Lamp Cone */}
      <spotLight
        ref={deskSpotRef}
        color="#ffad5c"
        intensity={3.4}
        distance={3.8}
        decay={1.8}
        angle={0.78}
        penumbra={0.82}
        position={DESK_LAMP_LAYOUT.bulbWorldPosition}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.00025}
        shadow-normalBias={0.015}
      />

      {/* Subtle warm bounce off the wooden desk top onto the CRT bezel and keyboard */}
      <pointLight
        color="#ff9e44"
        intensity={0.48}
        distance={1.65}
        decay={2}
        position={[0.12, 0.88, -1.32]}
      />

      {/* Restrained CRT Phosphor Screen Emission onto keyboard & desk front */}
      {crtPowered && (
        <pointLight
          color="#58e6a0"
          intensity={0.36}
          distance={1.25}
          decay={2}
          position={[
            CRT_LAYOUT.position[0],
            CRT_LAYOUT.position[1] + 0.24,
            CRT_LAYOUT.position[2] + 0.22,
          ]}
        />
      )}

      {/* Secondary Warm Floor Lamp in Right Corner for spatial depth & chair/tower rim */}
      <pointLight
        color="#ff9b42"
        intensity={1.15}
        distance={4.2}
        decay={2}
        position={[
          FLOOR_LAMP_LAYOUT.position[0],
          FLOOR_LAMP_LAYOUT.poleHeight - 0.05,
          FLOOR_LAMP_LAYOUT.position[2],
        ]}
      />
    </group>
  );
};
