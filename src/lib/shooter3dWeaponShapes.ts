import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { WeaponId } from './shooterTypes';

function material(color: number, metalness = .65, roughness = .4) {
  return new THREE.MeshStandardMaterial({ color, metalness, roughness });
}

function part(
  size: [number, number, number],
  position: [number, number, number],
  color = 0x202522,
  metalness = .65,
) {
  const radius = Math.min(...size) * .08;
  const mesh = new THREE.Mesh(
    new RoundedBoxGeometry(...size, 3, radius),
    material(color, metalness),
  );
  mesh.position.set(...position);
  mesh.castShadow = true;
  return mesh;
}

function magazine(length: number, compact: boolean) {
  const shape = new THREE.Shape();
  const height = compact ? .38 : .56;
  shape.moveTo(-.1, .04);
  shape.lineTo(.1, .04);
  shape.lineTo(.16, -height * .78);
  shape.quadraticCurveTo(.05, -height, -.1, -height * .84);
  shape.lineTo(-.14, -.07);
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: .14, bevelEnabled: true, bevelSize: .014, bevelThickness: .014,
  });
  geometry.rotateY(-Math.PI / 2);
  const mesh = new THREE.Mesh(geometry, material(0x101413, .8, .3));
  mesh.position.set(.07, -.1, -length * .3);
  mesh.castShadow = true;
  return mesh;
}

function stock(id: WeaponId) {
  const group = new THREE.Group();
  const wood = id === 'shotgun';
  const color = wood ? 0x6d4528 : 0x202724;
  if (id === 'smg') {
    group.add(part([.06, .06, .68], [-.1, .06, .33], color));
    group.add(part([.06, .06, .68], [.1, .06, .33], color));
    group.add(part([.28, .38, .08], [0, -.02, .68], color));
  } else {
    const body = part([.27, .28, .72], [0, -.02, .42], color, wood ? .08 : .3);
    body.rotation.x = -.08;
    group.add(body);
    group.add(part([.3, .42, .09], [0, -.06, .78], 0x171c1a, .2));
  }
  return group;
}

function handguard(id: WeaponId, length: number) {
  const group = new THREE.Group();
  const wood = id === 'shotgun';
  const frontLength = Math.max(.42, length - .7);
  group.add(part(
    [.32, .27, frontLength],
    [0, 0, -.68 - frontLength / 2],
    wood ? 0x754928 : 0x2d3532,
    wood ? .08 : .35,
  ));
  if (!wood) {
    for (let z = -.78; z > -length; z -= .18) {
      group.add(part([.34, .025, .035], [0, .15, z], 0x111513, .8));
    }
  }
  return group;
}

function details(id: WeaponId, length: number) {
  const group = new THREE.Group();
  group.add(part([.06, .08, .32], [.16, .08, -.3], 0x0c0f0e, .9));
  group.add(part([.04, .04, .16], [.16, .22, -.34], 0x9b7b42, .7));
  if (id === 'rifle' || id === 'ak47' || id === 'm4a1') {
    group.add(part([.05, .19, .06], [0, .24, -.35], 0x111513));
    group.add(part([.05, .2, .06], [0, .24, -length + .1], 0x111513));
  }
  if (id === 'sniper') {
    group.add(part([.04, .5, .04], [-.13, -.22, -length + .1], 0x171c1a));
    group.add(part([.04, .5, .04], [.13, -.22, -length + .1], 0x171c1a));
  }
  return group;
}

export function createWeaponReceiver(id: WeaponId, length: number) {
  const group = new THREE.Group();
  const receiverColor = id === 'ak47'
    ? 0x4a3323
    : id === 'rifle' || id === 'm4a1' ? 0x202825 : 0x242a28;
  group.add(part([.28, .27, .7], [0, 0, -.34], receiverColor));
  group.add(stock(id));
  group.add(handguard(id, length));
  group.add(details(id, length));
  if (id !== 'shotgun') group.add(magazine(length, id === 'smg'));
  return group;
}
