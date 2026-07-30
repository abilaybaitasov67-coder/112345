import * as THREE from 'three';
import { getShooterFloorHeight } from './shooterFloorHeight';
import {
  dustGroundMaterial,
  dustRoofMaterial,
} from './shooter3dMaterials';

const SCALE = .025;
const dark = new THREE.MeshStandardMaterial({ color: 0x302b27, roughness: 1 });
const ctFloor = new THREE.MeshStandardMaterial({ color: 0x547a82, roughness: 1 });

function box(width: number, height: number, depth: number, material: THREE.Material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function addGroundPatch(
  scene: THREE.Scene,
  x: number,
  z: number,
  width: number,
  depth: number,
  material: THREE.Material,
) {
  const patch = box(width, .025, depth, material);
  patch.position.set(
    x,
    getShooterFloorHeight(x / SCALE, z / SCALE) + .012,
    z,
  );
  scene.add(patch);
}

function addTRoof(scene: THREE.Scene) {
  const roof = box(3, .18, 2.1, dustRoofMaterial);
  roof.position.set(24, 3.15, 35.5);
  scene.add(roof);
}

export function addDustLandmarks(scene: THREE.Scene) {
  addTRoof(scene);
  addGroundPatch(scene, 25, 38.19, 19, 3.125, dustGroundMaterial);
  addGroundPatch(scene, 24.25, 9.25, 6.75, 5.75, ctFloor);
  addGroundPatch(scene, 37.5, 30, 4.25, 3.25, dark);
  addGroundPatch(scene, 42.5, 21, 4.25, 21.25, dustGroundMaterial);
}
