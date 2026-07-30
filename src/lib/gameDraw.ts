import {
  BLOCK_SIZE, bossCoffeePosition, checkpointPosition, crowbarBoxPosition,
  directorPosition, GameWorld, itemInfo, lockerPosition,
  medblockEntrance, medblockExit, medblockWalls, medicinePosition, merchant, patients,
  INNER_VISION_SIZE, officeEntrance, OUTER_VISION_SIZE, staffEntrance,
  poisonBoxPosition, sleepingBoxPosition, staffExit, staffPanelPosition,
  students, Teacher, warehouseEntrance, warehouseExit,
  walls, WORLD_HEIGHT, WORLD_WIDTH, yardWalls,
} from './game';
import { distance } from './gamePhysics';

const rooms = [
  { x: 18, y: 18, w: 292, h: 232, color: '#dfe8d4', name: 'КАБИНЕТ 204' },
  { x: 650, y: 18, w: 292, h: 232, color: '#d8e5e7', name: 'МЕДИЦИНСКИЙ АРХИВ' },
  { x: 18, y: 350, w: 292, h: 232, color: '#efe1c9', name: 'КОМНАТА ПЕРСОНАЛА' },
  { x: 650, y: 350, w: 292, h: 232, color: '#ddd9cf', name: 'СКЛАД' },
];

function roundedRect(context: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, radius: number) {
  context.beginPath();
  context.roundRect(x, y, w, h, radius);
}

function drawPerson(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  label: string,
  teacher = false,
  redCap = false,
  pinkHat = false,
  restraintJacket = false,
  tuxedo = false,
  businessSuit = false,
) {
  context.save();
  context.translate(x, y);
  context.fillStyle = 'rgba(25,30,27,.18)';
  context.beginPath(); context.ellipse(0, 17, 17, 7, 0, 0, Math.PI * 2); context.fill();
  context.fillStyle = color;
  roundedRect(context, -13, -7, 26, 28, 8); context.fill();
  context.fillStyle = '#f1c5a4';
  context.beginPath(); context.arc(0, -14, 11, 0, Math.PI * 2); context.fill();
  context.fillStyle = teacher ? '#453a34' : '#3c322e';
  context.beginPath(); context.arc(0, -18, 11, Math.PI, Math.PI * 2); context.fill();
  if (pinkHat) {
    context.fillStyle = '#ed78b5';
    roundedRect(context, -16, -22, 32, 6, 3); context.fill();
    context.beginPath(); context.arc(0, -23, 10, Math.PI, Math.PI * 2); context.fill();
    context.fillStyle = '#b9427f';
    context.fillRect(-10, -24, 20, 3);
  }
  if (restraintJacket) {
    context.fillStyle = '#ece9dc';
    roundedRect(context, -14, -7, 28, 29, 8); context.fill();
    context.strokeStyle = '#aaa99f'; context.lineWidth = 4;
    context.beginPath(); context.moveTo(-11, 0); context.lineTo(10, 14); context.stroke();
    context.beginPath(); context.moveTo(11, 0); context.lineTo(-10, 14); context.stroke();
    context.fillStyle = '#817f76';
    context.fillRect(-12, 18, 24, 3);
  }
  if (tuxedo) {
    context.fillStyle = '#202322';
    roundedRect(context, -14, -7, 28, 29, 7); context.fill();
    context.fillStyle = '#f5f3ed';
    context.beginPath();
    context.moveTo(-6, -7); context.lineTo(0, 10); context.lineTo(6, -7);
    context.closePath(); context.fill();
    context.fillStyle = '#a83f3f';
    context.beginPath();
    context.moveTo(-6, 0); context.lineTo(0, 4); context.lineTo(-1, -2);
    context.lineTo(6, 0); context.lineTo(0, 4); context.closePath(); context.fill();
  }
  if (businessSuit) {
    context.fillStyle = '#42566d';
    roundedRect(context, -14, -7, 28, 29, 7); context.fill();
    context.fillStyle = '#f8f7f2';
    context.beginPath();
    context.moveTo(-6, -7); context.lineTo(0, 13); context.lineTo(6, -7);
    context.closePath(); context.fill();
    context.fillStyle = '#314052';
    context.beginPath(); context.moveTo(-13, -5); context.lineTo(-2, 12);
    context.lineTo(-7, -7); context.closePath(); context.fill();
    context.beginPath(); context.moveTo(13, -5); context.lineTo(2, 12);
    context.lineTo(7, -7); context.closePath(); context.fill();
  }
  if (redCap) {
    context.fillStyle = '#d93632';
    context.beginPath(); context.arc(0, -19, 12, Math.PI, Math.PI * 2); context.fill();
    roundedRect(context, -3, -20, 18, 5, 2); context.fill();
  }
  context.fillStyle = '#fff'; context.font = '700 11px Inter, sans-serif'; context.textAlign = 'center';
  context.fillText(label, 0, 38);
  context.restore();
}

