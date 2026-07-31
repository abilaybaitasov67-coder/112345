import { ShooterWorld } from './shooterTypes';
import { getShooterStandingOffset } from './shooterFloorHeight';

const JUMP_SPEED = .0085;
const GRAVITY = .00002;

export function tryShooterJump(world: ShooterWorld) {
  const groundHeight = getShooterStandingOffset(
    world.player.x,
    world.player.y,
    world.covers,
  );
  if (world.status !== 'playing'
    || Math.abs(world.jumpHeight - groundHeight) > .001
    || world.jumpVelocity !== 0) return false;
  world.jumpVelocity = JUMP_SPEED;
  return true;
}

export function updateShooterJump(world: ShooterWorld, elapsed: number) {
  const groundHeight = getShooterStandingOffset(
    world.player.x,
    world.player.y,
    world.covers,
  );
  if (Math.abs(world.jumpHeight - groundHeight) <= .001
    && world.jumpVelocity <= 0) {
    world.jumpHeight = groundHeight;
    world.jumpVelocity = 0;
    return;
  }
  world.jumpVelocity -= GRAVITY * elapsed;
  world.jumpHeight += world.jumpVelocity * elapsed;
  if (world.jumpHeight > groundHeight) return;
  world.jumpHeight = groundHeight;
  world.jumpVelocity = 0;
}
