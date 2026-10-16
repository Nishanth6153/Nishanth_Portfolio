import { useMemo } from 'react'
import * as THREE from 'three'

interface CrtScreenProps {
  width: number
  height: number
  position: [number, number, number]
}

function makeTerminalTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 640
  canvas.height = 448
  const ctx = canvas.getContext('2d')!

  const background = ctx.createLinearGradient(0, 0, 0, canvas.height)
  background.addColorStop(0, '#08100d')
  background.addColorStop(0.55, '#0b1510')
  background.addColorStop(1, '#060c09')
  ctx.fillStyle = background
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const softGlass = ctx.createRadialGradient(142, 86, 8, 142, 86, 380)
  softGlass.addColorStop(0, 'rgba(171, 220, 175, 0.09)')
  softGlass.addColorStop(0.56, 'rgba(129, 177, 137, 0.025)')
  softGlass.addColorStop(1, 'rgba(5, 12, 8, 0.17)')
  ctx.fillStyle = softGlass
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.textBaseline = 'alphabetic'
  ctx.font = 'bold 29px "Courier New", monospace'
  ctx.fillStyle = '#c3e0b8'
  ctx.fillText('SYSTEM STARTUP', 42, 68)

  ctx.strokeStyle = 'rgba(153, 190, 147, 0.36)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(42, 90)
  ctx.lineTo(598, 90)
  ctx.stroke()

  ctx.font = '24px "Courier New", monospace'
  ctx.fillStyle = '#a5d1a2'
  ctx.fillText('Memory check ........ OK', 42, 144)
  ctx.fillText('Storage ............. READY', 42, 186)
  ctx.fillText('Display ............. ONLINE', 42, 228)
  ctx.fillText('Input device ........ READY', 42, 270)

  ctx.fillStyle = '#739577'
  ctx.fillRect(42, 300, 10, 2)
  ctx.fillRect(59, 300, 10, 2)
  ctx.fillRect(76, 300, 10, 2)
  ctx.font = 'bold 28px "Courier New", monospace'
  ctx.fillStyle = '#d0ecc8'
  ctx.fillText('READY FOR INPUT', 42, 356)
  ctx.font = '24px "Courier New", monospace'
  ctx.fillStyle = '#add2a8'
  ctx.fillText('C:\\> _', 42, 406)

  ctx.fillStyle = 'rgba(2, 6, 4, 0.09)'
  for (let y = 0; y < canvas.height; y += 4) ctx.fillRect(0, y, canvas.width, 1)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.generateMipmaps = true
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.anisotropy = 4
  return texture
}

function makeCurvedScreenGeometry(width: number, height: number) {
  const geometry = new THREE.PlaneGeometry(width, height, 24, 18)
  const positions = geometry.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i) / (width / 2)
    const y = positions.getY(i) / (height / 2)
    const radial = x * x * 0.72 + y * y * 0.38
    positions.setZ(i, -0.006 * radial)
  }
  positions.needsUpdate = true
  geometry.computeVertexNormals()
  return geometry
}

export function CrtScreen({ width, height, position }: CrtScreenProps) {
  const { geometry, material } = useMemo(() => {
    const texture = makeTerminalTexture()
    const geometry = makeCurvedScreenGeometry(width, height)
    const material = new THREE.MeshPhysicalMaterial({
      map: texture,
      emissiveMap: texture,
      emissive: '#729374',
      emissiveIntensity: 0.18,
      roughness: 0.36,
      metalness: 0.02,
      clearcoat: 0.2,
      clearcoatRoughness: 0.34,
      toneMapped: false,
      side: THREE.DoubleSide,
    })
    return { geometry, material }
  }, [width, height])

  return <mesh name="curved-crt-startup-screen" geometry={geometry} material={material} position={position} />
}
