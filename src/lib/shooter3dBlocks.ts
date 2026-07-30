import * as THREE from 'three';
import { shooterMapBlocks, ShooterMapBlock } from './shooterMapLayout';

const SCALE = .025;
const materials = {
  building: new THREE.MeshStandardMaterial({ color: 0xd0b98f, roughness: .91 }),
  stone: new THREE.MeshStandardMaterial({ color: 0x8e7258, roughness: .96 }),
  cover: new THREE.MeshStandardMaterial({ color: 0x5d4938, roughness: .86 }),
};
const trimMaterial = new THREE.MeshStandardMaterial({ color: 0x6d5845, roughness: .95 });
const windowMaterial = new THREE.MeshStandardMaterial({ color: 0x25343a, roughness: .48 });

function box(width: number, height: number, depth: number, material: THREE.Material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function addWindowRow(group: THREE.Group, block: ShooterMapBlock) {
  if (block.kind !== 'building') return;
  const width = Math.min(block.width * SCALE * .68, 4.6);
  const window = box(width, .68, .06, windowMaterial);
  window.position.set(0, Math.min(3.1, block.wallHeight * .62), block.height * SCALE / 2 + .035);
  group.add(window);
}

function addBlock(scene: THREE.Scene, block: ShooterMapBlock) {
  const group = new THREE.Group();
  const width = block.width * SCALE;
  const depth = block.height * SCALE;
  const body = box(width, block.wallHeight, depth, materials[block.kind]);
  body.position.y = block.wallHeight / 2;
  group.add(body);
  const trim = box(width + .06, .18, depth + .06, trimMaterial);
  trim.position.y = block.wallHeight - .09;
  group.add(trim);
  addWindowRow(group, block);
  group.position.set(
    (block.x + block.width / 2) * SCALE,
    0,
    (block.y + block.height / 2) * SCALE,
  );
  scene.add(group);
}

export function addMapBlocks(scene: THREE.Scene) {
  shooterMapBlocks.forEach((block) => addBlock(scene, block));
}

export function addBoundaryWalls(scene: THREE.Scene, width: number, depth: number) {
  const wallHeight = 5.2;
  const specs = [
    [width / 2, 0, width, .2],
    [width / 2, depth, width, .2],
    [0, depth / 2, .2, depth],
    [width, depth / 2, .2, depth],
  ];
  specs.forEach(([x, z, wallWidth, wallDepth]) => {
    const wall = box(wallWidth, wallHeight, wallDepth, materials.stone);
    wall.position.set(x, wallHeight / 2, z);
    scene.add(wall);
  });
}
