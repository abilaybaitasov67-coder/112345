import { useCallback, useEffect, useRef, useState } from 'react';
import { interact } from '../lib/gameActions';
import {
  CoffeeAdditive, createRepairCrew, createWorld, Direction, GameSnapshot, snapshot,
  TASER_PRICE,
} from '../lib/game';

function playMetalClang() {
  const audio = new AudioContext();
  const now = audio.currentTime;
  [0, 0.11].forEach((delay, index) => {
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(index === 0 ? 170 : 115, now + delay);
    oscillator.frequency.exponentialRampToValueAtTime(65, now + delay + 0.18);
    gain.gain.setValueAtTime(0.16, now + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.22);
    oscillator.connect(gain); gain.connect(audio.destination);
    oscillator.start(now + delay); oscillator.stop(now + delay + 0.23);
  });
  window.setTimeout(() => void audio.close(), 500);
}

export function useSchoolGame() {
  const worldRef = useRef(createWorld());
  const keysRef = useRef(new Set<string>());
  const [game, setGame] = useState<GameSnapshot>(() => snapshot(worldRef.current));
  const [restartKey, setRestartKey] = useState(0);

  const sync = useCallback(() => setGame(snapshot(worldRef.current)), []);

  const act = useCallback(() => {
    const previousSoundEvent = worldRef.current.soundEvent;
    interact(worldRef.current);
    if (worldRef.current.soundEvent !== previousSoundEvent) playMetalClang();
    sync();
  }, [sync]);

  const setDirection = useCallback((direction: Direction, pressed: boolean) => {
    const key = { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight' }[direction];
    if (pressed) keysRef.current.add(key);
    else keysRef.current.delete(key);
  }, []);

  const restart = useCallback(() => {
    worldRef.current = createWorld();
    keysRef.current.clear();
    setRestartKey((value) => value + 1);
    sync();
  }, [sync]);

  const submitCode = useCallback((code: string) => {
    const world = worldRef.current;
    if (code === world.gateCode) {
      world.gateUnlocked = true;
      world.showCodeLock = false;
      world.status = 'won';
      world.quest = 9;
      world.message = 'Код верный! Ворота открылись — ты на свободе.';
    } else {
      world.message = world.foundGateCode
        ? 'Неверный код. Проверь записку из кармана директора.'
        : 'Неверный код. Сначала найди записку с паролем.';
    }
    sync();
    return code === world.gateCode;
  }, [sync]);

  const closeCodeLock = useCallback(() => {
    worldRef.current.showCodeLock = false;
    sync();
  }, [sync]);

  const disablePanel = useCallback(() => {
    const world = worldRef.current;
    world.panelDisabled = true;
    world.showPanel = false;
    world.bossGuards = [];
    world.repairPhase = 'approaching';
    world.repairTime = 15000;
    world.repairCrew = createRepairCrew();
    world.soundEvent += 1;
    world.message = 'Провода сломаны! Директор и охрана вышли ремонтировать щиток.';
    playMetalClang();
    sync();
  }, [sync]);

  const closePanel = useCallback(() => {
    worldRef.current.showPanel = false;
    sync();
  }, [sync]);

  const chooseCoffeeAdditive = useCallback((additive: CoffeeAdditive) => {
    const world = worldRef.current;
    const requiredItem = additive === 'sleeping' ? 'sleepingPowder' : 'poison';
    if (!world.items.includes(requiredItem)) return;
    world.items = world.items.filter((item) => item !== requiredItem);
    world.coffeeSpiked = additive;
    world.showCoffeeChoice = false;
    world.message = additive === 'sleeping'
      ? 'Снотворное добавлено. Теперь дождись, когда директор выпьет кофе.'
      : 'Яд добавлен. Теперь дождись, когда директор выпьет кофе.';
    sync();
  }, [sync]);

  const closeCoffeeChoice = useCallback(() => {
    worldRef.current.showCoffeeChoice = false;
    sync();
  }, [sync]);

  const findGateCode = useCallback(() => {
    const world = worldRef.current;
    world.foundGateCode = true;
    if (!world.items.includes('passwordNote')) world.items.push('passwordNote');
    world.showPocketGame = false;
    world.message = `В кармане найдена записка: код ворот — ${world.gateCode}.`;
    sync();
  }, [sync]);

  const closePocketGame = useCallback(() => {
    worldRef.current.showPocketGame = false;
    sync();
  }, [sync]);

  const buyTaser = useCallback(() => {
    const world = worldRef.current;
    if (world.items.includes('taser') || world.money < TASER_PRICE) return;
    world.money -= TASER_PRICE;
    world.items.push('taser');
    world.message = 'Аишка: Покупка готова! Электрошокер появился в рюкзаке.';
    sync();
  }, [sync]);

  const closeShop = useCallback(() => {
    worldRef.current.showShop = false;
    sync();
  }, [sync]);

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'e', 'E'].includes(event.key)) event.preventDefault();
      if (event.key === 'e' || event.key === 'E' || event.key === ' ') act();
      keysRef.current.add(event.key);
    };
    const up = (event: KeyboardEvent) => keysRef.current.delete(event.key);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [act]);

  return {
    worldRef, keysRef, game, restartKey, sync, restart,
    act, setDirection, submitCode, closeCodeLock, disablePanel, closePanel,
    chooseCoffeeAdditive, closeCoffeeChoice,
    findGateCode, closePocketGame,
    buyTaser, closeShop,
  };
}
