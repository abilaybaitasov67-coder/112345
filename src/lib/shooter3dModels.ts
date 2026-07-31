import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { WeaponId } from './shooterTypes';
import { createWeaponReceiver } from './shooter3dWeaponShapes';
function material(color: number, metalness = 0) {
  return new THREE.MeshStandardMaterial({ color, roughness: .55, metalness });
}

function box(
  width: number,
  height: number,
  depth: number,
  color: number,
  x = 0,
  y = 0,
  z = 0,
) {
  const radius = Math.min(width, height, depth) * .09;
  const mesh = new THREE.Mesh(
    new RoundedBoxGeometry(width, height, depth, 3, radius),
    material(color, .35),
  );
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  return mesh;
}
function addGrip(group: THREE.Group, z: number, color = 0x171b19) {
  const grip = box(.16, .48, .18, color, .1, -.22, z);
  grip.rotation.x = -.25;
  group.add(grip);
}
function addBarrel(
  group: THREE.Group,
  length: number,
  z: number,
  radius = .055,
  x = 0,
) {
  const barrel = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, length, 12),
    material(0x101412, .85),
  );
  barrel.rotation.x = Math.PI / 2;
  barrel.position.set(x, 0, z - length / 2);
  group.add(barrel);
  const muzzle = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 1.35, radius * 1.35, .12, 12),
    material(0x090c0b, .9),
  );
  muzzle.rotation.x = Math.PI / 2;
  muzzle.position.set(x, 0, z - length);
  group.add(muzzle);
}
function addSight(group: THREE.Group, z: number) {
  group.add(box(.08, .13, .07, 0x111513, 0, .23, z));
}

export function createWeaponModel(id: WeaponId, includeArms = true) {
  const group = new THREE.Group();
  const dark = 0x202624;
  if (id === 'knife') {
    group.add(box(.1, .06, 1.05, 0xb8c2bd, 0, 0, -.58));
    group.add(box(.22, .1, .16, 0x303a35, 0, 0, -.02));
    group.add(box(.18, .15, .48, 0x17201c, 0, 0, .26));
  } else if (id === 'pistol' || id === 'revolver') {
    const length = id === 'revolver' ? 1.05 : .78;
    group.add(box(.18, .17, length * .78, dark, 0, 0, -.25));
    group.add(box(.2, .11, length * .9, 0x59615d, 0, .12, -.31));
    addGrip(group, .05, 0x24201c);
    addBarrel(
      group,
      id === 'revolver' ? .4 : .16,
      id === 'revolver' ? -.72 : -.66,
      .04,
    );
    addSight(group, id === 'revolver' ? -.68 : -.61);
    if (id === 'revolver') {
      const drum = new THREE.Mesh(new THREE.CylinderGeometry(.24, .24, .28, 16), material(0x444a47, .7));
      drum.rotation.z = Math.PI / 2;
      drum.position.z = -.05;
      group.add(drum);
    }
  } else {
    const isRifle = id === 'ak47' || id === 'm4a4';
    const length = id === 'sniper' ? 2.25 : id === 'shotgun' ? 1.9 : isRifle ? 1.65 : 1.1;
    group.add(createWeaponReceiver(id, length));
    if (id !== 'shotgun') {
      addBarrel(group, id === 'sniper' ? 1.15 : .65, -length);
    }
    addGrip(group, -.25);
    if (isRifle || id === 'smg') {
      group.add(box(.19, .05, length * .62, 0x111513, 0, .16, -length * .4));
      addSight(group, -length + .08);
    }
    if (id === 'shotgun') {
      addBarrel(group, 1.05, -1.55, .055, -.065);
      addBarrel(group, 1.05, -1.55, .055, .065);
      group.add(box(.26, .18, .52, 0x65432b, 0, -.03, -1.28));
      addSight(group, -2.55);
    }
    if (id === 'sniper') {
      const scope = new THREE.Mesh(new THREE.CylinderGeometry(.12, .12, .7, 16), material(0x101412, .8));
      scope.rotation.x = Math.PI / 2;
      scope.position.set(0, .25, -.7);
      group.add(scope);
      const lens = new THREE.Mesh(
        new THREE.CircleGeometry(.105, 16),
        new THREE.MeshStandardMaterial({ color: 0x315f72, metalness: .5, roughness: .15 }),
      );
      lens.position.set(0, .25, -1.06);
      group.add(lens);
      group.add(box(.15, .15, .8, 0x111513, 0, 0, -length - .35));
    }
  }
  if (includeArms) {
    const sleeveMaterial = material(0x315b45);
    [-.28, .3].forEach((x, index) => {
      const arm = new THREE.Mesh(new THREE.CapsuleGeometry(.11, .75, 5, 8), sleeveMaterial);
      arm.rotation.x = Math.PI / 2;
      arm.rotation.z = index === 0 ? -.12 : .12;
      arm.position.set(x, -.3, .35);
      arm.castShadow = true;
      group.add(arm);
    });
  }
  group.traverse((child) => { child.castShadow = true; });
  return group;
}
