import * as THREE from 'three';
import { GrenadeId, ShooterWorld } from './shooterTypes';

function material(color: number, metalness = .2) {
  return new THREE.MeshStandardMaterial({ color, roughness: .55, metalness });
}

function createGrenadeModel(kind: GrenadeId) {
  const group = new THREE.Group();
  if (kind === 'flash') {
    const body = new THREE.Mesh(new THREE.CylinderGeometry(.09, .09, .25, 12), material(0xbfc4bd, .7));
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(.07, .09, .05, 12), material(0x303831, .5));
    cap.position.y = .15;
    group.add(body, cap);
  } else if (kind === 'frag') {
    const body = new THREE.Mesh(new THREE.DodecahedronGeometry(.13, 1), material(0x485841, .35));
    const fuse = new THREE.Mesh(new THREE.BoxGeometry(.07, .07, .12), material(0x272d29, .6));
    fuse.position.y = .14;
    group.add(body, fuse);
  } else {
    const bottle = new THREE.Mesh(new THREE.CylinderGeometry(.07, .09, .3, 10), material(0x6d3e22, .1));
    const cloth = new THREE.Mesh(new THREE.ConeGeometry(.045, .16, 7), material(0xd5b071));
    cloth.position.y = .22;
    group.add(bottle, cloth);
  }
  group.userData.kind = kind;
  return group;
}

export function syncGrenadeModels(
  scene: THREE.Scene,
  models: THREE.Group[],
  world: ShooterWorld,
  scale: number,
) {
  while (models.length > world.grenades.length) scene.remove(models.pop()!);
  world.grenades.forEach((grenade, index) => {
    let model = models[index];
    if (!model || model.userData.kind !== grenade.kind) {
      if (model) scene.remove(model);
      model = createGrenadeModel(grenade.kind);
      models[index] = model;
      scene.add(model);
    }
    model.position.set(grenade.x * scale, grenade.height, grenade.y * scale);
    model.rotation.set(grenade.rotation, grenade.rotation * .7, grenade.rotation * .4);
    if (!grenade.active) {
      model.scale.setScalar(1);
      return;
    }
    const pulse = grenade.kind === 'molotov'
      ? 2.8 + Math.sin(grenade.timer * .04) * .5
      : 5 + (grenade.timer / 280) * 5;
    model.scale.setScalar(pulse);
    model.position.y = grenade.kind === 'molotov' ? .18 : .5;
  });
}
