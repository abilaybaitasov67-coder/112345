import { ShooterCover, ShooterPoint } from './shooterTypes';

export interface ShooterMapBlock extends ShooterCover {
  wallHeight: number;
  kind: 'building' | 'stone' | 'cover';
}

export const shooterBombSites = {
  A: { x: 1580, y: 260 },
  B: { x: 300, y: 260 },
} satisfies Record<'A' | 'B', ShooterPoint>;

export const shooterTeamSpawns = {
  terrorists: { x: 960, y: 1500, angle: -Math.PI / 2 },
  counter: { x: 960, y: 360, angle: Math.PI / 2 },
};

export const shooterMapBlocks: ShooterMapBlock[] = [
  { x: 0, y: 0, width: 150, height: 410, kind: 'stone', wallHeight: 5.8 },
  { x: 150, y: 0, width: 450, height: 120, kind: 'building', wallHeight: 5.8 },
  { x: 600, y: 0, width: 220, height: 300, kind: 'building', wallHeight: 6.2 },
  { x: 820, y: 0, width: 300, height: 240, kind: 'stone', wallHeight: 5.8 },
  { x: 1120, y: 0, width: 280, height: 300, kind: 'building', wallHeight: 6.2 },
  { x: 1400, y: 0, width: 400, height: 100, kind: 'building', wallHeight: 5.6 },
  { x: 1800, y: 0, width: 120, height: 1440, kind: 'stone', wallHeight: 6 },
  { x: 0, y: 410, width: 180, height: 770, kind: 'stone', wallHeight: 5.6 },
  { x: 550, y: 410, width: 270, height: 410, kind: 'building', wallHeight: 6.4 },
  { x: 180, y: 820, width: 240, height: 140, kind: 'stone', wallHeight: 4.8 },
  { x: 650, y: 820, width: 170, height: 35, kind: 'stone', wallHeight: 4.8 },
  { x: 650, y: 925, width: 170, height: 35, kind: 'stone', wallHeight: 4.8 },
  { x: 780, y: 960, width: 40, height: 400, kind: 'stone', wallHeight: 4.4 },
  { x: 1120, y: 300, width: 200, height: 320, kind: 'building', wallHeight: 6.2 },
  { x: 1480, y: 400, width: 120, height: 380, kind: 'stone', wallHeight: 5.8 },
  { x: 1120, y: 780, width: 480, height: 340, kind: 'building', wallHeight: 6.4 },
  { x: 1120, y: 1120, width: 280, height: 160, kind: 'building', wallHeight: 5.8 },
  { x: 0, y: 1180, width: 600, height: 420, kind: 'stone', wallHeight: 5.6 },
  { x: 1400, y: 1440, width: 520, height: 160, kind: 'stone', wallHeight: 5.6 },
  { x: 900, y: 820, width: 100, height: 80, kind: 'cover', wallHeight: 1.3 },
  { x: 900, y: 1380, width: 120, height: 80, kind: 'cover', wallHeight: 1.4 },
  { x: 360, y: 240, width: 100, height: 90, kind: 'cover', wallHeight: 1.5 },
  { x: 1450, y: 240, width: 100, height: 90, kind: 'cover', wallHeight: 1.5 },
  { x: 180, y: 410, width: 140, height: 16, kind: 'cover', wallHeight: 2.7 },
  { x: 410, y: 410, width: 140, height: 16, kind: 'cover', wallHeight: 2.7 },
  { x: 690, y: 300, width: 16, height: 20, kind: 'cover', wallHeight: 2.7 },
  { x: 690, y: 390, width: 16, height: 20, kind: 'cover', wallHeight: 2.7 },
  { x: 820, y: 500, width: 110, height: 16, kind: 'cover', wallHeight: 2.7 },
  { x: 1010, y: 500, width: 110, height: 16, kind: 'cover', wallHeight: 2.7 },
  { x: 1400, y: 1280, width: 160, height: 16, kind: 'cover', wallHeight: 2.7 },
  { x: 1640, y: 1280, width: 160, height: 16, kind: 'cover', wallHeight: 2.7 },
];
