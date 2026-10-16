import * as THREE from 'three'

/**
 * Procedural geometry generators for the polished CRT monitor.
 * All shapes are mathematically constructed procedural BufferGeometries.
 * Memory is managed by caller disposal or React useMemo lifecycle.
 */

/**
 * Creates the tapered rear chassis of a vintage CRT monitor.
 * Smoothly lofts from the front bezel junction to a narrower rear housing.
 */
export function createTaperedChassisGeometry(
  frontWidth = 0.55,
  frontHeight = 0.45,
  rearWidth = 0.33,
  rearHeight = 0.30,
  zFront = 0.115,
  zRear = -0.218,
  slices = 8,
  pointsPerCorner = 8,
): THREE.BufferGeometry {
  const pointsPerRing = pointsPerCorner * 4
  const positions: number[] = []
  const uvs: number[] = []
  const indices: number[] = []

  // Precompute 2D unit perimeter coordinates for a rounded rectangle
  function getRingPoints(w: number, h: number, r: number, z: number) {
    const pts: [number, number, number][] = []
    const hr = Math.min(r, w * 0.45, h * 0.45)
    const corners: [number, number][] = [
      [w / 2 - hr, h / 2 - hr], // Top-right
      [-w / 2 + hr, h / 2 - hr], // Top-left
      [-w / 2 + hr, -h / 2 + hr], // Bottom-left
      [w / 2 - hr, -h / 2 + hr], // Bottom-right
    ]

    for (let c = 0; c < 4; c++) {
      const [cx, cy] = corners[c]
      const startAngle = (c * Math.PI) / 2
      for (let i = 0; i < pointsPerCorner; i++) {
        const theta = startAngle + (i / (pointsPerCorner - 1)) * (Math.PI / 2)
        pts.push([cx + hr * Math.cos(theta), cy + hr * Math.sin(theta), z])
      }
    }
    return pts
  }

  // Generate rings along Z with a subtle convex loft
  const allRings: [number, number, number][][] = []
  for (let s = 0; s < slices; s++) {
    const t = s / (slices - 1)
    // Convex loft easing
    const ease = Math.pow(t, 0.82)
    const w = frontWidth + (rearWidth - frontWidth) * ease
    const h = frontHeight + (rearHeight - frontHeight) * ease
    const r = 0.045 + (0.032 - 0.045) * t
    const z = zFront + (zRear - zFront) * t
    const ring = getRingPoints(w, h, r, z)
    allRings.push(ring)

    for (let p = 0; p < pointsPerRing; p++) {
      const [x, y, pz] = ring[p]
      positions.push(x, y, pz)
      uvs.push(p / pointsPerRing, t)
    }
  }

  // Build quad strips between consecutive rings
  for (let s = 0; s < slices - 1; s++) {
    const ringA = s * pointsPerRing
    const ringB = (s + 1) * pointsPerRing
    for (let p = 0; p < pointsPerRing; p++) {
      const nextP = (p + 1) % pointsPerRing
      const a0 = ringA + p
      const a1 = ringA + nextP
      const b0 = ringB + p
      const b1 = ringB + nextP

      indices.push(a0, b0, a1)
      indices.push(a1, b0, b1)
    }
  }

  // Rear end cap (at zRear)
  const rearRingOffset = (slices - 1) * pointsPerRing
  const centerIndex = positions.length / 3
  positions.push(0, 0, zRear)
  uvs.push(0.5, 0.5)

  for (let p = 0; p < pointsPerRing; p++) {
    const nextP = (p + 1) % pointsPerRing
    indices.push(centerIndex, rearRingOffset + nextP, rearRingOffset + p)
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

/**
 * Creates the seamless front bezel frame with an inner aperture hole for the screen.
 * Both outer edge and inner screen cutout receive smooth chamfered bevels.
 */
export function createBezelFrameGeometry(
  outerW = 0.585,
  outerH = 0.485,
  outerR = 0.034,
  innerW = 0.458,
  innerH = 0.338,
  innerR = 0.016,
  centerY = 0.038,
  depth = 0.048,
): THREE.BufferGeometry {
  const shape = new THREE.Shape()

  // Outer rounded rectangle path (Counter-Clockwise)
  const ox0 = -outerW / 2
  const ox1 = outerW / 2
  const oy0 = 0.015 - outerH / 2
  const oy1 = 0.015 + outerH / 2
  const or = Math.min(outerR, outerW * 0.45, outerH * 0.45)

  shape.moveTo(ox0 + or, oy0)
  shape.lineTo(ox1 - or, oy0)
  shape.quadraticCurveTo(ox1, oy0, ox1, oy0 + or)
  shape.lineTo(ox1, oy1 - or)
  shape.quadraticCurveTo(ox1, oy1, ox1 - or, oy1)
  shape.lineTo(ox0 + or, oy1)
  shape.quadraticCurveTo(ox0, oy1, ox0, oy1 - or)
  shape.lineTo(ox0, oy0 + or)
  shape.quadraticCurveTo(ox0, oy0, ox0 + or, oy0)

  // Inner aperture hole path (Clockwise)
  const hole = new THREE.Path()
  const ix0 = -innerW / 2
  const ix1 = innerW / 2
  const iy0 = centerY - innerH / 2
  const iy1 = centerY + innerH / 2
  const ir = Math.min(innerR, innerW * 0.45, innerH * 0.45)

  // Clockwise order: top-left -> top-right -> bottom-right -> bottom-left -> top-left
  hole.moveTo(ix0 + ir, iy1)
  hole.lineTo(ix1 - ir, iy1)
  hole.quadraticCurveTo(ix1, iy1, ix1, iy1 - ir)
  hole.lineTo(ix1, iy0 + ir)
  hole.quadraticCurveTo(ix1, iy0, ix1 - ir, iy0)
  hole.lineTo(ix0 + ir, iy0)
  hole.quadraticCurveTo(ix0, iy0, ix0, iy0 + ir)
  hole.lineTo(ix0, iy1 - ir)
  hole.quadraticCurveTo(ix0, iy1, ix0 + ir, iy1)

  shape.holes.push(hole)

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.012,
    bevelSize: 0.012,
    bevelOffset: 0,
    bevelSegments: 4,
    curveSegments: 8,
  })

  geometry.computeVertexNormals()
  return geometry
}

