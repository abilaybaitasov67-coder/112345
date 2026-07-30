import {
  bossCoffeePosition, createBossGuards, createWarehouseGuards, directorPosition,
  crowbarBoxPosition, GameWorld, HiddenItemId,
  itemInfo, lockerPosition, medblockEntrance,
  medblockExit, medicinePosition, merchant, officeEntrance, staffEntrance,
  poisonBoxPosition, sleepingBoxPosition, staffExit, staffPanelPosition,
  students, warehouseEntrance, warehouseExit,
} from './game';
import { distance } from './gamePhysics';

function collect(world: GameWorld, item: HiddenItemId) {
  if (!world.items.includes(item) && distance(world.player, world.itemPositions[item]) < 42) {
    world.items.push(item);
    world.message = `Найден предмет: ${itemInfo[item].name}!`;
    if (item === 'notebook' && world.quest === 1) world.quest = 2;
    if (item === 'cookie' && world.quest === 3) world.quest = 4;
    if (item === 'key' && world.quest === 5) world.quest = 6;
    return true;
  }
  return false;
}

export function interact(world: GameWorld) {
  if (world.status !== 'playing') return;
  const guards = world.level === 'medblock' ? world.doctors
    : world.level === 'staff' ? world.bossGuards
    : world.level === 'warehouse' ? world.warehouseGuards : world.teachers;
  const nearbyGuard = guards.find((guard) => distance(world.player, guard) < 68);
  if (nearbyGuard?.chasing && world.items.includes('taser')) {
    world.items = world.items.filter((item) => item !== 'taser');
    nearbyGuard.chasing = false;
    nearbyGuard.stunnedFor = 5000;
    world.message = 'Разряд! Преследователь оглушён на 5 секунд.';
    return;
  }
  if (world.level === 'yard') {
    const nearGate = distance(world.player, { x: 480, y: 190 }) < 65;
    if (distance(world.player, officeEntrance) < 55) {
      world.level = 'school';
      world.quest = 6;
      world.player = { x: 880, y: 540 };
      world.safeTime = 3000;
      world.teachers.forEach((guard) => { guard.chasing = false; });
      world.message = 'Ты вернулся в офис. Охрана не заметит тебя первые 3 секунды.';
    } else if (distance(world.player, warehouseEntrance) < 55) {
      world.level = 'warehouse';
      world.player = { x: 480, y: 520 };
      world.safeTime = 3000;
      world.warehouseGuards = createWarehouseGuards();
      world.message = 'Ты вошёл на склад медикаментов. Охранник не заметит тебя 3 секунды.';
    } else if (distance(world.player, staffPanelPosition) < 55
      && !world.panelDisabled && !world.repairPhase) {
      if (world.items.includes('crowbar')) {
        world.showPanel = true;
        world.message = 'Ты вскрыл щиток ломом. Сломай провода в правильном порядке.';
      } else {
        world.message = 'Крышка щитка заперта. Сначала найди лом.';
      }
    } else if (distance(world.player, staffEntrance) < 55) {
      world.level = 'staff';
      world.player = { x: 480, y: 520 };
      world.safeTime = 3000;
      world.bossGuards = world.panelDisabled || world.repairPhase ? [] : createBossGuards();
      world.message = world.panelDisabled || world.repairPhase
        ? 'Ты вошёл в здание персонала. Директор и охрана сейчас снаружи.'
        : 'Ты вошёл в отдельное здание персонала.';
    } else if (nearGate && !world.gateUnlocked) {
      world.showCodeLock = true;
      world.message = 'Ворота закрыты электронным кодовым замком.';
    } else if (distance(world.player, medblockEntrance) < 65) {
      world.level = 'medblock';
      world.quest = 10;
      world.player = { x: 480, y: 520 };
      world.safeTime = 3000;
      world.doctors.forEach((doctor) => { doctor.chasing = false; });
      world.message = 'Ты вошёл в медблок. Доктора не заметят тебя первые 3 секунды.';
    } else {
      world.message = world.checkpointActive
        ? 'Ищи кодовую панель у ворот и вход в медблок за ними.'
        : 'Сначала наступи на светящийся чекпоинт.';
    }
    return;
  }
  if (world.level === 'medblock') {
    if (distance(world.player, medblockExit) < 55) {
      world.level = 'yard';
      world.player = { x: 335, y: 510 };
      world.quest = world.gateUnlocked ? 9 : 8;
      world.safeTime = 3000;
      world.doctors.forEach((doctor) => { doctor.chasing = false; });
      world.message = 'Ты вышел из медблока обратно во двор.';
    } else if (!world.items.includes('crowbar')
      && distance(world.player, crowbarBoxPosition) < 48) {
      world.items.push('crowbar');
      world.soundEvent += 1;
      world.doctors.forEach((doctor) => {
        doctor.chasing = false;
        doctor.investigateTarget = { ...crowbarBoxPosition };
        doctor.chasePath = [];
        doctor.pathRefresh = 0;
      });
      world.message = 'Ящик открылся с громким звоном! Все доктора идут проверить шум.';
    } else if (!world.items.includes('medicine') && distance(world.player, medicinePosition) < 42) {
      world.items.push('medicine');
      world.money += 1;
      world.message = 'Задание выполнено: лекарство найдено! Награда: 1 жетон.';
    } else {
      world.message = 'Осмотри шесть комнат и не попадай в поле зрения докторов.';
    }
    return;
  }
  if (world.level === 'staff') {
    if (distance(world.player, staffExit) < 55) {
      world.level = 'yard';
      world.player = { x: 735, y: 510 };
      world.safeTime = 3000;
      world.bossGuards = [];
      world.message = 'Ты вышел из здания персонала обратно во двор.';
    } else if (world.bossEffect === 'sleeping' && !world.foundGateCode
      && distance(world.player, directorPosition) < 160) {
      world.showPocketGame = true;
      world.message = 'Директор спит. Обыщи его карманы, пока он не проснулся.';
    } else if (!world.repairPhase && !world.coffeeSpiked
      && world.bossDrinkTime === 0 && distance(world.player, bossCoffeePosition) < 75) {
      world.showCoffeeChoice = true;
      world.message = 'Ты незаметно подобрался к чашке директора.';
    } else {
      world.message = 'В здании персонала пусто. Можно осмотреть кабинеты и комнату отдыха.';
    }
    return;
  }
  if (world.level === 'warehouse') {
    if (distance(world.player, warehouseExit) < 55) {
      world.level = 'yard';
      world.player = { x: 325, y: 270 };
      world.safeTime = 3000;
      world.warehouseGuards.forEach((guard) => { guard.chasing = false; });
      world.message = 'Ты вышел со склада медикаментов.';
    } else if (!world.items.includes('sleepingPowder')
      && distance(world.player, sleepingBoxPosition) < 60) {
      world.items.push('sleepingPowder');
      world.message = 'Ты нашёл игровое снотворное в левом ящике.';
    } else if (!world.items.includes('poison')
      && distance(world.player, poisonBoxPosition) < 60) {
      world.items.push('poison');
      world.message = 'Ты нашёл вымышленный яд в правом ящике.';
    } else {
      world.message = 'Обыщи два ящика и избегай охранника склада.';
    }
    return;
  }
  if (world.hiding) {
    world.hiding = false;
    world.message = 'Ты тихо вышел из шкафа. Осмотрись перед тем, как идти дальше.';
    return;
  }

  const coinIndex = world.coinPositions.findIndex((coin, index) =>
    !world.collectedCoins.includes(index) && distance(world.player, coin) < 38);
  if (coinIndex >= 0) {
    world.collectedCoins.push(coinIndex);
    world.money += 1;
    world.message = `Найден жетон центра! Теперь у тебя: ${world.money}.`;
    return;
  }

  if (collect(world, 'notebook') || collect(world, 'cookie') || collect(world, 'key')) return;

  if (distance(world.player, students[0]) < 52) {
    if (world.quest === 0) {
      world.quest = world.items.includes('notebook') ? 2 : 1;
      world.message = 'Алина: Я потеряла медкарту. Поищи её где-нибудь в офисе!';
    } else if (world.quest === 2) {
      world.quest = 3;
      world.money += 1;
      world.message = 'Алина: Спасибо! Получи 1 жетон. Тимур знает, где лежит пропуск.';
    } else world.message = 'Алина: Скорее, пока охранники тебя не заметили!';
    return;
  }

  if (distance(world.player, students[1]) < 52) {
    if (world.quest < 3) world.message = 'Тимур: Сначала помоги Алине в кабинете 204.';
    else if (world.quest === 3 && !world.items.includes('cookie')) {
      world.message = 'Тимур: Найди для меня кофе — тогда помогу.';
    }
    else if (world.quest === 3 || world.quest === 4) {
      world.quest = world.items.includes('key') ? 6 : 5;
      if (!world.items.includes('pass')) world.items.push('pass');
      world.money += 2;
      world.message = 'Тимур: Держи пропуск и 2 жетона! Ключ ищи в медицинском архиве.';
    }
    else world.message = 'Тимур: Выход в правом нижнем углу. Не попадись!';
    return;
  }

  if (distance(world.player, lockerPosition) < 48) {
    world.hiding = true;
    world.teachers.forEach((teacher) => { teacher.chasing = false; });
    world.message = 'Ты спрятался в шкафу. Погоня закончилась — нажми E, чтобы выйти.';
    return;
  }

  if (distance(world.player, merchant) < 54) {
    world.showShop = true;
    world.message = 'Аишка открыла магазин.';
    return;
  }

  if (world.player.x > 900 && world.player.y > 500) {
    if (world.items.includes('key') && world.items.includes('pass')) {
      world.level = 'yard';
      world.quest = world.checkpointActive ? world.gateUnlocked ? 9 : 8 : 7;
      world.player = { x: 480, y: 515 };
      world.safeTime = 3000;
      world.teachers.forEach((teacher) => { teacher.chasing = false; });
      world.message = 'Замок открыт! Ты выбрался из медицинского офиса и оказался во дворе.';
    } else world.message = 'Дверь заперта. Нужны ключ и служебный пропуск.';
    return;
  }

  world.message = 'Здесь нечего брать. Подойди ближе к предмету или персонажу.';
}
