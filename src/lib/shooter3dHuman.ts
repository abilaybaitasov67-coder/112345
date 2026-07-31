import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { WeaponId } from './shooterTypes';
import { createWeaponModel } from './shooter3dModels';

function material(color: number) {
  return new THREE.MeshStandardMaterial({ color, roughness: .7 });
}

function box(size: [number, number, number], color: number, position: [number, number, number]) {
  const radius = Math.min(...size) * .1;
  const mesh = new THREE.Mesh(new RoundedBoxGeometry(...size, 3, radius), material(color));
  mesh.position.set(...position);
  mesh.castShadow = true;
  return mesh;
}

function limb(radius: number, length: number, color: number, x: number, y: number) {
  const mesh = new THREE.Mesh(new THREE.CapsuleGeometry(radius, length, 5, 8), material(color));
  mesh.position.set(x, y, 0);
  mesh.castShadow = true;
  return mesh;
}

export function createHumanModel(friendly: boolean, weapon: WeaponId = 'm4a4') {
  const group = new THREE.Group();
  const uniform = friendly ? 0x315b45 : 0x713d35;
  group.add(box([.52, .82, .3], uniform, [0, 1.34, 0]));
  group.add(box([.44, .48, .28], 0x26332c, [0, 1.38, -.18]));
  const leftArm = limb(.1, .68, uniform, -.3, 1.36);
  const rightArm = limb(.1, .68, uniform, .3, 1.36);
  leftArm.rotation.set(Math.PI / 2.5, 0, -.28);
  rightArm.rotation.set(Math.PI / 2.5, 0, .28);
  group.add(leftArm, rightArm);
  group.add(limb(.13, .75, 0x202522, -.18, .48));
  group.add(limb(.13, .75, 0x202522, .18, .48));
  group.add(box([.24, .16, .42], 0x111513, [-.18, .08, -.09]));
  group.add(box([.24, .16, .42], 0x111513, [.18, .08, -.09]));
  group.add(box([.18, .16, .16], 0xd2a47f, [0, 1.75, 0]));
  const head = new THREE.Mesh(new THREE.SphereGeometry(.25, 16, 12), material(0xd2a47f));
  head.position.y = 1.98;
  head.castShadow = true;
  group.add(head);
  group.add(box([.58, .18, .48], 0x17201c, [0, 2.12, 0]));
  [-.09, .09].forEach((x) => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(.025, 8, 6), material(0x202321));
    eye.position.set(x, 2.02, -.235);
    group.add(eye);
  });
  [-.22, .22].forEach((x) => {
    const glove = new THREE.Mesh(new THREE.SphereGeometry(.1, 10, 8), material(0x151a18));
    glove.position.set(x, 1.25, -.48);
    group.add(glove);
  });
  const heldWeapon = createWeaponModel(weapon, false);
  heldWeapon.scale.setScalar(.42);
  heldWeapon.position.set(.18, 1.35, -.35);
  heldWeapon.rotation.x = -.18;
  group.add(heldWeapon);
  return group;
}
