import { ShooterWorld } from './shooterTypes';

export const SHOOTER_WIDTH = 960;
export const SHOOTER_HEIGHT = 560;
export const SHOOTER_WORLD_WIDTH = 1440;
export const SHOOTER_WORLD_HEIGHT = 840;

export const pvpSpawnPoints = [
  { x: 720, y: 765, angle: -Math.PI / 2 },
  { x: 150, y: 720, angle: -.45 },
  { x: 1290, y: 720, angle: -Math.PI + .45 },
  { x: 180, y: 150, angle: .45 },
  { x: 1260, y: 150, angle: Math.PI - .45 },
  { x: 720, y: 80, angle: Math.PI / 2 },
];

export function createShooterWorld(): ShooterWorld {
  return {
    player: { x: 720, y: 765, health: 100, cooldown: 0 },
    angle: -Math.PI / 2,
    pitch: 0,
    money: 1500,
    weapon: null,
    inventory: ['knife', 'pistol'],
    aiming: false,
    pvpMode: false,
    enemies: [
      { x: 202, y: 158, health: 60, cooldown: 700, weapon: 'rifle' },
      { x: 720, y: 112, health: 60, cooldown: 1000, weapon: 'smg' },
      { x: 1252, y: 158, health: 60, cooldown: 500, weapon: 'shotgun' },
      { x: 1290, y: 510, health: 60, cooldown: 1200, weapon: 'sniper' },
    ],
    remotePlayers: [],
    bullets: [],
    droppedWeapons: [],
    bomb: { x: 0, y: 0, site: null, timer: 0, planted: false, exploded: false },
    covers: [
      { x: 300, y: 80, width: 110, height: 300 },
      { x: 300, y: 500, width: 110, height: 220 },
      { x: 570, y: 100, width: 110, height: 220 },
      { x: 760, y: 100, width: 110, height: 220 },
      { x: 530, y: 500, width: 170, height: 70 },
      { x: 740, y: 500, width: 170, height: 70 },
      { x: 1030, y: 80, width: 110, height: 300 },
      { x: 1030, y: 500, width: 110, height: 220 },
      { x: 120, y: 330, width: 140, height: 60 },
      { x: 1180, y: 330, width: 140, height: 60 },
    ],
    aim: { x: 700, y: 200 },
    status: 'playing',
    message: 'Карта «Елена»: пройди через двор к точкам A и B.',
  };
}
