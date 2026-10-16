import * as THREE from 'three';

export interface SceneMaterialPalette {
  deskWoodTop: THREE.MeshStandardMaterial;
  deskWoodTrim: THREE.MeshStandardMaterial;
  deskDarkMetal: THREE.MeshStandardMaterial;
  crtBeigePlastic: THREE.MeshStandardMaterial;
  crtDarkBeigeRecess: THREE.MeshStandardMaterial;
  crtRearVentPlastic: THREE.MeshStandardMaterial;
  crtGlassSurface: THREE.MeshPhysicalMaterial;
  keycapLightBeige: THREE.MeshStandardMaterial;
  keycapModifierGray: THREE.MeshStandardMaterial;
  mousePadFabric: THREE.MeshStandardMaterial;
  speakerGrilleFabric: THREE.MeshStandardMaterial;
  brushedSteel: THREE.MeshStandardMaterial;
  brassAccent: THREE.MeshStandardMaterial;
  rubberCable: THREE.MeshStandardMaterial;
  chairFabric: THREE.MeshStandardMaterial;
  chairPlasticBase: THREE.MeshStandardMaterial;
  lampShadeWarm: THREE.MeshStandardMaterial;
  wallPlaster: THREE.MeshStandardMaterial;
  baseboardWood: THREE.MeshStandardMaterial;
  ceilingMatte: THREE.MeshStandardMaterial;
  floorWoodPlank: THREE.MeshStandardMaterial;
  rugWoven: THREE.MeshStandardMaterial;
  windowFramePaint: THREE.MeshStandardMaterial;
  windowGlassRainy: THREE.MeshPhysicalMaterial;
  ceramicMug: THREE.MeshStandardMaterial;
  bookCoverRed: THREE.MeshStandardMaterial;
  bookCoverNavy: THREE.MeshStandardMaterial;
  bookCoverTeal: THREE.MeshStandardMaterial;
  bookPaperEdges: THREE.MeshStandardMaterial;
  ledGreenOn: THREE.MeshStandardMaterial;
  ledAmberOn: THREE.MeshStandardMaterial;
}

let cachedPalette: SceneMaterialPalette | null = null;

