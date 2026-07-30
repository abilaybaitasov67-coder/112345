import * as THREE from 'three';

interface MapSign {
  label: string;
  x: number;
  z: number;
  color: string;
}

const signs: MapSign[] = [
  { label: 'MID', x: 24, z: 16.8, color: '#426b7a' },
  { label: 'LOWER MID', x: 24, z: 23.8, color: '#426b7a' },
  { label: 'SHORT A', x: 31.1, z: 9.5, color: '#a66b43' },
  { label: 'B DOORS', x: 8.9, z: 14, color: '#39797a' },
  { label: 'LONG A', x: 39.2, z: 23, color: '#596b48' },
  { label: 'B TUNNELS', x: 8.7, z: 21.2, color: '#735c7d' },
  { label: 'LONG DOORS', x: 38.4, z: 31, color: '#8d4f3d' },
  { label: 'T SPAWN', x: 24, z: 37.5, color: '#8b4e45' },
  { label: 'CT SPAWN', x: 24, z: 9, color: '#426a88' },
];

function createSign({ label, x, z, color }: MapSign) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  if (!context) return null;
  context.fillStyle = color;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#eef2f0';
  context.font = '800 58px Inter, Arial';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(label, 256, 68);
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2.8, .7),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas) }),
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(x, .015, z);
  return mesh;
}

export function addMapSigns(scene: THREE.Scene) {
  signs.forEach((sign) => {
    const mesh = createSign(sign);
    if (mesh) scene.add(mesh);
  });
}
