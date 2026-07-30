import * as THREE from 'three';

const stone = new THREE.MeshStandardMaterial({ color: 0x746f68, roughness: .92 });
const water = new THREE.MeshStandardMaterial({
  color: 0x4e9aa5,
  roughness: .35,
  metalness: .08,
});
const green = new THREE.MeshStandardMaterial({ color: 0x456846, roughness: 1 });
const terracotta = new THREE.MeshStandardMaterial({ color: 0xa85f3e, roughness: .9 });

function box(width: number, height: number, depth: number, material: THREE.Material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function addFountain(scene: THREE.Scene) {
  const fountain = new THREE.Group();
  const base = box(2.6, .32, 2.1, stone);
  const pool = box(2.22, .08, 1.72, water);
  const column = box(.34, 1.15, .34, stone);
  base.position.y = .16;
  pool.position.y = .35;
  column.position.y = .9;
  fountain.add(base, pool, column);
  fountain.position.set(18, 0, 10.6);
  scene.add(fountain);
}

function addPlanter(scene: THREE.Scene, x: number, z: number) {
  const planter = box(.74, .5, .74, terracotta);
  const leaves = new THREE.Mesh(
    new THREE.SphereGeometry(.54, 8, 6),
    green,
  );
  planter.position.set(x, .25, z);
  leaves.position.set(x, .88, z);
  leaves.castShadow = true;
  scene.add(planter, leaves);
}

function addBalcony(scene: THREE.Scene, x: number, z: number, rotation = 0) {
  const balcony = new THREE.Group();
  const platform = box(2.4, .18, .9, stone);
  platform.position.y = 2.1;
  balcony.add(platform);
  for (let offset = -1; offset <= 1; offset += .4) {
    const rail = box(.06, .72, .06, stone);
    rail.position.set(offset, 2.48, -.36);
    balcony.add(rail);
  }
  const topRail = box(2.2, .07, .07, stone);
  topRail.position.set(0, 2.82, -.36);
  balcony.add(topRail);
  balcony.position.set(x, 0, z);
  balcony.rotation.y = rotation;
  scene.add(balcony);
}

export function addHelenaProps(scene: THREE.Scene) {
  addFountain(scene);
  addPlanter(scene, 13.2, 10.55);
  addPlanter(scene, 22.8, 10.55);
  addPlanter(scene, 5.2, 17.6);
  addPlanter(scene, 30.8, 17.6);
  addBalcony(scene, 8.9, 7.7);
  addBalcony(scene, 27.1, 7.7);
}
