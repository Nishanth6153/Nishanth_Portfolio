import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'
import { CrtScreen } from './CrtScreen'
import { deskMat, plasticBeigeMat, plasticDarkMat, screenMat, propMat, trimMat } from './materials'
import { LAYOUT } from './layout'

const ledMat = new THREE.MeshStandardMaterial({ color: '#83a886', emissive: '#59785d', emissiveIntensity: 0.8 })
const paperMat = new THREE.MeshStandardMaterial({ color: '#b9aa8a', roughness: 0.94 })
const mugMat = new THREE.MeshStandardMaterial({ color: '#554538', roughness: 0.34, metalness: 0.04 })
const speakerMat = new THREE.MeshStandardMaterial({ color: '#282729', roughness: 0.68 })

export function Desk() {
  const desk = LAYOUT.desk
  const crt = desk.crt
  const tower = desk.tower
  const keyboard = desk.keyboard
  const speaker = desk.speaker
  const vhs = desk.vhs
  const mug = desk.mug
  const notebook = desk.notebook

  return (
    <group name="desk-assembly" position={desk.root.position} rotation={desk.root.rotation} scale={desk.root.scale}>
      <group name="desk-frame" position={desk.frameRoot.position} rotation={desk.frameRoot.rotation} scale={desk.frameRoot.scale}>
        <RoundedBox name="desk-top" args={desk.top.size} radius={0.025} smoothness={3} position={desk.top.transform.position} rotation={desk.top.transform.rotation} scale={desk.top.transform.scale} castShadow receiveShadow material={deskMat} />
        <RoundedBox name="desk-front-apron" args={desk.apron.size} radius={0.018} smoothness={2} position={desk.apron.transform.position} rotation={desk.apron.transform.rotation} scale={desk.apron.transform.scale} castShadow material={deskMat} />
        {desk.legs.map((leg, index) => (
          <mesh key={index} name={`desk-leg-${index + 1}`} position={leg.position} rotation={leg.rotation} scale={leg.scale} castShadow material={deskMat}>
            <boxGeometry args={desk.legSize} />
          </mesh>
        ))}
      </group>

      <group name="computer-assembly" position={desk.computerRoot.position} rotation={desk.computerRoot.rotation} scale={desk.computerRoot.scale}>
        <group name="crt-monitor-assembly" position={desk.crtRoot.position} rotation={desk.crtRoot.rotation} scale={desk.crtRoot.scale}>
          <RoundedBox name="crt-housing" args={crt.housing.size} radius={0.055} smoothness={5} position={crt.housing.transform.position} rotation={crt.housing.transform.rotation} scale={crt.housing.transform.scale} castShadow receiveShadow material={plasticBeigeMat} />
          <RoundedBox name="crt-bezel-inset" args={crt.bezel.size} radius={0.035} smoothness={4} position={crt.bezel.transform.position} rotation={crt.bezel.transform.rotation} scale={crt.bezel.transform.scale} material={plasticDarkMat} />
          <mesh name="crt-screen-backing" position={crt.backing.transform.position} rotation={crt.backing.transform.rotation} scale={crt.backing.transform.scale} material={screenMat}>
            <planeGeometry args={crt.backing.size.slice(0, 2) as [number, number]} />
          </mesh>
          <CrtScreen width={crt.screenWidth} height={crt.screenHeight} position={crt.screen.transform.position} />
          <RoundedBox name="crt-control-panel" args={crt.controlPanel.size} radius={0.012} smoothness={3} position={crt.controlPanel.transform.position} rotation={crt.controlPanel.transform.rotation} scale={crt.controlPanel.transform.scale} material={plasticBeigeMat} />
          {crt.controlButtons.map((button, index) => (
            <mesh key={index} name={`crt-control-button-${index + 1}`} position={button.position} rotation={button.rotation} scale={button.scale} material={trimMat}>
              <circleGeometry args={[crt.buttonRadius, 12]} />
            </mesh>
          ))}
          <mesh name="crt-led" position={crt.led.transform.position} rotation={crt.led.transform.rotation} scale={crt.led.transform.scale} material={ledMat}>
            <circleGeometry args={[crt.led.radius, 12]} />
          </mesh>
          <RoundedBox name="crt-stand-neck" args={crt.standNeck.size} radius={0.018} smoothness={3} position={crt.standNeck.transform.position} rotation={crt.standNeck.transform.rotation} scale={crt.standNeck.transform.scale} material={plasticBeigeMat} />
          <RoundedBox name="crt-stand-foot" args={crt.standFoot.size} radius={0.018} smoothness={3} position={crt.standFoot.transform.position} rotation={crt.standFoot.transform.rotation} scale={crt.standFoot.transform.scale} castShadow material={plasticBeigeMat} />
          <mesh name="crt-vent-shadow" position={crt.vent.transform.position} rotation={crt.vent.transform.rotation} scale={crt.vent.transform.scale} material={trimMat}>
            <boxGeometry args={crt.vent.size} />
          </mesh>
        </group>

        <group name="computer-tower-assembly" position={desk.towerRoot.position} rotation={desk.towerRoot.rotation} scale={desk.towerRoot.scale}>
          <RoundedBox name="tower-case" args={tower.case.size} radius={0.038} smoothness={4} position={tower.case.transform.position} rotation={tower.case.transform.rotation} scale={tower.case.transform.scale} castShadow receiveShadow material={plasticBeigeMat} />
          <RoundedBox name="tower-face" args={tower.face.size} radius={0.018} smoothness={3} position={tower.face.transform.position} rotation={tower.face.transform.rotation} scale={tower.face.transform.scale} material={plasticDarkMat} />
          <mesh name="tower-drive-bay" position={tower.driveBay.transform.position} rotation={tower.driveBay.transform.rotation} scale={tower.driveBay.transform.scale} material={plasticBeigeMat}>
            <boxGeometry args={tower.driveBay.size} />
          </mesh>
          <mesh name="tower-floppy-slot" position={tower.floppySlot.transform.position} rotation={tower.floppySlot.transform.rotation} scale={tower.floppySlot.transform.scale} material={trimMat}>
            <boxGeometry args={tower.floppySlot.size} />
          </mesh>
          <mesh name="tower-power" position={tower.power.transform.position} rotation={tower.power.transform.rotation} scale={tower.power.transform.scale} material={ledMat}>
            <circleGeometry args={[tower.power.radius, 12]} />
          </mesh>
          {tower.vents.map((vent, index) => (
            <mesh key={index} name={`tower-vent-${index + 1}`} position={vent.position} rotation={vent.rotation} scale={vent.scale} material={trimMat}>
              <boxGeometry args={tower.ventSize} />
            </mesh>
          ))}
        </group>
      </group>

      <group name="keyboard-mouse-assembly" position={desk.keyboardRoot.position} rotation={desk.keyboardRoot.rotation} scale={desk.keyboardRoot.scale}>
        <RoundedBox name="keyboard-shell" args={keyboard.shell.size} radius={0.018} smoothness={3} position={keyboard.shell.transform.position} rotation={keyboard.shell.transform.rotation} scale={keyboard.shell.transform.scale} castShadow receiveShadow material={plasticBeigeMat} />
        <mesh name="keyboard-keybed" position={keyboard.keybed.transform.position} rotation={keyboard.keybed.transform.rotation} scale={keyboard.keybed.transform.scale} material={plasticDarkMat}>
          <boxGeometry args={keyboard.keybed.size} />
        </mesh>
        {Array.from({ length: keyboard.keys.rows }, (_, row) => Array.from({ length: keyboard.keys.columns }, (_, col) => (
          <mesh key={`${row}-${col}`} name={`keyboard-key-${row + 1}-${col + 1}`} position={[keyboard.keys.firstX + col * keyboard.keys.stepX, keyboard.keys.y, keyboard.keys.firstZ + row * keyboard.keys.stepZ]} material={plasticBeigeMat}>
            <boxGeometry args={keyboard.keys.size} />
          </mesh>
        )))}
        <RoundedBox name="mouse" args={keyboard.mouse.size} radius={keyboard.mouse.radius} smoothness={4} position={keyboard.mouse.transform.position} rotation={keyboard.mouse.transform.rotation} scale={keyboard.mouse.transform.scale} castShadow material={plasticBeigeMat} />
      </group>

      <group name="desktop-accessories" position={desk.accessoriesRoot.position} rotation={desk.accessoriesRoot.rotation} scale={desk.accessoriesRoot.scale}>
        <group name="compact-speaker-assembly" position={desk.speakerRoot.position} rotation={desk.speakerRoot.rotation} scale={desk.speakerRoot.scale}>
          <RoundedBox name="speaker-cabinet" args={speaker.cabinet.size} radius={0.018} smoothness={3} position={speaker.cabinet.transform.position} rotation={speaker.cabinet.transform.rotation} scale={speaker.cabinet.transform.scale} castShadow material={speakerMat} />
          <mesh name="speaker-cone" position={speaker.cone.transform.position} rotation={speaker.cone.transform.rotation} scale={speaker.cone.transform.scale} material={propMat}>
            <circleGeometry args={[speaker.cone.radius, 20]} />
          </mesh>
          <mesh name="speaker-dust-cap" position={speaker.cap.transform.position} rotation={speaker.cap.transform.rotation} scale={speaker.cap.transform.scale} material={plasticDarkMat}>
            <circleGeometry args={[speaker.cap.radius, 16]} />
          </mesh>
        </group>

        <group name="vhs-stack-assembly" position={desk.vhsRoot.position} rotation={desk.vhsRoot.rotation} scale={desk.vhsRoot.scale}>
          <mesh name="vhs-stack-base" position={vhs.base.transform.position} rotation={vhs.base.transform.rotation} scale={vhs.base.transform.scale} castShadow material={propMat}>
            <boxGeometry args={vhs.base.size} />
          </mesh>
          {vhs.cases.map((item, index) => (
            <mesh key={index} name={`vhs-case-${index + 1}`} position={item.position} rotation={item.rotation} scale={item.scale} castShadow material={index ? plasticDarkMat : propMat}>
              <boxGeometry args={vhs.caseSize} />
            </mesh>
          ))}
        </group>

        <group name="coffee-mug-assembly" position={desk.mugRoot.position} rotation={desk.mugRoot.rotation} scale={desk.mugRoot.scale}>
          <mesh name="coffee-mug-body" position={mug.body.transform.position} rotation={mug.body.transform.rotation} scale={mug.body.transform.scale} castShadow material={mugMat}>
            <cylinderGeometry args={[mug.body.topRadius, mug.body.bottomRadius, mug.body.height, 20]} />
          </mesh>
          <mesh name="mug-rim" position={mug.rim.transform.position} rotation={mug.rim.transform.rotation} scale={mug.rim.transform.scale} material={mugMat}>
            <torusGeometry args={[mug.rim.radius, mug.rim.tube, 8, 20]} />
          </mesh>
          <mesh name="mug-handle" position={mug.handle.transform.position} rotation={mug.handle.transform.rotation} scale={mug.handle.transform.scale} material={mugMat}>
            <torusGeometry args={[mug.handle.radius, mug.handle.tube, 8, 16]} />
          </mesh>
        </group>

        <group name="paper-notebook-assembly" position={desk.notebookRoot.position} rotation={desk.notebookRoot.rotation} scale={desk.notebookRoot.scale}>
          <mesh name="paper-notebook" position={notebook.pages.transform.position} rotation={notebook.pages.transform.rotation} scale={notebook.pages.transform.scale} receiveShadow material={paperMat}>
            <planeGeometry args={notebook.pages.size.slice(0, 2) as [number, number]} />
          </mesh>
          <mesh name="notebook-cover" position={notebook.cover.transform.position} rotation={notebook.cover.transform.rotation} scale={notebook.cover.transform.scale} material={propMat}>
            <planeGeometry args={notebook.cover.size.slice(0, 2) as [number, number]} />
          </mesh>
        </group>
      </group>
    </group>
  )
}
