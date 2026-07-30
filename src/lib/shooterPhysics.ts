import { SHOOTER_WORLD_HEIGHT, SHOOTER_WORLD_WIDTH } from './shooterWorld';
import {
  ShooterBullet,
  ShooterCover,
  ShooterPoint,
  ShooterUnit,
  ShooterWorld,
} from './shooterTypes';
import { weaponInfo } from './shooterWeapons';
import { updateBomb } from './shooterBomb';

const UNIT_RADIUS = 15;

function distance(a: ShooterPoint, b: ShooterPoint) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function blocked(point: ShooterPoint, covers: ShooterCover[]) {
  return covers.some((cover) => point.x + UNIT_RADIUS > cover.x
    && point.x - UNIT_RADIUS < cover.x + cover.width
    && point.y + UNIT_RADIUS > cover.y
    && point.y - UNIT_RADIUS < cover.y + cover.height);
}

function movePlayer(world: ShooterWorld, x: number, y: number) {
  const nextX = { x: world.player.x + x, y: world.player.y };
  if (!blocked(nextX, world.covers)) world.player.x = nextX.x;
  const nextY = { x: world.player.x, y: world.player.y + y };
  if (!blocked(nextY, world.covers)) world.player.y = nextY.y;
  world.player.x = Math.max(UNIT_RADIUS, Math.min(SHOOTER_WORLD_WIDTH - UNIT_RADIUS, world.player.x));
  world.player.y = Math.max(UNIT_RADIUS, Math.min(SHOOTER_WORLD_HEIGHT - UNIT_RADIUS, world.player.y));
}

function moveEnemyToBomb(
  enemy: ShooterUnit,
  bomb: ShooterPoint,
  covers: ShooterCover[],
  elapsed: number,
) {
  const dx = bomb.x - enemy.x;
  const dy = bomb.y - enemy.y;
  const length = Math.hypot(dx, dy);
  if (length < 48) return;
  const speed = elapsed * .075;
  const nextX = { x: enemy.x + dx / length * speed, y: enemy.y };
  if (!blocked(nextX, covers)) enemy.x = nextX.x;
  const nextY = { x: enemy.x, y: enemy.y + dy / length * speed };
  if (!blocked(nextY, covers)) enemy.y = nextY.y;
}

function createBullet(from: ShooterPoint, to: ShooterPoint, enemy: boolean): ShooterBullet {
  const length = Math.max(1, distance(from, to));
  return { x: from.x, y: from.y, dx: (to.x - from.x) / length, dy: (to.y - from.y) / length, enemy };
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
  for (let shot = 0; shot < weapon.pellets; shot += 1) {
    const spread = (Math.random() - .5) * weapon.spread;
    world.bullets.push(createBullet(world.player, {
      x: world.player.x + Math.cos(world.angle + spread) * 1000,
      y: world.player.y + Math.sin(world.angle + spread) * 1000,
    }, false));
  }
  world.player.cooldown = weapon.cooldown;
}

export function updateShooter(
  world: ShooterWorld,
  elapsed: number,
  movement: ShooterPoint,
) {
  if (world.status !== 'playing' || !world.weapon) return;
  const selectedWeapon = weaponInfo[world.weapon];
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
  updateBomb(world, elapsed);

  if (!world.pvpMode) world.enemies.forEach((enemy) => {
    if (world.bomb.planted && !world.bomb.exploded) {
      moveEnemyToBomb(enemy, world.bomb, world.covers, elapsed);
    }
    enemy.cooldown -= elapsed;
    if (enemy.cooldown <= 0 && distance(enemy, world.player) < 650) {
      world.bullets.push(createBullet(enemy, world.player, true));
      enemy.cooldown = 900 + Math.random() * 600;
    }
  });

  world.bullets.forEach((bullet) => {
    bullet.x += bullet.dx * elapsed * 0.55;
    bullet.y += bullet.dy * elapsed * 0.55;
  });
  world.bullets = world.bullets.filter((bullet) => {
    if (bullet.x < 0 || bullet.x > SHOOTER_WORLD_WIDTH
      || bullet.y < 0 || bullet.y > SHOOTER_WORLD_HEIGHT) return false;
    if (world.covers.some((cover) => blocked(bullet, [cover]))) return false;
    const targets = bullet.enemy ? [world.player] : world.enemies;
    const hit = targets.find((target) => distance(bullet, target) < UNIT_RADIUS);
    if (!hit) return true;
    const playerDamage = selectedWeapon.damage;
    hit.health -= bullet.enemy ? 12 : playerDamage;
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
    if (distance(world.player, { x: 1372, y: 68 }) < 70) {
      world.status = 'won';
      world.message = 'Миссия выполнена! Отряд добрался до точки эвакуации.';
    } else {
      world.message = 'Район зачищен. Доберись до жёлтой точки EXIT.';
    }
  }
}
