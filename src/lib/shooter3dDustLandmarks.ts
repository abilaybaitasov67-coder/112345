import * as THREE from 'three';
import { getShooterFloorHeight } from './shooterFloorHeight';
import {
  dustGroundMaterial,
  dustRoofMaterial,
  dustStoneMaterial,
} from './shooter3dMaterials';

const SCALE = .025;
const dark = new THREE.MeshStandardMaterial({ color: 0x302b27, roughness: 1 });
const ctFloor = new THREE.MeshStandardMaterial({ color: 0x547a82, roughness: 1 });
const iron = new THREE.MeshStandardMaterial({
  color: 0x3b3731,
  roughness: .62,
  metalness: .34,
});

function box(width: number, height: number, depth: number, material: THREE.Material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function addHorizontalDoor(
  scene: THREE.Scene,
  x: number,
  z: number,
  span: number,
  leafCenters: readonly number[],
  leafWidth: number,
) {
  const lintel = box(span, .46, .48, dustStoneMaterial);
  lintel.position.set(x, 2.92, z);
  scene.add(lintel);
  [-1, 1].forEach((side) => {
    const jamb = box(.24, 2.7, .48, dustStoneMaterial);
    jamb.position.set(x + side * (span / 2 - .12), 1.35, z);
    scene.add(jamb);
  });
  leafCenters.forEach((leafX) => {
    [-1, 1].forEach((face) => {
      [.72, 1.72].forEach((y) => {
        const strap = box(leafWidth * .82, .1, .035, iron);
        strap.position.set(leafX, y, z + face * .22);
        scene.add(strap);
      });
      const spine = box(.1, 2.2, .035, iron);
      spine.position.set(leafX, 1.35, z + face * .22);
      scene.add(spine);
    });
  });
}

function addVerticalDoor(scene: THREE.Scene) {
  const x = 17.45;
  const z = 8.875;
  const lintel = box(.48, .46, 2.75, dustStoneMaterial);
  lintel.position.set(x, 2.92, z);
  scene.add(lintel);
  [-1, 1].forEach((side) => {
    const jamb = box(.48, 2.7, .24, dustStoneMaterial);
    jamb.position.set(x, 1.35, z + side * 1.255);
    scene.add(jamb);
  });
  [7.75, 10].forEach((leafZ) => {
    [-1, 1].forEach((face) => {
      [.72, 1.72].forEach((y) => {
        const strap = box(.035, .1, .41, iron);
        strap.position.set(x + face * .22, y, leafZ);
        scene.add(strap);
      });
      const spine = box(.035, 2.2, .1, iron);
      spine.position.set(x + face * .22, 1.35, leafZ);
      scene.add(spine);
    });
  });
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
  addHorizontalDoor(scene, 9.125, 10.45, 9.25, [6.25, 12], 3.5);
  addVerticalDoor(scene);
  addHorizontalDoor(scene, 24.25, 12.7, 7.5, [21.875, 26.625], 2.75);
  addHorizontalDoor(scene, 40, 32.2, 10, [37, 43], 4);
  addTRoof(scene);
  addGroundPatch(scene, 25, 38.19, 19, 3.125, dustGroundMaterial);
  addGroundPatch(scene, 24.25, 9.25, 6.75, 5.75, ctFloor);
  addGroundPatch(scene, 37.5, 30, 4.25, 3.25, dark);
  addGroundPatch(scene, 42.5, 21, 4.25, 21.25, dustGroundMaterial);
}