function drawWorldBase(context: CanvasRenderingContext2D) {
  context.fillStyle = '#cad0c4'; context.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  context.strokeStyle = 'rgba(67,75,65,.07)'; context.lineWidth = 1;
  for (let x = 0; x < WORLD_WIDTH; x += 32) {
    context.beginPath(); context.moveTo(x, 0); context.lineTo(x, WORLD_HEIGHT); context.stroke();
  }
  for (let y = 0; y < WORLD_HEIGHT; y += 32) {
    context.beginPath(); context.moveTo(0, y); context.lineTo(WORLD_WIDTH, y); context.stroke();
  }
  rooms.forEach((room) => {
    context.fillStyle = room.color; context.fillRect(room.x, room.y, room.w, room.h);
    context.fillStyle = 'rgba(44,49,43,.45)'; context.font = '800 12px Inter, sans-serif';
    context.fillText(room.name, room.x + 16, room.y + 25);
  });
  context.fillStyle = '#4e574d';
  walls.forEach((wall) => context.fillRect(wall.x, wall.y, wall.width, wall.height));
  context.fillStyle = '#61946b'; context.fillRect(935, 505, 9, 60);
  context.fillStyle = '#fff'; context.font = '800 11px Inter, sans-serif';
  context.fillText('ВЫХОД', 884, 543);
}

