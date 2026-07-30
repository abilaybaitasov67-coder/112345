import * as THREE from 'three';

const stone = new THREE.MeshStandardMaterial({ color: 0x46545b, roughness: .92 });
const metal = new THREE.MeshStandardMaterial({ color: 0x87989f, roughness: .38 });
const green = new THREE.MeshStandardMaterial({ color: 0x294b42, roughness: 1 });
const planterMaterial = new THREE.MeshStandardMaterial({ color: 0x3d484d, roughness: .9 });

function box(width: number, height: number, depth: number, material: THREE.Material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function addMonument(scene: THREE.Scene) {
  const monument = new THREE.Group();
  const base = box(2.6, .32, 2.1, stone);
  const plate = box(2.22, .08, 1.72, metal);
  const column = box(.34, 1.15, .34, stone);
  base.position.y = .16;
  plate.position.y = .35;
  column.position.y = .9;
  monument.add(base, plate, column);
  monument.position.set(18, 0, 13.8);
  scene.add(monument);
}

function addPlanter(scene: THREE.Scene, x: number, z: number) {
  const planter = box(.74, .5, .74, planterMaterial);
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
  addMonument(scene);
  addPlanter(scene, 13.2, 10.55);
  addPlanter(scene, 22.8, 10.55);
  addPlanter(scene, 5.2, 17.6);
  addPlanter(scene, 30.8, 17.6);
  addBalcony(scene, 8.9, 7.7);
  addBalcony(scene, 27.1, 7.7);
}
