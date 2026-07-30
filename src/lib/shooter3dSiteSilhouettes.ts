import * as THREE from 'three';
import {
  dustPlasterMaterial,
  dustStoneMaterial,
  dustTrimMaterial,
} from './shooter3dMaterials';

const nicheMaterial = new THREE.MeshStandardMaterial({
  color: 0x263238,
  roughness: .5,
});

function box(width: number, height: number, depth: number, material: THREE.Material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function addPitWalls(scene: THREE.Scene) {
  const west = box(.16, .9, 3.2, dustStoneMaterial);
  west.position.set(35.08, .45, 30);
  const north = box(4.5, .9, .16, dustStoneMaterial);
  north.position.set(37.35, .45, 28.08);
  scene.add(west, north);
}

function addAWatchtower(scene: THREE.Scene) {
  const tower = new THREE.Group();
  const body = box(2, 1.9, 1.5, dustPlasterMaterial);
  const roof = box(2.18, .16, 1.68, dustTrimMaterial);
  body.position.y = .95;
  roof.position.y = 1.98;
  tower.add(body, roof);
  [-.42, .42].forEach((x) => {
    const niche = box(.34, .64, .035, nicheMaterial);
    niche.position.set(x, 1.05, .77);
    tower.add(niche);
  });
  tower.position.set(42.2, 5.6, 1.2);
  scene.add(tower);
}

export function addSiteSilhouettes(scene: THREE.Scene) {
  addPitWalls(scene);
  addAWatchtower(scene);
}
