import { ShooterWorld } from './shooterTypes';
import {
  shooterMapBlocks,
  shooterBombSites,
  shooterTeamSpawns,
} from './shooterMapLayout';

export const SHOOTER_WIDTH = 960;
export const SHOOTER_HEIGHT = 560;
export const SHOOTER_WORLD_WIDTH = 1920;
export const SHOOTER_WORLD_HEIGHT = 1600;
export const shooterExitPoint = { x: 1660, y: 160 };

export const pvpSpawnPoints = [
  shooterTeamSpawns.terrorists,
  shooterTeamSpawns.counter,
  { x: 880, y: 1500, angle: -Math.PI / 2 },
  { x: 880, y: 360, angle: Math.PI / 2 },
  { x: 1040, y: 1500, angle: -Math.PI / 2 },
  { x: 1040, y: 360, angle: Math.PI / 2 },
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
      { x: 960, y: 700, health: 60, cooldown: 1000, weapon: 'smg' },
      { ...shooterBombSites.A, health: 60, cooldown: 500, weapon: 'shotgun' },
      { x: 960, y: 380, health: 60, cooldown: 1200, weapon: 'sniper' },
    ],
    remotePlayers: [],
    bullets: [],
    droppedWeapons: [],
    bomb: {
      x: 0,
      y: 0,
      site: null,
      timer: 0,
      defuseTimer: 0,
      defuser: null,
      planted: false,
      exploded: false,
      defused: false,
    },
    covers: shooterMapBlocks,
    aim: { x: 700, y: 200 },
    status: 'playing',
    message: 'Карта «Пыльный рубеж»: тоннели, MID, LONG и точки A/B.',
  };
}
