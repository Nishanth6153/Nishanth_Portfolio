export function Lighting() {
  return (
    <group name="lighting-rig">
      <hemisphereLight name="night-ambient" args={['#899ab5', '#37302a', 1.08]} />
      <ambientLight name="room-fill" color="#8790a6" intensity={0.18} />
      {/* Aim the existing cool fill through the clear window aperture toward the room. */}
      <directionalLight
        name="cool-window-light"
        color="#8ba6d1"
        intensity={1.28}
        position={[-0.15, 2.4, -2.7]}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={3}
        shadow-camera-bottom={-2}
        shadow-camera-near={0.5}
        shadow-camera-far={9}
        shadow-bias={-0.00035}
        shadow-normalBias={0.035}
      />
      <pointLight name="desk-lamp-pool" color="#ffb875" intensity={5.4} distance={2.8} decay={2} position={[-0.64, 1.29, -0.17]} castShadow shadow-mapSize={[512, 512]} />
      <pointLight name="cool-screen-spill" color="#8096c8" intensity={0.16} distance={1.55} decay={2} position={[0.12, 0.79, 0.16]} />
    </group>
  )
}
