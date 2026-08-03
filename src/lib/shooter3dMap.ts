import * as THREE from 'three';
import { bombSites } from './shooterBomb';
import { ShooterWorld } from './shooterTypes';
import { SHOOTER_WORLD_HEIGHT, SHOOTER_WORLD_WIDTH } from './shooterWorld';
import { addRouteProps } from './shooter3dRouteProps';
import { addMapSigns } from './shooter3dSigns';
import { addBoundaryWalls, addMapBlocks } from './shooter3dBlocks';
import { addDustLandmarks } from './shooter3dDustLandmarks';
import { dustGroundMaterial } from './shooter3dMaterials';
import { addSiteProps } from './shooter3dSiteProps';
import { addShooterElevations } from './shooter3dElevations';
import { getShooterFloorHeight } from './shooterFloorHeight';
import { addMapDoorways } from './shooter3dDoorways';
import { addSiteSilhouettes } from './shooter3dSiteSilhouettes';

const SCALE = .025;

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
  marker.position.set(
    x,
    getShooterFloorHeight(x / SCALE, z / SCALE) + .012,
    z,
  );
  scene.add(marker);
}

export function buildTacticalMap(
  scene: THREE.Scene,
  _world: ShooterWorld,
  lowPower = false,
) {
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(SHOOTER_WORLD_WIDTH * SCALE, SHOOTER_WORLD_HEIGHT * SCALE),
    dustGroundMaterial,
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(SHOOTER_WORLD_WIDTH * SCALE / 2, 0, SHOOTER_WORLD_HEIGHT * SCALE / 2);
  floor.receiveShadow = true;
  scene.add(floor);
  addShooterElevations(scene);
  addBoundaryWalls(
    scene,
    SHOOTER_WORLD_WIDTH * SCALE,
    SHOOTER_WORLD_HEIGHT * SCALE,
  );
  addMapBlocks(scene);
  addSiteMarker(scene, bombSites.A.x * SCALE, bombSites.A.y * SCALE, 'A');
  addSiteMarker(scene, bombSites.B.x * SCALE, bombSites.B.y * SCALE, 'B');
  if (lowPower) return;
  addSiteProps(scene);
  addRouteProps(scene);
  addDustLandmarks(scene);
  addMapDoorways(scene);
  addSiteSilhouettes(scene);
  addMapSigns(scene);
}
