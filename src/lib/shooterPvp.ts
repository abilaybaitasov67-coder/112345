import { hasShooterLineOfSight } from './shooterCollision';
import { getShooterFloorHeight } from './shooterFloorHeight';
import {
  RemoteShooter,
  ShooterBomb,
  ShooterBullet,
  ShooterTeam,
  ShooterWorld,
} from './shooterTypes';
import { pvpTeamSpawns } from './shooterWorld';

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
  team?: ShooterTeam;
  health: number;
  weapon?: RemoteShooter['weapon'];
  bomb?: ShooterBomb;
}

export interface PvpDamageEvent {
  targetId: string;
  damage: number;
  attacker: string;
  attackerTeam?: ShooterTeam;
  headshot: boolean;
}

export function getPvpSpawn(playerId: string, team: ShooterTeam) {
  const hash = [...playerId].reduce((total, character) =>
    total + character.charCodeAt(0), 0);
  const spawns = pvpTeamSpawns[team];
  return spawns[hash % spawns.length];
}

export function placePvpPlayer(
  world: ShooterWorld,
  playerId: string,
  team: ShooterTeam,
) {
  const spawn = getPvpSpawn(playerId, team);
  world.player.x = spawn.x;
  world.player.y = spawn.y;
  world.player.health = 100;
  world.angle = spawn.angle;
  world.jumpHeight = 0;
  world.jumpVelocity = 0;
  world.team = team;
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

export function findVisiblePvpTarget(world: ShooterWorld, shot?: ShooterBullet) {
  if (!world.weapon) return undefined;
  const maxDistance = world.weapon === 'knife' ? 65 : 900;
  const shotAngle = shot ? Math.atan2(shot.dy, shot.dx) : world.angle;
  const verticalSlope = shot?.verticalSlope
    ?? (world.pitch + world.viewKick) / 430;
  const eyeHeight = shot?.height ?? 1.7 + world.jumpHeight
    + getShooterFloorHeight(world.player.x, world.player.y);
  return world.remotePlayers
    .map((player) => {
      const dx = player.x - world.player.x;
      const dy = player.y - world.player.y;
      const distance = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx) - shotAngle;
      const difference = Math.abs(Math.atan2(Math.sin(angle), Math.cos(angle)));
      const feet = (player.jumpHeight ?? 0)
        + getShooterFloorHeight(player.x, player.y);
      const hitHeight = eyeHeight + distance * .025 * verticalSlope - feet;
      return { player, distance, difference, hitHeight };
    })
    .filter(({ player, distance, difference, hitHeight }) => {
      const feet = (player.jumpHeight ?? 0)
        + getShooterFloorHeight(player.x, player.y);
      return (
        player.health > 0
        && player.team !== world.team
        && distance <= maxDistance
        && difference < Math.max(.04, 18 / distance)
        && hitHeight >= .15
        && hitHeight <= 1.95
        && hasShooterLineOfSight(
          world.player,
          player,
          world.covers,
          eyeHeight,
          feet + hitHeight,
        )
      );
    })
    .sort((a, b) => a.difference - b.difference)
    .map(({ player, hitHeight }) => ({
      player,
      headshot: world.weapon !== 'knife' && hitHeight >= 1.42,
    }))[0];
}
