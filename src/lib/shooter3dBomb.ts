import * as THREE from 'three';
import { ShooterWorld } from './shooterTypes';
import { getShooterFloorHeight } from './shooterFloorHeight';

export function createBombModel() {
  const bomb = new THREE.Group();
  const caseMesh = new THREE.Mesh(
    new THREE.BoxGeometry(.48, .24, .34),
    new THREE.MeshStandardMaterial({ color: 0x25312b, roughness: .72 }),
  );
  const keypad = new THREE.Mesh(
    new THREE.BoxGeometry(.22, .035, .18),
    new THREE.MeshStandardMaterial({ color: 0x111714, roughness: .55 }),
  );
  keypad.position.y = .137;
  const indicatorMaterial = new THREE.MeshBasicMaterial({ color: 0xff3b25 });
  const indicator = new THREE.Mesh(
    new THREE.SphereGeometry(.035, 8, 6),
    indicatorMaterial,
  );
  indicator.position.set(.07, .165, 0);
  bomb.add(caseMesh, keypad, indicator);
  bomb.userData.indicator = indicatorMaterial;
  bomb.visible = false;
  return bomb;
}

export function syncBombModel(
  bombModel: THREE.Group,
  world: ShooterWorld,
  scale: number,
  time: number,
) {
  const { bomb } = world;
  bombModel.visible = bomb.planted && !bomb.exploded;
  if (!bombModel.visible) return;
  bombModel.position.set(
    bomb.x * scale,
    .15 + getShooterFloorHeight(bomb.x, bomb.y),
    bomb.y * scale,
  );
  bombModel.rotation.y = Math.PI / 5;
  const pulse = .9 + Math.sin(time * 12) * .1;
  bombModel.scale.setScalar(pulse);
  const indicator = bombModel.userData.indicator as THREE.MeshBasicMaterial;
  indicator.color.setHex(
    bomb.defuser
      ? 0x4bbcff
      : Math.sin(time * 12) > 0 ? 0xff311f : 0x5b0905,
  );
}
