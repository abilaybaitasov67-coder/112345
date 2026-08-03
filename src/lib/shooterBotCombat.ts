import {
  ShooterPoint,
  ShooterUnit,
  ShooterWorld,
  WeaponId,
} from './shooterTypes';
import { weaponInfo, WeaponInfo } from './shooterWeapons';
import { createShooterBullet, getTargetSlope } from './shooterBullets';
import { moveEnemyWithNavigation } from './shooterNavigation';
import { playWeaponShot } from './shooterAudio';
import { hasShooterLineOfSight } from './shooterCollision';

const automaticWeapons = new Set<WeaponId>(['smg', 'ak47', 'm4a4']);

export function getBotAimTarget(
  enemy: ShooterPoint,
  player: ShooterPoint,
): ShooterPoint {
  const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
  const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y);
  const error = (Math.random() - .5) * .09;
  return {
    x: enemy.x + Math.cos(angle + error) * distance,
    y: enemy.y + Math.sin(angle + error) * distance,
  };
}

export function getBotShotCooldown(
  enemy: ShooterUnit,
  weaponId: WeaponId,
  weapon: WeaponInfo,
) {
  if (!automaticWeapons.has(weaponId)) return 900 + Math.random() * 600;
  const shotsLeft = enemy.burstShots ?? 4 + Math.floor(Math.random() * 4);
  if (shotsLeft > 1) {
    enemy.burstShots = shotsLeft - 1;
    return Math.max(90, weapon.cooldown * 1.6);
  }
  enemy.burstShots = undefined;
  return 650 + Math.random() * 500;
}

export function updateShooterBots(world: ShooterWorld, elapsed: number) {
  if (world.pvpMode) return;
  world.enemies.forEach((enemy) => {
    let canSeePlayer = hasShooterLineOfSight(
      enemy,
      world.player,
      world.covers,
    );
    if (world.bomb.planted && !world.bomb.exploded) {
      moveEnemyWithNavigation(enemy, world.bomb, world.covers, elapsed);
    } else if (!canSeePlayer) {
      moveEnemyWithNavigation(enemy, world.player, world.covers, elapsed);
      canSeePlayer = hasShooterLineOfSight(
        enemy,
        world.player,
        world.covers,
      );
    }
    enemy.cooldown -= elapsed;
    const bombDistance = Math.hypot(
      enemy.x - world.bomb.x,
      enemy.y - world.bomb.y,
    );
    const playerDistance = Math.hypot(
      enemy.x - world.player.x,
      enemy.y - world.player.y,
    );
    const isDefusing = world.bomb.planted && bombDistance <= 70;
    if (
      isDefusing
      || enemy.cooldown > 0
      || playerDistance >= 650
      || !canSeePlayer
    ) return;
    const weaponId = enemy.weapon ?? 'm4a4';
    const weapon = weaponInfo[weaponId];
    world.bullets.push(createShooterBullet(
      enemy,
      getBotAimTarget(enemy, world.player),
      true,
      weapon.bulletSpeed,
      getTargetSlope(enemy, world.player, world.jumpHeight),
    ));
    playWeaponShot(weaponId, .38);
    enemy.cooldown = getBotShotCooldown(enemy, weaponId, weapon);
  });
}
