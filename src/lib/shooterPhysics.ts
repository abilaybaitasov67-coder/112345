import {
  shooterExitPoint,
  SHOOTER_WORLD_HEIGHT,
  SHOOTER_WORLD_WIDTH,
} from './shooterWorld';
import {
  ShooterPoint,
  ShooterWorld,
} from './shooterTypes';
import { weaponInfo } from './shooterWeapons';
import { updateBomb } from './shooterBomb';
import {
  hasShooterLineOfSight,
  moveShooterPoint,
} from './shooterCollision';
import {
  createShooterBullet,
  findBulletTarget,
  getShotOffset,
  moveShooterBullet,
} from './shooterBullets';
import { updateShooterJump } from './shooterJump';
import { getShooterFloorHeight } from './shooterFloorHeight';
import { updateShooterBots } from './shooterBotCombat';

function distance(a: ShooterPoint, b: ShooterPoint) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function movePlayer(world: ShooterWorld, x: number, y: number) {
  moveShooterPoint(world.player, x, y, world.covers);
}

export function firePlayer(world: ShooterWorld) {
  if (world.status !== 'playing' || world.player.cooldown > 0 || !world.weapon) return;
  const weapon = weaponInfo[world.weapon];
  if (world.weapon === 'knife') {
    const target = world.enemies
      .filter((enemy) => distance(enemy, world.player) < 65)
      .find((enemy) => {
        const angle = Math.atan2(enemy.y - world.player.y, enemy.x - world.player.x);
        return Math.abs(Math.atan2(Math.sin(angle - world.angle), Math.cos(angle - world.angle))) < .7;
      });
    if (target) target.health -= weapon.damage;
    world.player.cooldown = weapon.cooldown;
    return;
  }
  const aimScale = world.aiming ? .18 : 1;
  const movementSpread = world.moving ? .12 : 0;
  const jumpSpread = world.jumpHeight > .05 ? .12 : 0;
  const sniperHipSpread = world.weapon === 'sniper' && !world.aiming ? .2 : 0;
  const revolverSpread = world.weapon === 'revolver' ? weapon.spread : 0;
  const accuracySpread = (
    world.recoil + movementSpread + jumpSpread
      + sniperHipSpread + revolverSpread
  ) * aimScale;
  const pelletSpread = weapon.spread * aimScale;
  for (let shot = 0; shot < weapon.pellets; shot += 1) {
    const accuracyOffset = (Math.random() - .5) * accuracySpread;
    const spread = accuracyOffset + getShotOffset(shot, weapon.pellets, pelletSpread);
    world.bullets.push(createShooterBullet(world.player, {
      x: world.player.x + Math.cos(world.angle + spread) * 1000,
      y: world.player.y + Math.sin(world.angle + spread) * 1000,
    }, false, weapon.bulletSpeed, (world.pitch + world.viewKick) / 430, world.jumpHeight));
  }
  world.recoil = Math.min(.22, world.recoil + weapon.recoil);
  world.viewKick = Math.min(95, world.viewKick + weapon.recoil * 360);
  world.player.cooldown = weapon.cooldown;
}

export function updateShooter(
  world: ShooterWorld,
  elapsed: number,
  movement: ShooterPoint,
) {
  if (world.status !== 'playing' || !world.weapon) return;
  updateShooterJump(world, elapsed);
  const selectedWeapon = weaponInfo[world.weapon];
  world.moving = Math.hypot(movement.x, movement.y) > .12;
  const recovery = world.moving ? .000045 : .000085;
  world.recoil = Math.max(0, world.recoil - elapsed * recovery);
  world.viewKick = Math.max(0, world.viewKick - elapsed * .055);
  const length = Math.max(1, Math.hypot(movement.x, movement.y));
  const strafe = movement.x / length;
  const forward = -movement.y / length;
  const dx = Math.cos(world.angle) * forward + Math.cos(world.angle + Math.PI / 2) * strafe;
  const dy = Math.sin(world.angle) * forward + Math.sin(world.angle + Math.PI / 2) * strafe;
  movePlayer(world, dx * elapsed * 0.16, dy * elapsed * 0.16);
  world.aim = {
    x: world.player.x + Math.cos(world.angle) * 1000,
    y: world.player.y + Math.sin(world.angle) * 1000,
  };
  world.player.cooldown = Math.max(0, world.player.cooldown - elapsed);

  updateShooterBots(world, elapsed);
  updateBomb(world, elapsed);

  world.bullets = world.bullets.filter((bullet) => {
    const start = { ...bullet };
    moveShooterBullet(bullet, elapsed);
    if (bullet.x < 0 || bullet.x > SHOOTER_WORLD_WIDTH
      || bullet.y < 0 || bullet.y > SHOOTER_WORLD_HEIGHT) return false;
    if (!hasShooterLineOfSight(
      start,
      bullet,
      world.covers,
      start.height,
      bullet.height,
    )) return false;
    const targets = bullet.enemy ? [world.player] : world.enemies;
    const impact = findBulletTarget(targets, (target) =>
      getShooterFloorHeight(target.x, target.y)
        + (target === world.player ? world.jumpHeight : 0), start, bullet);
    if (!impact) return true;
    const playerDamage = selectedWeapon.damage;
    const headshot = !bullet.enemy && impact.relativeHeight >= 1.42;
    impact.target.health -= bullet.enemy ? 12 : playerDamage * (headshot ? 2 : 1);
    if (headshot) world.message = `ХЕДШОТ! −${playerDamage * 2} HP`;
    return false;
  });
  const defeated = world.enemies.filter((enemy) => enemy.health <= 0);
  defeated.forEach((enemy) => {
    world.droppedWeapons.push({
      x: enemy.x,
      y: enemy.y,
      weapon: enemy.weapon ?? 'rifle',
    });
  });
  world.enemies = world.enemies.filter((enemy) => enemy.health > 0);
  if (world.player.health <= 0) {
    world.status = 'lost';
    world.message = 'Миссия провалена. Отряд потерял бойца.';
  } else if (!world.pvpMode && world.enemies.length === 0) {
    if (distance(world.player, shooterExitPoint) < 70) {
      world.status = 'won';
      world.message = 'Миссия выполнена! Отряд добрался до точки эвакуации.';
    } else {
      world.message = 'Район зачищен. Доберись до жёлтой точки EXIT.';
    }
  }
}
