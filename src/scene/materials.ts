import * as THREE from 'three'

function seededRandom(seed: number) {
  let value = seed >>> 0
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0
    return value / 0x100000000
  }
}

function makeWoodGrainMap() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 256
  const ctx = canvas.getContext('2d')!
  const random = seededRandom(92417)
  const base = ctx.createLinearGradient(0, 0, 0, canvas.height)
  base.addColorStop(0, '#59432d')
  base.addColorStop(0.48, '#725638')
  base.addColorStop(1, '#61482e')
  ctx.fillStyle = base
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  for (let i = 0; i < 620; i++) {
    const y = random() * canvas.height
    const phase = random() * Math.PI * 2
    const amplitude = 0.3 + random() * 2.4
    const frequency = 0.012 + random() * 0.034
    const dark = random() > 0.45
    ctx.beginPath()
    ctx.moveTo(0, y)
    for (let x = 12; x <= canvas.width; x += 12) {
      const curve = Math.sin(x * frequency + phase) * amplitude + Math.sin(x * 0.009 + phase * 0.5) * amplitude * 0.4
      ctx.lineTo(x, y + curve)
    }
    ctx.strokeStyle = dark
      ? `rgba(24, 15, 9, ${0.025 + random() * 0.09})`
      : `rgba(211, 173, 121, ${0.018 + random() * 0.065})`
    ctx.lineWidth = 0.35 + random() * 1.05
    ctx.stroke()
  }

  for (let i = 0; i < 3; i++) {
    const x = 48 + random() * (canvas.width - 96)
    const y = 24 + random() * (canvas.height - 48)
    ctx.strokeStyle = 'rgba(28, 17, 10, 0.09)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.ellipse(x, y, 4 + random() * 4, 13 + random() * 10, 0, 0, Math.PI * 2)
    ctx.stroke()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(2, 1)
  texture.anisotropy = 4
  return texture
}

function makeAgedPlasticMap() {
  const canvas = document.createElement('canvas')
  canvas.width = 96
  canvas.height = 96
  const ctx = canvas.getContext('2d')!
  const random = seededRandom(1819)
  ctx.fillStyle = '#b8b5ae'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  for (let i = 0; i < 900; i++) {
    const light = random() > 0.52
    ctx.fillStyle = light ? 'rgba(255,250,233,0.06)' : 'rgba(47,39,28,0.045)'
    ctx.fillRect(random() * canvas.width, random() * canvas.height, 1, 1)
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(1.2, 1.2)
  texture.anisotropy = 2
  return texture
}

function makeFabricMap() {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')!
  const random = seededRandom(443)
  ctx.fillStyle = '#b7b8b9'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  for (let i = 0; i < 128; i++) {
    const offset = random() * 2
    ctx.strokeStyle = i % 2 ? 'rgba(255,255,255,0.10)' : 'rgba(45,49,54,0.09)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(i + offset, 0)
    ctx.lineTo(i + offset, canvas.height)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, i + offset)
    ctx.lineTo(canvas.width, i + offset)
    ctx.stroke()
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(3, 3)
  texture.anisotropy = 2
  return texture
}

export const floorMat = new THREE.MeshStandardMaterial({ color: '#25262b', roughness: 0.86, metalness: 0.008 })
export const wallMat = new THREE.MeshStandardMaterial({ color: '#323035', roughness: 0.96, metalness: 0 })
export const deskMat = new THREE.MeshStandardMaterial({ map: makeWoodGrainMap(), color: '#ffffff', roughness: 0.72, metalness: 0 })
export const plasticDarkMat = new THREE.MeshStandardMaterial({ color: '#202225', roughness: 0.62, metalness: 0.025 })
export const plasticBeigeMat = new THREE.MeshPhysicalMaterial({ color: '#b4a88f', map: makeAgedPlasticMap(), roughness: 0.74, metalness: 0.008, clearcoat: 0.08, clearcoatRoughness: 0.72 })
export const screenMat = new THREE.MeshPhysicalMaterial({ color: '#0b100e', roughness: 0.38, metalness: 0.015, clearcoat: 0.18, clearcoatRoughness: 0.34 })
export const chairFabricMat = new THREE.MeshStandardMaterial({ color: '#74787e', map: makeFabricMap(), roughness: 0.96, metalness: 0 })
export const glassMat = new THREE.MeshPhysicalMaterial({ color: '#a1b2c4', roughness: 0.24, metalness: 0.025, transparent: true, opacity: 0.11, depthWrite: false, clearcoat: 0.5, clearcoatRoughness: 0.18 })
export const cityMat = new THREE.MeshBasicMaterial({ color: '#ffffff', toneMapped: false, side: THREE.DoubleSide })
export const lampShadeMat = new THREE.MeshStandardMaterial({ color: '#b6a788', roughness: 0.84 })
export const propMat = new THREE.MeshStandardMaterial({ color: '#39373a', roughness: 0.84, metalness: 0.025 })
export const trimMat = new THREE.MeshStandardMaterial({ color: '#3c352e', roughness: 0.62, metalness: 0.075 })
export const brassMat = new THREE.MeshStandardMaterial({ color: '#8e7048', roughness: 0.42, metalness: 0.56 })
