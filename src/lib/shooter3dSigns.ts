import * as THREE from 'three';

interface MapSign {
  label: string;
  x: number;
  z: number;
  color: string;
}

const signs: MapSign[] = [
  { label: 'MID', x: 24, z: 13, color: '#426b7a' },
  { label: 'LONG', x: 4.2, z: 18, color: '#596b48' },
  { label: 'UPPER', x: 40.6, z: 15.6, color: '#735c7d' },
  { label: 'T SPAWN', x: 24, z: 26, color: '#8b4e45' },
  { label: 'CT SPAWN', x: 24, z: 2.25, color: '#426a88' },
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
