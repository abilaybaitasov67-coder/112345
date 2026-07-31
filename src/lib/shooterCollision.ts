import { ShooterCover, ShooterPoint } from './shooterTypes';
import {
  SHOOTER_WORLD_HEIGHT,
  SHOOTER_WORLD_WIDTH,
} from './shooterWorld';
import { getShooterCoverTop } from './shooterFloorHeight';

export const SHOOTER_UNIT_RADIUS = 15;

export function isShooterPointBlocked(
  point: ShooterPoint,
  covers: ShooterCover[],
  radius = SHOOTER_UNIT_RADIUS,
  feetHeight?: number,
) {
  if (
    point.x < radius
    || point.y < radius
    || point.x > SHOOTER_WORLD_WIDTH - radius
    || point.y > SHOOTER_WORLD_HEIGHT - radius
  ) return true;
  return covers.some((cover) => {
    const canStandAbove = cover.climbable
      && feetHeight !== undefined
      && feetHeight >= getShooterCoverTop(cover) - .08;
    return !canStandAbove
      && point.x + radius > cover.x
      && point.x - radius < cover.x + cover.width
      && point.y + radius > cover.y
      && point.y - radius < cover.y + cover.height;
  });
}

export function moveShooterPoint(
  point: ShooterPoint,
  dx: number,
  dy: number,
  covers: ShooterCover[],
  feetHeight?: number,
) {
  const startX = point.x;
  const startY = point.y;
  const nextX = { x: point.x + dx, y: point.y };
  if (!isShooterPointBlocked(
    nextX, covers, SHOOTER_UNIT_RADIUS, feetHeight,
  )) point.x = nextX.x;
  const nextY = { x: point.x, y: point.y + dy };
  if (!isShooterPointBlocked(
    nextY, covers, SHOOTER_UNIT_RADIUS, feetHeight,
  )) point.y = nextY.y;
  return Math.hypot(point.x - startX, point.y - startY);
}

function segmentHitsCover(
  from: ShooterPoint,
  to: ShooterPoint,
  cover: ShooterCover,
  fromHeight?: number,
  toHeight?: number,
) {
  const padding = SHOOTER_UNIT_RADIUS;
  const axes = [
    [from.x, to.x - from.x, cover.x - padding, cover.x + cover.width + padding],
    [from.y, to.y - from.y, cover.y - padding, cover.y + cover.height + padding],
  ];
  let near = 0;
  let far = 1;
  for (const [origin, delta, minimum, maximum] of axes) {
    if (Math.abs(delta) < .001) {
      if (origin < minimum || origin > maximum) return false;
      continue;
    }
    const first = (minimum - origin) / delta;
    const second = (maximum - origin) / delta;
    near = Math.max(near, Math.min(first, second));
    far = Math.min(far, Math.max(first, second));
    if (near > far) return false;
  }
  if (far <= .001 || near >= .999) return false;
  if (fromHeight === undefined || toHeight === undefined
    || cover.wallHeight === undefined) return true;
  const entryHeight = fromHeight + (toHeight - fromHeight) * Math.max(0, near);
  const exitHeight = fromHeight + (toHeight - fromHeight) * Math.min(1, far);
  return Math.min(entryHeight, exitHeight) <= cover.wallHeight + .04;
}

export function hasShooterLineOfSight(
  from: ShooterPoint,
  to: ShooterPoint,
  covers: ShooterCover[],
  fromHeight?: number,
  toHeight?: number,
) {
  return !covers.some((cover) =>
    segmentHitsCover(from, to, cover, fromHeight, toHeight));
}
