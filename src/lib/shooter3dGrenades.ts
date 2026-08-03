import * as THREE from 'three';
import { GrenadeId, ShooterWorld } from './shooterTypes';

function material(color: number, metalness = .2) {
  return new THREE.MeshStandardMaterial({ color, roughness: .55, metalness });
}

function createFire() {
  const fire = new THREE.Group();
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(1.25, 20),
    new THREE.MeshBasicMaterial({
      color: 0xff4b12, transparent: true, opacity: .55,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = .015;
  fire.add(ground);
  for (let index = 0; index < 8; index += 1) {
    const flame = new THREE.Mesh(
      new THREE.ConeGeometry(.16, .7, 7),
      new THREE.MeshBasicMaterial({
        color: index % 2 ? 0xffc326 : 0xff5315,
        transparent: true,
        opacity: .88,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    const angle = index / 8 * Math.PI * 2;
    const radius = index % 3 === 0 ? .2 : .65;
    flame.position.set(Math.cos(angle) * radius, .35, Math.sin(angle) * radius);
    flame.userData.phase = index * .8;
    fire.add(flame);
  }
  fire.visible = false;
  return fire;
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
    const body = new THREE.Group();
    const bottle = new THREE.Mesh(new THREE.CylinderGeometry(.07, .09, .3, 10), material(0x6d3e22, .1));
    const cloth = new THREE.Mesh(new THREE.ConeGeometry(.045, .16, 7), material(0xd5b071));
    cloth.position.y = .22;
    body.add(bottle, cloth);
    const fire = createFire();
    group.add(body, fire);
    group.userData.body = body;
    group.userData.fire = fire;
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
    const fire = model.userData.fire as THREE.Group | undefined;
    const body = model.userData.body as THREE.Group | undefined;
    if (!grenade.active) {
      model.scale.setScalar(1);
      if (fire) fire.visible = false;
      if (body) body.visible = true;
      return;
    }
    if (grenade.kind === 'molotov' && fire && body) {
      model.scale.setScalar(1);
      model.rotation.set(0, 0, 0);
      model.position.y = .02;
      body.visible = false;
      fire.visible = true;
      fire.children.slice(1).forEach((flame) => {
        const phase = flame.userData.phase as number;
        flame.scale.y = .72 + Math.sin(grenade.timer * .018 + phase) * .28;
        flame.rotation.y += .08;
      });
      return;
    }
    model.scale.setScalar(5 + (grenade.timer / 280) * 5);
    model.position.y = .5;
  });
}
