import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'
import { lampShadeMat, deskMat, plasticDarkMat, chairFabricMat } from './materials'
import { LAYOUT } from './layout'

const lampMetal = new THREE.MeshStandardMaterial({ color: '#292722', roughness: 0.42, metalness: 0.38 })
const pottery = new THREE.MeshStandardMaterial({ color: '#634b3b', roughness: 0.78 })
const leafMat = new THREE.MeshStandardMaterial({ color: '#415944', roughness: 0.92 })
const chairSeamMat = new THREE.MeshStandardMaterial({ color: '#4b4e52', roughness: 0.98 })
const bookMats = ['#463d34', '#504448', '#34414a', '#62503c'].map(color => new THREE.MeshStandardMaterial({ color, roughness: 0.86 }))

export function Props() {
  const props = LAYOUT.props
  const deskLamp = props.deskLamp
  const floorLamp = props.floorLamp
  const plant = props.plant
  const books = props.books
  const chair = props.chair
  const sideTable = props.sideTable

  return (
    <group name="room-props" position={props.root.position} rotation={props.root.rotation} scale={props.root.scale}>
      <group name="desk-lamp-assembly" position={props.deskLampRoot.position} rotation={props.deskLampRoot.rotation} scale={props.deskLampRoot.scale}>
        <mesh name="desk-lamp-base" position={deskLamp.base.transform.position} rotation={deskLamp.base.transform.rotation} scale={deskLamp.base.transform.scale} castShadow material={lampMetal}>
          <cylinderGeometry args={[deskLamp.base.topRadius, deskLamp.base.bottomRadius, deskLamp.base.height, 20]} />
        </mesh>
        <mesh name="desk-lamp-lower-arm" position={deskLamp.lowerArm.transform.position} rotation={deskLamp.lowerArm.transform.rotation} scale={deskLamp.lowerArm.transform.scale} castShadow material={lampMetal}>
          <cylinderGeometry args={[deskLamp.lowerArm.radiusTop, deskLamp.lowerArm.radiusBottom, deskLamp.lowerArm.length, 10]} />
        </mesh>
        <mesh name="desk-lamp-upper-arm" position={deskLamp.upperArm.transform.position} rotation={deskLamp.upperArm.transform.rotation} scale={deskLamp.upperArm.transform.scale} castShadow material={lampMetal}>
          <cylinderGeometry args={[deskLamp.upperArm.radiusTop, deskLamp.upperArm.radiusBottom, deskLamp.upperArm.length, 10]} />
        </mesh>
        <mesh name="desk-lamp-lower-joint" position={deskLamp.lowerJoint.transform.position} rotation={deskLamp.lowerJoint.transform.rotation} scale={deskLamp.lowerJoint.transform.scale} castShadow material={lampMetal}>
          <sphereGeometry args={[deskLamp.lowerJoint.radius, 12, 10]} />
        </mesh>
        <mesh name="desk-lamp-upper-joint" position={deskLamp.upperJoint.transform.position} rotation={deskLamp.upperJoint.transform.rotation} scale={deskLamp.upperJoint.transform.scale} castShadow material={lampMetal}>
          <sphereGeometry args={[deskLamp.upperJoint.radius, 12, 10]} />
        </mesh>
        <mesh name="desk-lamp-shade" position={deskLamp.shade.transform.position} rotation={deskLamp.shade.transform.rotation} scale={deskLamp.shade.transform.scale} castShadow material={lampShadeMat}>
          <cylinderGeometry args={[deskLamp.shade.topRadius, deskLamp.shade.bottomRadius, deskLamp.shade.height, 20, 1, true]} />
        </mesh>
        <mesh name="desk-lamp-shade-rim" position={deskLamp.shadeRim.transform.position} rotation={deskLamp.shadeRim.transform.rotation} scale={deskLamp.shadeRim.transform.scale} material={lampMetal}>
          <torusGeometry args={[deskLamp.shadeRim.radius, deskLamp.shadeRim.tube, 8, 20]} />
        </mesh>
        <mesh name="desk-lamp-bulb" position={deskLamp.bulb.transform.position} rotation={deskLamp.bulb.transform.rotation} scale={deskLamp.bulb.transform.scale} material={new THREE.MeshBasicMaterial({ color: '#ffd69b' })}>
          <sphereGeometry args={[deskLamp.bulb.radius, 12, 8]} />
        </mesh>
      </group>

      <group name="floor-lamp-assembly" position={props.floorLampRoot.position} rotation={props.floorLampRoot.rotation} scale={props.floorLampRoot.scale}>
        <group name="floor-lamp-visible-geometry" position={floorLamp.visibleOffset.position} rotation={floorLamp.visibleOffset.rotation} scale={floorLamp.visibleOffset.scale}>
          <mesh name="floor-lamp-pole" position={floorLamp.pole.transform.position} rotation={floorLamp.pole.transform.rotation} scale={floorLamp.pole.transform.scale} castShadow material={lampMetal}>
            <cylinderGeometry args={[floorLamp.pole.topRadius, floorLamp.pole.bottomRadius, floorLamp.pole.height, 12]} />
          </mesh>
          <mesh name="floor-lamp-base" position={floorLamp.base.transform.position} rotation={floorLamp.base.transform.rotation} scale={floorLamp.base.transform.scale} castShadow material={lampMetal}>
            <cylinderGeometry args={[floorLamp.base.topRadius, floorLamp.base.bottomRadius, floorLamp.base.height, 24]} />
          </mesh>
          <mesh name="floor-lamp-shade" position={floorLamp.shade.transform.position} rotation={floorLamp.shade.transform.rotation} scale={floorLamp.shade.transform.scale} castShadow material={lampShadeMat}>
            <cylinderGeometry args={[floorLamp.shade.topRadius, floorLamp.shade.bottomRadius, floorLamp.shade.height, 24, 1, true]} />
          </mesh>
          <mesh name="floor-lamp-shade-rim" position={floorLamp.shadeRim.transform.position} rotation={floorLamp.shadeRim.transform.rotation} scale={floorLamp.shadeRim.transform.scale} material={lampMetal}>
            <torusGeometry args={[floorLamp.shadeRim.radius, floorLamp.shadeRim.tube, 8, 24]} />
          </mesh>
          <mesh name="floor-lamp-bulb" position={floorLamp.bulb.transform.position} rotation={floorLamp.bulb.transform.rotation} scale={floorLamp.bulb.transform.scale} material={new THREE.MeshBasicMaterial({ color: '#ffd09a', toneMapped: false })}>
            <sphereGeometry args={[floorLamp.bulb.radius, 12, 10]} />
          </mesh>
        </group>
        <pointLight name="floor-lamp-pool" color="#e9ae74" intensity={2.2} distance={3.1} decay={2} position={floorLamp.light.transform.position} />
      </group>

      <group name="potted-plant-assembly" position={props.plantRoot.position} rotation={props.plantRoot.rotation} scale={props.plantRoot.scale}>
        <mesh name="plant-pot" position={plant.pot.transform.position} rotation={plant.pot.transform.rotation} scale={plant.pot.transform.scale} castShadow material={pottery}>
          <cylinderGeometry args={[plant.pot.topRadius, plant.pot.bottomRadius, plant.pot.height, 16]} />
        </mesh>
        <mesh name="plant-saucer" position={plant.saucer.transform.position} rotation={plant.saucer.transform.rotation} scale={plant.saucer.transform.scale} material={pottery}>
          <cylinderGeometry args={[plant.saucer.radius, plant.saucer.radius, plant.saucer.height, 16]} />
        </mesh>
        <mesh name="plant-rim" position={plant.rim.transform.position} rotation={plant.rim.transform.rotation} scale={plant.rim.transform.scale} material={pottery}>
          <cylinderGeometry args={[plant.rim.radius, plant.rim.radius, plant.rim.height, 14]} />
        </mesh>
        <group name="plant-canopy" position={plant.canopyRoot.position} rotation={plant.canopyRoot.rotation} scale={plant.canopyRoot.scale}>
          {plant.leaves.map((leaf, index) => (
            <mesh key={index} name={`plant-leaf-${index + 1}`} position={leaf.transform.position} rotation={leaf.transform.rotation} scale={leaf.transform.scale} castShadow material={leafMat}>
              <sphereGeometry args={[plant.leafRadius, 16, 12]} />
            </mesh>
          ))}
        </group>
      </group>

      <group name="floor-book-stack" position={props.bookStackRoot.position} rotation={props.bookStackRoot.rotation} scale={props.bookStackRoot.scale}>
        {books.positions.map((book, index) => (
          <RoundedBox key={index} name={`book-${index + 1}`} position={book.position} rotation={book.rotation} scale={book.scale} args={books.size} radius={books.radius} smoothness={2} castShadow material={bookMats[index]} />
        ))}
      </group>

      <group name="lounge-chair-assembly" position={props.chairRoot.position} rotation={props.chairRoot.rotation} scale={props.chairRoot.scale}>
        <group name="chair-cushions" position={chair.cushionsRoot.position} rotation={chair.cushionsRoot.rotation} scale={chair.cushionsRoot.scale}>
          <RoundedBox name="chair-seat-cushion" position={chair.seat.transform.position} rotation={chair.seat.transform.rotation} scale={chair.seat.transform.scale} args={chair.seat.size} radius={chair.seat.radius} smoothness={4} castShadow receiveShadow material={chairFabricMat} />
          <RoundedBox name="chair-back-cushion" position={chair.back.transform.position} rotation={chair.back.transform.rotation} scale={chair.back.transform.scale} args={chair.back.size} radius={chair.back.radius} smoothness={4} castShadow material={chairFabricMat} />
          {chair.seams.map((seam, index) => (
            <mesh key={index} name={`chair-back-seam-${index + 1}`} position={seam.position} rotation={seam.rotation} scale={seam.scale} material={chairSeamMat}>
              <boxGeometry args={chair.seamSize} />
            </mesh>
          ))}
        </group>
        <group name="chair-armrests" position={chair.armrestsRoot.position} rotation={chair.armrestsRoot.rotation} scale={chair.armrestsRoot.scale}>
          {chair.arms.map((arm, index) => (
            <RoundedBox key={index} name={index === 0 ? 'chair-armrest-left' : 'chair-armrest-right'} position={arm.position} rotation={arm.rotation} scale={arm.scale} args={chair.armSize} radius={0.04} smoothness={3} castShadow material={chairFabricMat} />
          ))}
        </group>
        <group name="chair-leg-supports" position={chair.legsRoot.position} rotation={chair.legsRoot.rotation} scale={chair.legsRoot.scale}>
          {chair.legs.map((leg, index) => {
            const names = ['chair-leg-left-back', 'chair-leg-right-back', 'chair-leg-left-front', 'chair-leg-right-front']
            return (
              <mesh key={index} name={names[index]} position={leg.position} rotation={leg.rotation} scale={leg.scale} castShadow material={deskMat}>
                <cylinderGeometry args={[chair.legTopRadius, chair.legBottomRadius, chair.legHeight, 10]} />
              </mesh>
            )
          })}
        </group>
      </group>

      <group name="side-table-assembly" position={props.sideTableRoot.position} rotation={props.sideTableRoot.rotation} scale={props.sideTableRoot.scale}>
        <mesh name="side-table-body" position={sideTable.body.transform.position} rotation={sideTable.body.transform.rotation} scale={sideTable.body.transform.scale} castShadow receiveShadow material={deskMat}>
          <boxGeometry args={sideTable.body.size} />
        </mesh>
        <mesh name="side-table-drawer-pull" position={sideTable.pull.transform.position} rotation={sideTable.pull.transform.rotation} scale={sideTable.pull.transform.scale} material={lampMetal}>
          <boxGeometry args={sideTable.pull.size} />
        </mesh>
        <mesh name="side-table-radio" position={sideTable.radio.transform.position} rotation={sideTable.radio.transform.rotation} scale={sideTable.radio.transform.scale} castShadow material={plasticDarkMat}>
          <boxGeometry args={sideTable.radio.size} />
        </mesh>
        <mesh name="radio-dial" position={sideTable.dial.transform.position} rotation={sideTable.dial.transform.rotation} scale={sideTable.dial.transform.scale} material={lampShadeMat}>
          <circleGeometry args={[sideTable.dial.radius, 16]} />
        </mesh>
      </group>
    </group>
  )
}
