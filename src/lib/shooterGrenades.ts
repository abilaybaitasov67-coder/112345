import { moveShooterPoint } from './shooterCollision';
import { GrenadeId, ShooterWorld } from './shooterTypes';

const THROW_SPEED = .48;
const EFFECT_RADIUS = 150;

function distance(x1: number, y1: number, x2: number, y2: number) {
  return Math.hypot(x1 - x2, y1 - y2);
}

export function throwShooterGrenade(world: ShooterWorld, kind: GrenadeId) {
  if (world.status !== 'playing' || world.grenadeCounts[kind] <= 0) return false;
  world.grenadeCounts[kind] -= 1;
  world.grenades.push({
    kind,
    x: world.player.x,
    y: world.player.y,
    dx: Math.cos(world.angle) * THROW_SPEED,
    dy: Math.sin(world.angle) * THROW_SPEED,
    timer: 650,
    active: false,
  });
  world.message = kind === 'flash'
    ? 'Световая граната брошена!'
    : kind === 'frag' ? 'Осколочная граната брошена!' : 'Молотов брошен!';
  return true;
}

function activateGrenade(world: ShooterWorld, index: number) {
  const grenade = world.grenades[index];
  if (grenade.kind === 'flash') {
    world.enemies.forEach((enemy) => {
      if (distance(enemy.x, enemy.y, grenade.x, grenade.y) <= EFFECT_RADIUS) {
        enemy.cooldown = Math.max(enemy.cooldown, 3000);
      }
    });
    world.message = 'Вспышка! Ближайшие боты ослеплены.';
    world.grenades.splice(index, 1);
    return;
  }
  if (grenade.kind === 'frag') {
    world.enemies.forEach((enemy) => {
      const range = distance(enemy.x, enemy.y, grenade.x, grenade.y);
      if (range <= EFFECT_RADIUS) enemy.health -= Math.round(85 * (1 - range / 220));
    });
    world.message = 'Осколочная граната взорвалась!';
    world.grenades.splice(index, 1);
    return;
  }
  grenade.active = true;
  grenade.dx = 0;
  grenade.dy = 0;
  grenade.timer = 5000;
  world.message = 'Зона горит — не подходи близко!';
}

export function updateShooterGrenades(world: ShooterWorld, elapsed: number) {
  for (let index = world.grenades.length - 1; index >= 0; index -= 1) {
    const grenade = world.grenades[index];
    grenade.timer -= elapsed;
    if (!grenade.active) {
      moveShooterPoint(grenade, grenade.dx * elapsed, grenade.dy * elapsed, world.covers, 1);
      if (grenade.timer <= 0) activateGrenade(world, index);
      continue;
    }
    world.enemies.forEach((enemy) => {
      if (distance(enemy.x, enemy.y, grenade.x, grenade.y) <= 115) {
        enemy.health -= elapsed * .025;
      }
    });
    if (grenade.timer <= 0) world.grenades.splice(index, 1);
  }
}
