import * as THREE from 'three';
import { getShooterFloorHeight } from './shooterFloorHeight';
import { createHumanModel } from './shooter3dHuman';
import { ShooterWorld } from './shooterTypes';

export function syncEnemyModels(
  scene: THREE.Scene,
  models: THREE.Group[],
  world: ShooterWorld,
  scale: number,
) {
  while (models.length > world.enemies.length) {
    scene.remove(models.pop()!);
  }
  while (models.length < world.enemies.length) {
    const weapon = world.enemies[models.length].weapon ?? 'rifle';
    const model = createHumanModel(false, weapon);
    model.userData.weapon = weapon;
    models.push(model);
    scene.add(model);
  }
  models.forEach((currentModel, index) => {
    const enemy = world.enemies[index];
    let model = currentModel;
    const weapon = enemy.weapon ?? 'rifle';
    if (model.userData.weapon !== weapon) {
      scene.remove(model);
      model = createHumanModel(false, weapon);
      model.userData.weapon = weapon;
      models[index] = model;
      scene.add(model);
    }
    model.position.set(
      enemy.x * scale,
      getShooterFloorHeight(enemy.x, enemy.y),
      enemy.y * scale,
    );
    model.lookAt(
      world.player.x * scale,
      1.2 + world.jumpHeight + getShooterFloorHeight(world.player.x, world.player.y),
      world.player.y * scale,
    );
    model.rotateY(Math.PI);
  });
}

export function syncRemotePlayerModels(
  scene: THREE.Scene,
  models: Map<string, THREE.Group>,
  world: ShooterWorld,
  scale: number,
) {
  const activeIds = new Set(world.remotePlayers.map((player) => player.id));
  models.forEach((model, id) => {
    if (!activeIds.has(id)) {
      scene.remove(model);
      models.delete(id);
    }
  });
  world.remotePlayers.forEach((player) => {
    const weapon = player.weapon ?? 'rifle';
    const friendly = player.team === world.team;
    let model = models.get(player.id);
    if (!model
      || model.userData.weapon !== weapon
      || model.userData.friendly !== friendly) {
      if (model) scene.remove(model);
      model = createHumanModel(friendly, weapon);
      model.userData.weapon = weapon;
      model.userData.friendly = friendly;
      models.set(player.id, model);
      scene.add(model);
    }
    model.position.set(
      player.x * scale,
      (player.jumpHeight ?? 0) + getShooterFloorHeight(player.x, player.y),
      player.y * scale,
    );
    model.rotation.y = -player.angle + Math.PI / 2;
    model.visible = player.health > 0;
  });
}
