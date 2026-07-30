import * as THREE from 'three';

interface MapSign {
  label: string;
  x: number;
  y: number;
  z: number;
  color: string;
}

const signs: MapSign[] = [
  { label: '← B', x: 19.9, y: 2, z: 34.05, color: '#4f8584' },
  { label: 'A →', x: 31.5, y: 2, z: 32.05, color: '#a8513d' },
  { label: '← B', x: 17.5, y: 2, z: 7.55, color: '#4f8584' },
  { label: 'A →', x: 30.5, y: 2, z: 7.55, color: '#a8513d' },
];

function createSign({ label, x, y, z, color }: MapSign) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 192;
  const context = canvas.getContext('2d');
  if (!context) return null;
  context.font = '900 112px Inter, Arial';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.lineWidth = 16;
  context.strokeStyle = 'rgba(55, 43, 31, .36)';
  context.strokeText(label, 256, 102);
  context.fillStyle = color;
  context.fillText(label, 256, 102);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2.25, .84),
    new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      alphaTest: .08,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -2,
    }),
  );
  mesh.position.set(x, y, z);
  return mesh;
}

export function addMapSigns(scene: THREE.Scene) {
  signs.forEach((sign) => {
    const mesh = createSign(sign);
    if (mesh) scene.add(mesh);
  });
}