function drawYard(context: CanvasRenderingContext2D, world: GameWorld) {
  context.fillStyle = '#83a96f';
  context.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  context.fillStyle = '#c9bca1';
  context.beginPath();
  context.moveTo(410, 600); context.lineTo(435, 165);
  context.lineTo(525, 165); context.lineTo(555, 600);
  context.closePath(); context.fill();

  context.fillStyle = '#596b55';
  yardWalls.slice(0, 4).forEach((wall) => context.fillRect(wall.x, wall.y, wall.width, wall.height));
  context.strokeStyle = '#735c45'; context.lineWidth = 7;
  context.beginPath(); context.moveTo(18, 170); context.lineTo(423, 170); context.stroke();
  context.beginPath(); context.moveTo(537, 170); context.lineTo(942, 170); context.stroke();
  context.lineWidth = 3;
  for (let x = 22; x < 942; x += 28) {
    if (x > 415 && x < 545) continue;
    context.beginPath(); context.moveTo(x, 130); context.lineTo(x, 205); context.stroke();
  }

  context.fillStyle = '#8a6c45';
  context.fillRect(416, 122, 8, 82); context.fillRect(536, 122, 8, 82);
  if (!world.gateUnlocked) {
    context.strokeStyle = '#735c45'; context.lineWidth = 5;
    for (let x = 430; x < 537; x += 18) {
      context.beginPath(); context.moveTo(x, 130); context.lineTo(x, 203); context.stroke();
    }
    context.fillStyle = '#303732';
    roundedRect(context, 469, 155, 24, 30, 4); context.fill();
    context.fillStyle = '#75d37c'; context.fillRect(475, 161, 12, 5);
  }
  context.fillStyle = '#f0d66a'; context.font = '800 12px Inter'; context.textAlign = 'center';
  context.fillText(world.gateUnlocked ? 'ОТКРЫТО' : 'ВОРОТА', 480, 118);

  [{ x: 341, y: 320 }, { x: 816, y: 382 }].forEach((tree) => {
    context.fillStyle = '#6b4e32'; context.fillRect(tree.x - 7, tree.y, 14, 38);
    context.fillStyle = '#3f7548';
    context.beginPath(); context.arc(tree.x, tree.y - 8, 34, 0, Math.PI * 2); context.fill();
  });
  context.fillStyle = 'rgba(255,255,255,.8)'; context.font = '900 18px Inter'; context.textAlign = 'left';
  context.fillText('ДВОР МЕДИЦИНСКОГО ЦЕНТРА', 32, 42);

  const checkpoint = checkpointPosition;
  context.fillStyle = world.checkpointActive ? 'rgba(91, 221, 150, .65)' : 'rgba(91, 181, 221, .45)';
  context.beginPath(); context.ellipse(checkpoint.x, checkpoint.y, 34, 17, 0, 0, Math.PI * 2); context.fill();
  context.strokeStyle = '#d8fff0'; context.lineWidth = 3; context.stroke();
  context.fillStyle = '#fff'; context.font = '800 10px Inter'; context.textAlign = 'center';
  context.fillText(world.checkpointActive ? 'ЧЕКПОИНТ ✓' : 'ЧЕКПОИНТ', checkpoint.x, checkpoint.y + 4);

  context.fillStyle = '#e6dfd3'; context.fillRect(18, 350, 255, 232);
  context.fillStyle = '#b9c7bd';
  context.fillRect(42, 375, 55, 48);
  context.fillRect(120, 375, 55, 48);
  context.fillRect(198, 375, 52, 48);
  context.fillStyle = '#a94e4e';
  context.fillRect(135, 447, 18, 52); context.fillRect(118, 464, 52, 18);
  context.fillStyle = '#587365';
  roundedRect(context, 255, medblockEntrance.y - 32, 42, 64, 4); context.fill();
  context.fillStyle = '#fff'; context.font = '800 11px Inter';
  context.save();
  context.translate(246, 548); context.rotate(-Math.PI / 2);
  context.fillText('МЕДБЛОК', 0, 0); context.restore();

  context.fillStyle = '#a9a79d'; context.fillRect(18, 210, 255, 120);
  context.fillStyle = '#727b76';
  context.fillRect(42, 232, 55, 42); context.fillRect(120, 232, 55, 42);
  context.fillStyle = '#5f6c65';
  roundedRect(context, 255, warehouseEntrance.y - 30, 42, 60, 4); context.fill();
  context.fillStyle = '#fff'; context.font = '800 10px Inter'; context.textAlign = 'center';
  context.fillText('СКЛАД', 145, 312);

  context.fillStyle = '#65756b';
  roundedRect(context, officeEntrance.x - 42, 540, 84, 42, 5); context.fill();
  context.fillStyle = '#d9e4dc'; context.fillRect(officeEntrance.x - 28, 550, 56, 32);
  context.fillStyle = '#26362d'; context.font = '800 9px Inter'; context.textAlign = 'center';
  context.fillText('ВХОД В ОФИС', officeEntrance.x, 548);

  context.fillStyle = '#c9c0ae'; context.fillRect(792, 430, 150, 152);
  context.fillStyle = '#7891a0';
  context.fillRect(815, 452, 42, 38); context.fillRect(878, 452, 42, 38);
  context.fillStyle = '#5b6870';
  roundedRect(context, 766, staffEntrance.y - 30, 40, 60, 4); context.fill();
  context.fillStyle = '#fff'; context.font = '800 10px Inter';
  context.save(); context.translate(815, 550); context.rotate(-Math.PI / 2);
  context.fillText('ПЕРСОНАЛ', 0, 0); context.restore();

  context.fillStyle = '#59635e';
  roundedRect(context, staffPanelPosition.x - 24, staffPanelPosition.y - 20, 48, 40, 4); context.fill();
  context.strokeStyle = '#303834'; context.lineWidth = 3; context.stroke();
  context.fillStyle = '#f0c84f'; context.font = '20px sans-serif'; context.textAlign = 'center';
  context.fillText('⚡', staffPanelPosition.x, staffPanelPosition.y + 7);
  context.fillStyle = world.panelDisabled ? '#d65b55' : '#76d17d';
  context.beginPath(); context.arc(staffPanelPosition.x + 16, staffPanelPosition.y - 12, 3, 0, Math.PI * 2); context.fill();
  if (world.repairPhase === 'repairing') {
    context.fillStyle = '#202621';
    roundedRect(context, staffPanelPosition.x - 42, staffPanelPosition.y - 52, 84, 24, 6); context.fill();
    context.fillStyle = '#fff'; context.font = '800 11px Inter'; context.textAlign = 'center';
    context.fillText(`${Math.ceil(world.repairTime / 1000)} сек`, staffPanelPosition.x, staffPanelPosition.y - 36);
  }
}

