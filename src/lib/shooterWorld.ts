import { ShooterWorld } from './shooterTypes';

export const SHOOTER_WIDTH = 960;
export const SHOOTER_HEIGHT = 560;

export function createShooterWorld(): ShooterWorld {
  return {
    player: { x: 90, y: 470, health: 100, cooldown: 0 },
    angle: -0.55,
    pitch: 0,
    money: 1500,
    weapon: null,
    inventory: ['knife', 'pistol'],
    aiming: false,
    pvpMode: false,
    enemies: [
      { x: 845, y: 95, health: 60, cooldown: 700, weapon: 'rifle' },
      { x: 805, y: 265, health: 60, cooldown: 1000, weapon: 'smg' },
      { x: 590, y: 275, health: 60, cooldown: 500, weapon: 'shotgun' },
      { x: 760, y: 500, health: 60, cooldown: 1200, weapon: 'sniper' },
    ],
    remotePlayers: [],
    bullets: [],
    droppedWeapons: [],
    covers: [
      { x: 185, y: 70, width: 75, height: 190 },
      { x: 185, y: 335, width: 220, height: 60 },
      { x: 430, y: 115, width: 70, height: 185 },
      { x: 565, y: 335, width: 190, height: 60 },
      { x: 690, y: 65, width: 75, height: 160 },
      { x: 815, y: 370, width: 80, height: 115 },
    ],
    aim: { x: 700, y: 200 },
    status: 'playing',
    message: 'Обезвредь всех противников и доберись до эвакуации.',
  };
}
