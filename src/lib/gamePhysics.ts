import {
  bossCoffeePosition, checkpointPosition, GameWorld,
  lockedGate, medblockWalls, PLAYER_SIZE, Point, Rectangle, RepairNpc, staffWalls,
  Teacher, INNER_VISION_SIZE, OUTER_VISION_SIZE,
  walls, warehouseWalls, WORLD_HEIGHT, WORLD_WIDTH, yardWalls,
} from './game';
import { findPath } from './pathfinding';

export function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function overlaps(point: Point, wall: Rectangle) {
  const radius = PLAYER_SIZE / 2;
  return point.x + radius > wall.x && point.x - radius < wall.x + wall.width
    && point.y + radius > wall.y && point.y - radius < wall.y + wall.height;
}

function moveGuard(teacher: Point, dx: number, dy: number, obstacles: Rectangle[]) {
  const previousX = teacher.x;
  const previousY = teacher.y;
  const nextX = { x: teacher.x + dx, y: teacher.y };
  if (!obstacles.some((wall) => overlaps(nextX, wall))) teacher.x = nextX.x;
  const nextY = { x: teacher.x, y: teacher.y + dy };
  if (!obstacles.some((wall) => overlaps(nextY, wall))) teacher.y = nextY.y;
  return Math.hypot(teacher.x - previousX, teacher.y - previousY) > 0.05;
}

function moveRepairNpc(npc: RepairNpc, elapsed: number) {
  npc.pathRefresh -= elapsed;
  if (npc.pathRefresh <= 0 || npc.path.length === 0) {
    npc.path = findPath(npc, npc.target, yardWalls);
    npc.pathRefresh = 600;
  }
  const waypoint = npc.path[0] ?? npc.target;
  const dx = waypoint.x - npc.x;
  const dy = waypoint.y - npc.y;
  const length = Math.max(1, Math.hypot(dx, dy));
  const step = Math.min(length, elapsed * 0.08);
  moveGuard(npc, (dx / length) * step, (dy / length) * step, yardWalls);
  if (length < 7) npc.path.shift();
}

function handleCaught(world: GameWorld, guardName: string) {
  if (world.checkpointActive) {
    world.alert = Math.min(100, world.alert + 20);
    if (world.alert >= 100) {
      world.status = 'lost';
      world.message = `${guardName} поймал тебя, а уровень страха достиг 100%!`;
      return;
    }
    world.level = 'yard';
    world.player = { ...checkpointPosition };
    world.quest = world.gateUnlocked ? 9 : 8;
    world.showCodeLock = false;
    world.teachers.forEach((guard) => { guard.chasing = false; });
    world.doctors.forEach((doctor) => { doctor.chasing = false; });
    world.warehouseGuards.forEach((guard) => { guard.chasing = false; });
    world.bossGuards = [];
    world.message = `${guardName} поймал тебя! Страх вырос до ${Math.round(world.alert)}%, но чекпоинт сработал.`;
  } else {
    world.alert = 100;
    world.status = 'lost';
    world.message = `${guardName} догнал тебя — побег не удался!`;
  }
}

export function movePlayer(world: GameWorld, dx: number, dy: number) {
  const levelWalls = world.level === 'yard'
    ? world.gateUnlocked ? yardWalls : [...yardWalls, lockedGate]
    : world.level === 'medblock' ? medblockWalls
    : world.level === 'staff' ? staffWalls
    : world.level === 'warehouse' ? warehouseWalls : walls;
  const nextX = { x: world.player.x + dx, y: world.player.y };
  if (!levelWalls.some((wall) => overlaps(nextX, wall))) world.player.x = nextX.x;

  const nextY = { x: world.player.x, y: world.player.y + dy };
  if (!levelWalls.some((wall) => overlaps(nextY, wall))) world.player.y = nextY.y;

  world.player.x = Math.max(PLAYER_SIZE, Math.min(WORLD_WIDTH - PLAYER_SIZE, world.player.x));
  world.player.y = Math.max(PLAYER_SIZE, Math.min(WORLD_HEIGHT - PLAYER_SIZE, world.player.y));

  if (world.level === 'yard' && !world.checkpointActive
    && distance(world.player, checkpointPosition) < 34) {
    world.checkpointActive = true;
    world.quest = 8;
    world.message = 'Чекпоинт активирован! Теперь найди способ открыть ворота.';
  }
}

