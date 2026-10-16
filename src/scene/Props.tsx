import React from 'react';
import {
  DESK_LAMP_LAYOUT,
  CHAIR_LAYOUT,
  FLOOR_LAMP_LAYOUT,
  PROPS_LAYOUT,
} from './layout';
import { getSceneMaterials } from './materials';

export const Props: React.FC = () => {
  const materials = getSceneMaterials();

  return (
    <group name="room-furniture-and-props">
      {/* ==================== ARTICULATED ARCHITECT DESK LAMP ==================== */}
      <group
        position={DESK_LAMP_LAYOUT.position}
        rotation={[0, DESK_LAMP_LAYOUT.rotationY, 0]}
        name="desk-lamp"
      >
        {/* Weighted Base */}
        <mesh
          position={[0, DESK_LAMP_LAYOUT.baseHeight / 2, 0]}
          castShadow
          receiveShadow
          material={materials.deskDarkMetal}
        >
          <cylinderGeometry
            args={[
              DESK_LAMP_LAYOUT.baseRadius * 0.85,
              DESK_LAMP_LAYOUT.baseRadius,
              DESK_LAMP_LAYOUT.baseHeight,
              24,
            ]}
          />
        </mesh>
        {/* Lower Stem */}
        <mesh
          position={[-0.02, 0.16, 0.02]}
          rotation={[0.18, 0, -0.15]}
          castShadow
          material={materials.brassAccent}
        >
          <cylinderGeometry args={[0.01, 0.012, 0.28, 12]} />
        </mesh>
        {/* Upper Articulated Arm */}
        <mesh
          position={[0.06, 0.36, 0.09]}
          rotation={[0.45, 0, -0.48]}
          castShadow
          material={materials.brassAccent}
        >
          <cylinderGeometry args={[0.009, 0.01, 0.26, 12]} />
        </mesh>
        {/* Cone Shade Aimed at Keyboard/Desk Surface */}
        <group position={[0.14, 0.44, 0.16]} rotation={[0.55, 0.25, -0.52]}>
          <mesh castShadow material={materials.deskDarkMetal}>
            <coneGeometry args={[0.088, 0.14, 24, 1, true]} />
          </mesh>
          {/* Warm Glowing Bulb Inside Shade */}
          <mesh position={[0, -0.035, 0]} material={materials.lampShadeWarm}>
            <sphereGeometry args={[0.028, 16, 16]} />
          </mesh>
        </group>
      </group>

      {/* ==================== ERGONOMIC SWIVEL OFFICE CHAIR ==================== */}
      <group
        position={CHAIR_LAYOUT.position}
        rotation={[0, CHAIR_LAYOUT.rotationY, 0]}
        name="office-chair"
      >
        {/* Pneumatic Center Column */}
        <mesh
          position={[0, CHAIR_LAYOUT.seatHeight / 2, 0]}
          castShadow
          material={materials.chairPlasticBase}
        >
          <cylinderGeometry args={[0.028, 0.034, CHAIR_LAYOUT.seatHeight - 0.04, 16]} />
        </mesh>

        {/* 5-Star Caster Base Legs */}
        {[0, 1, 2, 3, 4].map((idx) => {
          const angle = (idx * Math.PI * 2) / 5;
          return (
            <group key={idx} rotation={[0, angle, 0]}>
              <mesh
                position={[0, 0.055, 0.15]}
                rotation={[0.12, 0, 0]}
                castShadow
                material={materials.chairPlasticBase}
              >
                <boxGeometry args={[0.034, 0.026, 0.28]} />
              </mesh>
              <mesh
                position={[0, 0.022, 0.27]}
                rotation={[0, 0, Math.PI / 2]}
                material={materials.rubberCable}
              >
                <cylinderGeometry args={[0.022, 0.022, 0.022, 12]} />
              </mesh>
            </group>
          );
        })}

        {/* Contoured Upholstered Seat Cushion */}
        <mesh
          position={[0, CHAIR_LAYOUT.seatHeight, 0]}
          castShadow
          receiveShadow
          material={materials.chairFabric}
        >
          <boxGeometry
            args={[CHAIR_LAYOUT.seatWidth, 0.072, CHAIR_LAYOUT.seatDepth]}
          />
        </mesh>

        {/* Spine Post & Contoured Backrest */}
        <mesh
          position={[0, CHAIR_LAYOUT.seatHeight + 0.18, -CHAIR_LAYOUT.seatDepth / 2 + 0.02]}
          castShadow
          material={materials.chairPlasticBase}
        >
          <boxGeometry args={[0.065, 0.34, 0.028]} />
        </mesh>
        <mesh
          position={[0, CHAIR_LAYOUT.seatHeight + 0.34, -CHAIR_LAYOUT.seatDepth / 2 + 0.04]}
          rotation={[-0.08, 0, 0]}
          castShadow
          receiveShadow
          material={materials.chairFabric}
        >
          <boxGeometry args={[0.45, 0.42, 0.068]} />
        </mesh>

        {/* Left & Right T-Armrests */}
        {[-1, 1].map((dir) => (
          <group
            key={dir}
            position={[dir * (CHAIR_LAYOUT.seatWidth / 2 + 0.02), CHAIR_LAYOUT.seatHeight + 0.11, 0.02]}
          >
            <mesh castShadow material={materials.chairPlasticBase}>
              <boxGeometry args={[0.026, 0.2, 0.04]} />
            </mesh>
            <mesh
              position={[0, 0.1, 0.02]}
              castShadow
              material={materials.chairPlasticBase}
            >
              <boxGeometry args={[0.055, 0.024, 0.24]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ==================== CORNER FLOOR LAMP ==================== */}
      <group position={FLOOR_LAMP_LAYOUT.position} name="floor-lamp">
        <mesh
          position={[0, 0.02, 0]}
          castShadow
          receiveShadow
          material={materials.deskDarkMetal}
        >
          <cylinderGeometry
            args={[
              FLOOR_LAMP_LAYOUT.baseRadius * 0.9,
              FLOOR_LAMP_LAYOUT.baseRadius,
              0.04,
              24,
            ]}
          />
        </mesh>
        <mesh
          position={[0, FLOOR_LAMP_LAYOUT.poleHeight / 2, 0]}
          castShadow
          material={materials.brassAccent}
        >
          <cylinderGeometry args={[0.016, 0.02, FLOOR_LAMP_LAYOUT.poleHeight, 16]} />
        </mesh>
        <mesh
          position={[0, FLOOR_LAMP_LAYOUT.poleHeight - 0.04, 0]}
          material={materials.lampShadeWarm}
        >
          <cylinderGeometry
            args={[
              FLOOR_LAMP_LAYOUT.shadeTopRadius,
              FLOOR_LAMP_LAYOUT.shadeBottomRadius,
              FLOOR_LAMP_LAYOUT.shadeHeight,
              28,
              1,
              true,
            ]}
          />
        </mesh>
      </group>

      {/* ==================== DESK PROPS (MUG, BOOKS, FLOPPY CASE) ==================== */}
      {/* Ceramic Coffee Mug */}
      <group
        position={PROPS_LAYOUT.mug.position}
        rotation={[0, PROPS_LAYOUT.mug.rotationY, 0]}
        name="coffee-mug"
      >
        <mesh position={[0, 0.048, 0]} castShadow receiveShadow material={materials.ceramicMug}>
          <cylinderGeometry args={[0.04, 0.036, 0.096, 20]} />
        </mesh>
        <mesh
          position={[0.042, 0.048, 0]}
          rotation={[0, 0, Math.PI / 2]}
          material={materials.ceramicMug}
        >
          <torusGeometry args={[0.024, 0.006, 10, 18, Math.PI]} />
        </mesh>
      </group>

      {/* Stacked Technical Reference Books on Left Desk Corner */}
      <group
        position={PROPS_LAYOUT.bookStack.position}
        rotation={[0, PROPS_LAYOUT.bookStack.rotationY, 0]}
        name="desk-book-stack"
      >
        <mesh position={[0, 0.016, 0]} receiveShadow material={materials.bookCoverNavy}>
          <boxGeometry args={[0.19, 0.032, 0.24]} />
        </mesh>
        <mesh position={[0.004, 0.016, 0]} material={materials.bookPaperEdges}>
          <boxGeometry args={[0.182, 0.026, 0.232]} />
        </mesh>
        <mesh
          position={[0.008, 0.044, -0.006]}
          rotation={[0, -0.08, 0]}
          receiveShadow
          material={materials.bookCoverRed}
        >
          <boxGeometry args={[0.175, 0.026, 0.225]} />
        </mesh>
      </group>

      {/* 3.5" Floppy Disk Storage Box */}
      <group
        position={PROPS_LAYOUT.floppyCase.position}
        rotation={[0, PROPS_LAYOUT.floppyCase.rotationY, 0]}
        name="floppy-storage-box"
      >
        <mesh
          position={[0, 0.048, 0]}
          receiveShadow
          material={materials.crtDarkBeigeRecess}
        >
          <boxGeometry args={[0.115, 0.096, 0.21]} />
        </mesh>
      </group>

      {/* ==================== LEFT-WALL WOODEN BOOKSHELF ==================== */}
      <group
        position={PROPS_LAYOUT.bookshelf.position}
        rotation={[0, PROPS_LAYOUT.bookshelf.rotationY, 0]}
        name="room-bookshelf"
      >
        {/* Outer Frame */}
        <mesh
          position={[0, PROPS_LAYOUT.bookshelf.height / 2, 0]}
          castShadow
          receiveShadow
          material={materials.deskWoodTrim}
        >
          <boxGeometry
            args={[
              PROPS_LAYOUT.bookshelf.width,
              PROPS_LAYOUT.bookshelf.height,
              PROPS_LAYOUT.bookshelf.depth,
            ]}
          />
        </mesh>
        {/* Shelf Row Books */}
        {[-0.28, -0.22, -0.15, -0.08, 0.12, 0.19, 0.25].map((bx, i) => (
          <mesh
            key={i}
            position={[
              bx,
              1.18 + (i % 3) * 0.01,
              PROPS_LAYOUT.bookshelf.depth / 2 + 0.005,
            ]}
            material={
              i % 3 === 0
                ? materials.bookCoverRed
                : i % 3 === 1
                ? materials.bookCoverNavy
                : materials.bookCoverTeal
            }
          >
            <boxGeometry args={[0.048, 0.24 + (i % 2) * 0.03, 0.04]} />
          </mesh>
        ))}
      </group>
    </group>
  );
};
