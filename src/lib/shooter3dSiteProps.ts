import * as THREE from 'three';
import {
  dustStoneMaterial,
  dustTrimMaterial,
  dustWoodMaterial,
} from './shooter3dMaterials';

const carBody = new THREE.MeshStandardMaterial({
  color: 0x64766e,
  roughness: .88,
  metalness: .08,
});
const carGlass = new THREE.MeshStandardMaterial({
  color: 0x24363a,
  roughness: .38,
  metalness: .12,
});
const tireMaterial = new THREE.MeshStandardMaterial({
  color: 0x211f1c,
  roughness: 1,
});
const barrelMaterial = new THREE.MeshStandardMaterial({
  color: 0x496b70,
  roughness: .72,
  metalness: .18,
});

function box(width: number, height: number, depth: number, material: THREE.Material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function createCrate(size = .76) {
  const crate = new THREE.Group();
  const body = box(size * .92, size * .92, size * .92, dustWoodMaterial);
  body.position.y = size * .46;
  crate.add(body);
  [-1, 1].forEach((side) => {
    [-.25, .25].forEach((offset) => {
      const rail = box(size * .98, .08, .05, dustTrimMaterial);
      rail.position.set(0, size * (.46 + offset), side * size * .48);
      crate.add(rail);
    });
  });
  return crate;
}

function addACrates(scene: THREE.Scene) {
  const spots = [
    [36.72, 6.46, 0, 0],
    [37.72, 6.46, 0, .08],
    [37.22, 7.38, 0, -.08],
    [37.22, 6.94, .76, .04],
  ] as const;
  spots.forEach(([x, z, y, rotation]) => {
    const crate = createCrate();
    crate.position.set(x, y, z);
    crate.rotation.y = rotation;
    scene.add(crate);
  });
}

function addBCar(scene: THREE.Scene) {
  const car = new THREE.Group();
  const chassis = box(2.08, .68, 1.18, carBody);
  const cabin = box(1.12, .52, 1.04, carBody);
  const windscreen = box(.68, .34, .025, carGlass);
  chassis.position.y = .55;
  cabin.position.set(.15, 1.08, 0);
  windscreen.position.set(-.28, 1.1, .535);
  car.add(chassis, cabin, windscreen);
  [-.7, .7].forEach((x) => {
    [-.61, .61].forEach((z) => {
      const wheel = new THREE.Mesh(
        new THREE.CylinderGeometry(.25, .25, .16, 14),
        tireMaterial,
      );
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(x, .31, z);
      wheel.castShadow = true;
      car.add(wheel);
    });
  });
  car.position.set(10.25, 0, 7.05);
  car.rotation.y = -.08;
  scene.add(car);
}

function addBarrel(scene: THREE.Scene, x: number, z: number) {
  const barrel = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(.24, .24, .72, 16),
    barrelMaterial,
  );
  body.position.y = .36;
  body.castShadow = true;
  body.receiveShadow = true;
  barrel.add(body);
  [-.22, .22].forEach((y) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(.245, .025, 6, 16),
      dustStoneMaterial,
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = .36 + y;
    barrel.add(ring);
  });
  barrel.position.set(x, 0, z);
  scene.add(barrel);
}

export function addSiteProps(scene: THREE.Scene) {
  addBCar(scene);
  addACrates(scene);
  addBarrel(scene, 9.25, 7.88);
  addBarrel(scene, 38.28, 7.85);
}
