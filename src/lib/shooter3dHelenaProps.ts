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
  monument.position.set(21.5, 1.3, 11.75);
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
  const roof = box(6.5, .3, 11.2, darkWood);
  roof.position.set(40.625, 3.45, 15.625);
  scene.add(roof);
  for (let z = 10.5; z <= 20.7; z += 2.05) {
    const beam = box(6.65, .28, .22, stone);
    beam.position.set(40.625, 3.25, z);
    scene.add(beam);
  }
}

function addSpawnGate(scene: THREE.Scene, x: number, z: number, width: number) {
  const gate = new THREE.Group();
  const beam = box(width, .42, .5, darkWood);
  const left = box(.42, 4.2, .5, stone);
  const right = box(.42, 4.2, .5, stone);
  beam.position.y = 4;
  left.position.set(-width / 2 + .2, 2.1, 0);
  right.position.set(width / 2 - .2, 2.1, 0);
  gate.add(beam, left, right);
  gate.position.set(x, 0, z);
  scene.add(gate);
}

function addLongButtresses(scene: THREE.Scene) {
  [9.5, 11.6, 13.7, 15.3].forEach((z) => {
    const pillar = box(.4, 3.5, .75, stone);
    pillar.position.set(8, 1.75, z);
    scene.add(pillar);
  });
}

export function addHelenaProps(scene: THREE.Scene) {
  addMonument(scene);
  addBalcony(scene, 12.2, 8.7);
  addBalcony(scene, 31.9, 8.7);
  addUpperTunnel(scene);
  addSpawnGate(scene, 24.5, 5, 8);
  addSpawnGate(scene, 25.25, 23.75, 6.6);
  addLongButtresses(scene);
}
