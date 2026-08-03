import * as THREE from 'three';
import { ShooterWorld } from './shooterTypes';
import { createWeaponModel } from './shooter3dModels';
import { getShooterFloorHeight } from './shooterFloorHeight';

const TRAIL_FORWARD = new THREE.Vector3(0, 0, 1);
const trailDirection = new THREE.Vector3();

export function syncBulletMeshes(
  scene: THREE.Scene,
  meshes: THREE.Mesh[],
  world: ShooterWorld,
  scale: number,
) {
  while (meshes.length < world.bullets.length) {
    const trail = new THREE.Mesh(
      new THREE.BoxGeometry(.025, .025, .5),
      new THREE.MeshBasicMaterial({ color: 0xffdf68 }),
    );
    meshes.push(trail);
    scene.add(trail);
  }
  meshes.forEach((trail, index) => {
    const bullet = world.bullets[index];
    trail.visible = Boolean(bullet);
    if (!bullet) return;
    trail.position.set(
      bullet.x * scale,
      bullet.height,
      bullet.y * scale,
    );
    trailDirection.set(bullet.dx, bullet.verticalSlope, bullet.dy).normalize();
    trail.quaternion.setFromUnitVectors(TRAIL_FORWARD, trailDirection);
    const color = bullet.enemy ? 0xff4055 : 0xffdf68;
    (trail.material as THREE.MeshBasicMaterial).color.setHex(color);
  });
}

export function syncDroppedWeapons(
  scene: THREE.Scene,
  models: THREE.Group[],
  world: ShooterWorld,
  scale: number,
) {
  if (models.length !== world.droppedWeapons.length) {
    models.forEach((model) => scene.remove(model));
    models.length = 0;
  }
  while (models.length < world.droppedWeapons.length) {
    const drop = world.droppedWeapons[models.length];
    const model = createWeaponModel(drop.weapon, false);
    model.scale.setScalar(.45);
    model.position.set(
      drop.x * scale,
      .12 + getShooterFloorHeight(drop.x, drop.y),
      drop.y * scale,
    );
    model.rotation.z = Math.PI / 2;
    model.rotation.y = models.length * .7;
    models.push(model);
    scene.add(model);
  }
}

export function syncGrenadeMeshes(
  scene: THREE.Scene,
  meshes: THREE.Mesh[],
  world: ShooterWorld,
  scale: number,
) {
  while (meshes.length < world.grenades.length) {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(.12, 8, 6),
      new THREE.MeshBasicMaterial(),
    );
    meshes.push(mesh);
    scene.add(mesh);
  }
  while (meshes.length > world.grenades.length) {
    scene.remove(meshes.pop()!);
  }
  meshes.forEach((mesh, index) => {
    const grenade = world.grenades[index];
    mesh.position.set(grenade.x * scale, grenade.active ? .08 : .6, grenade.y * scale);
    mesh.scale.setScalar(grenade.active ? 5 : 1);
    const color = grenade.kind === 'flash'
      ? 0xffffff : grenade.kind === 'frag' ? 0x556c4c : 0xff6a20;
    (mesh.material as THREE.MeshBasicMaterial).color.setHex(color);
  });
}