// Deterministic pseudo-random helper so procedural textures are consistent across builds
function seededRandom(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function createWoodGrainTextures(
  baseHex: string,
  grainHex: string,
  highlightHex: string,
  repeatX: number,
  repeatY: number,
  withPlankSeams = false
): { map: THREE.CanvasTexture; roughnessMap: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  const width = 512;
  const height = 512;
  const rand = seededRandom(4219);

  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = width;
  colorCanvas.height = height;
  const cCtx = colorCanvas.getContext('2d')!;

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = width;
  roughCanvas.height = height;
  const rCtx = roughCanvas.getContext('2d')!;

  cCtx.fillStyle = baseHex;
  cCtx.fillRect(0, 0, width, height);

  rCtx.fillStyle = '#8c8c8c';
  rCtx.fillRect(0, 0, width, height);

  // Subtle horizontal wood fiber streaks along the plank direction
  for (let y = 0; y < height; y++) {
    const wave = Math.sin(y * 0.045) * 0.5 + Math.cos(y * 0.13) * 0.5;
    const alpha = 0.04 + Math.abs(wave) * 0.08 + rand() * 0.04;
    cCtx.fillStyle = wave > 0 ? grainHex : highlightHex;
    cCtx.globalAlpha = alpha;
    cCtx.fillRect(0, y, width, 1 + (rand() > 0.7 ? 1 : 0));

    const rVal = Math.floor(125 + wave * 28 + (rand() - 0.5) * 18);
    rCtx.fillStyle = `rgb(${rVal},${rVal},${rVal})`;
    rCtx.fillRect(0, y, width, 1);
  }

  // Fine organic cathedral grain ellipses
  cCtx.globalAlpha = 0.06;
  for (let i = 0; i < 28; i++) {
    const gx = rand() * width;
    const gy = rand() * height;
    const rx = 60 + rand() * 140;
    const ry = 6 + rand() * 18;
    cCtx.strokeStyle = grainHex;
    cCtx.lineWidth = 1.2;
    cCtx.beginPath();
    cCtx.ellipse(gx, gy, rx, ry, 0, 0, Math.PI * 2);
    cCtx.stroke();
  }

  if (withPlankSeams) {
    cCtx.globalAlpha = 0.38;
    cCtx.fillStyle = '#140c07';
    const plankCount = 6;
    const step = height / plankCount;
    for (let p = 1; p < plankCount; p++) {
      const py = Math.floor(p * step);
      cCtx.fillRect(0, py, width, 2);
      rCtx.fillStyle = '#e0e0e0';
      rCtx.fillRect(0, py, width, 2);
    }
  }

  cCtx.globalAlpha = 1;

  const map = new THREE.CanvasTexture(colorCanvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(repeatX, repeatY);
  map.anisotropy = 4;

  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  roughnessMap.colorSpace = THREE.NoColorSpace;
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.repeat.set(repeatX, repeatY);

  return { map, roughnessMap, bumpMap: roughnessMap };
}

function createAgedPlasticTextures(): {
  map: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
} {
  const size = 256;
  const rand = seededRandom(9973);

  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = size;
  colorCanvas.height = size;
  const cCtx = colorCanvas.getContext('2d')!;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext('2d')!;

  cCtx.fillStyle = '#d8d0be';
  cCtx.fillRect(0, 0, size, size);

  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, size, size);

  // Fine mold-release micro-stipple characteristic of 1990s ABS computer casings
  for (let i = 0; i < 6500; i++) {
    const x = Math.floor(rand() * size);
    const y = Math.floor(rand() * size);
    const delta = (rand() - 0.5) * 14;
    const r = Math.min(255, Math.max(0, Math.floor(216 + delta)));
    const g = Math.min(255, Math.max(0, Math.floor(208 + delta)));
    const b = Math.min(255, Math.max(0, Math.floor(190 + delta)));
    cCtx.fillStyle = `rgb(${r},${g},${b})`;
    cCtx.fillRect(x, y, 2, 2);

    const bVal = Math.floor(128 + delta * 2.5);
    bCtx.fillStyle = `rgb(${bVal},${bVal},${bVal})`;
    bCtx.fillRect(x, y, 2, 2);
  }

  const map = new THREE.CanvasTexture(colorCanvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(2, 2);

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.colorSpace = THREE.NoColorSpace;
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(3, 3);

  return { map, bumpMap };
}

function createWovenFabricTexture(baseHex: string, accentHex: string): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, size, size);

  ctx.fillStyle = accentHex;
  ctx.globalAlpha = 0.16;
  for (let y = 0; y < size; y += 4) {
    ctx.fillRect(0, y, size, 1);
  }
  for (let x = 0; x < size; x += 4) {
    ctx.fillRect(x, 0, 1, size);
  }

  // Subtle border motif for rug/fabric realism
  ctx.globalAlpha = 0.22;
  ctx.strokeStyle = '#6e473b';
  ctx.lineWidth = 6;
  ctx.strokeRect(14, 14, size - 28, size - 28);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function createPlasterBumpTexture(): THREE.CanvasTexture {
  const size = 256;
  const rand = seededRandom(1337);
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 4500; i++) {
    const x = Math.floor(rand() * size);
    const y = Math.floor(rand() * size);
    const v = Math.floor(116 + rand() * 24);
    ctx.fillStyle = `rgb(${v},${v},${v})`;
    ctx.fillRect(x, y, 3, 3);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.NoColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 4);
  return tex;
}

