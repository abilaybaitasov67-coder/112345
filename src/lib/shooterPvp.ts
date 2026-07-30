import { hasShooterLineOfSight } from './shooterCollision';
import { getShooterFloorHeight } from './shooterFloorHeight';
import { RemoteShooter, ShooterBomb, ShooterWorld } from './shooterTypes';
import { pvpSpawnPoints } from './shooterWorld';

function createPlayerId() {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  const random = Math.random().toString(36).slice(2);
  return `${Date.now().toString(36)}-${random}`;
}

export const pvpPlayerId = createPlayerId();
export const pvpPlayerName = `Игрок ${pvpPlayerId.slice(0, 4).toUpperCase()}`;
export const PVP_SPAWN_PROTECTION_MS = 8000;

export interface PvpPlayerState {
  id: string;
  name: string;
  x: number;
  y: number;
  angle: number;
  jumpHeight: number;
  health: number;
  weapon?: RemoteShooter['weapon'];
  bomb?: ShooterBomb;
}

export interface PvpDamageEvent {
  targetId: string;
  damage: number;
  attacker: string;
}

export function getPvpSpawn(playerId: string) {
  const hash = [...playerId].reduce((total, character) =>
    total + character.charCodeAt(0), 0);
  return pvpSpawnPoints[hash % pvpSpawnPoints.length];
}

export function placePvpPlayer(world: ShooterWorld, spawnIndex: number) {
  const spawn = pvpSpawnPoints[spawnIndex % pvpSpawnPoints.length];
  world.player.x = spawn.x;
  world.player.y = spawn.y;
  world.player.health = 100;
  world.angle = spawn.angle;
  world.jumpHeight = 0;
  world.jumpVelocity = 0;
  world.status = 'playing';
  world.message = 'Защита спавна действует 8 секунд.';
}

export function syncPvpBomb(world: ShooterWorld, incoming?: ShooterBomb) {
  if (!incoming || incoming.updatedAt <= world.bomb.updatedAt) return;
  world.bomb = {
    ...incoming,
    defuser: incoming.defuser === 'player' ? 'remote' : incoming.defuser,
  };
  if (incoming.defused) {
    world.status = 'lost';
    world.message = 'Другой игрок обезвредил бомбу.';
  } else if (incoming.planted) {
    world.status = 'playing';
    world.message = `Другой игрок установил бомбу на точке ${incoming.site}.`;
  }
}

export function findVisiblePvpTarget(world: ShooterWorld) {
  if (!world.weapon) return undefined;
  const maxDistance = world.weapon === 'knife' ? 65 : 900;
  return world.remotePlayers
    .map((player) => {
      const dx = player.x - world.player.x;
      const dy = player.y - world.player.y;
      const distance = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx) - world.angle;
      const difference = Math.abs(Math.atan2(Math.sin(angle), Math.cos(angle)));
      return { player, distance, difference };
    })
    .filter(({ player, distance, difference }) =>
      player.health > 0
      && distance <= maxDistance
      && difference < Math.max(.04, 18 / distance)
      && hasShooterLineOfSight(
        world.player,
        player,
        world.covers,
        1.7 + world.jumpHeight + getShooterFloorHeight(world.player.x, world.player.y),
        1.7 + (player.jumpHeight ?? 0) + getShooterFloorHeight(player.x, player.y),
      ))
    .sort((a, b) => a.difference - b.difference)[0]?.player;
}
