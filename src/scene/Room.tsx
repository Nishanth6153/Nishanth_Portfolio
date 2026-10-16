import React from 'react';
import { ROOM_DIMENSIONS, WINDOW_LAYOUT, PROPS_LAYOUT } from './layout';
import { getSceneMaterials } from './materials';

export const Room: React.FC = () => {
  const materials = getSceneMaterials();
  const { width, depth, height, wallThickness, baseboardHeight, baseboardDepth } =
    ROOM_DIMENSIONS;

  const halfW = width / 2;
  const halfD = depth / 2;

  // Back wall is segmented around WINDOW_LAYOUT so the exterior city backdrop has a real physical opening
  const winLeftEdge = WINDOW_LAYOUT.wallCenter[0] - WINDOW_LAYOUT.width / 2;
  const winRightEdge = WINDOW_LAYOUT.wallCenter[0] + WINDOW_LAYOUT.width / 2;
  const winBottomEdge = WINDOW_LAYOUT.wallCenter[1] - WINDOW_LAYOUT.height / 2;
  const winTopEdge = WINDOW_LAYOUT.wallCenter[1] + WINDOW_LAYOUT.height / 2;

  const leftWallSegmentWidth = Math.max(0.1, winLeftEdge - -halfW);
  const rightWallSegmentWidth = Math.max(0.1, halfW - winRightEdge);
  const bottomWallSegmentHeight = Math.max(0.1, winBottomEdge);
  const topWallSegmentHeight = Math.max(0.1, height - winTopEdge);

  return (
    <group name="room-shell">
      {/* Wooden Plank Floor */}
      <mesh
        position={[0, -0.02, 0]}
        receiveShadow
        material={materials.floorWoodPlank}
      >
        <boxGeometry args={[width, 0.04, depth]} />
      </mesh>

      {/* Subtle Ceiling */}
      <mesh
        position={[0, height + 0.02, 0]}
        material={materials.ceilingMatte}
      >
        <boxGeometry args={[width, 0.04, depth]} />
      </mesh>

      {/* Back Wall — Left Pillar */}
      <mesh
        position={[
          -halfW + leftWallSegmentWidth / 2,
          height / 2,
          -halfD - wallThickness / 2,
        ]}
        receiveShadow
        material={materials.wallPlaster}
      >
        <boxGeometry args={[leftWallSegmentWidth, height, wallThickness]} />
      </mesh>

      {/* Back Wall — Right Pillar */}
      <mesh
        position={[
          winRightEdge + rightWallSegmentWidth / 2,
          height / 2,
          -halfD - wallThickness / 2,
        ]}
        receiveShadow
        material={materials.wallPlaster}
      >
        <boxGeometry args={[rightWallSegmentWidth, height, wallThickness]} />
      </mesh>

      {/* Back Wall — Below Window Apron */}
      <mesh
        position={[
          WINDOW_LAYOUT.wallCenter[0],
          bottomWallSegmentHeight / 2,
          -halfD - wallThickness / 2,
        ]}
        receiveShadow
        material={materials.wallPlaster}
      >
        <boxGeometry
          args={[WINDOW_LAYOUT.width, bottomWallSegmentHeight, wallThickness]}
        />
      </mesh>

      {/* Back Wall — Above Window Header */}
      <mesh
        position={[
          WINDOW_LAYOUT.wallCenter[0],
          winTopEdge + topWallSegmentHeight / 2,
          -halfD - wallThickness / 2,
        ]}
        receiveShadow
        material={materials.wallPlaster}
      >
        <boxGeometry
          args={[WINDOW_LAYOUT.width, topWallSegmentHeight, wallThickness]}
        />
      </mesh>

      {/* Left Wall */}
      <mesh
        position={[-halfW - wallThickness / 2, height / 2, 0]}
        receiveShadow
        material={materials.wallPlaster}
      >
        <boxGeometry args={[wallThickness, height, depth + wallThickness * 2]} />
      </mesh>

      {/* Right Wall */}
      <mesh
        position={[halfW + wallThickness / 2, height / 2, 0]}
        receiveShadow
        material={materials.wallPlaster}
      >
        <boxGeometry args={[wallThickness, height, depth + wallThickness * 2]} />
      </mesh>

      {/* Baseboards (Back, Left, Right) */}
      <mesh
        position={[0, baseboardHeight / 2, -halfD + baseboardDepth / 2]}
        receiveShadow
        material={materials.baseboardWood}
      >
        <boxGeometry args={[width, baseboardHeight, baseboardDepth]} />
      </mesh>
      <mesh
        position={[-halfW + baseboardDepth / 2, baseboardHeight / 2, 0]}
        receiveShadow
        material={materials.baseboardWood}
      >
        <boxGeometry args={[baseboardDepth, baseboardHeight, depth]} />
      </mesh>
      <mesh
        position={[halfW - baseboardDepth / 2, baseboardHeight / 2, 0]}
        receiveShadow
        material={materials.baseboardWood}
      >
        <boxGeometry args={[baseboardDepth, baseboardHeight, depth]} />
      </mesh>

      {/* Grounded Area Rug under Desk & Chair */}
      <mesh
        position={PROPS_LAYOUT.rug.position}
        receiveShadow
        material={materials.rugWoven}
      >
        <boxGeometry
          args={[PROPS_LAYOUT.rug.width, 0.006, PROPS_LAYOUT.rug.depth]}
        />
      </mesh>
    </group>
  );
};
