import { moveShooterPoint } from './shooterCollision';
import { GrenadeId, ShooterWorld } from './shooterTypes';

const THROW_SPEED = .48;
const GRAVITY = .000018;
const EFFECT_RADIUS = 150;

export const grenadeShopItems = [
  { id: 'flash', name: 'Световая', detail: 'Ослепляет ботов на 3 секунды', price: 200 },
  { id: 'frag', name: 'Осколочная', detail: 'Наносит урон в радиусе взрыва', price: 300 },
  { id: 'molotov', name: 'Молотов', detail: 'Поджигает участок на 5 секунд', price: 400 },
] as const;

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
    height: 1.35,
    verticalVelocity: .006,
    rotation: 0,
    timer: 950,
    active: false,
    detonated: false,
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
    grenade.active = true;
    grenade.detonated = true;
    grenade.timer = 220;
    return;
  }
  if (grenade.kind === 'frag') {
    world.enemies.forEach((enemy) => {
      const range = distance(enemy.x, enemy.y, grenade.x, grenade.y);
      if (range <= EFFECT_RADIUS) enemy.health -= Math.round(85 * (1 - range / 220));
    });
    world.message = 'Осколочная граната взорвалась!';
    grenade.active = true;
    grenade.detonated = true;
    grenade.timer = 280;
    return;
  }
  grenade.active = true;
  grenade.dx = 0;
  grenade.dy = 0;
  grenade.timer = 5000;
  grenade.detonated = true;
  world.message = 'Зона горит — не подходи близко!';
}

export function updateShooterGrenades(world: ShooterWorld, elapsed: number) {
  for (let index = world.grenades.length - 1; index >= 0; index -= 1) {
    const grenade = world.grenades[index];
    grenade.timer -= elapsed;
    if (!grenade.active) {
      const expectedStep = Math.hypot(grenade.dx * elapsed, grenade.dy * elapsed);
      const moved = moveShooterPoint(
        grenade, grenade.dx * elapsed, grenade.dy * elapsed, world.covers, grenade.height,
      );
      if (moved < expectedStep * .35) {
        grenade.dx *= -.35;
        grenade.dy *= -.35;
      }
      grenade.verticalVelocity -= GRAVITY * elapsed;
      grenade.height += grenade.verticalVelocity * elapsed;
      grenade.rotation += elapsed * .012;
      if (grenade.height <= .1) {
        grenade.height = .1;
        grenade.verticalVelocity = Math.abs(grenade.verticalVelocity) * .42;
        grenade.dx *= .72;
        grenade.dy *= .72;
      }
      if (grenade.timer <= 0) activateGrenade(world, index);
      continue;
    }
    if (grenade.kind !== 'molotov') {
      if (grenade.timer <= 0) world.grenades.splice(index, 1);
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
