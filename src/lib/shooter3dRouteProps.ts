import * as THREE from 'three';

const stone = new THREE.MeshStandardMaterial({ color: 0x80654d, roughness: .92 });
const metal = new THREE.MeshStandardMaterial({ color: 0xb58a4b, roughness: .38 });
const darkWood = new THREE.MeshStandardMaterial({ color: 0x473328, roughness: .86 });

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
  monument.position.set(23.75, 1.3, 21.5);
  scene.add(monument);
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

function addUpperTunnel(scene: THREE.Scene) {
  const roof = box(13.5, .3, 11.8, darkWood);
  roof.position.set(6.875, 3.45, 21.35);
  scene.add(roof);
  for (let z = 15.8; z <= 26.9; z += 2.25) {
    const beam = box(13.6, .28, .22, stone);
    beam.position.set(6.875, 3.25, z);
    scene.add(beam);
  }
  const upperRoof = box(3.7, .28, 3.5, darkWood);
  upperRoof.position.set(8.9, 3.4, 13.2);
  scene.add(upperRoof);
}

function addSpawnGate(scene: THREE.Scene, z: number) {
  const gate = new THREE.Group();
  const beam = box(8.18, .42, .5, darkWood);
  const left = box(.28, 4.2, .35, stone);
  const right = box(.28, 4.2, .35, stone);
  beam.position.y = 4;
  left.position.set(20.3, 2.1, 0);
  right.position.set(28.2, 2.1, 0);
  gate.add(beam, left, right);
  beam.position.x = 24.25;
  gate.position.z = z;
  scene.add(gate);
}

function addLongButtresses(scene: THREE.Scene) {
  [13, 17, 21, 25, 29].forEach((z) => {
    const pillar = box(.4, 3.5, .75, stone);
    pillar.scale.x = .8;
    pillar.position.set(34.28, 1.75, z);
    scene.add(pillar);
  });
}

export function addRouteProps(scene: THREE.Scene) {
  addMonument(scene);
  addBalcony(scene, 17.1, 8.7);
  addBalcony(scene, 31.25, 11.2);
  addUpperTunnel(scene);
  addSpawnGate(scene, 7.3);
  addSpawnGate(scene, 27.5);
  addLongButtresses(scene);
}
