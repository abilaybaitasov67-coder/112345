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
  { x: 0, y: 0, width: 150, height: 450, kind: 'stone', wallHeight: 5.5 },
  { x: 150, y: 0, width: 450, height: 120, kind: 'building', wallHeight: 5.8 },
  { x: 600, y: 0, width: 220, height: 300, kind: 'building', wallHeight: 6.2 },
  { x: 1120, y: 0, width: 260, height: 300, kind: 'building', wallHeight: 6.2 },
  { x: 1700, y: 0, width: 220, height: 450, kind: 'stone', wallHeight: 5.8 },
  { x: 550, y: 410, width: 270, height: 690, kind: 'building', wallHeight: 6.4 },
  { x: 1120, y: 450, width: 260, height: 750, kind: 'building', wallHeight: 6.4 },
  { x: 0, y: 1200, width: 600, height: 400, kind: 'stone', wallHeight: 5.6 },
  { x: 1380, y: 1350, width: 540, height: 250, kind: 'stone', wallHeight: 5.6 },
  { x: 150, y: 450, width: 130, height: 150, kind: 'building', wallHeight: 4.8 },
  { x: 430, y: 450, width: 120, height: 150, kind: 'building', wallHeight: 4.8 },
  { x: 1480, y: 400, width: 130, height: 130, kind: 'stone', wallHeight: 4.6 },
  { x: 1700, y: 450, width: 220, height: 800, kind: 'building', wallHeight: 6 },
  { x: 250, y: 780, width: 180, height: 150, kind: 'cover', wallHeight: 1.6 },
  { x: 900, y: 820, width: 100, height: 80, kind: 'cover', wallHeight: 1.3 },
  { x: 900, y: 1380, width: 120, height: 80, kind: 'cover', wallHeight: 1.4 },
  { x: 360, y: 240, width: 100, height: 90, kind: 'cover', wallHeight: 1.5 },
  { x: 1450, y: 240, width: 100, height: 90, kind: 'cover', wallHeight: 1.5 },
  { x: 810, y: 472, width: 110, height: 16, kind: 'cover', wallHeight: 2.7 },
  { x: 1020, y: 472, width: 110, height: 16, kind: 'cover', wallHeight: 2.7 },
  { x: 276, y: 592, width: 54, height: 16, kind: 'cover', wallHeight: 2.7 },
  { x: 382, y: 592, width: 54, height: 16, kind: 'cover', wallHeight: 2.7 },
  { x: 1376, y: 1252, width: 111, height: 16, kind: 'cover', wallHeight: 2.7 },
  { x: 1593, y: 1252, width: 111, height: 16, kind: 'cover', wallHeight: 2.7 },
];
