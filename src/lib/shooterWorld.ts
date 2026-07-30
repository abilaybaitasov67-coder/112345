import { ShooterWorld } from './shooterTypes';

export const SHOOTER_WIDTH = 960;
export const SHOOTER_HEIGHT = 560;

export function createShooterWorld(): ShooterWorld {
  return {
    player: { x: 480, y: 510, health: 100, cooldown: 0 },
    angle: -Math.PI / 2,
    pitch: 0,
    money: 1500,
    weapon: null,
    inventory: ['knife', 'pistol'],
    aiming: false,
    pvpMode: false,
    enemies: [
      { x: 135, y: 105, health: 60, cooldown: 700, weapon: 'rifle' },
      { x: 480, y: 75, health: 60, cooldown: 1000, weapon: 'smg' },
      { x: 835, y: 105, health: 60, cooldown: 500, weapon: 'shotgun' },
      { x: 860, y: 340, health: 60, cooldown: 1200, weapon: 'sniper' },
    ],
    remotePlayers: [],
    bullets: [],
    droppedWeapons: [],
    bomb: { x: 0, y: 0, site: null, timer: 0, planted: false, exploded: false },
    covers: [
      { x: 275, y: 0, width: 55, height: 185 },
      { x: 275, y: 255, width: 55, height: 185 },
      { x: 400, y: 115, width: 55, height: 190 },
      { x: 505, y: 115, width: 55, height: 190 },
      { x: 400, y: 370, width: 160, height: 50 },
      { x: 675, y: 75, width: 55, height: 235 },
      { x: 675, y: 380, width: 55, height: 110 },
      { x: 800, y: 225, width: 120, height: 55 },
    ],
    aim: { x: 700, y: 200 },
    status: 'playing',
    message: 'Обезвредь всех противников и доберись до эвакуации.',
  };
}
