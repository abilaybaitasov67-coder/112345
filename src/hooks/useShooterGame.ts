import { useCallback, useRef, useState } from 'react';
import { firePlayer } from '../lib/shooterPhysics';
import { ShooterPoint, ShooterStatus, ShooterWorld, WeaponId } from '../lib/shooterTypes';
import { createShooterWorld } from '../lib/shooterWorld';
import { weaponInfo, weaponSlot } from '../lib/shooterWeapons';
import {
  bombSites,
  stopPlayerBombDefuse,
  tryPlantBomb,
  tryStartBombDefuse,
} from '../lib/shooterBomb';
import { tryShooterJump } from '../lib/shooterJump';

function storeWeapon(world: ShooterWorld, weapon: WeaponId) {
  const slot = weaponSlot(weapon);
  const currentIndex = world.inventory.findIndex((item) => weaponSlot(item) === slot);
  if (currentIndex >= 0) world.inventory[currentIndex] = weapon;
  else world.inventory.push(weapon);
  world.inventory.sort((a, b) => weaponSlot(a) - weaponSlot(b));
}

export interface ShooterSnapshot {
  health: number;
  enemies: number;
  status: ShooterStatus;
  message: string;
  money: number;
  weapon: WeaponId | null;
  inventory: WeaponId[];
  aiming: boolean;
  spread: number;
  bomb: string;
}

function snapshot(world: ShooterWorld): ShooterSnapshot {
  const nearbySite = (Object.entries(bombSites) as ['A' | 'B', ShooterPoint][])
    .find(([, site]) => Math.hypot(
      site.x - world.player.x,
      site.y - world.player.y,
    ) < 100)?.[0];
  return {
    health: Math.max(0, world.player.health),
    enemies: world.enemies.length,
    status: world.status,
    message: world.message,
    money: world.money,
    weapon: world.weapon,
    inventory: [...world.inventory],
    aiming: world.aiming,
    spread: Math.min(
      28,
      world.recoil * 120
        + (world.moving ? 7 : 0)
        + (world.jumpHeight > .05 ? 13 : 0)
        + (world.weapon === 'shotgun' ? weaponInfo.shotgun.spread * 35 : 0),
    ),
    bomb: world.bomb.defuser
      ? `ДЕФЬЮЗ ${Math.ceil(world.bomb.defuseTimer / 1000)}`
      : world.bomb.planted
        ? `БОМБА ${world.bomb.site} · ${Math.ceil(world.bomb.timer / 1000)}`
      : nearbySite ? `ТОЧКА ${nearbySite} · НАЖМИ E` : 'БОМБА · НАЙДИ A ИЛИ B',
  };
}

export function useShooterGame() {
  const worldRef = useRef(createShooterWorld());
  const keysRef = useRef(new Set<string>());
  const mobileRef = useRef<ShooterPoint>({ x: 0, y: 0 });
  const [game, setGame] = useState(() => snapshot(worldRef.current));
  const [restartKey, setRestartKey] = useState(0);

  const sync = useCallback(() => setGame(snapshot(worldRef.current)), []);
  const restart = useCallback(() => {
    worldRef.current = createShooterWorld();
    setRestartKey((key) => key + 1);
    sync();
  }, [sync]);
  const fire = useCallback(() => {
    firePlayer(worldRef.current);
    sync();
  }, [sync]);
  const setMobile = useCallback((x: number, y: number) => {
    mobileRef.current = { x, y };
  }, []);
  const jump = useCallback(() => {
    tryShooterJump(worldRef.current);
  }, []);
  const buyWeapon = useCallback((weapon: WeaponId, price: number) => {
    const world = worldRef.current;
    if (price > world.money) return;
    world.money -= price;
    world.weapon = weapon;
    storeWeapon(world, weapon);
    world.message = 'Оружие получено. Начинай операцию!';
    sync();
  }, [sync]);
  const setAiming = useCallback((aiming: boolean) => {
    worldRef.current.aiming = aiming && worldRef.current.weapon === 'sniper';
    sync();
  }, [sync]);
  const pickUpWeapon = useCallback(() => {
    const world = worldRef.current;
    if (tryStartBombDefuse(world)) {
      sync();
      return;
    }
    if (tryPlantBomb(world)) {
      sync();
      return;
    }
    const index = world.droppedWeapons.findIndex((drop) =>
      Math.hypot(drop.x - world.player.x, drop.y - world.player.y) < 55);
    if (index < 0) {
      world.message = 'Подойди ближе к оружию, чтобы поднять его.';
      sync();
      return;
    }
    const [drop] = world.droppedWeapons.splice(index, 1);
    world.weapon = drop.weapon;
    storeWeapon(world, drop.weapon);
    world.aiming = false;
    world.message = `Подобрано оружие: ${weaponInfo[drop.weapon].name}.`;
    sync();
  }, [sync]);
  const stopAction = useCallback(() => {
    stopPlayerBombDefuse(worldRef.current);
    sync();
  }, [sync]);
  const selectWeapon = useCallback((weapon: WeaponId) => {
    const world = worldRef.current;
    if (!world.inventory.includes(weapon)) return;
    world.weapon = weapon;
    world.aiming = false;
    world.message = `Выбрано оружие: ${weaponInfo[weapon].name}.`;
    sync();
  }, [sync]);

  return {
    worldRef, keysRef, mobileRef, game, restartKey,
    sync, restart, fire, setMobile, jump, buyWeapon, setAiming,
    pickUpWeapon, stopAction, selectWeapon,
  };
}
