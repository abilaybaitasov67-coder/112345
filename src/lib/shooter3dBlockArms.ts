import * as THREE from 'three';
import { WeaponId } from './shooterTypes';

const skin = new THREE.MeshStandardMaterial({
  color: 0xb8754f,
  roughness: .85,
});

const sleeve = new THREE.MeshStandardMaterial({
  color: 0x263a32,
  roughness: .9,
});

function cube(
  size: [number, number, number],
  position: [number, number, number],
  material: THREE.Material,
) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.position.set(...position);
  mesh.castShadow = true;
  return mesh;
}

function armBetween(start: THREE.Vector3, end: THREE.Vector3) {
  const direction = new THREE.Vector3().subVectors(end, start);
  const arm = cube(
    [.28, .28, direction.length()],
    [0, 0, 0],
    sleeve,
  );
  arm.position.copy(start).add(end).multiplyScalar(.5);
  arm.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 0, 1),
    direction.clone().normalize(),
  );
  return arm;
}

function addHand(
  arms: THREE.Group,
  hand: THREE.Vector3,
  elbow: THREE.Vector3,
) {
  arms.add(
    cube([.3, .28, .34], [hand.x, hand.y, hand.z], skin),
    armBetween(hand, elbow),
  );
}

export function createBlockArms(weapon: WeaponId) {
  const arms = new THREE.Group();
  const rightHand = new THREE.Vector3(.18, -.14, .12);
  addHand(arms, rightHand, new THREE.Vector3(.58, -.72, .62));

  if (weapon === 'knife') return arms;

  const isSidearm = weapon === 'pistol' || weapon === 'revolver';
  const supportZ = isSidearm
    ? .02
    : weapon === 'sniper' ? -.78 : weapon === 'shotgun' ? -.68 : -.58;
  const leftHand = new THREE.Vector3(-.18, -.12, supportZ);
  const leftElbow = new THREE.Vector3(
    -.58,
    -.7,
    isSidearm ? .48 : supportZ + .56,
  );
  addHand(arms, leftHand, leftElbow);
  return arms;
}
