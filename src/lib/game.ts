export type ItemId = 'notebook' | 'cookie' | 'key' | 'pass' | 'taser'
  | 'medicine' | 'crowbar' | 'sleepingPowder' | 'poison' | 'passwordNote';
export type HiddenItemId = 'notebook' | 'cookie' | 'key';
export type GameStatus = 'playing' | 'won' | 'lost' | 'poisonEnding';
export type GameLevel = 'school' | 'yard' | 'medblock' | 'staff' | 'warehouse';
export type Direction = 'up' | 'down' | 'left' | 'right';
export type CoffeeAdditive = 'poison' | 'sleeping';

export interface Point {
  x: number;
  y: number;
}

export interface Rectangle extends Point {
  width: number;
  height: number;
}

export interface Teacher extends Point {
  route: Point[];
  routeIndex: number;
  speed: number;
  chasing: boolean;
  stunnedFor: number;
  investigateTarget?: Point;
  playerInOuter?: boolean;
  chasePath?: Point[];
  pathRefresh?: number;
  color: string;
}

export interface RepairNpc extends Point {
  role: 'boss' | 'guard';
  target: Point;
  path: Point[];
  pathRefresh: number;
}

export interface GameWorld {
  level: GameLevel;
  player: Point;
  direction: Direction;
  teachers: Teacher[];
  doctors: Teacher[];
  bossGuards: Teacher[];
  warehouseGuards: Teacher[];
  items: ItemId[];
  itemPositions: Record<HiddenItemId, Point>;
  quest: number;
  alert: number;
  money: number;
  coinPositions: Point[];
  collectedCoins: number[];
  status: GameStatus;
  hiding: boolean;
  checkpointActive: boolean;
  gateUnlocked: boolean;
  showCodeLock: boolean;
  showPanel: boolean;
  panelDisabled: boolean;
  safeTime: number;
  soundEvent: number;
  repairPhase: 'approaching' | 'repairing' | 'returning' | null;
  repairTime: number;
  repairCrew: RepairNpc[];
  bossCoffeeTimer: number;
  bossDrinkTime: number;
  showCoffeeChoice: boolean;
  coffeeSpiked: CoffeeAdditive | null;
  bossEffect: CoffeeAdditive | null;
  bossEffectTime: number;
  gateCode: string;
  foundGateCode: boolean;
  showPocketGame: boolean;
  showShop: boolean;
  message: string;
}

export interface GameSnapshot {
  level: GameLevel;
  alert: number;
  items: ItemId[];
  quest: number;
  money: number;
  status: GameStatus;
  checkpointActive: boolean;
  gateUnlocked: boolean;
  showCodeLock: boolean;
  showPanel: boolean;
  panelDisabled: boolean;
  showCoffeeChoice: boolean;
  foundGateCode: string | null;
  showPocketGame: boolean;
  showShop: boolean;
  message: string;
}

export const WORLD_WIDTH = 960;
export const WORLD_HEIGHT = 600;
export const PLAYER_SIZE = 24;
export const BLOCK_SIZE = 32;
export const INNER_VISION_SIZE = BLOCK_SIZE * 3;
export const OUTER_VISION_SIZE = BLOCK_SIZE * 5;
export const lockerPosition: Point = { x: 780, y: 535 };
export const merchant = { x: 805, y: 375, name: 'Аишка', color: '#c880b7' };
export const checkpointPosition: Point = { x: 480, y: 420 };
export const medblockEntrance: Point = { x: 290, y: 510 };
export const medblockExit: Point = { x: 480, y: 550 };
export const officeEntrance: Point = { x: 480, y: 550 };
export const staffEntrance: Point = { x: 775, y: 510 };
export const staffExit: Point = { x: 480, y: 550 };
export const staffPanelPosition: Point = { x: 885, y: 420 };
export const bossCoffeePosition: Point = { x: 575, y: 380 };
export const directorPosition: Point = { x: 480, y: 270 };
export const warehouseEntrance: Point = { x: 290, y: 270 };
export const warehouseExit: Point = { x: 480, y: 550 };
export const sleepingBoxPosition: Point = { x: 170, y: 205 };
export const poisonBoxPosition: Point = { x: 790, y: 205 };
export const TASER_PRICE = 3;

