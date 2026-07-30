import * as THREE from 'three';
import {
  dustStoneMaterial,
  dustWoodMaterial,
} from './shooter3dMaterials';

const iron = new THREE.MeshStandardMaterial({
  color: 0x37332d,
  roughness: .62,
  metalness: .38,
});

function box(width: number, height: number, depth: number, material: THREE.Material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function createLeaf(horizontal: boolean, side: number) {
  const leaf = new THREE.Group();
  const offset = side * .45;
  const panel = box(
    horizontal ? .9 : .12,
    2.35,
    horizontal ? .12 : .9,
    dustWoodMaterial,
  );
  if (horizontal) panel.position.x = offset;
  else panel.position.z = offset;
  leaf.add(panel);
  [.68, 1.62].forEach((y) => {
    const strap = box(
      horizontal ? .82 : .035,
      .09,
      horizontal ? .035 : .82,
      iron,
    );
    strap.position.set(
      horizontal ? offset : .078,
      y - 1.175,
      horizontal ? .078 : offset,
    );
    leaf.add(strap);
  });
  return leaf;
}

function addHorizontalDoorway(
  scene: THREE.Scene,
  x: number,
  z: number,
  outerWidth: number,
  clearWidth: number,
) {
  const jambWidth = (outerWidth - clearWidth) / 2;
  const lintel = box(outerWidth, .5, .56, dustStoneMaterial);
  lintel.position.set(x, 2.78, z);
  scene.add(lintel);
  [-1, 1].forEach((side) => {
    const jamb = box(jambWidth, 2.7, .56, dustStoneMaterial);
    jamb.position.set(
      x + side * (clearWidth / 2 + jambWidth / 2),
      1.35,
      z,
    );
    scene.add(jamb);
    const leaf = createLeaf(true, side);
    leaf.position.set(x + side * clearWidth / 2, 1.175, z);
    leaf.rotation.y = side * .42;
    scene.add(leaf);
  });
}

function addVerticalDoorway(scene: THREE.Scene) {
  const x = 17.45;
  const z = 8.875;
  const clearDepth = 1.75;
  const outerDepth = 2.55;
  const jambDepth = (outerDepth - clearDepth) / 2;
  const lintel = box(.56, .5, outerDepth, dustStoneMaterial);
  lintel.position.set(x, 2.78, z);
  scene.add(lintel);
  [-1, 1].forEach((side) => {
    const jamb = box(.56, 2.7, jambDepth, dustStoneMaterial);
    jamb.position.set(x, 1.35, z + side * (clearDepth / 2 + jambDepth / 2));
    scene.add(jamb);
    const leaf = createLeaf(false, side);
    leaf.position.set(x, 1.175, z + side * clearDepth / 2);
    scene.add(leaf);
  });
}

export function addMapDoorways(scene: THREE.Scene) {
  addHorizontalDoorway(scene, 9.125, 10.45, 3.05, 2.25);
  addVerticalDoorway(scene);
  addHorizontalDoorway(scene, 24.25, 12.7, 2.8, 2);
  addHorizontalDoorway(scene, 40, 32.2, 2.8, 2);
}