export function getSceneMaterials(): SceneMaterialPalette {
  if (cachedPalette) return cachedPalette;

  const deskWood = createWoodGrainTextures('#6e4327', '#3d2210', '#8b5735', 2, 1, false);
  const floorWood = createWoodGrainTextures('#3a2618', '#1d1109', '#4f3522', 3, 3, true);
  const agedPlastic = createAgedPlasticTextures();
  const chairWeave = createWovenFabricTexture('#252b38', '#384152');
  const rugWeave = createWovenFabricTexture('#2a232d', '#473642');
  const plasterBump = createPlasterBumpTexture();

  cachedPalette = {
    deskWoodTop: new THREE.MeshStandardMaterial({
      map: deskWood.map,
      roughnessMap: deskWood.roughnessMap,
      bumpMap: deskWood.bumpMap,
      bumpScale: 0.003,
      roughness: 0.52,
      metalness: 0.04,
    }),
    deskWoodTrim: new THREE.MeshStandardMaterial({
      map: deskWood.map,
      color: new THREE.Color('#59341d'),
      roughness: 0.58,
      metalness: 0.04,
    }),
    deskDarkMetal: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1f232a'),
      roughness: 0.42,
      metalness: 0.78,
    }),
    crtBeigePlastic: new THREE.MeshStandardMaterial({
      map: agedPlastic.map,
      bumpMap: agedPlastic.bumpMap,
      bumpScale: 0.0018,
      roughness: 0.62,
      metalness: 0.03,
    }),
    crtDarkBeigeRecess: new THREE.MeshStandardMaterial({
      map: agedPlastic.map,
      color: new THREE.Color('#ada493'),
      bumpMap: agedPlastic.bumpMap,
      bumpScale: 0.002,
      roughness: 0.72,
      metalness: 0.04,
    }),
    crtRearVentPlastic: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#8e8676'),
      roughness: 0.78,
      metalness: 0.05,
    }),
    crtGlassSurface: new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#0a1214'),
      roughness: 0.14,
      metalness: 0.05,
      reflectivity: 0.65,
      clearcoat: 0.85,
      clearcoatRoughness: 0.12,
      transparent: true,
      opacity: 0.24,
    }),
    keycapLightBeige: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#dfd7c6'),
      bumpMap: agedPlastic.bumpMap,
      bumpScale: 0.001,
      roughness: 0.56,
      metalness: 0.02,
    }),
    keycapModifierGray: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#b4ab99'),
      bumpMap: agedPlastic.bumpMap,
      bumpScale: 0.001,
      roughness: 0.6,
      metalness: 0.02,
    }),
    mousePadFabric: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1e3545'),
      roughness: 0.88,
      metalness: 0.01,
    }),
    speakerGrilleFabric: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#27292e'),
      bumpMap: chairWeave,
      bumpScale: 0.0025,
      roughness: 0.86,
      metalness: 0.05,
    }),
    brushedSteel: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#9aa3ad'),
      roughness: 0.32,
      metalness: 0.86,
    }),
    brassAccent: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#c89d54'),
      roughness: 0.28,
      metalness: 0.88,
    }),
    rubberCable: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#232529'),
      roughness: 0.76,
      metalness: 0.08,
    }),
    chairFabric: new THREE.MeshStandardMaterial({
      map: chairWeave,
      bumpMap: chairWeave,
      bumpScale: 0.003,
      roughness: 0.84,
      metalness: 0.02,
    }),
    chairPlasticBase: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1a1d24'),
      roughness: 0.55,
      metalness: 0.18,
    }),
    lampShadeWarm: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#e8c88b'),
      emissive: new THREE.Color('#ff9d3b'),
      emissiveIntensity: 0.42,
      roughness: 0.65,
      metalness: 0.05,
      side: THREE.DoubleSide,
    }),
    wallPlaster: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1e2636'),
      bumpMap: plasterBump,
      bumpScale: 0.0025,
      roughness: 0.88,
      metalness: 0.02,
    }),
    baseboardWood: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#2b1d14'),
      roughness: 0.64,
      metalness: 0.05,
    }),
    ceilingMatte: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#151b26'),
      roughness: 0.94,
      metalness: 0.01,
    }),
    floorWoodPlank: new THREE.MeshStandardMaterial({
      map: floorWood.map,
      roughnessMap: floorWood.roughnessMap,
      bumpMap: floorWood.bumpMap,
      bumpScale: 0.004,
      roughness: 0.58,
      metalness: 0.04,
    }),
    rugWoven: new THREE.MeshStandardMaterial({
      map: rugWeave,
      bumpMap: rugWeave,
      bumpScale: 0.004,
      roughness: 0.92,
      metalness: 0.01,
    }),
    windowFramePaint: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#252d3b'),
      roughness: 0.52,
      metalness: 0.15,
    }),
    windowGlassRainy: new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#7cb4d8'),
      roughness: 0.16,
      metalness: 0.05,
      transmission: 0.72,
      transparent: true,
      opacity: 0.32,
      reflectivity: 0.75,
      clearcoat: 0.9,
      clearcoatRoughness: 0.15,
    }),
    ceramicMug: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#c85a32'),
      roughness: 0.24,
      metalness: 0.06,
    }),
    bookCoverRed: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#6e2626'),
      roughness: 0.7,
      metalness: 0.04,
    }),
    bookCoverNavy: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#223656'),
      roughness: 0.68,
      metalness: 0.04,
    }),
    bookCoverTeal: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1f4e52'),
      roughness: 0.7,
      metalness: 0.04,
    }),
    bookPaperEdges: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#dfd6c3'),
      roughness: 0.85,
      metalness: 0.01,
    }),
    ledGreenOn: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#38ff6a'),
      emissive: new THREE.Color('#28e858'),
      emissiveIntensity: 1.8,
      roughness: 0.3,
    }),
    ledAmberOn: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#ffb838'),
      emissive: new THREE.Color('#ff9c1a'),
      emissiveIntensity: 1.4,
      roughness: 0.3,
    }),
  };

  return cachedPalette;
}