export const itemInfo: Record<ItemId, { name: string; icon: string }> = {
  notebook: { name: 'Медкарта Алины', icon: '📋' },
  cookie: { name: 'Кофе', icon: '☕' },
  key: { name: 'Ключ', icon: '🔑' },
  pass: { name: 'Пропуск', icon: '🎫' },
  taser: { name: 'Электрошокер', icon: '⚡' },
  medicine: { name: 'Лекарство', icon: '💊' },
  crowbar: { name: 'Лом', icon: '🛠️' },
  sleepingPowder: { name: 'Снотворное', icon: '💤' },
  poison: { name: 'Яд', icon: '☠️' },
  passwordNote: { name: 'Записка с кодом', icon: '📄' },
};
export const medicinePosition: Point = { x: 830, y: 500 };
export const crowbarBoxPosition: Point = { x: 610, y: 125 };
export const patients = [
  { x: 130, y: 115, name: 'Пациент 1', color: '#8a9da8' },
  { x: 130, y: 290, name: 'Пациент 2', color: '#9a8fa5' },
  { x: 130, y: 485, name: 'Пациент 3', color: '#879c8d' },
  { x: 830, y: 115, name: 'Пациент 4', color: '#a49582' },
  { x: 830, y: 290, name: 'Пациент 5', color: '#829aa0' },
  { x: 830, y: 455, name: 'Пациент 6', color: '#9b8989' },
];

const spawnPoints: Point[] = [
  { x: 94, y: 98 }, { x: 100, y: 220 }, { x: 250, y: 125 },
  { x: 700, y: 98 }, { x: 840, y: 98 }, { x: 880, y: 175 },
  { x: 55, y: 540 }, { x: 160, y: 540 }, { x: 280, y: 450 },
  { x: 400, y: 100 }, { x: 535, y: 205 }, { x: 355, y: 370 },
  { x: 420, y: 530 }, { x: 900, y: 285 }, { x: 550, y: 530 },
];

export const walls: Rectangle[] = [
  { x: 0, y: 0, width: 960, height: 18 },
  { x: 0, y: 582, width: 960, height: 18 },
  { x: 0, y: 0, width: 18, height: 600 },
  { x: 942, y: 0, width: 18, height: 505 },
  { x: 942, y: 565, width: 18, height: 35 },
  { x: 310, y: 18, width: 12, height: 90 },
  { x: 310, y: 166, width: 12, height: 268 },
  { x: 310, y: 492, width: 12, height: 90 },
  { x: 638, y: 18, width: 12, height: 90 },
  { x: 638, y: 166, width: 12, height: 268 },
  { x: 638, y: 492, width: 12, height: 90 },
  { x: 18, y: 250, width: 118, height: 12 },
  { x: 194, y: 250, width: 116, height: 12 },
  { x: 18, y: 338, width: 118, height: 12 },
  { x: 194, y: 338, width: 116, height: 12 },
  { x: 650, y: 250, width: 118, height: 12 },
  { x: 826, y: 250, width: 116, height: 12 },
  { x: 650, y: 338, width: 118, height: 12 },
  { x: 826, y: 338, width: 116, height: 12 },
  { x: 55, y: 150, width: 82, height: 24 },
  { x: 190, y: 80, width: 82, height: 24 },
  { x: 684, y: 205, width: 210, height: 22 },
  { x: 70, y: 395, width: 74, height: 28 },
  { x: 187, y: 480, width: 74, height: 28 },
  { x: 690, y: 390, width: 70, height: 70 },
  { x: 820, y: 430, width: 70, height: 70 },
];

export const yardWalls: Rectangle[] = [
  { x: 0, y: 0, width: 960, height: 18 },
  { x: 0, y: 582, width: 960, height: 18 },
  { x: 0, y: 0, width: 18, height: 600 },
  { x: 942, y: 0, width: 18, height: 600 },
  { x: 18, y: 165, width: 405, height: 14 },
  { x: 537, y: 165, width: 405, height: 14 },
  { x: 310, y: 290, width: 62, height: 62 },
  { x: 780, y: 350, width: 72, height: 72 },
  { x: 18, y: 350, width: 255, height: 232 },
  { x: 792, y: 430, width: 150, height: 152 },
  { x: 18, y: 210, width: 255, height: 120 },
];
export const lockedGate: Rectangle = { x: 423, y: 165, width: 114, height: 14 };
export const medblockWalls: Rectangle[] = [
  { x: 0, y: 0, width: 960, height: 18 },
  { x: 0, y: 582, width: 960, height: 18 },
  { x: 0, y: 0, width: 18, height: 600 },
  { x: 942, y: 0, width: 18, height: 600 },
  { x: 270, y: 18, width: 14, height: 60 },
  { x: 270, y: 138, width: 14, height: 120 },
  { x: 270, y: 318, width: 14, height: 122 },
  { x: 270, y: 500, width: 14, height: 82 },
  { x: 676, y: 18, width: 14, height: 60 },
  { x: 676, y: 138, width: 14, height: 120 },
  { x: 676, y: 318, width: 14, height: 122 },
  { x: 676, y: 500, width: 14, height: 82 },
  { x: 18, y: 195, width: 252, height: 12 },
  { x: 18, y: 385, width: 252, height: 12 },
  { x: 690, y: 195, width: 252, height: 12 },
  { x: 690, y: 385, width: 252, height: 12 },
];
export const staffWalls: Rectangle[] = [
  { x: 0, y: 0, width: 960, height: 18 },
  { x: 0, y: 582, width: 960, height: 18 },
  { x: 0, y: 0, width: 18, height: 600 },
  { x: 942, y: 0, width: 18, height: 600 },
  { x: 85, y: 100, width: 180, height: 70 },
  { x: 695, y: 100, width: 180, height: 70 },
  { x: 320, y: 300, width: 320, height: 100 },
];
export const warehouseWalls: Rectangle[] = [
  { x: 0, y: 0, width: 960, height: 18 },
  { x: 0, y: 582, width: 960, height: 18 },
  { x: 0, y: 0, width: 18, height: 600 },
  { x: 942, y: 0, width: 18, height: 600 },
  { x: 80, y: 90, width: 240, height: 85 },
  { x: 640, y: 90, width: 240, height: 85 },
  { x: 355, y: 300, width: 250, height: 70 },
];

