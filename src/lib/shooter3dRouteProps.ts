import * as THREE from 'three';
import {
  dustRoofMaterial,
  dustStoneMaterial,
  dustTrimMaterial,
  dustWoodMaterial,
} from './shooter3dMaterials';

const metal = new THREE.MeshStandardMaterial({ color: 0xb58a4b, roughness: .38 });
const lampMaterial = new THREE.MeshStandardMaterial({
  color: 0xffd69a,
  emissive: 0xff9d45,
  emissiveIntensity: 2.2,
  roughness: .5,
});

function box(width: number, height: number, depth: number, material: THREE.Material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function addMidBoxes(scene: THREE.Scene) {
  const stack = new THREE.Group();
  const crate = box(2.3, 1.26, 1.8, dustWoodMaterial);
  crate.position.y = .63;
  stack.add(crate);
  [-.65, .65].forEach((x) => {
    const band = box(.1, 1.28, 1.84, dustTrimMaterial);
    band.position.set(x, .64, 0);
    stack.add(band);
  });
  stack.position.set(23.75, 0, 21.5);
  scene.add(stack);
}

function addBalcony(scene: THREE.Scene, x: number, z: number, rotation = 0) {
  const balcony = new THREE.Group();
  const platform = box(2.4, .18, .9, dustStoneMaterial);
  platform.position.y = 2.1;
  balcony.add(platform);
  for (let offset = -1; offset <= 1; offset += .4) {
    const rail = box(.06, .72, .06, metal);
    rail.position.set(offset, 2.48, -.36);
    balcony.add(rail);
  }
  const topRail = box(2.2, .07, .07, metal);
  topRail.position.set(0, 2.82, -.36);
  balcony.add(topRail);
  balcony.position.set(x, 0, z);
  balcony.rotation.y = rotation;
  scene.add(balcony);
}

function addUpperTunnel(scene: THREE.Scene) {
  const roof = box(13.5, .3, 11.8, dustRoofMaterial);
  roof.position.set(6.875, 3.45, 21.35);
  scene.add(roof);
  for (let z = 15.8; z <= 26.9; z += 2.25) {
    const beam = box(13.6, .28, .22, dustStoneMaterial);
    beam.position.set(6.875, 3.25, z);
    scene.add(beam);
    [.18, 13.57].forEach((x) => {
      const support = box(.28, 3.25, .28, dustStoneMaterial);
      support.position.set(x, 1.625, z);
      scene.add(support);
    });
  }
  [18, 22.5, 26].forEach((z) => {
    const lamp = box(.42, .09, .22, lampMaterial);
    lamp.position.set(6.8, 3.18, z);
    scene.add(lamp);
    const light = new THREE.PointLight(0xffb65f, .55, 4.2, 2);
    light.position.set(6.8, 2.95, z);
    scene.add(light);
  });
  const upperRoof = box(3.7, .28, 3.5, dustRoofMaterial);
  upperRoof.position.set(8.9, 3.4, 13.2);
  scene.add(upperRoof);
}

function addSpawnGate(scene: THREE.Scene, z: number) {
  const gate = new THREE.Group();
  const beam = box(8.18, .42, .5, dustRoofMaterial);
  const left = box(.28, 4.2, .35, dustStoneMaterial);
  const right = box(.28, 4.2, .35, dustStoneMaterial);
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
    const pillar = box(.4, 3.5, .75, dustStoneMaterial);
    pillar.scale.x = .8;
    pillar.position.set(34.28, 1.75, z);
    scene.add(pillar);
  });
}

export function addRouteProps(scene: THREE.Scene) {
  addMidBoxes(scene);
  addBalcony(scene, 17.1, 8.7);
  addBalcony(scene, 31.25, 11.2);
  addUpperTunnel(scene);
  addSpawnGate(scene, 7.3);
  addSpawnGate(scene, 27.5);
  addLongButtresses(scene);
}
