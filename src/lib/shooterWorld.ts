import { ShooterWorld } from './shooterTypes';

export const SHOOTER_WIDTH = 960;
export const SHOOTER_HEIGHT = 560;
export const SHOOTER_WORLD_WIDTH = 1920;
export const SHOOTER_WORLD_HEIGHT = 1120;
export const shooterExitPoint = { x: SHOOTER_WORLD_WIDTH - 68, y: 68 };

export const pvpSpawnPoints = [
  { x: 1080, y: 1020, angle: -Math.PI / 2 },
  { x: 1000, y: 980, angle: -Math.PI / 2 },
  { x: 1200, y: 980, angle: -Math.PI / 2 },
  { x: 880, y: 105, angle: Math.PI / 2 },
  { x: 985, y: 105, angle: Math.PI / 2 },
  { x: 1090, y: 125, angle: Math.PI / 2 },
];

export function createShooterWorld(): ShooterWorld {
  return {
    player: { x: 1080, y: 1020, health: 100, cooldown: 0 },
    angle: -Math.PI / 2,
    pitch: 0,
    money: 1500,
    weapon: null,
    inventory: ['knife', 'pistol'],
    aiming: false,
    pvpMode: false,
    enemies: [
      { x: 253, y: 507, health: 60, cooldown: 700, weapon: 'rifle' },
      { x: 813, y: 293, health: 60, cooldown: 1000, weapon: 'smg' },
      { x: 1547, y: 307, health: 60, cooldown: 500, weapon: 'shotgun' },
      { x: 935, y: 123, health: 60, cooldown: 1200, weapon: 'sniper' },
    ],
    remotePlayers: [],
    bullets: [],
    droppedWeapons: [],
    bomb: { x: 0, y: 0, site: null, timer: 0, planted: false, exploded: false },
    covers: [
      { x: 0, y: 0, width: 613, height: 307 },
      { x: 693, y: 0, width: 160, height: 190 },
      { x: 1240, y: 0, width: 680, height: 147 },
      { x: 0, y: 667, width: 200, height: 453 },
      { x: 333, y: 380, width: 173, height: 227 },
      { x: 573, y: 400, width: 187, height: 400 },
      { x: 867, y: 240, width: 200, height: 333 },
      { x: 1267, y: 147, width: 133, height: 360 },
      { x: 1720, y: 147, width: 200, height: 533 },
      { x: 1133, y: 587, width: 267, height: 133 },
      { x: 240, y: 860, width: 453, height: 133 },
      { x: 1493, y: 760, width: 427, height: 360 },
      { x: 800, y: 920, width: 133, height: 200 },
    ],
    aim: { x: 700, y: 200 },
    status: 'playing',
    message: 'Большая «Северная Елена»: MID, LONG и верхний тоннель открыты.',
  };
}
