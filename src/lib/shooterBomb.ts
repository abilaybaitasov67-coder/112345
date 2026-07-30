import { ShooterPoint, ShooterWorld } from './shooterTypes';

export const bombSites = {
  A: { x: 1224, y: 150 },
  B: { x: 222, y: 150 },
} satisfies Record<'A' | 'B', ShooterPoint>;

const PLANT_DISTANCE = 100;
const BOMB_TIME = 30_000;

function distance(a: ShooterPoint, b: ShooterPoint) {
  return Math.hypot(a.x - b.x, a.y - b.y);
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
    planted: true,
    exploded: false,
  };
  world.message = `Бомба установлена на точке ${site[0]}!`;
  return true;
}

export function updateBomb(world: ShooterWorld, elapsed: number) {
  if (!world.bomb.planted || world.bomb.exploded) return;
  world.bomb.timer = Math.max(0, world.bomb.timer - elapsed);
  if (world.bomb.timer > 0) return;
  world.bomb.exploded = true;
  world.status = 'won';
  world.message = `Точка ${world.bomb.site} взорвана. Раунд выигран!`;
}
