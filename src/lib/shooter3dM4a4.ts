import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const metal = new THREE.MeshStandardMaterial({
  color: 0x171c1b,
  metalness: .72,
  roughness: .34,
});
const polymer = new THREE.MeshStandardMaterial({
  color: 0x242b29,
  metalness: .18,
  roughness: .7,
});
const accent = new THREE.MeshStandardMaterial({
  color: 0x39413e,
  metalness: .48,
  roughness: .45,
});

function box(
  size: [number, number, number],
  position: [number, number, number],
  material: THREE.Material,
) {
  const radius = Math.min(...size) * .08;
  const mesh = new THREE.Mesh(
    new RoundedBoxGeometry(...size, 3, radius),
    material,
  );
  mesh.position.set(...position);
  mesh.castShadow = true;
  return mesh;
}

function barrel(
  radius: number,
  length: number,
  position: [number, number, number],
) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, length, 12),
    metal,
  );
  mesh.rotation.x = Math.PI / 2;
  mesh.position.set(...position);
  mesh.castShadow = true;
  return mesh;
}

function addStock(model: THREE.Group) {
  model.add(barrel(.045, .74, [0, .08, .47]));
  [-.13, .13].forEach((x) => {
    model.add(box([.055, .075, .66], [x, .05, .58], metal));
  });
  model.add(
    box([.34, .32, .3], [0, .02, .86], polymer),
    box([.36, .48, .1], [0, -.04, 1.03], polymer),
  );
}

function addHandguard(model: THREE.Group) {
  model.add(box([.4, .34, .94], [0, .03, -1.05], polymer));
  for (let z = -.68; z >= -1.48; z -= .16) {
    model.add(
      box([.43, .035, .07], [0, .22, z], metal),
      box([.43, .035, .07], [0, -.16, z], metal),
    );
  }
  [-1, 1].forEach((side) => {
    for (let z = -.7; z >= -1.45; z -= .2) {
      model.add(box([.035, .12, .08], [side * .215, .02, z], accent));
    }
  });
}

function addSights(model: THREE.Group) {
  model.add(box([.07, .18, .07], [0, .42, -1.45], metal));
  model.add(box([.28, .08, .42], [0, .37, -.26], metal));
  model.add(box([.06, .17, .06], [0, .48, -.12], metal));
  const rearRing = new THREE.Mesh(
    new THREE.TorusGeometry(.075, .018, 6, 14),
    metal,
  );
  rearRing.position.set(0, .51, -.04);
  rearRing.rotation.y = Math.PI / 2;
  model.add(rearRing);
}

function addMagazineAndGrip(model: THREE.Group) {
  const magazine = box([.28, .58, .22], [0, -.39, -.42], accent);
  magazine.rotation.x = -.13;
  const grip = box([.25, .55, .25], [0, -.35, .02], polymer);
  grip.rotation.x = -.24;
  const guard = new THREE.Mesh(
    new THREE.TorusGeometry(.13, .025, 6, 16, Math.PI),
    metal,
  );
  guard.position.set(0, -.2, -.06);
  guard.rotation.set(0, Math.PI / 2, Math.PI);
  model.add(magazine, grip, guard);
}

export function createM4a4Model() {
  const model = new THREE.Group();
  model.add(
    box([.36, .34, .78], [0, .04, -.24], metal),
    box([.34, .16, .74], [0, .27, -.28], accent),
  );
  addStock(model);
  addHandguard(model);
  addMagazineAndGrip(model);
  addSights(model);
  model.add(
    barrel(.055, .78, [0, .05, -1.9]),
    barrel(.095, .22, [0, .05, -2.38]),
  );
  [-2.43, -2.36, -2.29].forEach((z) => {
    model.add(box([.22, .045, .035], [0, .05, z], metal));
  });
  return model;
}
