import { ShooterWorld } from './shooterTypes';
import {
  helenaBlocks,
  shooterBombSites,
  shooterTeamSpawns,
} from './shooterMapLayout';

export const SHOOTER_WIDTH = 960;
export const SHOOTER_HEIGHT = 560;
export const SHOOTER_WORLD_WIDTH = 1920;
export const SHOOTER_WORLD_HEIGHT = 1120;
export const shooterExitPoint = { x: 1660, y: 90 };

export const pvpSpawnPoints = [
  shooterTeamSpawns.terrorists,
  { x: 880, y: 1040, angle: -Math.PI / 2 },
  { x: 1040, y: 1040, angle: -Math.PI / 2 },
  shooterTeamSpawns.counter,
  { x: 880, y: 90, angle: Math.PI / 2 },
  { x: 1040, y: 90, angle: Math.PI / 2 },
];

export function createShooterWorld(): ShooterWorld {
  return {
    player: {
      x: shooterTeamSpawns.terrorists.x,
      y: shooterTeamSpawns.terrorists.y,
      health: 100,
      cooldown: 0,
    },
    angle: -Math.PI / 2,
    pitch: 0,
    money: 1500,
    weapon: null,
    inventory: ['knife', 'pistol'],
    aiming: false,
    pvpMode: false,
    enemies: [
      { ...shooterBombSites.B, health: 60, cooldown: 700, weapon: 'rifle' },
      { x: 960, y: 520, health: 60, cooldown: 1000, weapon: 'smg' },
      { ...shooterBombSites.A, health: 60, cooldown: 500, weapon: 'shotgun' },
      { x: 960, y: 130, health: 60, cooldown: 1200, weapon: 'sniper' },
    ],
    remotePlayers: [],
    bullets: [],
    droppedWeapons: [],
    bomb: { x: 0, y: 0, site: null, timer: 0, planted: false, exploded: false },
    covers: helenaBlocks,
    aim: { x: 700, y: 200 },
    status: 'playing',
    message: 'Большая «Северная Елена»: MID, LONG и верхний тоннель открыты.',
  };
}