function isInVision(player: Point, teacher: Teacher, size: number) {
  const halfVision = size / 2;
  return Math.abs(player.x - teacher.x) <= halfVision
    && Math.abs(player.y - teacher.y) <= halfVision;
}

function updateGuards(
  world: GameWorld,
  guards: Teacher[],
  elapsed: number,
  obstacles: Rectangle[],
  guardName: string,
) {
  world.safeTime = Math.max(0, world.safeTime - elapsed);
  guards.forEach((teacher) => {
    if (teacher.stunnedFor > 0) {
      teacher.stunnedFor = Math.max(0, teacher.stunnedFor - elapsed);
      return;
    }
    if (teacher.chasing) {
      const dx = world.player.x - teacher.x;
      const dy = world.player.y - teacher.y;
      const distanceToPlayer = Math.hypot(dx, dy);
      if (distanceToPlayer < 25) {
        handleCaught(world, guardName);
        return;
      }
      teacher.pathRefresh = (teacher.pathRefresh ?? 0) - elapsed;
      if (teacher.pathRefresh <= 0 || teacher.chasePath === undefined) {
        teacher.chasePath = findPath(teacher, world.player, obstacles);
        teacher.pathRefresh = 350;
      }
      const waypoint = teacher.chasePath[0]
        ?? (distanceToPlayer < 40 ? world.player : teacher);
      const pathDx = waypoint.x - teacher.x;
      const pathDy = waypoint.y - teacher.y;
      const length = Math.max(1, Math.hypot(pathDx, pathDy));
      const chaseSpeed = elapsed * teacher.speed * 2.2;
      const moved = moveGuard(
        teacher, (pathDx / length) * chaseSpeed,
        (pathDy / length) * chaseSpeed, obstacles,
      );
      if (length < 7) teacher.chasePath.shift();
      if (!moved) {
        teacher.chasePath = [];
        teacher.pathRefresh = 0;
      }
    } else {
      const searchTarget = teacher.investigateTarget ?? world.player;
      teacher.pathRefresh = (teacher.pathRefresh ?? 0) - elapsed;
      if (teacher.pathRefresh <= 0 || teacher.chasePath === undefined) {
        teacher.chasePath = findPath(teacher, searchTarget, obstacles);
        teacher.pathRefresh = 500;
      }
      const target = teacher.chasePath?.[0]
        ?? (distance(teacher, searchTarget) < 40 ? searchTarget : teacher);
      const dx = target.x - teacher.x;
      const dy = target.y - teacher.y;
      const length = Math.max(1, Math.hypot(dx, dy));
      const step = Math.min(length, elapsed * teacher.speed);
      const moved = moveGuard(teacher, (dx / length) * step, (dy / length) * step, obstacles);
      if (length < 7) teacher.chasePath?.shift();
      if (teacher.investigateTarget) {
        if (distance(teacher, teacher.investigateTarget) < 8) {
          teacher.investigateTarget = undefined;
          teacher.chasePath = [];
        } else if (!moved) {
          teacher.chasePath = [];
          teacher.pathRefresh = 0;
        }
      } else if (!moved) {
        teacher.chasePath = [];
        teacher.pathRefresh = 0;
      }
    }

    const inOuter = isInVision(world.player, teacher, OUTER_VISION_SIZE);
    const inInner = isInVision(world.player, teacher, INNER_VISION_SIZE);
    if (world.safeTime <= 0 && !world.hiding && !teacher.chasing) {
      if (inInner) {
        teacher.chasing = true;
        teacher.investigateTarget = undefined;
        teacher.chasePath = [];
        teacher.pathRefresh = 0;
        world.alert = Math.min(95, world.alert + 40);
        world.message = `${guardName} увидел тебя в зоне 3×3 и начал погоню!`;
      } else if (inOuter && !teacher.playerInOuter && !teacher.investigateTarget) {
        teacher.investigateTarget = { ...world.player };
        world.message = `${guardName} заметил движение и идёт проверить место, где ты был.`;
      }
    }
    teacher.playerInOuter = inOuter;

    if (teacher.chasing && distance(world.player, teacher) < 25) {
      handleCaught(world, guardName);
    }
  });
}

