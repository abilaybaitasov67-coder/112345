import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { ShooterWorld } from './shooterTypes';
import { SHOOTER_WORLD_HEIGHT, SHOOTER_WORLD_WIDTH } from './shooterWorld';

const SCALE = .025;
const stone = new THREE.MeshStandardMaterial({ color: 0x9d7951, roughness: .94 });
const plaster = new THREE.MeshStandardMaterial({ color: 0xc9ad7d, roughness: .9 });
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xa88d68, roughness: 1 });
const darkWood = new THREE.MeshStandardMaterial({ color: 0x4a3323, roughness: .82 });

function box(width: number, height: number, depth: number, material: THREE.Material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function addWall(scene: THREE.Scene, x: number, y: number, width: number, depth: number) {
  const wall = box(width * SCALE, 2.8, depth * SCALE, plaster);
  wall.position.set(x * SCALE, 1.4, y * SCALE);
  scene.add(wall);
  const trim = box(width * SCALE + .04, .16, depth * SCALE + .04, stone);
  trim.position.set(x * SCALE, 2.72, y * SCALE);
  scene.add(trim);
}

function addSiteMarker(scene: THREE.Scene, x: number, z: number, label: string) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext('2d');
  if (!context) return;
  context.fillStyle = '#b84d25';
  context.fillRect(0, 0, 256, 256);
  context.fillStyle = '#f3dfb3';
  context.font = 'bold 170px Arial';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(label, 128, 140);
  const marker = new THREE.Mesh(
    new THREE.PlaneGeometry(1.2, 1.2),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas) }),
  );
  marker.rotation.x = -Math.PI / 2;
  marker.position.set(x, .012, z);
  scene.add(marker);
}

function addArch(scene: THREE.Scene, x: number, z: number, rotation = 0) {
  const arch = new THREE.Group();
  const left = box(.42, 2.45, .65, stone);
  const right = box(.42, 2.45, .65, stone);
  const top = box(2.5, .48, .72, stone);
  left.position.set(-1.02, 1.22, 0);
  right.position.set(1.02, 1.22, 0);
  top.position.set(0, 2.22, 0);
  const doorLeft = box(.82, 1.85, .12, darkWood);
  const doorRight = box(.82, 1.85, .12, darkWood);
  doorLeft.position.set(-.45, .93, 0);
  doorRight.position.set(.45, .93, 0);
  doorLeft.rotation.y = -.16;
  doorRight.rotation.y = .16;
  arch.add(left, right, top, doorLeft, doorRight);
  arch.position.set(x, 0, z);
  arch.rotation.y = rotation;
  scene.add(arch);
}

function addBarrels(scene: THREE.Scene) {
  const positions = [[4.8, 3.15], [5.48, 3.22], [30.3, 3.3], [30.98, 3.22]];
  positions.forEach(([x, z]) => {
    const barrel = new THREE.Mesh(
      new THREE.CylinderGeometry(.24, .24, .72, 12),
      darkWood,
    );
    barrel.position.set(x, .36, z);
    barrel.castShadow = true;
    barrel.receiveShadow = true;
    scene.add(barrel);
  });
}

function addCrates(scene: THREE.Scene) {
  const spots = [
    [5.4, 4.2, 0], [6.52, 4.2, 0], [5.92, 5.25, 0],
    [30.15, 4.2, .3], [31.27, 4.2, -.15], [30.67, 5.25, 0],
  ] as const;
  const cratePath = `${import.meta.env.BASE_URL}models/tactical-crate.glb`;
  new GLTFLoader().load(cratePath, ({ scene: crate }) => {
    spots.forEach(([x, z, rotation]) => {
      const model = crate.clone(true);
      model.scale.setScalar(.48);
      model.position.set(x, 0, z);
      model.rotation.y = rotation;
      model.traverse((child) => { child.castShadow = true; child.receiveShadow = true; });
      scene.add(model);
    });
  });
}

export function buildTacticalMap(scene: THREE.Scene, world: ShooterWorld) {
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(SHOOTER_WORLD_WIDTH * SCALE, SHOOTER_WORLD_HEIGHT * SCALE),
    floorMaterial,
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(SHOOTER_WORLD_WIDTH * SCALE / 2, 0, SHOOTER_WORLD_HEIGHT * SCALE / 2);
  floor.receiveShadow = true;
  scene.add(floor);
  const walls = [
    [SHOOTER_WORLD_WIDTH / 2, 0, SHOOTER_WORLD_WIDTH, 8],
    [SHOOTER_WORLD_WIDTH / 2, SHOOTER_WORLD_HEIGHT, SHOOTER_WORLD_WIDTH, 8],
    [0, SHOOTER_WORLD_HEIGHT / 2, 8, SHOOTER_WORLD_HEIGHT],
    [SHOOTER_WORLD_WIDTH, SHOOTER_WORLD_HEIGHT / 2, 8, SHOOTER_WORLD_HEIGHT],
    ...world.covers.map((cover) => [
      cover.x + cover.width / 2, cover.y + cover.height / 2,
      cover.width, cover.height,
    ]),
  ];
  walls.forEach(([x, y, width, depth]) => addWall(scene, x, y, width, depth));
  addSiteMarker(scene, 30.6, 3.75, 'A');
  addSiteMarker(scene, 5.55, 3.75, 'B');
  addArch(scene, 18, 11.85);
  addArch(scene, 11.4, 8.25, Math.PI / 2);
  addBarrels(scene);
  addCrates(scene);
}
