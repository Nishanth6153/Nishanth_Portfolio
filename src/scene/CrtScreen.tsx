import React, { useMemo } from 'react';
import * as THREE from 'three';
import { CRT_LAYOUT } from './layout';
import { getSceneMaterials } from './materials';
import { PORTFOLIO_CONTENT } from '../core/content';

interface CrtScreenProps {
  powered: boolean;
  onTogglePower?: () => void;
}

export const CrtScreen: React.FC<CrtScreenProps> = ({ powered, onTogglePower }) => {
  const materials = getSceneMaterials();

  // Crisp late-1990s CRT phosphor terminal texture with scanlines & vignette
  const screenTexture = useMemo(() => {
    const width = 1024;
    const height = 768;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;

    // Deep phosphor background gradient
    const grad = ctx.createRadialGradient(
      width * 0.5,
      height * 0.5,
      80,
      width * 0.5,
      height * 0.5,
      width * 0.65
    );
    grad.addColorStop(0, '#0b221c');
    grad.addColorStop(0.75, '#061512');
    grad.addColorStop(1, '#020807');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Subtle phosphor text glow
    ctx.shadowColor = 'rgba(72, 255, 168, 0.55)';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#5effb8';
    ctx.font = 'bold 24px "Courier New", monospace';

    ctx.fillText(PORTFOLIO_CONTENT.systemHeader, 54, 72);
    ctx.font = '20px "Courier New", monospace';
    ctx.fillStyle = '#3ed896';
    ctx.fillText(PORTFOLIO_CONTENT.biosVersion, 54, 106);
    ctx.fillText(PORTFOLIO_CONTENT.memoryCheck, 54, 148);

    // Divider bar
    ctx.fillRect(54, 174, width - 108, 3);

    // Main OS Banner Box
    ctx.strokeStyle = '#48ffa8';
    ctx.lineWidth = 2;
    ctx.strokeRect(54, 204, width - 108, 76);
    ctx.font = 'bold 28px "Courier New", monospace';
    ctx.fillStyle = '#7dffca';
    ctx.fillText(PORTFOLIO_CONTENT.osBanner, 78, 252);

    // Status lines
    ctx.font = '22px "Courier New", monospace';
    ctx.fillStyle = '#4ce8a5';
    PORTFOLIO_CONTENT.statusLines.forEach((line, idx) => {
      ctx.fillText(line, 58, 340 + idx * 46);
    });

    // Interactive prompt
    ctx.font = 'bold 26px "Courier New", monospace';
    ctx.fillStyle = '#88ffd0';
    ctx.fillText(PORTFOLIO_CONTENT.promptHint, 58, 575);

    // Horizontal CRT Scanlines
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
    for (let y = 0; y < height; y += 4) {
      ctx.fillRect(0, y, width, 2);
    }

    // Rounded CRT corner shadow vignette
    ctx.strokeStyle = 'rgba(2, 6, 5, 0.85)';
    ctx.lineWidth = 28;
    ctx.strokeRect(0, 0, width, height);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }, []);

  const screenMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: powered ? new THREE.Color('#ffffff') : new THREE.Color('#090d0e'),
      map: powered ? screenTexture : null,
      emissive: powered ? new THREE.Color('#2cd98b') : new THREE.Color('#000000'),
      emissiveMap: powered ? screenTexture : null,
      emissiveIntensity: powered ? 0.78 : 0,
      roughness: 0.2,
      metalness: 0.05,
    });
  }, [powered, screenTexture]);

  const {
    position,
    rotationY,
    swivelBaseRadius,
    swivelBaseHeight,
    neckWidth,
    neckDepth,
    neckHeight,
    bezelWidth,
    bezelHeight,
    bezelDepth,
    rearHousingWidth,
    rearHousingHeight,
    rearHousingDepth,
    screenWidth,
    screenHeight,
  } = CRT_LAYOUT;

  const casingCenterY = swivelBaseHeight + neckHeight + bezelHeight / 2;
  const frameBarW = (bezelWidth - screenWidth) / 2;
  const frameBarH = (bezelHeight - screenHeight) / 2;

  return (
    <group
      position={position}
      rotation={[0, rotationY, 0]}
      name="crt-monitor-assembly"
    >
      {/* Swivel Tilt Base (Grounded on Desk Surface Y=0 relative to group) */}
      <mesh
        position={[0, swivelBaseHeight / 2, 0]}
        castShadow
        receiveShadow
        material={materials.crtDarkBeigeRecess}
      >
        <cylinderGeometry
          args={[swivelBaseRadius * 0.88, swivelBaseRadius, swivelBaseHeight, 28]}
        />
      </mesh>

      {/* Monitor Pedestal Neck */}
      <mesh
        position={[0, swivelBaseHeight + neckHeight / 2, -0.01]}
        castShadow
        receiveShadow
        material={materials.crtBeigePlastic}
      >
        <boxGeometry args={[neckWidth, neckHeight, neckDepth]} />
      </mesh>

      {/* Main Front Casing Box (Behind the recessed bezel frame) */}
      <mesh
        position={[0, casingCenterY, -0.02]}
        castShadow
        receiveShadow
        material={materials.crtBeigePlastic}
      >
        <boxGeometry args={[bezelWidth, bezelHeight, bezelDepth]} />
      </mesh>

      {/* Stepped Front Bezel Frame (Top, Bottom, Left, Right) creating a true recessed screen cavity */}
      <mesh
        position={[0, casingCenterY + bezelHeight / 2 - frameBarH / 2, bezelDepth / 2 - 0.005]}
        castShadow
        receiveShadow
        material={materials.crtBeigePlastic}
      >
        <boxGeometry args={[bezelWidth, frameBarH, 0.032]} />
      </mesh>
      <mesh
        position={[0, casingCenterY - bezelHeight / 2 + frameBarH / 2, bezelDepth / 2 - 0.005]}
        castShadow
        receiveShadow
        material={materials.crtBeigePlastic}
      >
        <boxGeometry args={[bezelWidth, frameBarH, 0.032]} />
      </mesh>
      <mesh
        position={[
          -bezelWidth / 2 + frameBarW / 2,
          casingCenterY,
          bezelDepth / 2 - 0.005,
        ]}
        castShadow
        receiveShadow
        material={materials.crtBeigePlastic}
      >
        <boxGeometry args={[frameBarW, screenHeight, 0.032]} />
      </mesh>
      <mesh
        position={[
          bezelWidth / 2 - frameBarW / 2,
          casingCenterY,
          bezelDepth / 2 - 0.005,
        ]}
        castShadow
        receiveShadow
        material={materials.crtBeigePlastic}
      >
        <boxGeometry args={[frameBarW, screenHeight, 0.032]} />
      </mesh>

      {/* Inner Dark Bezel Chamfer Collar */}
      <mesh
        position={[0, casingCenterY, bezelDepth / 2 - 0.016]}
        material={materials.crtDarkBeigeRecess}
      >
        <planeGeometry args={[screenWidth + 0.016, screenHeight + 0.016]} />
      </mesh>

      {/* Active Phosphor CRT Screen Plane */}
      <mesh
        position={[0, casingCenterY, bezelDepth / 2 - 0.012]}
        material={screenMaterial}
      >
        <planeGeometry args={[screenWidth, screenHeight]} />
      </mesh>

      {/* Outer Specular Glass Overlay for subtle room/lamp reflection */}
      <mesh
        position={[0, casingCenterY, bezelDepth / 2 - 0.008]}
        material={materials.crtGlassSurface}
      >
        <planeGeometry args={[screenWidth, screenHeight]} />
      </mesh>

      {/* Tapered Rear Cathode Tube Housing */}
      <mesh
        position={[0, casingCenterY - 0.01, -bezelDepth / 2 - rearHousingDepth / 2 + 0.02]}
        castShadow
        receiveShadow
        material={materials.crtBeigePlastic}
      >
        <boxGeometry
          args={[rearHousingWidth, rearHousingHeight, rearHousingDepth]}
        />
      </mesh>

      {/* Rear Ventilation Slots */}
      {[-0.08, -0.04, 0, 0.04, 0.08].map((offsetX, i) => (
        <mesh
          key={i}
          position={[
            offsetX,
            casingCenterY + rearHousingHeight / 2 + 0.001,
            -bezelDepth / 2 - rearHousingDepth * 0.45,
          ]}
          material={materials.crtRearVentPlastic}
        >
          <boxGeometry args={[0.018, 0.003, 0.14]} />
        </mesh>
      ))}

      {/* Lower-Right Power Button, LED Indicator & OSD Adjustment Dials */}
      <mesh
        position={[0.155, casingCenterY - bezelHeight / 2 + 0.026, bezelDepth / 2 + 0.012]}
        onClick={(e) => {
          e.stopPropagation();
          onTogglePower?.();
        }}
        material={materials.keycapModifierGray}
      >
        <boxGeometry args={[0.026, 0.016, 0.012]} />
      </mesh>
      <mesh
        position={[0.125, casingCenterY - bezelHeight / 2 + 0.026, bezelDepth / 2 + 0.012]}
        material={powered ? materials.ledGreenOn : materials.crtRearVentPlastic}
      >
        <sphereGeometry args={[0.0045, 12, 12]} />
      </mesh>
      {[-0.04, -0.01, 0.02, 0.05].map((dx, idx) => (
        <mesh
          key={idx}
          position={[dx, casingCenterY - bezelHeight / 2 + 0.024, bezelDepth / 2 + 0.011]}
          material={materials.crtDarkBeigeRecess}
        >
          <boxGeometry args={[0.016, 0.009, 0.008]} />
        </mesh>
      ))}
    </group>
  );
};
