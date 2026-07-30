import { ShooterWorld } from './shooterTypes';

const JUMP_SPEED = .0085;
const GRAVITY = .00002;

export function tryShooterJump(world: ShooterWorld) {
  if (world.status !== 'playing'
    || world.jumpHeight > .001
    || world.jumpVelocity > 0) return false;
  world.jumpVelocity = JUMP_SPEED;
  return true;
}

export function updateShooterJump(world: ShooterWorld, elapsed: number) {
  if (world.jumpHeight <= 0 && world.jumpVelocity <= 0) return;
  world.jumpVelocity -= GRAVITY * elapsed;
  world.jumpHeight += world.jumpVelocity * elapsed;
  if (world.jumpHeight > 0) return;
  world.jumpHeight = 0;
  world.jumpVelocity = 0;
}
