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

function createGateLeaf(width: number, side: number) {
  const gate = new THREE.Group();
  const offset = side * width / 2;
  const plankWidth = width / 5;
  for (let index = 0; index < 5; index += 1) {
    const plank = box(plankWidth - .025, 2.5, .14, dustWoodMaterial);
    plank.position.x = offset - width / 2 + plankWidth * (index + .5);
    gate.add(plank);
  }
  [-.68, .58].forEach((y) => {
    const strap = box(width * .88, .09, .18, iron);
    strap.position.set(offset, y, .025);
    gate.add(strap);
  });
  const brace = box(width * .72, .08, .18, iron);
  brace.position.set(offset, -.05, .03);
  brace.rotation.z = side * .62;
  gate.add(brace);
  const handle = new THREE.Mesh(
    new THREE.TorusGeometry(.1, .024, 6, 14),
    iron,
  );
  handle.position.set(offset - side * width * .28, .04, .105);
  gate.add(handle);
  return gate;
}

function addArch(
  scene: THREE.Scene,
  x: number,
  z: number,
  radius: number,
  vertical = false,
) {
  const arch = new THREE.Mesh(
    new THREE.TorusGeometry(radius, .18, 7, 30, Math.PI),
    dustStoneMaterial,
  );
  arch.position.set(x, 2.48, z);
  if (vertical) arch.rotation.y = -Math.PI / 2;
  arch.castShadow = true;
  arch.receiveShadow = true;
  const keystone = box(
    vertical ? .62 : .3,
    .36,
    vertical ? .3 : .62,
    dustStoneMaterial,
  );
  keystone.position.set(x, 2.55 + radius, z);
  scene.add(arch, keystone);
}

function addHorizontalGate(
  scene: THREE.Scene,
  x: number,
  z: number,
  outerWidth: number,
  clearWidth: number,
) {
  const jambWidth = (outerWidth - clearWidth) / 2;
  addArch(scene, x, z, clearWidth / 2);
  [-1, 1].forEach((side) => {
    const jamb = box(jambWidth, 2.7, .56, dustStoneMaterial);
    jamb.position.set(
      x + side * (clearWidth / 2 + jambWidth / 2),
      1.35,
      z,
    );
    const leaf = createGateLeaf(clearWidth / 2 - .04, side);
    leaf.position.set(x + side * clearWidth / 2, 1.25, z);
    leaf.rotation.y = side * .3;
    scene.add(jamb, leaf);
  });
}

function addVerticalGate(scene: THREE.Scene) {
  const x = 17.45;
  const z = 8.875;
  const clearDepth = 1.75;
  const outerDepth = 2.55;
  const jambDepth = (outerDepth - clearDepth) / 2;
  addArch(scene, x, z, clearDepth / 2, true);
  [-1, 1].forEach((side) => {
    const jamb = box(.56, 2.7, jambDepth, dustStoneMaterial);
    jamb.position.set(x, 1.35, z + side * (clearDepth / 2 + jambDepth / 2));
    const leaf = createGateLeaf(clearDepth / 2 - .04, side);
    leaf.position.set(x, 1.25, z + side * clearDepth / 2);
    leaf.rotation.y = -Math.PI / 2;
    scene.add(jamb, leaf);
  });
}

export function addMapDoorways(scene: THREE.Scene) {
  addHorizontalGate(scene, 9.125, 10.45, 3.05, 2.25);
  addVerticalGate(scene);
  addHorizontalGate(scene, 24.25, 12.7, 2.8, 2);
  addHorizontalGate(scene, 40, 32.2, 2.8, 2);
}