export const students = [
  { x: 240, y: 195, name: 'Алина', color: '#f0a06b' },
  { x: 225, y: 445, name: 'Тимур', color: '#62a7d5' },
];

export const questText = [
  'Поговори с Алиной в кабинете 204',
  'Найди медкарту Алины в офисе',
  'Верни медкарту Алине',
  'Найди кофе в медицинском центре',
  'Отнеси кофе Тимуру',
  'Найди ключ где-нибудь в офисе',
  'Иди к зелёному выходу',
  'Активируй чекпоинт во дворе',
  'Открой ворота с кодовым замком',
  'Найди вход в медблок',
  'Осмотри медблок',
];

const patrolTrips: Point[][] = [
  [
    { x: 370, y: 290 }, { x: 370, y: 137 }, { x: 280, y: 137 },
    { x: 250, y: 210 }, { x: 160, y: 210 }, { x: 280, y: 137 },
    { x: 370, y: 137 }, { x: 485, y: 290 },
  ],
  [
    { x: 590, y: 290 }, { x: 590, y: 137 }, { x: 700, y: 137 },
    { x: 780, y: 175 }, { x: 880, y: 175 }, { x: 700, y: 137 },
    { x: 590, y: 137 }, { x: 485, y: 290 },
  ],
  [
    { x: 370, y: 290 }, { x: 370, y: 463 }, { x: 280, y: 463 },
    { x: 280, y: 540 }, { x: 160, y: 540 }, { x: 280, y: 463 },
    { x: 370, y: 463 }, { x: 485, y: 290 },
  ],
  [
    { x: 590, y: 290 }, { x: 590, y: 480 }, { x: 700, y: 480 },
    { x: 780, y: 540 }, { x: 910, y: 540 }, { x: 700, y: 480 },
    { x: 590, y: 480 }, { x: 485, y: 290 },
  ],
];

function shuffled<T>(values: T[]) {
  return [...values].sort(() => Math.random() - 0.5);
}

export function createSchoolRoute() {
  return [{ x: 485, y: 290 }, ...shuffled(patrolTrips).flat()];
}

const doctorTrips: Point[][] = [
  [{ x: 420, y: 108 }, { x: 300, y: 108 }, { x: 230, y: 108 }, { x: 300, y: 108 }, { x: 480, y: 290 }],
  [{ x: 540, y: 108 }, { x: 660, y: 108 }, { x: 730, y: 108 }, { x: 660, y: 108 }, { x: 480, y: 290 }],
  [{ x: 420, y: 288 }, { x: 300, y: 288 }, { x: 230, y: 288 }, { x: 300, y: 288 }, { x: 480, y: 290 }],
  [{ x: 540, y: 288 }, { x: 660, y: 288 }, { x: 730, y: 288 }, { x: 660, y: 288 }, { x: 480, y: 290 }],
  [{ x: 420, y: 470 }, { x: 300, y: 470 }, { x: 230, y: 470 }, { x: 300, y: 470 }, { x: 480, y: 290 }],
  [{ x: 540, y: 470 }, { x: 660, y: 470 }, { x: 730, y: 470 }, { x: 660, y: 470 }, { x: 480, y: 290 }],
];

export function createDoctorRoute() {
  return [{ x: 480, y: 290 }, ...shuffled(doctorTrips).flat()];
}

const bossRoute: Point[] = [
  { x: 280, y: 245 }, { x: 280, y: 455 }, { x: 480, y: 475 },
  { x: 680, y: 455 }, { x: 680, y: 245 }, { x: 480, y: 210 },
];

