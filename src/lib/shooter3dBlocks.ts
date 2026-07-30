import * as THREE from 'three';
import { shooterMapBlocks, ShooterMapBlock } from './shooterMapLayout';
import {
  dustPlasterMaterial,
  dustStoneMaterial,
  dustTrimMaterial,
  dustWoodMaterial,
} from './shooter3dMaterials';

const SCALE = .025;
const windowMaterial = new THREE.MeshStandardMaterial({ color: 0x25343a, roughness: .48 });
const blockMaterials = {
  building: dustPlasterMaterial,
  stone: dustStoneMaterial,
  cover: dustWoodMaterial,
};

function box(width: number, height: number, depth: number, material: THREE.Material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function addFrontWindow(group: THREE.Group, x: number, y: number, z: number) {
  const pane = box(.66, .86, .06, windowMaterial);
  const sill = box(.82, .09, .14, dustTrimMaterial);
  const shade = box(.84, .08, .24, dustWoodMaterial);
  pane.position.set(x, y, z);
  sill.position.set(x, y - .49, z + Math.sign(z) * .035);
  shade.position.set(x, y + .52, z + Math.sign(z) * .075);
  group.add(pane, sill, shade);
}

function addSideWindow(group: THREE.Group, x: number, y: number, z: number) {
  const pane = box(.06, .86, .66, windowMaterial);
  const sill = box(.14, .09, .82, dustTrimMaterial);
  const shade = box(.24, .08, .84, dustWoodMaterial);
  pane.position.set(x, y, z);
  sill.position.set(x + Math.sign(x) * .035, y - .49, z);
  shade.position.set(x + Math.sign(x) * .075, y + .52, z);
  group.add(pane, sill, shade);
}

function addFacadeWindows(group: THREE.Group, block: ShooterMapBlock) {
  if (block.kind !== 'building') return;
  const width = block.width * SCALE;
  const depth = block.height * SCALE;
  const y = Math.min(3.05, block.wallHeight * .56);
  const frontCount = Math.max(1, Math.min(4, Math.floor(width / 2)));
  for (let index = 1; index <= frontCount; index += 1) {
    const x = -width / 2 + width * index / (frontCount + 1);
    addFrontWindow(group, x, y, depth / 2 + .035);
    addFrontWindow(group, x, y, -depth / 2 - .035);
  }
  if (depth < 3.4) return;
  const sideCount = Math.max(1, Math.min(3, Math.floor(depth / 2.4)));
  for (let index = 1; index <= sideCount; index += 1) {
    const z = -depth / 2 + depth * index / (sideCount + 1);
    addSideWindow(group, width / 2 + .035, y, z);
    addSideWindow(group, -width / 2 - .035, y, z);
  }
}

function addBlock(scene: THREE.Scene, block: ShooterMapBlock) {
  const group = new THREE.Group();
  const width = block.width * SCALE;
  const depth = block.height * SCALE;
  const body = box(width, block.wallHeight, depth, blockMaterials[block.kind]);
  body.position.y = block.wallHeight / 2;
  group.add(body);
  const trim = box(width + .06, .18, depth + .06, dustTrimMaterial);
  trim.position.y = block.wallHeight - .09;
  group.add(trim);
  addFacadeWindows(group, block);
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
    const wall = box(wallWidth, wallHeight, wallDepth, dustStoneMaterial);
    wall.position.set(x, wallHeight / 2, z);
    scene.add(wall);
  });
}
