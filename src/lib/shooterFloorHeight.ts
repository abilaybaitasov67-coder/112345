import { ShooterCover } from './shooterTypes';

export const SHOOTER_A_HEIGHT = .66;

const SHORT_STEP_COUNT = 5;
const LONG_STEP_COUNT = 6;

export function getShooterFloorHeight(x: number, y: number) {
  const onASite = x >= 1400 && x < 1800 && y >= 100 && y < 400;
  if (onASite) return SHOOTER_A_HEIGHT;

  const onUpperShort = x >= 1320 && x < 1480 && y >= 300 && y < 780;
  if (onUpperShort) return SHOOTER_A_HEIGHT;

  const onShortSteps = x >= 1120 && x < 1320 && y >= 620 && y < 780;
  if (onShortSteps) {
    const step = Math.floor((x - 1120) / 40) + 1;
    return SHOOTER_A_HEIGHT * step / SHORT_STEP_COUNT;
  }

  const onLongRamp = x >= 1600 && x < 1800 && y >= 400 && y < 640;
  if (onLongRamp) {
    const step = Math.ceil((640 - y) / 40);
    return SHOOTER_A_HEIGHT * step / LONG_STEP_COUNT;
  }

  return 0;
}

export function getShooterCoverTop(cover: ShooterCover) {
  const centerX = cover.x + cover.width / 2;
  const centerY = cover.y + cover.height / 2;
  return getShooterFloorHeight(centerX, centerY) + (cover.wallHeight ?? 0);
}

export function getShooterStandingOffset(
  x: number,
  y: number,
  covers: ShooterCover[],
) {
  const baseHeight = getShooterFloorHeight(x, y);
  return covers.reduce((height, cover) => {
    if (!cover.climbable
      || x < cover.x
      || x > cover.x + cover.width
      || y < cover.y
      || y > cover.y + cover.height) return height;
    return Math.max(height, getShooterCoverTop(cover) - baseHeight);
  }, 0);
}
