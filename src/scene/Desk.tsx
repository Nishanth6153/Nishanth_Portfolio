import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import {
  DESK_LAYOUT,
  KEYBOARD_LAYOUT,
  MOUSE_LAYOUT,
  TOWER_LAYOUT,
  SPEAKERS_LAYOUT,
} from './layout';
import { getSceneMaterials } from './materials';

export const Desk: React.FC = () => {
  const materials = getSceneMaterials();
  const lightKeysRef = useRef<THREE.InstancedMesh>(null);
  const modKeysRef = useRef<THREE.InstancedMesh>(null);

  // Compute physical 104-key layout transforms once for InstancedMesh efficiency
  const { lightKeyMatrices, modKeyMatrices } = useMemo(() => {
    const light: THREE.Matrix4[] = [];
    const mod: THREE.Matrix4[] = [];
    const dummy = new THREE.Object3D();

    const rows = 5;
    const cols = 15;
    const startX = -0.19;
    const startZ = -0.052;
    const stepX = 0.0195;
    const stepZ = 0.021;

    // Function key top row
    for (let c = 0; c < 13; c++) {
      if (c === 1 || c === 5 || c === 9) continue;
      dummy.position.set(startX + c * stepX * 1.12, 0.027, startZ - 0.024);
      dummy.rotation.set(0.08, 0, 0);
      dummy.scale.set(1, 1, 0.85);
      dummy.updateMatrix();
      if (c === 0 || c >= 9) {
        mod.push(dummy.matrix.clone());
      } else {
        light.push(dummy.matrix.clone());
      }
    }

    // Alphanumeric + modifier block
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Spacebar row handling
        if (r === 4 && c >= 4 && c <= 9) {
          if (c === 6) {
            dummy.position.set(startX + 6.5 * stepX, 0.021, startZ + r * stepZ);
            dummy.rotation.set(0.08, 0, 0);
            dummy.scale.set(5.4, 1, 1);
            dummy.updateMatrix();
            light.push(dummy.matrix.clone());
          }
          continue;
        }

        const yHeight = 0.025 - r * 0.0012;
        dummy.position.set(startX + c * stepX, yHeight, startZ + r * stepZ);
        dummy.rotation.set(0.08, 0, 0);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();

        const isModifier = c === 0 || c === cols - 1 || r === 4;
        if (isModifier) {
          mod.push(dummy.matrix.clone());
        } else {
          light.push(dummy.matrix.clone());
        }
      }
    }

    // Navigation + Numpad right cluster
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < 4; c++) {
        dummy.position.set(0.125 + c * stepX, 0.025 - r * 0.0012, startZ + r * stepZ);
        dummy.rotation.set(0.08, 0, 0);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        if (c === 3) {
          mod.push(dummy.matrix.clone());
        } else {
          light.push(dummy.matrix.clone());
        }
      }
    }

    return { lightKeyMatrices: light, modKeyMatrices: mod };
  }, []);

  useEffect(() => {
    if (lightKeysRef.current) {
      lightKeyMatrices.forEach((mat, i) => lightKeysRef.current!.setMatrixAt(i, mat));
      lightKeysRef.current.instanceMatrix.needsUpdate = true;
    }
    if (modKeysRef.current) {
      modKeyMatrices.forEach((mat, i) => modKeysRef.current!.setMatrixAt(i, mat));
      modKeysRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [lightKeyMatrices, modKeyMatrices]);

  const {
    position: deskPos,
    width: deskW,
    depth: deskD,
    topHeight,
    topThickness,
    apronHeight,
    legThickness,
    drawerUnitWidth,
    drawerUnitDepth,
  } = DESK_LAYOUT;

  const legHeight = topHeight - topThickness;

  return (
    <group name="workstation-desk-and-hardware">
      {/* ==================== WOODEN DESK STRUCTURE ==================== */}
      <group position={deskPos}>
        {/* Main Wood Tabletop */}
        <mesh
          position={[0, topHeight - topThickness / 2, 0]}
          castShadow
          receiveShadow
          material={materials.deskWoodTop}
        >
          <boxGeometry args={[deskW, topThickness, deskD]} />
        </mesh>

        {/* Beveled Front & Side Wood Edge Trim */}
        <mesh
          position={[0, topHeight - topThickness / 2, deskD / 2 + 0.006]}
          castShadow
          receiveShadow
          material={materials.deskWoodTrim}
        >
          <boxGeometry args={[deskW + 0.012, topThickness * 0.92, 0.014]} />
        </mesh>

        {/* Structural Under-Desk Apron Frame */}
        <mesh
          position={[0, topHeight - topThickness - apronHeight / 2, -deskD / 2 + 0.05]}
          castShadow
          receiveShadow
          material={materials.deskDarkMetal}
        >
          <boxGeometry args={[deskW - 0.14, apronHeight, 0.03]} />
        </mesh>

        {/* Left Front & Rear Legs */}
        <mesh
          position={[-deskW / 2 + 0.07, legHeight / 2, deskD / 2 - 0.07]}
          castShadow
          receiveShadow
          material={materials.deskDarkMetal}
        >
          <boxGeometry args={[legThickness, legHeight, legThickness]} />
        </mesh>
        <mesh
          position={[-deskW / 2 + 0.07, legHeight / 2, -deskD / 2 + 0.07]}
          castShadow
          receiveShadow
          material={materials.deskDarkMetal}
        >
          <boxGeometry args={[legThickness, legHeight, legThickness]} />
        </mesh>

        {/* Left Side Crossbar Stretcher */}
        <mesh
          position={[-deskW / 2 + 0.07, 0.16, 0]}
          castShadow
          receiveShadow
          material={materials.deskDarkMetal}
        >
          <boxGeometry args={[0.035, 0.035, deskD - 0.14]} />
        </mesh>

        {/* Right Wooden Drawer Pedestal Unit */}
        <group position={[deskW / 2 - drawerUnitWidth / 2 - 0.05, legHeight / 2, 0]}>
          <mesh
            castShadow
            receiveShadow
            material={materials.deskWoodTrim}
          >
            <boxGeometry args={[drawerUnitWidth, legHeight, drawerUnitDepth]} />
          </mesh>
          {/* Three Drawer Front Panels + Brushed Metal Pulls */}
          {[0.19, 0, -0.19].map((dy, idx) => (
            <group key={idx} position={[0, dy, drawerUnitDepth / 2 + 0.008]}>
              <mesh
                castShadow
                receiveShadow
                material={materials.deskWoodTop}
              >
                <boxGeometry args={[drawerUnitWidth - 0.03, 0.165, 0.016]} />
              </mesh>
              <mesh
                position={[0, 0, 0.014]}
                material={materials.brushedSteel}
              >
                <boxGeometry args={[0.095, 0.014, 0.014]} />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* ==================== RETRO MECHANICAL KEYBOARD ==================== */}
      <group
        position={KEYBOARD_LAYOUT.position}
        rotation={[0, KEYBOARD_LAYOUT.rotationY, 0]}
        name="retro-keyboard"
      >
        {/* Sloped Wedge Keyboard Shell */}
        <mesh
          position={[0, 0.012, 0]}
          rotation={[0.08, 0, 0]}
          castShadow
          receiveShadow
          material={materials.crtBeigePlastic}
        >
          <boxGeometry
            args={[KEYBOARD_LAYOUT.width, 0.022, KEYBOARD_LAYOUT.depth]}
          />
        </mesh>

        {/* Dark Recessed Keybed Well */}
        <mesh
          position={[-0.035, 0.022, 0.002]}
          rotation={[0.08, 0, 0]}
          material={materials.crtDarkBeigeRecess}
        >
          <boxGeometry args={[0.31, 0.004, 0.125]} />
        </mesh>

        {/* Instanced Light Alphanumeric Keycaps */}
        <instancedMesh
          ref={lightKeysRef}
          args={[undefined, undefined, lightKeyMatrices.length]}
          material={materials.keycapLightBeige}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.016, 0.01, 0.016]} />
        </instancedMesh>

        {/* Instanced Gray Modifier Keycaps */}
        <instancedMesh
          ref={modKeysRef}
          args={[undefined, undefined, modKeyMatrices.length]}
          material={materials.keycapModifierGray}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.017, 0.01, 0.016]} />
        </instancedMesh>

        {/* NumLock / CapsLock / ScrollLock Status LEDs */}
        {[0.14, 0.158, 0.176].map((lx, idx) => (
          <mesh
            key={idx}
            position={[lx, 0.026, -0.062]}
            material={idx < 2 ? materials.ledGreenOn : materials.crtRearVentPlastic}
          >
            <boxGeometry args={[0.008, 0.003, 0.004]} />
          </mesh>
        ))}
      </group>

      {/* ==================== MOUSE & FABRIC MOUSEPAD ==================== */}
      <group
        position={MOUSE_LAYOUT.position}
        rotation={[0, MOUSE_LAYOUT.rotationY, 0]}
        name="retro-mouse-and-pad"
      >
        {/* Mousepad */}
        <mesh
          position={[0, MOUSE_LAYOUT.padThickness / 2, 0]}
          receiveShadow
          material={materials.mousePadFabric}
        >
          <boxGeometry
            args={[
              MOUSE_LAYOUT.padWidth,
              MOUSE_LAYOUT.padThickness,
              MOUSE_LAYOUT.padDepth,
            ]}
          />
        </mesh>

        {/* Contoured 2-Button Mouse Body */}
        <group position={[0, MOUSE_LAYOUT.padThickness, 0.01]}>
          <mesh
            position={[0, 0.014, 0]}
            castShadow
            receiveShadow
            material={materials.crtBeigePlastic}
          >
            <boxGeometry args={[0.062, 0.028, 0.105]} />
          </mesh>
          {/* Left & Right Mouse Buttons */}
          <mesh
            position={[-0.015, 0.029, -0.026]}
            material={materials.keycapLightBeige}
          >
            <boxGeometry args={[0.026, 0.004, 0.042]} />
          </mesh>
          <mesh
            position={[0.015, 0.029, -0.026]}
            material={materials.keycapLightBeige}
          >
            <boxGeometry args={[0.026, 0.004, 0.042]} />
          </mesh>
          {/* Scroll Wheel */}
          <mesh
            position={[0, 0.03, -0.026]}
            rotation={[0, 0, Math.PI / 2]}
            material={materials.rubberCable}
          >
            <cylinderGeometry args={[0.006, 0.006, 0.005, 12]} />
          </mesh>
          {/* Mouse Cord Leading Toward Back of Desk */}
          <mesh
            position={[0, 0.006, -0.14]}
            rotation={[Math.PI / 2, 0, 0]}
            material={materials.rubberCable}
          >
            <cylinderGeometry args={[0.0025, 0.0025, 0.19, 8]} />
          </mesh>
        </group>
      </group>

      {/* ==================== LATE-1990s MID-TOWER PC ==================== */}
      <group
        position={TOWER_LAYOUT.position}
        rotation={[0, TOWER_LAYOUT.rotationY, 0]}
        name="retro-pc-tower"
      >
        {/* Main Beige Tower Chassis */}
        <mesh
          position={[0, TOWER_LAYOUT.height / 2, 0]}
          castShadow
          receiveShadow
          material={materials.crtBeigePlastic}
        >
          <boxGeometry
            args={[TOWER_LAYOUT.width, TOWER_LAYOUT.height, TOWER_LAYOUT.depth]}
          />
        </mesh>

        {/* Stepped Front Bezel */}
        <mesh
          position={[0, TOWER_LAYOUT.height / 2, TOWER_LAYOUT.depth / 2 + 0.01]}
          castShadow
          receiveShadow
          material={materials.crtBeigePlastic}
        >
          <boxGeometry
            args={[TOWER_LAYOUT.width - 0.01, TOWER_LAYOUT.height - 0.012, 0.022]}
          />
        </mesh>

        {/* Two 5.25" Drive Bays (Top CD-ROM with Eject Button + Blank Bay) */}
        {[0.34, 0.285].map((by, idx) => (
          <group
            key={idx}
            position={[0, by, TOWER_LAYOUT.depth / 2 + 0.022]}
          >
            <mesh material={materials.keycapLightBeige}>
              <boxGeometry args={[0.155, 0.042, 0.006]} />
            </mesh>
            {idx === 0 && (
              <>
                <mesh
                  position={[0, 0.004, 0.004]}
                  material={materials.crtDarkBeigeRecess}
                >
                  <boxGeometry args={[0.13, 0.012, 0.004]} />
                </mesh>
                <mesh
                  position={[0.052, -0.01, 0.005]}
                  material={materials.keycapModifierGray}
                >
                  <boxGeometry args={[0.016, 0.007, 0.004]} />
                </mesh>
              </>
            )}
          </group>
        ))}

        {/* 3.5" Floppy Disk Drive Bay */}
        <group position={[0, 0.22, TOWER_LAYOUT.depth / 2 + 0.022]}>
          <mesh material={materials.crtDarkBeigeRecess}>
            <boxGeometry args={[0.108, 0.028, 0.006]} />
          </mesh>
          <mesh position={[0, 0.002, 0.004]} material={materials.rubberCable}>
            <boxGeometry args={[0.088, 0.005, 0.004]} />
          </mesh>
          <mesh
            position={[0.032, -0.007, 0.005]}
            material={materials.keycapModifierGray}
          >
            <boxGeometry args={[0.014, 0.006, 0.005]} />
          </mesh>
        </group>

        {/* Power Button, Reset Button & Power/HDD Activity LEDs */}
        <mesh
          position={[-0.045, 0.145, TOWER_LAYOUT.depth / 2 + 0.023]}
          material={materials.keycapModifierGray}
        >
          <cylinderGeometry args={[0.012, 0.012, 0.008, 16]} />
        </mesh>
        <mesh
          position={[-0.015, 0.145, TOWER_LAYOUT.depth / 2 + 0.023]}
          material={materials.crtDarkBeigeRecess}
        >
          <cylinderGeometry args={[0.006, 0.006, 0.007, 12]} />
        </mesh>
        <mesh
          position={[0.025, 0.15, TOWER_LAYOUT.depth / 2 + 0.023]}
          material={materials.ledGreenOn}
        >
          <boxGeometry args={[0.008, 0.004, 0.004]} />
        </mesh>
        <mesh
          position={[0.042, 0.15, TOWER_LAYOUT.depth / 2 + 0.023]}
          material={materials.ledAmberOn}
        >
          <boxGeometry args={[0.008, 0.004, 0.004]} />
        </mesh>

        {/* Lower Front Intake Louvers */}
        {[0.04, 0.06, 0.08, 0.1].map((vy, i) => (
          <mesh
            key={i}
            position={[0, vy, TOWER_LAYOUT.depth / 2 + 0.022]}
            material={materials.crtRearVentPlastic}
          >
            <boxGeometry args={[0.14, 0.006, 0.005]} />
          </mesh>
        ))}
      </group>

      {/* ==================== STEREO DESKTOP SPEAKERS ==================== */}
      {(['left', 'right'] as const).map((side) => {
        const spk = SPEAKERS_LAYOUT[side];
        return (
          <group
            key={side}
            position={spk.position}
            rotation={[0, spk.rotationY, 0]}
            name={`speaker-${side}`}
          >
            {/* Speaker Enclosure */}
            <mesh
              position={[0, SPEAKERS_LAYOUT.height / 2, 0]}
              castShadow
              receiveShadow
              material={materials.crtBeigePlastic}
            >
              <boxGeometry
                args={[
                  SPEAKERS_LAYOUT.width,
                  SPEAKERS_LAYOUT.height,
                  SPEAKERS_LAYOUT.depth,
                ]}
              />
            </mesh>
            {/* Acoustic Fabric Front Grille */}
            <mesh
              position={[0, SPEAKERS_LAYOUT.height / 2 + 0.01, SPEAKERS_LAYOUT.depth / 2 + 0.003]}
              material={materials.speakerGrilleFabric}
            >
              <boxGeometry
                args={[
                  SPEAKERS_LAYOUT.width - 0.016,
                  SPEAKERS_LAYOUT.height - 0.048,
                  0.006,
                ]}
              />
            </mesh>
            {/* Volume Knob on Right Speaker */}
            {side === 'right' && (
              <mesh
                position={[0.02, 0.02, SPEAKERS_LAYOUT.depth / 2 + 0.006]}
                rotation={[Math.PI / 2, 0, 0]}
                material={materials.crtDarkBeigeRecess}
              >
                <cylinderGeometry args={[0.007, 0.007, 0.008, 12]} />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
};
