import * as THREE from 'three';

const stone = new THREE.MeshStandardMaterial({ color: 0x8d6547, roughness: .94 });
const wood = new THREE.MeshStandardMaterial({ color: 0x4d3527, roughness: .88 });
const dark = new THREE.MeshStandardMaterial({ color: 0x302b27, roughness: 1 });
const siteA = new THREE.MeshStandardMaterial({ color: 0xb9573e, roughness: .86 });
const siteB = new THREE.MeshStandardMaterial({ color: 0x3d7f82, roughness: .86 });
const sand = new THREE.MeshStandardMaterial({ color: 0xb9905f, roughness: 1 });
const ctFloor = new THREE.MeshStandardMaterial({ color: 0x547a82, roughness: 1 });

function box(width: number, height: number, depth: number, material: THREE.Material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function addDoorLintel(scene: THREE.Scene, x: number, z: number, span: number) {
  const lintel = box(span, .46, .42, stone);
  lintel.position.set(x, 2.92, z);
  scene.add(lintel);
}

function addSiteShelter(
  scene: THREE.Scene,
  x: number,
  z: number,
  material: THREE.Material,
) {
  const shelter = new THREE.Group();
  const roof = box(2.45, .16, 2.15, material);
  roof.position.y = 3;
  shelter.add(roof);
  [[-1.02, -.85], [1.02, -.85], [-1.02, .85], [1.02, .85]].forEach(([px, pz]) => {
    const post = box(.16, 3, .16, wood);
    post.position.set(px, 1.5, pz);
    shelter.add(post);
  });
  shelter.position.set(x, 0, z);
  scene.add(shelter);
}

function addLongPit(scene: THREE.Scene) {
  const floor = box(7.6, .04, 1.9, dark);
  floor.position.set(38.5, .02, 32.72);
  scene.add(floor);
}

function addTRoof(scene: THREE.Scene) {
  const roof = box(3, .18, 2.1, wood);
  roof.position.set(24, 3.15, 35.5);
  scene.add(roof);
}

function addShortRamp(scene: THREE.Scene) {
  for (let index = 0; index < 6; index += 1) {
    const strip = box(.9, .05, 3.35, stone);
    strip.position.set(28.5 + index * 1.05, .025, 9.375);
    scene.add(strip);
  }
}

function addGroundPatch(
  scene: THREE.Scene,
  x: number,
  z: number,
  width: number,
  depth: number,
  material: THREE.Material,
) {
  const patch = box(width, .025, depth, material);
  patch.position.set(x, .012, z);
  scene.add(patch);
}

export function addDustLandmarks(scene: THREE.Scene) {
  addDoorLintel(scene, 24.25, 11.9, 8);
  addDoorLintel(scene, 8.9, 14.9, 4);
  addDoorLintel(scene, 38.5, 31.5, 8.2);
  addSiteShelter(scene, 37.5, 7.1, siteA);
  addSiteShelter(scene, 10.25, 7.1, siteB);
  addLongPit(scene);
  addTRoof(scene);
  addShortRamp(scene);
  addGroundPatch(scene, 24.75, 38.2, 19, 3.3, sand);
  addGroundPatch(scene, 24.25, 8.9, 7, 2.5, ctFloor);
  addGroundPatch(scene, 38.5, 22.25, 7.6, 17.5, sand);
  addGroundPatch(scene, 35.75, 11.625, 2.35, 3.05, siteA);
}
