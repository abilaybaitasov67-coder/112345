import * as THREE from 'three';
import {
  dustRoofMaterial,
  dustStoneMaterial,
  dustTrimMaterial,
  dustWoodMaterial,
} from './shooter3dMaterials';

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

function addTunnelLamp(scene: THREE.Scene, x: number, z: number) {
  const lamp = box(.42, .09, .22, lampMaterial);
  lamp.position.set(x, 3.18, z);
  scene.add(lamp);
  const light = new THREE.PointLight(0xffb65f, .5, 3.8, 2);
  light.position.set(x, 2.95, z);
  scene.add(light);
}

function addTunnelSection(
  scene: THREE.Scene,
  x: number,
  z: number,
  width: number,
  depth: number,
  beamPositions: readonly number[],
  lampPositions: readonly number[],
) {
  const roof = box(width, .3, depth, dustRoofMaterial);
  roof.position.set(x, 3.45, z);
  scene.add(roof);
  beamPositions.forEach((beamZ) => {
    const beam = box(width + .08, .28, .22, dustStoneMaterial);
    beam.position.set(x, 3.25, beamZ);
    scene.add(beam);
    [x - width / 2 + .08, x + width / 2 - .08].forEach((supportX) => {
      const support = box(.28, 3.25, .28, dustStoneMaterial);
      support.position.set(supportX, 1.625, beamZ);
      scene.add(support);
    });
  });
  lampPositions.forEach((lampZ) => addTunnelLamp(scene, x, lampZ));
}

function addTunnelNetwork(scene: THREE.Scene) {
  addTunnelSection(
    scene,
    9.125,
    13.5,
    9.4,
    5.65,
    [11.2, 13.5, 15.7],
    [13.2],
  );
  addTunnelSection(
    scene,
    11.125,
    18.375,
    5.4,
    4.25,
    [16.7, 18.5, 20.1],
    [18.4],
  );
  addTunnelSection(
    scene,
    12,
    26.75,
    15.1,
    5.5,
    [24.5, 26.75, 29],
    [25.5, 28],
  );
  const connector = box(5.5, .28, 1.5, dustRoofMaterial);
  connector.position.set(13.375, 3.42, 22.25);
  const firstElbow = box(3.05, .28, 1.13, dustRoofMaterial);
  firstElbow.position.set(12.15, 3.42, 20.94);
  const secondElbow = box(5.5, .28, 1.15, dustRoofMaterial);
  secondElbow.position.set(13.375, 3.42, 23.575);
  const turnBeam = box(5.5, .34, .24, dustStoneMaterial);
  turnBeam.position.set(13.375, 3.17, 22.25);
  scene.add(connector, firstElbow, secondElbow, turnBeam);
  addTunnelLamp(scene, 13.375, 22.25);
}

function addLongButtresses(scene: THREE.Scene) {
  [13, 17, 21, 25, 29].forEach((z) => {
    const pillar = box(.32, 3.5, .75, dustStoneMaterial);
    pillar.position.set(44.82, 1.75, z);
    scene.add(pillar);
  });
}

export function addRouteProps(scene: THREE.Scene) {
  addMidBoxes(scene);
  addTunnelNetwork(scene);
  addLongButtresses(scene);
}
