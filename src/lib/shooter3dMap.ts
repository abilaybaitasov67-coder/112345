import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { bombSites } from './shooterBomb';
import { ShooterWorld } from './shooterTypes';
import { SHOOTER_WORLD_HEIGHT, SHOOTER_WORLD_WIDTH } from './shooterWorld';
import { addRouteProps } from './shooter3dRouteProps';
import { addMapSigns } from './shooter3dSigns';
import { addBoundaryWalls, addMapBlocks } from './shooter3dBlocks';

const SCALE = .025;
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x9b876a, roughness: 1 });
const darkWood = new THREE.MeshStandardMaterial({ color: 0x493629, roughness: .82 });

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

function addBarrels(scene: THREE.Scene) {
  const positions = [[9.2, 6.4], [9.9, 6.4], [36.5, 6.4], [37.2, 6.4]];
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
    [9.2, 6.2, 0], [10.32, 6.2, 0], [9.75, 7.25, 0],
    [36.2, 6.2, .3], [37.32, 6.2, -.15], [36.75, 7.25, 0],
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

export function buildTacticalMap(scene: THREE.Scene, _world: ShooterWorld) {
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(SHOOTER_WORLD_WIDTH * SCALE, SHOOTER_WORLD_HEIGHT * SCALE),
    floorMaterial,
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(SHOOTER_WORLD_WIDTH * SCALE / 2, 0, SHOOTER_WORLD_HEIGHT * SCALE / 2);
  floor.receiveShadow = true;
  scene.add(floor);
  addBoundaryWalls(
    scene,
    SHOOTER_WORLD_WIDTH * SCALE,
    SHOOTER_WORLD_HEIGHT * SCALE,
  );
  addMapBlocks(scene);
  addSiteMarker(scene, bombSites.A.x * SCALE, bombSites.A.y * SCALE, 'A');
  addSiteMarker(scene, bombSites.B.x * SCALE, bombSites.B.y * SCALE, 'B');
  addBarrels(scene);
  addCrates(scene);
  addRouteProps(scene);
  addMapSigns(scene);
}