function drawMedblock(context: CanvasRenderingContext2D) {
  context.fillStyle = '#c8d1cb'; context.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  context.strokeStyle = '#aebbb3'; context.lineWidth = 2;
  for (let x = 18; x < WORLD_WIDTH; x += 48) {
    context.beginPath(); context.moveTo(x, 0); context.lineTo(x, WORLD_HEIGHT); context.stroke();
  }
  for (let y = 18; y < WORLD_HEIGHT; y += 48) {
    context.beginPath(); context.moveTo(0, y); context.lineTo(WORLD_WIDTH, y); context.stroke();
  }

  const rooms = [
    { x: 18, y: 18, w: 252, h: 177, name: 'КОМНАТА 1' },
    { x: 18, y: 207, w: 252, h: 178, name: 'КОМНАТА 2' },
    { x: 18, y: 397, w: 252, h: 185, name: 'КОМНАТА 3' },
    { x: 690, y: 18, w: 252, h: 177, name: 'КОМНАТА 4' },
    { x: 690, y: 207, w: 252, h: 178, name: 'КОМНАТА 5' },
    { x: 690, y: 397, w: 252, h: 185, name: 'КОМНАТА 6 · ЛЕКАРСТВО' },
  ];
  rooms.forEach((room) => {
    context.fillStyle = '#d8dfda'; context.fillRect(room.x, room.y, room.w, room.h);
    context.fillStyle = '#6b7a71'; context.font = '800 10px Inter'; context.textAlign = 'left';
    context.fillText(room.name, room.x + 14, room.y + 22);
  });
  context.fillStyle = '#7c8981';
  medblockWalls.slice(4).forEach((wall) => context.fillRect(wall.x, wall.y, wall.width, wall.height));

  context.fillStyle = '#89978e'; roundedRect(context, 380, 75, 200, 62, 6); context.fill();
  context.fillStyle = '#26332c'; context.fillRect(402, 89, 82, 32);
  context.fillStyle = '#9bc4ad'; context.fillRect(493, 89, 65, 32);
  context.fillStyle = '#eef2ef'; context.font = '700 11px Inter'; context.textAlign = 'center';
  context.fillText('ПОСТ ДЕЖУРНОГО', 480, 155);

  context.fillStyle = 'rgba(68, 84, 74, .12)';
  context.beginPath(); context.ellipse(480, 330, 165, 80, 0, 0, Math.PI * 2); context.fill();
  context.fillStyle = '#53645a'; context.font = '800 11px Inter';
  context.fillText('ТИХОЕ ОТДЕЛЕНИЕ', 480, 335);
  context.fillStyle = '#4d765b'; roundedRect(context, 440, 560, 80, 22, 4); context.fill();
  context.fillStyle = '#fff'; context.font = '700 10px Inter'; context.fillText('ВХОД', 480, 575);
  context.fillStyle = '#405048'; context.font = '900 18px Inter'; context.textAlign = 'left';
  context.fillText('ЗАКРЫТОЕ ОТДЕЛЕНИЕ', 32, 42);
}

function drawStaffBuilding(context: CanvasRenderingContext2D, world: GameWorld) {
  context.fillStyle = '#d8d2c4'; context.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  context.fillStyle = '#b9b09e';
  for (let x = 18; x < WORLD_WIDTH; x += 48) {
    for (let y = 18; y < WORLD_HEIGHT; y += 48) context.fillRect(x, y, 46, 46);
  }
  const desks = [{ x: 85, y: 100 }, { x: 695, y: 100 }];
  desks.forEach((desk) => {
    context.fillStyle = '#82684f'; roundedRect(context, desk.x, desk.y, 180, 70, 7); context.fill();
    context.fillStyle = '#35434a'; context.fillRect(desk.x + 60, desk.y + 12, 60, 34);
  });
  if (!world.repairPhase) {
    drawPerson(context, 480, 270, '#39495c', 'Директор', false, false, false, false, false, true);
    if (world.bossEffect === 'sleeping') {
      context.font = '22px sans-serif'; context.textAlign = 'center';
      context.fillText('💤', 505, 250);
      context.fillStyle = '#53645a'; context.font = '800 10px Inter';
      context.fillText('СПИТ', 480, 228);
    } else if (world.bossEffect === 'poison') {
      context.font = '22px sans-serif'; context.textAlign = 'center';
      context.fillText('🤢', 505, 250);
      context.fillStyle = '#6f574c'; context.font = '800 10px Inter';
      context.fillText('ПЛОХО', 480, 228);
    } else if (world.bossDrinkTime > 0) {
      context.font = '20px sans-serif'; context.textAlign = 'center';
      context.fillText('☕', 500, 255);
      context.fillStyle = '#66503e'; context.font = '800 9px Inter';
      context.fillText('ПЬЁТ КОФЕ', 480, 228);
    }
  }
  context.fillStyle = '#73563f'; roundedRect(context, 320, 300, 320, 100, 10); context.fill();
  context.fillStyle = '#29353b'; roundedRect(context, 438, 308, 84, 46, 4); context.fill();
  context.fillStyle = '#a9c3cd'; context.fillRect(447, 316, 66, 28);
  context.fillStyle = '#f3ead6';
  context.save(); context.translate(370, 320); context.rotate(-.12); context.fillRect(0, 0, 48, 32); context.restore();
  if (world.bossDrinkTime === 0 || world.repairPhase) {
    context.fillStyle = 'rgba(238, 199, 91, .28)';
    context.beginPath(); context.arc(bossCoffeePosition.x, bossCoffeePosition.y, 22, 0, Math.PI * 2); context.fill();
    context.font = '20px sans-serif'; context.textAlign = 'center';
    context.fillText('☕', bossCoffeePosition.x, bossCoffeePosition.y + 7);
    if (world.coffeeSpiked) {
      context.fillStyle = '#dfc052'; context.font = '15px sans-serif';
      context.fillText('✦', bossCoffeePosition.x + 18, bossCoffeePosition.y - 7);
    }
  }
  context.fillStyle = '#fff'; context.font = '800 11px Inter'; context.textAlign = 'center';
  context.fillText('КАБИНЕТ ДИРЕКТОРА', 480, 420);
  context.fillStyle = '#4d765b'; roundedRect(context, 440, 560, 80, 22, 4); context.fill();
  context.fillStyle = '#fff'; context.font = '700 10px Inter'; context.fillText('ВЫХОД', 480, 575);
  context.fillStyle = '#4e514d'; context.font = '900 18px Inter'; context.textAlign = 'left';
  context.fillText('ЗДАНИЕ ПЕРСОНАЛА', 32, 42);
}

