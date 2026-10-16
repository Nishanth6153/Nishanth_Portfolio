import { wallMat, floorMat } from './materials'
import { LAYOUT, type BoxSize, type Transform } from './layout'

function WallBlock({ name, transform, size }: { name: string; transform: Transform; size: BoxSize }) {
  return (
    <mesh name={name} position={transform.position} rotation={transform.rotation} scale={transform.scale} castShadow receiveShadow material={wallMat}>
      <boxGeometry args={size} />
    </mesh>
  )
}

export function Room() {
  const room = LAYOUT.room
  return (
    <group name="room-shell" position={room.root.position} rotation={room.root.rotation} scale={room.root.scale}>
      <mesh name="floor" position={room.floor.transform.position} rotation={room.floor.transform.rotation} scale={room.floor.transform.scale} receiveShadow material={floorMat}>
        <boxGeometry args={room.floor.size} />
      </mesh>
      <mesh name="ceiling" position={room.ceiling.transform.position} rotation={room.ceiling.transform.rotation} scale={room.ceiling.transform.scale} receiveShadow material={wallMat}>
        <boxGeometry args={room.ceiling.size} />
      </mesh>
      <WallBlock name="rear-wall-below-window" {...room.walls.rearBelowWindow} />
      <WallBlock name="rear-wall-above-window" {...room.walls.rearAboveWindow} />
      <WallBlock name="rear-wall-left-of-window" {...room.walls.rearLeftOfWindow} />
      <WallBlock name="rear-wall-right-of-window" {...room.walls.rearRightOfWindow} />
      <WallBlock name="left-wall" {...room.walls.left} />
      <WallBlock name="right-wall" {...room.walls.right} />
      <mesh name="rear-baseboard" position={room.rearBaseboard.transform.position} rotation={room.rearBaseboard.transform.rotation} scale={room.rearBaseboard.transform.scale} material={wallMat}>
        <boxGeometry args={room.rearBaseboard.size} />
      </mesh>
    </group>
  )
}
