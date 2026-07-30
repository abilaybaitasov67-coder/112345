import * as THREE from 'three';
import { SHOOTER_A_HEIGHT } from './shooterFloorHeight';
import {
  dustGroundMaterial,
  dustStoneMaterial,
} from './shooter3dMaterials';

const SCALE = .025;

function box(
  width: number,
  height: number,
  depth: number,
  material: THREE.Material,
) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    material,
  );
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function addShort(scene: THREE.Scene) {
  for (let index = 0; index < 5; index += 1) {
    const height = SHOOTER_A_HEIGHT * (index + 1) / 5;
    const step = box(40 * SCALE, height, 160 * SCALE, dustStoneMaterial);
    step.position.set((1140 + index * 40) * SCALE, height / 2, 700 * SCALE);
    scene.add(step);

    const parapet = box(40 * SCALE, .9, .14, dustStoneMaterial);
    parapet.position.set(
      (1140 + index * 40) * SCALE,
      height + .45,
      780 * SCALE + .06,
    );
    scene.add(parapet);
  }

  const turn = box(160 * SCALE, SHOOTER_A_HEIGHT, 380 * SCALE, dustStoneMaterial);
  turn.position.set(1400 * SCALE, SHOOTER_A_HEIGHT / 2, 590 * SCALE);
  scene.add(turn);

  const upperTurn = box(80 * SCALE, SHOOTER_A_HEIGHT, 100 * SCALE, dustStoneMaterial);
  upperTurn.position.set(1360 * SCALE, SHOOTER_A_HEIGHT / 2, 350 * SCALE);
  scene.add(upperTurn);

  const southParapet = box(160 * SCALE, .9, .14, dustStoneMaterial);
  southParapet.position.set(1400 * SCALE, SHOOTER_A_HEIGHT + .45, 780 * SCALE + .06);
  scene.add(southParapet);

  const westParapet = box(.14, .9, 320 * SCALE, dustStoneMaterial);
  westParapet.position.set(1320 * SCALE + .06, SHOOTER_A_HEIGHT + .45, 460 * SCALE);
  scene.add(westParapet);
}

function addASite(scene: THREE.Scene) {
  const platform = box(
    400 * SCALE,
    SHOOTER_A_HEIGHT,
    300 * SCALE,
    dustGroundMaterial,
  );
  platform.position.set(1600 * SCALE, SHOOTER_A_HEIGHT / 2, 250 * SCALE);
  scene.add(platform);
}

function addLongRamp(scene: THREE.Scene) {
  for (let index = 0; index < 6; index += 1) {
    const height = SHOOTER_A_HEIGHT * (6 - index) / 6;
    const step = box(200 * SCALE, height, 40 * SCALE, dustGroundMaterial);
    step.position.set(1700 * SCALE, height / 2, (420 + index * 40) * SCALE);
    scene.add(step);
  }
}

export function addShooterElevations(scene: THREE.Scene) {
  addASite(scene);
  addShort(scene);
  addLongRamp(scene);
}
