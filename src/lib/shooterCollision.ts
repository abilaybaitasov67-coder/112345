import { ShooterCover, ShooterPoint } from './shooterTypes';
import {
  SHOOTER_WORLD_HEIGHT,
  SHOOTER_WORLD_WIDTH,
} from './shooterWorld';

export const SHOOTER_UNIT_RADIUS = 15;

export function isShooterPointBlocked(
  point: ShooterPoint,
  covers: ShooterCover[],
  radius = SHOOTER_UNIT_RADIUS,
) {
  if (
    point.x < radius
    || point.y < radius
    || point.x > SHOOTER_WORLD_WIDTH - radius
    || point.y > SHOOTER_WORLD_HEIGHT - radius
  ) return true;
  return covers.some((cover) => point.x + radius > cover.x
    && point.x - radius < cover.x + cover.width
    && point.y + radius > cover.y
    && point.y - radius < cover.y + cover.height);
}

export function moveShooterPoint(
  point: ShooterPoint,
  dx: number,
  dy: number,
  covers: ShooterCover[],
) {
  const startX = point.x;
  const startY = point.y;
  const nextX = { x: point.x + dx, y: point.y };
  if (!isShooterPointBlocked(nextX, covers)) point.x = nextX.x;
  const nextY = { x: point.x, y: point.y + dy };
  if (!isShooterPointBlocked(nextY, covers)) point.y = nextY.y;
  return Math.hypot(point.x - startX, point.y - startY);
}
