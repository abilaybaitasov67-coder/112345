import { SHOOTER_UNIT_RADIUS, isShooterPointBlocked, moveShooterPoint } from './shooterCollision';
import { ShooterCover, ShooterPoint, ShooterUnit } from './shooterTypes';
import { SHOOTER_WORLD_HEIGHT, SHOOTER_WORLD_WIDTH } from './shooterWorld';

const CELL_SIZE = 30;
const WAYPOINT_DISTANCE = 8;
const ENEMY_SPEED = .085;
const REPLAN_DELAY = 500;
const NAVIGATION_RADIUS = SHOOTER_UNIT_RADIUS + 3;

interface NavigationGrid {
  columns: number;
  rows: number;
  open: Uint8Array;
}

interface EnemyRoute {
  targetKey: string;
  points: ShooterPoint[];
  index: number;
  stuckFor: number;
}

const gridCache = new WeakMap<ShooterCover[], NavigationGrid>();
const enemyRoutes = new WeakMap<ShooterUnit, EnemyRoute>();

function targetRouteKey(target: ShooterPoint) {
  return `${Math.round(target.x / CELL_SIZE)}:${Math.round(target.y / CELL_SIZE)}`;
}

function cellPoint(index: number, grid: NavigationGrid): ShooterPoint {
  return {
    x: SHOOTER_UNIT_RADIUS + index % grid.columns * CELL_SIZE,
    y: SHOOTER_UNIT_RADIUS + Math.floor(index / grid.columns) * CELL_SIZE,
  };
}

function getGrid(covers: ShooterCover[]) {
  const cached = gridCache.get(covers);
  if (cached) return cached;
  const diameter = SHOOTER_UNIT_RADIUS * 2;
  const columns = Math.floor((SHOOTER_WORLD_WIDTH - diameter) / CELL_SIZE) + 1;
  const rows = Math.floor((SHOOTER_WORLD_HEIGHT - diameter) / CELL_SIZE) + 1;
  const grid = { columns, rows, open: new Uint8Array(columns * rows) };
  grid.open.forEach((_, index) => {
    grid.open[index] = isShooterPointBlocked(
      cellPoint(index, grid),
      covers,
      NAVIGATION_RADIUS,
    ) ? 0 : 1;
  });
  gridCache.set(covers, grid);
  return grid;
}

function closestOpenCell(point: ShooterPoint, grid: NavigationGrid) {
  let bestIndex = -1;
  let bestDistance = Number.POSITIVE_INFINITY;
  grid.open.forEach((open, index) => {
    if (!open) return;
    const cell = cellPoint(index, grid);
    const distance = (cell.x - point.x) ** 2 + (cell.y - point.y) ** 2;
    if (distance < bestDistance) {
      bestIndex = index;
      bestDistance = distance;
    }
  });
  return bestIndex;
}

function compactPath(points: ShooterPoint[]) {
  if (points.length < 3) return points;
  return points.filter((point, index) => {
    if (index === 0 || index === points.length - 1) return true;
    const previous = points[index - 1];
    const next = points[index + 1];
    return Math.sign(point.x - previous.x) !== Math.sign(next.x - point.x)
      || Math.sign(point.y - previous.y) !== Math.sign(next.y - point.y);
  });
}

export function findShooterPath(start: ShooterPoint, target: ShooterPoint, covers: ShooterCover[]) {
  const grid = getGrid(covers);
  const startCell = closestOpenCell(start, grid);
  const targetCell = closestOpenCell(target, grid);
  if (startCell < 0 || targetCell < 0) return [];
  const parents = new Int32Array(grid.open.length);
  parents.fill(-2);
  parents[startCell] = -1;
  const queue = new Int32Array(grid.open.length);
  let head = 0;
  let tail = 0;
  queue[tail++] = startCell;
  while (head < tail && parents[targetCell] === -2) {
    const current = queue[head++];
    const column = current % grid.columns;
    const row = Math.floor(current / grid.columns);
    const neighbors = [
      column > 0 ? current - 1 : -1,
      column + 1 < grid.columns ? current + 1 : -1,
      row > 0 ? current - grid.columns : -1,
      row + 1 < grid.rows ? current + grid.columns : -1,
    ];
    neighbors.forEach((next) => {
      if (next < 0 || !grid.open[next] || parents[next] !== -2) return;
      parents[next] = current;
      queue[tail++] = next;
    });
  }
  if (parents[targetCell] === -2) return [];
  const cells: number[] = [];
  for (let cell = targetCell; cell >= 0; cell = parents[cell]) cells.push(cell);
  const points = compactPath(cells.reverse().map((cell) => cellPoint(cell, grid)));
  points.push({ ...target });
  return points;
}

function createRoute(enemy: ShooterUnit, target: ShooterPoint, covers: ShooterCover[]) {
  return {
    targetKey: targetRouteKey(target),
    points: findShooterPath(enemy, target, covers),
    index: 0,
    stuckFor: 0,
  };
}

export function moveEnemyWithNavigation(
  enemy: ShooterUnit, target: ShooterPoint, covers: ShooterCover[], elapsed: number,
) {
  if (Math.hypot(target.x - enemy.x, target.y - enemy.y) < 48) return;
  const targetKey = targetRouteKey(target);
  let route = enemyRoutes.get(enemy);
  if (!route || route.targetKey !== targetKey || route.stuckFor >= REPLAN_DELAY) {
    route = createRoute(enemy, target, covers);
    enemyRoutes.set(enemy, route);
  }
  while (route.index < route.points.length) {
    const point = route.points[route.index];
    if (Math.hypot(point.x - enemy.x, point.y - enemy.y) > WAYPOINT_DISTANCE) break;
    route.index += 1;
  }
  const waypoint = route.points[route.index] ?? target;
  const dx = waypoint.x - enemy.x;
  const dy = waypoint.y - enemy.y;
  const distance = Math.max(1, Math.hypot(dx, dy));
  const step = Math.min(distance, elapsed * ENEMY_SPEED);
  const moved = moveShooterPoint(enemy, dx / distance * step, dy / distance * step, covers);
  route.stuckFor = moved < .02 ? route.stuckFor + elapsed : 0;
}
