import { PLAYER_SIZE, Point, Rectangle, WORLD_HEIGHT, WORLD_WIDTH } from './game';

interface Cell {
  column: number;
  row: number;
}

const PATH_CELL_SIZE = 16;
const columns = Math.floor(WORLD_WIDTH / PATH_CELL_SIZE);
const rows = Math.floor(WORLD_HEIGHT / PATH_CELL_SIZE);

function key(cell: Cell) {
  return `${cell.column}:${cell.row}`;
}

function toPoint(cell: Cell): Point {
  return {
    x: cell.column * PATH_CELL_SIZE + PATH_CELL_SIZE / 2,
    y: cell.row * PATH_CELL_SIZE + PATH_CELL_SIZE / 2,
  };
}

function isBlocked(cell: Cell, obstacles: Rectangle[]) {
  const point = toPoint(cell);
  const radius = PLAYER_SIZE / 2;
  return obstacles.some((wall) =>
    point.x + radius > wall.x && point.x - radius < wall.x + wall.width
    && point.y + radius > wall.y && point.y - radius < wall.y + wall.height);
}

function nearestCell(point: Point, obstacles: Rectangle[]) {
  let nearest: Cell = { column: 1, row: 1 };
  let nearestDistance = Number.POSITIVE_INFINITY;
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const cell = { column, row };
      if (isBlocked(cell, obstacles)) continue;
      const center = toPoint(cell);
      const distance = Math.hypot(center.x - point.x, center.y - point.y);
      if (distance < nearestDistance) {
        nearest = cell;
        nearestDistance = distance;
      }
    }
  }
  return nearest;
}

function neighbors(cell: Cell, obstacles: Rectangle[]) {
  const candidates = [
    { column: cell.column + 1, row: cell.row },
    { column: cell.column - 1, row: cell.row },
    { column: cell.column, row: cell.row + 1 },
    { column: cell.column, row: cell.row - 1 },
  ];
  return candidates.filter((candidate) =>
    candidate.column >= 0 && candidate.column < columns
    && candidate.row >= 0 && candidate.row < rows
    && !isBlocked(candidate, obstacles));
}

function heuristic(first: Cell, second: Cell) {
  return Math.abs(first.column - second.column) + Math.abs(first.row - second.row);
}

export function findPath(startPoint: Point, endPoint: Point, obstacles: Rectangle[]): Point[] {
  const start = nearestCell(startPoint, obstacles);
  const goal = nearestCell(endPoint, obstacles);
  const open: Cell[] = [start];
  const cameFrom = new Map<string, Cell>();
  const cost = new Map<string, number>([[key(start), 0]]);
  const score = new Map<string, number>([[key(start), heuristic(start, goal)]]);

  while (open.length > 0) {
    open.sort((first, second) =>
      (score.get(key(first)) ?? Infinity) - (score.get(key(second)) ?? Infinity));
    const current = open.shift();
    if (!current) break;
    if (key(current) === key(goal)) {
      const path: Point[] = [];
      let step = current;
      while (key(step) !== key(start)) {
        path.unshift(toPoint(step));
        const previous = cameFrom.get(key(step));
        if (!previous) break;
        step = previous;
      }
      return path;
    }

    neighbors(current, obstacles).forEach((neighbor) => {
      const nextCost = (cost.get(key(current)) ?? 0) + 1;
      if (nextCost >= (cost.get(key(neighbor)) ?? Infinity)) return;
      cameFrom.set(key(neighbor), current);
      cost.set(key(neighbor), nextCost);
      score.set(key(neighbor), nextCost + heuristic(neighbor, goal));
      if (!open.some((cell) => key(cell) === key(neighbor))) open.push(neighbor);
    });
  }
  return [];
}