function drawWarehouse(context: CanvasRenderingContext2D, world: GameWorld) {
  context.fillStyle = '#b9b9ae'; context.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  context.strokeStyle = '#9e9e94'; context.lineWidth = 2;
  for (let x = 18; x < WORLD_WIDTH; x += 42) {
    context.beginPath(); context.moveTo(x, 0); context.lineTo(x, WORLD_HEIGHT); context.stroke();
  }
  const shelves = [
    { x: 80, y: 90, w: 240, h: 85 },
    { x: 640, y: 90, w: 240, h: 85 },
    { x: 355, y: 300, w: 250, h: 70 },
  ];
  shelves.forEach((shelf) => {
    context.fillStyle = '#6d5a46'; roundedRect(context, shelf.x, shelf.y, shelf.w, shelf.h, 5); context.fill();
    context.strokeStyle = '#3f352b'; context.lineWidth = 4; context.stroke();
  });
  const drawBox = (position: { x: number; y: number }, taken: boolean, icon: string) => {
    context.fillStyle = taken ? '#66594b' : '#997349';
    roundedRect(context, position.x - 30, position.y - 24, 60, 48, 5); context.fill();
    context.fillStyle = '#fff'; context.font = '21px sans-serif'; context.textAlign = 'center';
    context.fillText(taken ? '✓' : icon, position.x, position.y + 7);
  };
  drawBox(sleepingBoxPosition, world.items.includes('sleepingPowder'), '💤');
  drawBox(poisonBoxPosition, world.items.includes('poison'), '☠️');
  context.fillStyle = '#4d765b'; roundedRect(context, 440, 560, 80, 22, 4); context.fill();
  context.fillStyle = '#fff'; context.font = '700 10px Inter'; context.fillText('ВЫХОД', 480, 575);
  context.fillStyle = '#424a45'; context.font = '900 18px Inter'; context.textAlign = 'left';
  context.fillText('СКЛАД МЕДИКАМЕНТОВ', 32, 42);
}

function drawRepairCrew(context: CanvasRenderingContext2D, world: GameWorld) {
  world.repairCrew.forEach((npc) => {
    if (npc.role === 'boss') {
      drawPerson(context, npc.x, npc.y, '#39495c', 'Директор', false, false, false, false, false, true);
    } else {
      drawPerson(context, npc.x, npc.y, '#333b3f', 'Охранник', true, false, false, false, true);
    }
  });
}

function drawItems(context: CanvasRenderingContext2D, world: GameWorld) {
  (['notebook', 'cookie', 'key'] as const).forEach((id) => {
    if (world.items.includes(id)) return;
    const item = itemInfo[id];
    const position = world.itemPositions[id];
    context.fillStyle = 'rgba(255,255,255,.82)';
    context.beginPath(); context.arc(position.x, position.y, 19, 0, Math.PI * 2); context.fill();
    context.font = '22px sans-serif'; context.textAlign = 'center';
    context.fillText(item.icon, position.x, position.y + 8);
  });
  world.coinPositions.forEach((coin, index) => {
    if (world.collectedCoins.includes(index)) return;
    context.fillStyle = '#efc64f';
    context.beginPath(); context.arc(coin.x, coin.y, 11, 0, Math.PI * 2); context.fill();
    context.strokeStyle = '#a97c24'; context.lineWidth = 3; context.stroke();
    context.fillStyle = '#755119'; context.font = '800 11px Inter'; context.textAlign = 'center';
    context.fillText('Ж', coin.x, coin.y + 4);
  });
}

