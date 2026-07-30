import { ShooterWorld } from './shooterTypes';

export const SHOOTER_WIDTH = 960;
export const SHOOTER_HEIGHT = 560;
export const SHOOTER_WORLD_WIDTH = 1440;
export const SHOOTER_WORLD_HEIGHT = 840;

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
      { x: 412, y: 0, width: 82, height: 278 },
      { x: 412, y: 382, width: 82, height: 278 },
      { x: 600, y: 172, width: 82, height: 285 },
      { x: 758, y: 172, width: 82, height: 285 },
      { x: 600, y: 555, width: 240, height: 75 },
      { x: 1012, y: 112, width: 82, height: 352 },
      { x: 1012, y: 570, width: 82, height: 165 },
      { x: 1200, y: 338, width: 180, height: 82 },
    ],
    aim: { x: 700, y: 200 },
    status: 'playing',
    message: 'Обезвредь всех противников и доберись до эвакуации.',
  };
}
