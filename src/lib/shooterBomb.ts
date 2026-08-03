import { ShooterPoint, ShooterWorld } from './shooterTypes';
import { shooterBombSites } from './shooterMapLayout';

export const bombSites = shooterBombSites;

const PLANT_DISTANCE = 100;
const BOMB_TIME = 30_000;
const DEFUSE_DISTANCE = 70;
const DEFUSE_TIME = 5_000;

function distance(a: ShooterPoint, b: ShooterPoint) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function isPlayerNearBomb(world: ShooterWorld) {
  return world.bomb.planted
    && distance(world.player, world.bomb) <= DEFUSE_DISTANCE;
}

export function tryPlantBomb(world: ShooterWorld) {
  if (world.status !== 'playing' || world.bomb.planted) return false;
  const site = (Object.entries(bombSites) as ['A' | 'B', ShooterPoint][])
    .find(([, point]) => distance(world.player, point) <= PLANT_DISTANCE);
  if (!site) return false;
  world.bomb = {
    x: site[1].x,
    y: site[1].y,
    site: site[0],
    timer: BOMB_TIME,
    defuseTimer: DEFUSE_TIME,
    defuser: null,
    updatedAt: Date.now(),
    planted: true,
    exploded: false,
    defused: false,
  };
  world.message = `Бомба установлена на точке ${site[0]}!`;
  return true;
}

export function tryStartBombDefuse(world: ShooterWorld) {
  if (
    world.status !== 'playing'
    || world.team !== 'counter'
    || !world.bomb.planted
    || world.bomb.exploded
    || !isPlayerNearBomb(world)
  ) return false;
  if (world.bomb.defuser !== 'player') world.bomb.defuseTimer = DEFUSE_TIME;
  world.bomb.defuser = 'player';
  world.bomb.updatedAt = Date.now();
  world.message = 'Разминирование началось — удерживай E!';
  return true;
}

export function stopPlayerBombDefuse(world: ShooterWorld) {
  if (world.bomb.defuser !== 'player' || !world.bomb.planted) return;
  world.bomb.defuser = null;
  world.bomb.defuseTimer = DEFUSE_TIME;
  world.bomb.updatedAt = Date.now();
  world.message = 'Разминирование отменено.';
}

function finishDefuse(
  world: ShooterWorld,
  defuser: 'player' | 'bot' | 'remote',
) {
  world.bomb.planted = false;
  world.bomb.defused = true;
  world.bomb.defuser = null;
  if (defuser !== 'remote') world.bomb.updatedAt = Date.now();
  world.status = defuser === 'player' ? 'won' : 'lost';
  world.message = defuser === 'player'
    ? 'Бомба обезврежена. Раунд выигран!'
    : defuser === 'bot'
      ? 'Боты обезвредили бомбу. Раунд проигран.'
      : 'Другой игрок обезвредил бомбу. Раунд проигран.';
}

export function updateBomb(world: ShooterWorld, elapsed: number) {
  if (!world.bomb.planted || world.bomb.exploded) return;
  const playerInRange = distance(world.player, world.bomb) <= DEFUSE_DISTANCE;
  const botInRange = world.team === 'terrorists' && world.enemies.some((enemy) =>
    enemy.health > 0 && distance(enemy, world.bomb) <= DEFUSE_DISTANCE);
  if (world.bomb.defuser === 'player' && !playerInRange) {
    stopPlayerBombDefuse(world);
  } else if (world.bomb.defuser !== 'player' && world.bomb.defuser !== 'remote') {
    world.bomb.defuser = botInRange ? 'bot' : null;
    if (!botInRange) world.bomb.defuseTimer = DEFUSE_TIME;
  }
  world.bomb.timer = Math.max(0, world.bomb.timer - elapsed);
  if (world.bomb.defuser) {
    world.bomb.defuseTimer = Math.max(0, world.bomb.defuseTimer - elapsed);
    if (world.bomb.defuseTimer === 0) {
      finishDefuse(world, world.bomb.defuser);
      return;
    }
  }
  if (world.bomb.timer > 0) return;
  world.bomb.exploded = true;
  world.bomb.updatedAt = Date.now();
  world.status = 'won';
  world.message = `Точка ${world.bomb.site} взорвана. Раунд выигран!`;
}