function drawLocker(context: CanvasRenderingContext2D, world: GameWorld) {
  const { x, y } = lockerPosition;
  context.fillStyle = world.hiding ? '#4f765d' : '#53645a';
  roundedRect(context, x - 20, y - 34, 40, 60, 5); context.fill();
  context.strokeStyle = '#28352d'; context.lineWidth = 3; context.stroke();
  context.fillStyle = '#26342b';
  context.fillRect(x - 13, y - 24, 26, 3);
  context.fillRect(x - 13, y - 16, 26, 3);
  context.fillStyle = '#d9c16d';
  context.beginPath(); context.arc(x + 10, y + 2, 3, 0, Math.PI * 2); context.fill();
  context.fillStyle = '#fff'; context.font = '700 10px Inter, sans-serif'; context.textAlign = 'center';
  context.fillText(world.hiding ? 'ТЫ ВНУТРИ' : 'ШКАФ', x, y + 42);
}

function drawGuardVision(context: CanvasRenderingContext2D, guards: Teacher[]) {
  guards.forEach((teacher) => {
    const drawZone = (size: number, blocks: number, fill: string, stroke: string) => {
      const left = teacher.x - size / 2;
      const top = teacher.y - size / 2;
      context.fillStyle = fill; context.fillRect(left, top, size, size);
      context.strokeStyle = stroke; context.lineWidth = 1;
      for (let block = 0; block <= blocks; block += 1) {
        context.beginPath(); context.moveTo(left + block * BLOCK_SIZE, top);
        context.lineTo(left + block * BLOCK_SIZE, top + size); context.stroke();
        context.beginPath(); context.moveTo(left, top + block * BLOCK_SIZE);
        context.lineTo(left + size, top + block * BLOCK_SIZE); context.stroke();
      }
    };
    drawZone(OUTER_VISION_SIZE, 5, 'rgba(238,154,55,.14)', 'rgba(224,126,38,.42)');
    drawZone(INNER_VISION_SIZE, 3, 'rgba(206,72,65,.2)', 'rgba(190,61,55,.5)');
  });
}

function drawPrompt(context: CanvasRenderingContext2D, world: GameWorld) {
  const nearStudent = students.some((student) => distance(world.player, student) < 52);
  const nearItem = (['notebook', 'cookie', 'key'] as const).some((id) =>
    !world.items.includes(id) && distance(world.player, world.itemPositions[id]) < 42);
  const nearExit = world.player.x > 900 && world.player.y > 500;
  const nearLocker = distance(world.player, lockerPosition) < 48;
  const nearMerchant = distance(world.player, merchant) < 54;
  const nearCoin = world.coinPositions.some((coin, index) =>
    !world.collectedCoins.includes(index) && distance(world.player, coin) < 38);
  const nearTeacher = world.items.includes('taser')
    && world.teachers.some((teacher) => teacher.chasing && distance(world.player, teacher) < 68);
  if (!nearStudent && !nearItem && !nearExit && !nearLocker
    && !nearMerchant && !nearCoin && !nearTeacher && !world.hiding) return;
  context.fillStyle = '#202621';
  roundedRect(context, world.player.x - 58, world.player.y - 58, 116, 27, 8); context.fill();
  context.fillStyle = '#fff'; context.font = '700 12px Inter, sans-serif'; context.textAlign = 'center';
  context.fillText('E  Действовать', world.player.x, world.player.y - 40);
}

function drawYardPrompt(context: CanvasRenderingContext2D, world: GameWorld) {
  const nearGate = distance(world.player, { x: 480, y: 190 }) < 65;
  const nearMedblock = distance(world.player, medblockEntrance) < 65;
  const nearOffice = distance(world.player, officeEntrance) < 55;
  const nearStaff = distance(world.player, staffEntrance) < 55;
  const nearWarehouse = distance(world.player, warehouseEntrance) < 55;
  const nearPanel = !world.panelDisabled && !world.repairPhase
    && distance(world.player, staffPanelPosition) < 55;
  if ((!nearGate || world.gateUnlocked) && !nearMedblock
    && !nearOffice && !nearStaff && !nearWarehouse && !nearPanel) return;
  context.fillStyle = '#202621';
  roundedRect(context, world.player.x - 58, world.player.y - 58, 116, 27, 8); context.fill();
  context.fillStyle = '#fff'; context.font = '700 12px Inter'; context.textAlign = 'center';
  context.fillText('E  Действовать', world.player.x, world.player.y - 40);
}

