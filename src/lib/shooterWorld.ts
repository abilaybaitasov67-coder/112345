import { ShooterWorld } from './shooterTypes';

export const SHOOTER_WIDTH = 960;
export const SHOOTER_HEIGHT = 560;
export const SHOOTER_WORLD_WIDTH = 1440;
export const SHOOTER_WORLD_HEIGHT = 840;

export const pvpSpawnPoints = [
  { x: 810, y: 765, angle: -Math.PI / 2 },
  { x: 750, y: 735, angle: -Math.PI / 2 },
  { x: 900, y: 735, angle: -Math.PI / 2 },
  { x: 660, y: 80, angle: Math.PI / 2 },
  { x: 740, y: 80, angle: Math.PI / 2 },
  { x: 820, y: 95, angle: Math.PI / 2 },
];

export function createShooterWorld(): ShooterWorld {
  return {
    player: { x: 810, y: 765, health: 100, cooldown: 0 },
    angle: -Math.PI / 2,
    pitch: 0,
    money: 1500,
    weapon: null,
    inventory: ['knife', 'pistol'],
    aiming: false,
    pvpMode: false,
    enemies: [
      { x: 190, y: 380, health: 60, cooldown: 700, weapon: 'rifle' },
      { x: 610, y: 220, health: 60, cooldown: 1000, weapon: 'smg' },
      { x: 1160, y: 230, health: 60, cooldown: 500, weapon: 'shotgun' },
      { x: 700, y: 92, health: 60, cooldown: 1200, weapon: 'sniper' },
    ],
    remotePlayers: [],
    bullets: [],
    droppedWeapons: [],
    bomb: { x: 0, y: 0, site: null, timer: 0, planted: false, exploded: false },
    covers: [
      { x: 0, y: 0, width: 460, height: 230 },
      { x: 520, y: 0, width: 120, height: 170 },
      { x: 930, y: 0, width: 510, height: 110 },
      { x: 0, y: 500, width: 150, height: 340 },
      { x: 250, y: 285, width: 130, height: 170 },
      { x: 430, y: 300, width: 140, height: 300 },
      { x: 650, y: 180, width: 150, height: 250 },
      { x: 950, y: 110, width: 100, height: 270 },
      { x: 1290, y: 110, width: 150, height: 400 },
      { x: 850, y: 440, width: 200, height: 100 },
      { x: 180, y: 610, width: 340, height: 100 },
      { x: 1120, y: 570, width: 320, height: 270 },
      { x: 600, y: 690, width: 100, height: 150 },
    ],
    aim: { x: 700, y: 200 },
    status: 'playing',
    message: 'Карта «Северная Елена»: контролируй mid и проходы к A и B.',
  };
}
