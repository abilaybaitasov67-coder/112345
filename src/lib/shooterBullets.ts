import { getShooterFloorHeight } from './shooterFloorHeight';
import { ShooterBullet, ShooterPoint } from './shooterTypes';

const WORLD_TO_SCENE = .025;

function distance(a: ShooterPoint, b: ShooterPoint) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function createShooterBullet(
  from: ShooterPoint,
  to: ShooterPoint,
  enemy: boolean,
  speed: number,
  verticalSlope = 0,
): ShooterBullet {
  const length = Math.max(1, distance(from, to));
  return {
    x: from.x,
    y: from.y,
    dx: (to.x - from.x) / length,
    dy: (to.y - from.y) / length,
    height: 1.7 + getShooterFloorHeight(from.x, from.y),
    verticalSlope,
    speed,
    enemy,
  };
}

export function getTargetSlope(from: ShooterPoint, to: ShooterPoint) {
  const heightDifference = getShooterFloorHeight(to.x, to.y)
    - getShooterFloorHeight(from.x, from.y);
  return heightDifference / (Math.max(1, distance(from, to)) * WORLD_TO_SCENE);
}

export function getShotOffset(shot: number, pellets: number, spread: number) {
  if (pellets <= 1) return 0;
  const middle = (pellets - 1) / 2;
  return ((shot - middle) / Math.max(1, middle)) * spread / 2;
}

export function moveShooterBullet(bullet: ShooterBullet, elapsed: number) {
  bullet.x += bullet.dx * elapsed * bullet.speed;
  bullet.y += bullet.dy * elapsed * bullet.speed;
  bullet.height += elapsed * bullet.speed * WORLD_TO_SCENE * bullet.verticalSlope;
}

export function distanceToBulletPath(
  point: ShooterPoint,
  start: ShooterPoint,
  end: ShooterPoint,
) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSquared = dx * dx + dy * dy;
  const amount = lengthSquared === 0 ? 0 : Math.max(0, Math.min(1,
    ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared));
  return distance(point, { x: start.x + dx * amount, y: start.y + dy * amount });
}