function drawMedblockPrompt(context: CanvasRenderingContext2D, world: GameWorld) {
  const nearMedicine = !world.items.includes('medicine')
    && distance(world.player, medicinePosition) < 42;
  const nearDoctor = world.items.includes('taser')
    && world.doctors.some((doctor) => doctor.chasing && distance(world.player, doctor) < 68);
  const nearExit = distance(world.player, medblockExit) < 55;
  const nearBox = !world.items.includes('crowbar')
    && distance(world.player, crowbarBoxPosition) < 48;
  if (!nearMedicine && !nearDoctor && !nearExit && !nearBox) return;
  context.fillStyle = '#202621';
  roundedRect(context, world.player.x - 58, world.player.y - 58, 116, 27, 8); context.fill();
  context.fillStyle = '#fff'; context.font = '700 12px Inter'; context.textAlign = 'center';
  context.fillText('E  Действовать', world.player.x, world.player.y - 40);
}

function drawStaffPrompt(context: CanvasRenderingContext2D, world: GameWorld) {
  const nearExit = distance(world.player, staffExit) < 55;
  const nearGuard = world.items.includes('taser')
    && world.bossGuards.some((guard) => guard.chasing && distance(world.player, guard) < 68);
  const nearCoffee = !world.repairPhase && !world.coffeeSpiked
    && world.bossDrinkTime === 0 && distance(world.player, bossCoffeePosition) < 75;
  const nearSleepingBoss = world.bossEffect === 'sleeping' && !world.foundGateCode
    && distance(world.player, directorPosition) < 160;
  if (!nearExit && !nearGuard && !nearCoffee && !nearSleepingBoss) return;
  context.fillStyle = '#202621';
  roundedRect(context, world.player.x - 58, world.player.y - 58, 116, 27, 8); context.fill();
  context.fillStyle = '#fff'; context.font = '700 12px Inter'; context.textAlign = 'center';
  context.fillText('E  Выйти', world.player.x, world.player.y - 40);
}

function drawWarehousePrompt(context: CanvasRenderingContext2D, world: GameWorld) {
  const nearExit = distance(world.player, warehouseExit) < 55;
  const nearSleeping = !world.items.includes('sleepingPowder')
    && distance(world.player, sleepingBoxPosition) < 60;
  const nearPoison = !world.items.includes('poison')
    && distance(world.player, poisonBoxPosition) < 60;
  const nearGuard = world.items.includes('taser')
    && world.warehouseGuards.some((guard) => guard.chasing && distance(world.player, guard) < 68);
  if (!nearExit && !nearSleeping && !nearPoison && !nearGuard) return;
  context.fillStyle = '#202621';
  roundedRect(context, world.player.x - 58, world.player.y - 58, 116, 27, 8); context.fill();
  context.fillStyle = '#fff'; context.font = '700 12px Inter'; context.textAlign = 'center';
  context.fillText('E  Действовать', world.player.x, world.player.y - 40);
}