export function createBossGuards(): Teacher[] {
  return [
    { x: 280, y: 245, route: bossRoute, routeIndex: 1, speed: 0.075, chasing: false, stunnedFor: 0, color: '#333b3f' },
    { x: 680, y: 245, route: [...bossRoute].reverse(), routeIndex: 1, speed: 0.07, chasing: false, stunnedFor: 0, color: '#3f3838' },
    { x: 480, y: 475, route: bossRoute, routeIndex: 4, speed: 0.068, chasing: false, stunnedFor: 0, color: '#303a35' },
  ];
}

const warehouseRoute: Point[] = [
  { x: 350, y: 220 }, { x: 160, y: 220 }, { x: 350, y: 220 },
  { x: 480, y: 250 }, { x: 610, y: 220 }, { x: 800, y: 220 },
  { x: 610, y: 220 }, { x: 650, y: 450 }, { x: 480, y: 480 },
  { x: 310, y: 450 }, { x: 350, y: 220 },
];

export function createWarehouseGuards(): Teacher[] {
  return [{
    x: 480, y: 250, route: warehouseRoute, routeIndex: 1,
    speed: 0.072, chasing: false, stunnedFor: 0, color: '#343c38',
  }];
}

export function createRepairCrew(): RepairNpc[] {
  const starts = [
    { x: 755, y: 485 }, { x: 755, y: 510 },
    { x: 755, y: 535 }, { x: 730, y: 510 },
  ];
  const targets = [
    { x: 865, y: 370 }, { x: 880, y: 395 },
    { x: 905, y: 395 }, { x: 925, y: 385 },
  ];
  return starts.map((start, index) => ({
    ...start,
    role: index === 0 ? 'boss' : 'guard',
    target: targets[index],
    path: [],
    pathRefresh: 0,
  }));
}

function randomSpawns() {
  const positions = shuffled(spawnPoints);
  return {
    itemPositions: {
      notebook: positions[0], cookie: positions[1], key: positions[2],
    },
    coinPositions: positions.slice(3, 8),
  };
}

export function createWorld(): GameWorld {
  const randomPositions = randomSpawns();
  const gateCode = String(Math.floor(100 + Math.random() * 900));
  return {
    level: 'school',
    player: { x: 470, y: 510 }, direction: 'up',
    teachers: [
      { x: 450, y: 290, route: createSchoolRoute(), routeIndex: 1, speed: 0.075, chasing: false, stunnedFor: 0, color: '#934f4f' },
      { x: 520, y: 290, route: createSchoolRoute(), routeIndex: 1, speed: 0.065, chasing: false, stunnedFor: 0, color: '#67528f' },
    ],
    doctors: [
      { x: 420, y: 290, route: createDoctorRoute(), routeIndex: 1, speed: 0.07, chasing: false, stunnedFor: 0, color: '#e8ece9' },
      { x: 480, y: 230, route: createDoctorRoute(), routeIndex: 6, speed: 0.065, chasing: false, stunnedFor: 0, color: '#d7e7df' },
      { x: 540, y: 290, route: createDoctorRoute(), routeIndex: 11, speed: 0.072, chasing: false, stunnedFor: 0, color: '#e5e1d6' },
    ],
    bossGuards: [],
    warehouseGuards: createWarehouseGuards(),
    items: [], itemPositions: randomPositions.itemPositions,
    quest: 0, alert: 8, money: 0,
    coinPositions: randomPositions.coinPositions, collectedCoins: [],
    status: 'playing', hiding: false, checkpointActive: false,
    gateUnlocked: false, showCodeLock: false, showPanel: false,
    panelDisabled: false, safeTime: 0, soundEvent: 0,
    repairPhase: null, repairTime: 0, repairCrew: [],
    bossCoffeeTimer: 34000, bossDrinkTime: 0,
    showCoffeeChoice: false, coffeeSpiked: null,
    bossEffect: null, bossEffectTime: 0,
    gateCode, foundGateCode: false, showPocketGame: false,
    showShop: false,
    message: 'Найди сотрудников со знаком «!». Они помогут выбраться из медицинского офиса.',
  };
}

export function snapshot(world: GameWorld): GameSnapshot {
  return {
    level: world.level, alert: Math.round(world.alert), items: [...world.items], money: world.money,
    quest: world.quest, status: world.status, checkpointActive: world.checkpointActive,
    gateUnlocked: world.gateUnlocked, showCodeLock: world.showCodeLock,
    showPanel: world.showPanel, panelDisabled: world.panelDisabled,
    showCoffeeChoice: world.showCoffeeChoice,
    foundGateCode: world.foundGateCode ? world.gateCode : null,
    showPocketGame: world.showPocketGame, showShop: world.showShop, message: world.message,
  };
}
