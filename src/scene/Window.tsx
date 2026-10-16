import React, { useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { WINDOW_LAYOUT } from './layout';
import { getSceneMaterials } from './materials';

export const Window: React.FC = () => {
  const materials = getSceneMaterials();
  const [cityTexture, setCityTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loader = new THREE.TextureLoader();
    loader.load(
      '/assets/city-night.png',
      (tex) => {
        if (!isMounted) return;
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 4;
        setCityTexture(tex);
      },
      undefined,
      () => {
        // Fallback if texture fails to load
      }
    );
    return () => {
      isMounted = false;
    };
  }, []);

  // Procedural rain-streak overlay texture for subtle wet window character
  const rainStreakMaterial = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, 256, 256);

    ctx.strokeStyle = 'rgba(185, 220, 245, 0.22)';
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 90; i++) {
      const x = ((i * 73) % 250) + 3;
      const y = ((i * 41) % 210);
      const len = 14 + (i % 22);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 1.5, y + len);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);

    return new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
    });
  }, []);

  const silhouetteMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#0c1320'),
        roughness: 0.9,
        metalness: 0.1,
      }),
    []
  );

  const distantWindowGlowMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color('#ffd28a'),
      }),
    []
  );

  const { wallCenter, width, height, frameDepth, sillWidth, sillDepth, sillHeight } =
    WINDOW_LAYOUT;
  const frameThickness = 0.055;

  return (
    <group position={wallCenter} name="rainy-city-window">
      {/* Deep Exterior City Night Backdrop Plane (Parallax Layer) */}
      <mesh position={[0.15, 0.05, WINDOW_LAYOUT.exteriorBackdropOffsetZ]}>
        <planeGeometry args={[3.9, 2.85]} />
        <meshBasicMaterial
          map={cityTexture ?? undefined}
          color={cityTexture ? '#c8ddf0' : '#162840'}
        />
      </mesh>

      {/* Midground 3D Building Silhouettes between window and backdrop for genuine camera parallax */}
      <group position={[0, -0.45, -0.78]}>
        <mesh position={[-0.72, 0.15, -0.15]} material={silhouetteMaterial}>
          <boxGeometry args={[0.46, 1.35, 0.24]} />
        </mesh>
        <mesh position={[-0.18, -0.05, 0.05]} material={silhouetteMaterial}>
          <boxGeometry args={[0.38, 0.95, 0.2]} />
        </mesh>
        <mesh position={[0.58, 0.22, -0.1]} material={silhouetteMaterial}>
          <boxGeometry args={[0.52, 1.48, 0.26]} />
        </mesh>
        {/* Subtle lit apartment windows on midground silhouettes */}
        <mesh position={[-0.68, 0.42, -0.029]} material={distantWindowGlowMaterial}>
          <planeGeometry args={[0.045, 0.032]} />
        </mesh>
        <mesh position={[-0.78, 0.24, -0.029]} material={distantWindowGlowMaterial}>
          <planeGeometry args={[0.045, 0.032]} />
        </mesh>
        <mesh position={[0.48, 0.52, 0.031]} material={distantWindowGlowMaterial}>
          <planeGeometry args={[0.05, 0.034]} />
        </mesh>
      </group>

      {/* Outer Window Casing (Top, Bottom, Left, Right) */}
      <mesh
        position={[0, height / 2 - frameThickness / 2, 0]}
        castShadow
        receiveShadow
        material={materials.windowFramePaint}
      >
        <boxGeometry args={[width, frameThickness, frameDepth]} />
      </mesh>
      <mesh
        position={[0, -height / 2 + frameThickness / 2, 0]}
        castShadow
        receiveShadow
        material={materials.windowFramePaint}
      >
        <boxGeometry args={[width, frameThickness, frameDepth]} />
      </mesh>
      <mesh
        position={[-width / 2 + frameThickness / 2, 0, 0]}
        castShadow
        receiveShadow
        material={materials.windowFramePaint}
      >
        <boxGeometry args={[frameThickness, height, frameDepth]} />
      </mesh>
      <mesh
        position={[width / 2 - frameThickness / 2, 0, 0]}
        castShadow
        receiveShadow
        material={materials.windowFramePaint}
      >
        <boxGeometry args={[frameThickness, height, frameDepth]} />
      </mesh>

      {/* Center Vertical Mullion & Horizontal Transom */}
      <mesh castShadow receiveShadow material={materials.windowFramePaint}>
        <boxGeometry args={[0.036, height - frameThickness * 2, frameDepth * 0.75]} />
      </mesh>
      <mesh
        position={[0, 0.08, 0]}
        castShadow
        receiveShadow
        material={materials.windowFramePaint}
      >
        <boxGeometry args={[width - frameThickness * 2, 0.038, frameDepth * 0.8]} />
      </mesh>

      {/* Specular Rainy Glass Pane + Subtle Rain Streaks */}
      <mesh position={[0, 0, -0.01]} material={materials.windowGlassRainy}>
        <planeGeometry args={[width - frameThickness * 2, height - frameThickness * 2]} />
      </mesh>
      <mesh position={[0, 0, -0.004]} material={rainStreakMaterial}>
        <planeGeometry args={[width - frameThickness * 2, height - frameThickness * 2]} />
      </mesh>

      {/* Projecting Interior Window Sill */}
      <mesh
        position={[0, -height / 2 - sillHeight / 2 + 0.01, sillDepth / 2 - 0.03]}
        castShadow
        receiveShadow
        material={materials.windowFramePaint}
      >
        <boxGeometry args={[sillWidth, sillHeight, sillDepth]} />
      </mesh>
    </group>
  );
};