export function drawGame(context: CanvasRenderingContext2D, world: GameWorld) {
  context.clearRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  if (world.level === 'yard') {
    drawYard(context, world);
    drawRepairCrew(context, world);
    drawPerson(context, world.player.x, world.player.y, '#d97452', 'Ты', false, true);
    drawYardPrompt(context, world);
    return;
  }
  if (world.level === 'medblock') {
    drawMedblock(context);
    drawGuardVision(context, world.doctors);
    context.fillStyle = world.items.includes('crowbar') ? '#6f5d49' : '#9a744c';
    roundedRect(
      context, crowbarBoxPosition.x - 24, crowbarBoxPosition.y - 18, 48, 36, 5,
    ); context.fill();
    context.strokeStyle = '#493a2c'; context.lineWidth = 3; context.stroke();
    context.fillStyle = '#d4b55f'; context.fillRect(crowbarBoxPosition.x - 4, crowbarBoxPosition.y - 3, 8, 9);
    context.fillStyle = '#fff'; context.font = '700 9px Inter'; context.textAlign = 'center';
    context.fillText(
      world.items.includes('crowbar') ? 'ОТКРЫТО' : 'ЯЩИК',
      crowbarBoxPosition.x, crowbarBoxPosition.y + 31,
    );
    patients.forEach((patient) =>
      drawPerson(context, patient.x, patient.y, patient.color, patient.name, false, false, false, true));
    if (!world.items.includes('medicine')) {
      context.fillStyle = 'rgba(255,255,255,.85)';
      context.beginPath(); context.arc(medicinePosition.x, medicinePosition.y, 20, 0, Math.PI * 2); context.fill();
      context.font = '23px sans-serif'; context.textAlign = 'center';
      context.fillText('💊', medicinePosition.x, medicinePosition.y + 8);
    }
    world.doctors.forEach((doctor) => {
      drawPerson(context, doctor.x, doctor.y, doctor.color, 'Доктор', true);
      if (doctor.chasing) {
        context.fillStyle = '#bd332d'; context.font = '900 12px Inter'; context.textAlign = 'center';
        context.fillText('ПОГОНЯ!', doctor.x, doctor.y - 42);
      } else if (doctor.investigateTarget) {
        context.fillStyle = '#b86f24'; context.font = '800 10px Inter'; context.textAlign = 'center';
        context.fillText('ПРОВЕРЯЕТ', doctor.x, doctor.y - 42);
      }
    });
    drawPerson(context, world.player.x, world.player.y, '#d97452', 'Ты', false, true);
    drawMedblockPrompt(context, world);
    return;
  }
  if (world.level === 'staff') {
    drawStaffBuilding(context, world);
    drawGuardVision(context, world.bossGuards);
    world.bossGuards.forEach((guard) => {
      drawPerson(context, guard.x, guard.y, guard.color, 'Охранник', true, false, false, false, true);
      if (guard.chasing) {
        context.fillStyle = '#bd332d'; context.font = '900 12px Inter'; context.textAlign = 'center';
        context.fillText('ПОГОНЯ!', guard.x, guard.y - 42);
      } else if (guard.investigateTarget) {
        context.fillStyle = '#b86f24'; context.font = '800 10px Inter'; context.textAlign = 'center';
        context.fillText('ПРОВЕРЯЕТ', guard.x, guard.y - 42);
      }
    });
    drawPerson(context, world.player.x, world.player.y, '#d97452', 'Ты', false, true);
    drawStaffPrompt(context, world);
    return;
  }
  if (world.level === 'warehouse') {
    drawWarehouse(context, world);
    drawGuardVision(context, world.warehouseGuards);
    world.warehouseGuards.forEach((guard) => {
      drawPerson(context, guard.x, guard.y, guard.color, 'Охранник', true, false, false, false, true);
    });
    drawPerson(context, world.player.x, world.player.y, '#d97452', 'Ты', false, true);
    drawWarehousePrompt(context, world);
    return;
  }
  drawWorldBase(context);
  drawGuardVision(context, world.teachers);
  drawItems(context, world);
  drawLocker(context, world);
  students.forEach((student, index) => {
    drawPerson(context, student.x, student.y, student.color, student.name, false, false, false, false, false, true);
    if ((index === 0 && world.quest <= 2) || (index === 1 && world.quest >= 3 && world.quest <= 4)) {
      context.fillStyle = '#d66d4e'; context.font = '900 25px Inter'; context.fillText('!', student.x, student.y - 38);
    }
  });
  drawPerson(context, merchant.x, merchant.y, merchant.color, merchant.name, false, false, true);
  context.fillStyle = '#efc64f'; context.font = '900 20px Inter'; context.textAlign = 'center';
  context.fillText('🛒', merchant.x, merchant.y - 38);
  world.teachers.forEach((teacher) => {
    drawPerson(context, teacher.x, teacher.y, teacher.color, 'Охранник', true, false, false, false, true);
    if (teacher.stunnedFor > 0) {
      context.font = '18px sans-serif'; context.textAlign = 'center';
      context.fillText('💫', teacher.x, teacher.y - 42);
    } else if (teacher.chasing) {
      context.fillStyle = '#bd332d';
      context.font = '900 12px Inter, sans-serif';
      context.textAlign = 'center';
      context.fillText('ПОГОНЯ!', teacher.x, teacher.y - 42);
    } else if (teacher.investigateTarget) {
      context.fillStyle = '#b86f24';
      context.font = '800 10px Inter, sans-serif';
      context.textAlign = 'center';
      context.fillText('ПРОВЕРЯЕТ', teacher.x, teacher.y - 42);
    }
  });
  if (!world.hiding) drawPerson(context, world.player.x, world.player.y, '#d97452', 'Ты', false, true);
  drawPrompt(context, world);
}