export function updateTeachers(world: GameWorld, elapsed: number) {
  updateGuards(world, world.teachers, elapsed, walls, 'Охранник');
}

export function updateDoctors(world: GameWorld, elapsed: number) {
  updateGuards(world, world.doctors, elapsed, medblockWalls, 'Доктор');
}

export function updateBossGuards(world: GameWorld, elapsed: number) {
  updateGuards(world, world.bossGuards, elapsed, staffWalls, 'Охранник директора');
}

export function updateWarehouseGuards(world: GameWorld, elapsed: number) {
  updateGuards(world, world.warehouseGuards, elapsed, warehouseWalls, 'Охранник склада');
}

export function updateRepairCrew(world: GameWorld, elapsed: number) {
  if (!world.repairPhase) return;
  if (world.repairPhase === 'repairing') {
    world.repairTime = Math.max(0, world.repairTime - elapsed);
    if (world.repairTime === 0) {
      world.panelDisabled = false;
      world.repairPhase = 'returning';
      const returnTargets = [
        { x: 755, y: 485 }, { x: 755, y: 510 },
        { x: 755, y: 535 }, { x: 730, y: 510 },
      ];
      world.repairCrew.forEach((npc, index) => {
        npc.target = returnTargets[index];
        npc.path = [];
        npc.pathRefresh = 0;
      });
      world.message = 'Щиток починен. Директор и охрана возвращаются внутрь.';
    }
    return;
  }

  world.repairCrew.forEach((npc) => moveRepairNpc(npc, elapsed));
  const arrived = world.repairCrew.every((npc) => distance(npc, npc.target) < 14);
  if (!arrived) return;
  if (world.repairPhase === 'approaching') {
    world.repairPhase = 'repairing';
    world.repairTime = 15000;
    world.message = 'Начался ремонт щитка. До включения питания осталось 15 секунд.';
  } else {
    world.repairPhase = null;
    world.repairCrew = [];
    world.message = 'Директор и три охранника вернулись в здание персонала.';
  }
}

export function updateBossCoffee(world: GameWorld, elapsed: number) {
  if (world.showPocketGame) return;
  if (world.repairPhase) {
    world.bossDrinkTime = 0;
    return;
  }
  if (world.bossDrinkTime > 0) {
    const wasDrinking = world.bossDrinkTime;
    world.bossDrinkTime = Math.max(0, world.bossDrinkTime - elapsed);
    if (wasDrinking > 0 && world.bossDrinkTime === 0 && world.coffeeSpiked) {
      world.bossEffect = world.coffeeSpiked;
      world.bossEffectTime = world.coffeeSpiked === 'sleeping' ? 20000 : 15000;
      if (world.coffeeSpiked === 'sleeping') {
        world.message = 'Снотворное сработало — директор уснул на 20 секунд.';
      } else {
        world.alert = Math.min(100, world.alert + 25);
        world.bossGuards.forEach((guard) => {
          guard.chasing = false;
          guard.investigateTarget = { ...bossCoffeePosition };
        });
        world.status = 'poisonEnding';
        world.message = 'Директору стало плохо, и его срочно увезли из больницы.';
      }
      world.coffeeSpiked = null;
    }
    return;
  }
  if (world.bossEffectTime > 0) {
    world.bossEffectTime = Math.max(0, world.bossEffectTime - elapsed);
    if (world.bossEffectTime === 0) world.bossEffect = null;
    return;
  }
  world.bossCoffeeTimer = Math.max(0, world.bossCoffeeTimer - elapsed);
  if (world.bossCoffeeTimer === 0) {
    world.bossDrinkTime = 2500;
    world.bossCoffeeTimer = 34000;
  }
}
