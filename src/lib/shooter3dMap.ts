import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { ShooterWorld } from './shooterTypes';
import { SHOOTER_HEIGHT, SHOOTER_WIDTH } from './shooterWorld';

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
  arch.add(left, right, top);
  arch.position.set(x, 0, z);
  arch.rotation.y = rotation;
  scene.add(arch);
}

function addBarrels(scene: THREE.Scene) {
  const positions = [[4.7, 1.2], [5.15, 1.25], [20.4, 10.8], [20.8, 10.75]];
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
    [5.9, 1.35, 0], [6.65, 1.35, 0], [6.3, 2.05, 0],
    [17.8, 7.7, .3], [18.5, 7.7, -.15], [18.15, 8.4, 0],
  ] as const;
  new GLTFLoader().load('/models/tactical-crate.glb', ({ scene: crate }) => {
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
    new THREE.PlaneGeometry(SHOOTER_WIDTH * SCALE, SHOOTER_HEIGHT * SCALE),
    floorMaterial,
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(SHOOTER_WIDTH * SCALE / 2, 0, SHOOTER_HEIGHT * SCALE / 2);
  floor.receiveShadow = true;
  scene.add(floor);
  const walls = [
    [SHOOTER_WIDTH / 2, 0, SHOOTER_WIDTH, 8],
    [SHOOTER_WIDTH / 2, SHOOTER_HEIGHT, SHOOTER_WIDTH, 8],
    [0, SHOOTER_HEIGHT / 2, 8, SHOOTER_HEIGHT],
    [SHOOTER_WIDTH, SHOOTER_HEIGHT / 2, 8, SHOOTER_HEIGHT],
    ...world.covers.map((cover) => [
      cover.x + cover.width / 2, cover.y + cover.height / 2,
      cover.width, cover.height,
    ]),
  ];
  walls.forEach(([x, y, width, depth]) => addWall(scene, x, y, width, depth));
  addSiteMarker(scene, 6.2, 1.7, 'A');
  addSiteMarker(scene, 18.2, 8, 'B');
  addArch(scene, 11.8, 6.9);
  addArch(scene, 17.3, 3.15, Math.PI / 2);
  addBarrels(scene);
  addCrates(scene);
}
