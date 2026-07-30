import * as THREE from 'three';
import {
  dustGroundMaterial,
  dustRoofMaterial,
  dustStoneMaterial,
} from './shooter3dMaterials';

const dark = new THREE.MeshStandardMaterial({ color: 0x302b27, roughness: 1 });
const siteA = new THREE.MeshStandardMaterial({ color: 0xb9573e, roughness: .86 });
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

function addDoorFrame(
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

function addLongPit(scene: THREE.Scene) {
  const floor = box(7.6, .04, 1.9, dark);
  floor.position.set(38.5, .02, 32.72);
  scene.add(floor);
}

function addTRoof(scene: THREE.Scene) {
  const roof = box(3, .18, 2.1, dustRoofMaterial);
  roof.position.set(24, 3.15, 35.5);
  scene.add(roof);
}

function addShortRamp(scene: THREE.Scene) {
  for (let index = 0; index < 6; index += 1) {
    const strip = box(.9, .05, 3.35, dustStoneMaterial);
    strip.position.set(28.5 + index * 1.05, .025, 9.375);
    scene.add(strip);
  }
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
  patch.position.set(x, .012, z);
  scene.add(patch);
}

export function addDustLandmarks(scene: THREE.Scene) {
  addDoorFrame(scene, 24.25, 12, 8, [21.625, 26.875], 2.75);
  addDoorFrame(scene, 8.9, 15, 4, [7.575, 10.225], 1.35);
  addDoorFrame(scene, 38.5, 31.5, 8.2, [35.7875, 41.2125], 2.775);
  addLongPit(scene);
  addTRoof(scene);
  addShortRamp(scene);
  addGroundPatch(scene, 24.75, 38.2, 19, 3.3, dustGroundMaterial);
  addGroundPatch(scene, 24.25, 8.9, 7, 2.5, ctFloor);
  addGroundPatch(scene, 38.5, 22.25, 7.6, 17.5, dustGroundMaterial);
  addGroundPatch(scene, 35.75, 11.625, 2.35, 3.05, siteA);
}