/**
 * Creates the recessed inner bezel lip that holds the CRT glass inside the front frame.
 */
export function createInnerBezelLipGeometry(
  outerW = 0.468,
  outerH = 0.348,
  innerW = 0.444,
  innerH = 0.324,
  depth = 0.016,
): THREE.BufferGeometry {
  const shape = new THREE.Shape()
  const ox0 = -outerW / 2
  const ox1 = outerW / 2
  const oy0 = -outerH / 2
  const oy1 = outerH / 2
  const or = 0.018

  shape.moveTo(ox0 + or, oy0)
  shape.lineTo(ox1 - or, oy0)
  shape.quadraticCurveTo(ox1, oy0, ox1, oy0 + or)
  shape.lineTo(ox1, oy1 - or)
  shape.quadraticCurveTo(ox1, oy1, ox1 - or, oy1)
  shape.lineTo(ox0 + or, oy1)
  shape.quadraticCurveTo(ox0, oy1, ox0, oy1 - or)
  shape.lineTo(ox0, oy0 + or)
  shape.quadraticCurveTo(ox0, oy0, ox0 + or, oy0)

  const hole = new THREE.Path()
  const ix0 = -innerW / 2
  const ix1 = innerW / 2
  const iy0 = -innerH / 2
  const iy1 = innerH / 2
  const ir = 0.012

  hole.moveTo(ix0 + ir, iy1)
  hole.lineTo(ix1 - ir, iy1)
  hole.quadraticCurveTo(ix1, iy1, ix1, iy1 - ir)
  hole.lineTo(ix1, iy0 + ir)
  hole.quadraticCurveTo(ix1, iy0, ix1 - ir, iy0)
  hole.lineTo(ix0 + ir, iy0)
  hole.quadraticCurveTo(ix0, iy0, ix0, iy0 + ir)
  hole.lineTo(ix0, iy1 - ir)
  hole.quadraticCurveTo(ix0, iy1, ix0 + ir, iy1)

  shape.holes.push(hole)

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.004,
    bevelSize: 0.004,
    bevelSegments: 3,
    curveSegments: 8,
  })
  geometry.computeVertexNormals()
  return geometry
}

/**
 * Creates the tapered swivel plinth foot for the monitor stand.
 * Centered at zCenter to maintain concentric alignment with collar and hinge.
 */
