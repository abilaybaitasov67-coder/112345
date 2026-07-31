import {
  SHOOTER_HEIGHT,
  shooterExitPoint,
  SHOOTER_WIDTH,
  SHOOTER_WORLD_HEIGHT,
  SHOOTER_WORLD_WIDTH,
} from './shooterWorld';
import { ShooterCover, ShooterWorld } from './shooterTypes';
import { drawFirstPersonWeapon } from './shooterWeaponDraw';
import { weaponInfo } from './shooterWeapons';

const DEFAULT_FOV = Math.PI / 3;
const RAYS = 240;
const MAX_DEPTH = 2100;

function insideCover(x: number, y: number, covers: ShooterCover[]) {
  return covers.some((cover) => x > cover.x && x < cover.x + cover.width
    && y > cover.y && y < cover.y + cover.height);
}

function castRay(world: ShooterWorld, angle: number) {
  for (let depth = 5; depth < MAX_DEPTH; depth += 4) {
    const x = world.player.x + Math.cos(angle) * depth;
    const y = world.player.y + Math.sin(angle) * depth;
    if (x < 4 || x > SHOOTER_WORLD_WIDTH - 4 || y < 4 || y > SHOOTER_WORLD_HEIGHT - 4
      || insideCover(x, y, world.covers)) return depth;
  }
  return MAX_DEPTH;
}

function normalizeAngle(angle: number) {
  return Math.atan2(Math.sin(angle), Math.cos(angle));
}

function drawScope(context: CanvasRenderingContext2D) {
  const radius = 245;
  context.fillStyle = 'rgba(0, 0, 0, .96)';
  context.beginPath();
  context.rect(0, 0, SHOOTER_WIDTH, SHOOTER_HEIGHT);
  context.arc(SHOOTER_WIDTH / 2, SHOOTER_HEIGHT / 2, radius, 0, Math.PI * 2);
  context.fill('evenodd');
  context.strokeStyle = '#101412';
  context.lineWidth = 5;
  context.beginPath();
  context.arc(SHOOTER_WIDTH / 2, SHOOTER_HEIGHT / 2, radius, 0, Math.PI * 2);
  context.moveTo(SHOOTER_WIDTH / 2 - radius, SHOOTER_HEIGHT / 2);
  context.lineTo(SHOOTER_WIDTH / 2 + radius, SHOOTER_HEIGHT / 2);
  context.moveTo(SHOOTER_WIDTH / 2, SHOOTER_HEIGHT / 2 - radius);
  context.lineTo(SHOOTER_WIDTH / 2, SHOOTER_HEIGHT / 2 + radius);
  context.stroke();
}

function drawEnemy(
  context: CanvasRenderingContext2D,
  screenX: number,
  depth: number,
  health: number,
  horizon: number,
) {
  const height = Math.min(300, 17000 / depth);
  const width = height * 0.38;
  const floor = horizon + height * 0.55;
  const top = floor - height;
  context.fillStyle = '#713d35';
  context.fillRect(screenX - width / 2, top + height * .3, width, height * .45);
  context.fillStyle = '#252d28';
  context.fillRect(screenX - width * .42, top + height * .42, width * .84, height * .26);
  context.fillStyle = '#d2a47f';
  context.beginPath();
  context.arc(screenX, top + height * .2, width * .3, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = '#17201c';
  context.fillRect(screenX - width * .35, top + height * .09, width * .7, height * .1);
  context.strokeStyle = '#1b211d';
  context.lineWidth = Math.max(3, width * .13);
  context.beginPath();
  context.moveTo(screenX - width * .2, top + height * .7);
  context.lineTo(screenX - width * .25, floor);
  context.moveTo(screenX + width * .2, top + height * .7);
  context.lineTo(screenX + width * .25, floor);
  context.stroke();
  context.fillStyle = '#111827';
  context.fillRect(screenX - width / 2, top - 9, width, 5);
  context.fillStyle = '#ef4444';
  context.fillRect(screenX - width / 2, top - 9, width * health / 60, 5);
}

export function drawShooter(context: CanvasRenderingContext2D, world: ShooterWorld) {
  const scoped = world.weapon === 'sniper' && world.aiming;
  const fov = scoped ? Math.PI / 8 : DEFAULT_FOV;
  const horizon = SHOOTER_HEIGHT / 2 + world.pitch + world.viewKick;
  const sky = context.createLinearGradient(0, 0, 0, horizon);
  sky.addColorStop(0, '#81909a'); sky.addColorStop(1, '#c3c8c5');
  context.fillStyle = sky;
  context.fillRect(0, 0, SHOOTER_WIDTH, horizon);
  context.fillStyle = '#545c56';
  context.fillRect(0, horizon, SHOOTER_WIDTH, SHOOTER_HEIGHT - horizon);

  const depths: number[] = [];
  const stripWidth = SHOOTER_WIDTH / RAYS;
  for (let ray = 0; ray < RAYS; ray += 1) {
    const offset = (ray / RAYS - .5) * fov;
    const depth = castRay(world, world.angle + offset) * Math.cos(offset);
    depths.push(depth);
    const wallHeight = Math.min(SHOOTER_HEIGHT, 19000 / depth);
    const shade = Math.max(45, 155 - depth * .13);
    context.fillStyle = `rgb(${shade}, ${shade + 8}, ${shade + 3})`;
    context.fillRect(ray * stripWidth, horizon - wallHeight / 2, stripWidth + 1, wallHeight);
  }

  const visible = world.enemies.map((enemy) => {
    const dx = enemy.x - world.player.x;
    const dy = enemy.y - world.player.y;
    return { enemy, depth: Math.hypot(dx, dy), angle: normalizeAngle(Math.atan2(dy, dx) - world.angle) };
  }).filter(({ angle }) => Math.abs(angle) < fov * .58)
    .sort((a, b) => b.depth - a.depth);
  visible.forEach(({ enemy, depth, angle }) => {
    const screenX = SHOOTER_WIDTH / 2 + angle / fov * SHOOTER_WIDTH;
    const ray = Math.max(0, Math.min(RAYS - 1, Math.floor(screenX / stripWidth)));
    if (depth < depths[ray] + 12) drawEnemy(context, screenX, depth, enemy.health, horizon);
  });
  if (world.enemies.length === 0) {
    const exitAngle = normalizeAngle(
      Math.atan2(
        shooterExitPoint.y - world.player.y,
        shooterExitPoint.x - world.player.x,
      ) - world.angle,
    );
    const markerX = Math.max(55, Math.min(905, SHOOTER_WIDTH / 2 + exitAngle / fov * SHOOTER_WIDTH));
    context.fillStyle = '#facc15';
    context.font = 'bold 18px Inter';
    context.textAlign = 'center';
    context.fillText(exitAngle < -fov / 2 ? '← EXIT' : exitAngle > fov / 2 ? 'EXIT →' : '▼ EXIT', markerX, 55);
    context.textAlign = 'start';
  }

  context.strokeStyle = 'rgba(255,255,255,.75)';
  context.lineWidth = 1.5;
  context.beginPath();
  context.moveTo(472, 280); context.lineTo(477, 280);
  context.moveTo(483, 280); context.lineTo(488, 280);
  context.moveTo(480, 272); context.lineTo(480, 277);
  context.moveTo(480, 283); context.lineTo(480, 288);
  context.stroke();
  context.fillStyle = '#fff';
  context.fillRect(479, 279, 2, 2);
  const firing = world.weapon
    ? world.player.cooldown > weaponInfo[world.weapon].cooldown - 70
    : false;
  if (scoped) drawScope(context);
  else drawFirstPersonWeapon(context, world.weapon, firing);
}
