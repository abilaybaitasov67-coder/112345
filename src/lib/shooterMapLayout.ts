import { ShooterCover, ShooterPoint } from './shooterTypes';

export interface ShooterMapBlock extends ShooterCover {
  wallHeight: number;
  kind: 'building' | 'stone' | 'cover';
}

export const shooterBombSites = {
  A: { x: 1570, y: 280 },
  B: { x: 220, y: 500 },
} satisfies Record<'A' | 'B', ShooterPoint>;

export const shooterTeamSpawns = {
  terrorists: { x: 960, y: 1040, angle: -Math.PI / 2 },
  counter: { x: 960, y: 90, angle: Math.PI / 2 },
};

export const helenaBlocks: ShooterMapBlock[] = [
  { x: 0, y: 0, width: 590, height: 240, kind: 'building', wallHeight: 5.8 },
  { x: 310, y: 350, width: 320, height: 290, kind: 'stone', wallHeight: 6 },
  { x: 330, y: 760, width: 330, height: 220, kind: 'building', wallHeight: 5 },
  { x: 590, y: 0, width: 240, height: 200, kind: 'stone', wallHeight: 5.4 },
  { x: 1130, y: 0, width: 250, height: 200, kind: 'building', wallHeight: 5.4 },
  { x: 1190, y: 350, width: 180, height: 170, kind: 'building', wallHeight: 5.8 },
  { x: 1190, y: 680, width: 180, height: 80, kind: 'stone', wallHeight: 4.5 },
  { x: 660, y: 790, width: 230, height: 160, kind: 'building', wallHeight: 5.2 },
  { x: 1130, y: 760, width: 260, height: 220, kind: 'building', wallHeight: 6 },
  { x: 1390, y: 410, width: 100, height: 130, kind: 'stone', wallHeight: 5 },
  { x: 1390, y: 660, width: 100, height: 160, kind: 'stone', wallHeight: 5 },
  { x: 1760, y: 390, width: 160, height: 470, kind: 'building', wallHeight: 5.8 },
  { x: 1740, y: 0, width: 180, height: 210, kind: 'building', wallHeight: 6.4 },
  { x: 1620, y: 280, width: 100, height: 80, kind: 'cover', wallHeight: 1.5 },
  { x: 810, y: 430, width: 100, height: 80, kind: 'cover', wallHeight: 1.3 },
  { x: 1010, y: 590, width: 100, height: 80, kind: 'cover', wallHeight: 1.3 },
  { x: 50, y: 560, width: 100, height: 80, kind: 'cover', wallHeight: 1.5 },
];