export function createStandPlinthGeometry(
  baseW = 0.30,
  baseD = 0.22,
  topW = 0.26,
  topD = 0.18,
  height = 0.024,
  yBottom = -0.315,
  zCenter = 0.015,
): THREE.BufferGeometry {
  const yTop = yBottom + height
  const rBottom = 0.03
  const rTop = 0.025
  const pointsPerCorner = 6
  const pointsCount = pointsPerCorner * 4

  function getRing(w: number, d: number, r: number, y: number) {
    const pts: [number, number, number][] = []
    const hr = Math.min(r, w * 0.45, d * 0.45)
    const corners: [number, number][] = [
      [w / 2 - hr, d / 2 - hr],
      [-w / 2 + hr, d / 2 - hr],
      [-w / 2 + hr, -d / 2 + hr],
      [w / 2 - hr, -d / 2 + hr],
    ]
    for (let c = 0; c < 4; c++) {
      const [cx, cz] = corners[c]
      const startAngle = (c * Math.PI) / 2
      for (let i = 0; i < pointsPerCorner; i++) {
        const theta = startAngle + (i / (pointsPerCorner - 1)) * (Math.PI / 2)
        pts.push([cx + hr * Math.cos(theta), y, zCenter + cz + hr * Math.sin(theta)])
      }
    }
    return pts
  }

  const ringBottom = getRing(baseW, baseD, rBottom, yBottom)
  const ringTop = getRing(topW, topD, rTop, yTop)

  const positions: number[] = []
  const uvs: number[] = []
  const indices: number[] = []

  // Add bottom ring vertices (0 .. pointsCount - 1)
  for (let i = 0; i < pointsCount; i++) {
    positions.push(...ringBottom[i])
    uvs.push(i / pointsCount, 0)
  }
  // Add top ring vertices (pointsCount .. 2*pointsCount - 1)
  for (let i = 0; i < pointsCount; i++) {
    positions.push(...ringTop[i])
    uvs.push(i / pointsCount, 1)
  }

  // Sides
  for (let i = 0; i < pointsCount; i++) {
    const nextI = (i + 1) % pointsCount
    const b0 = i
    const b1 = nextI
    const t0 = i + pointsCount
    const t1 = nextI + pointsCount

    indices.push(b0, t0, b1)
    indices.push(b1, t0, t1)
  }

  // Top cap center
  const topCenterIdx = positions.length / 3
  positions.push(0, yTop, zCenter)
  uvs.push(0.5, 0.5)

  for (let i = 0; i < pointsCount; i++) {
    const nextI = (i + 1) % pointsCount
    indices.push(topCenterIdx, i + pointsCount, nextI + pointsCount)
  }

  // Bottom cap center
  const bottomCenterIdx = positions.length / 3
  positions.push(0, yBottom, zCenter)
  uvs.push(0.5, 0.5)

  for (let i = 0; i < pointsCount; i++) {
    const nextI = (i + 1) % pointsCount
    indices.push(bottomCenterIdx, nextI, i)
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

/**
 * Creates a curved tube power cable originating at the rear chassis socket and dropping behind desk.
 */
export function createPowerCableGeometry(): THREE.BufferGeometry {
  const points = [
    new THREE.Vector3(0.08, -0.14, -0.218),
    new THREE.Vector3(0.075, -0.20, -0.25),
    new THREE.Vector3(0.065, -0.27, -0.26),
    new THREE.Vector3(0.05, -0.315, -0.255),
    new THREE.Vector3(0.04, -0.37, -0.265),
  ]
  const curve = new THREE.CatmullRomCurve3(points)
  return new THREE.TubeGeometry(curve, 18, 0.007, 8, false)
}

/**
 * Creates a curved tube signal/video cable connecting CRT monitor rear to computer tower rear.
 */
export function createSignalCableGeometry(): THREE.BufferGeometry {
  const points = [
    new THREE.Vector3(-0.08, -0.14, -0.218),
    new THREE.Vector3(-0.11, -0.22, -0.245),
    new THREE.Vector3(-0.22, -0.29, -0.235),
    new THREE.Vector3(-0.40, -0.31, -0.19),
    new THREE.Vector3(-0.56, -0.26, -0.14),
    new THREE.Vector3(-0.68, -0.15, -0.12),
  ]
  const curve = new THREE.CatmullRomCurve3(points)
  return new THREE.TubeGeometry(curve, 22, 0.0055, 8, false)
}
