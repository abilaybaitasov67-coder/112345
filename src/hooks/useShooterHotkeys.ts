import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
} from 'react';
import { GrenadeId, ShooterWorld, WeaponId } from '../lib/shooterTypes';

const weaponKeys: Record<string, number> = {
  Digit1: 0,
  Digit2: 1,
  Digit3: 2,
  Numpad1: 0,
  Numpad2: 1,
  Numpad3: 2,
};

function isTyping(target: EventTarget | null) {
  return target instanceof HTMLInputElement
    || target instanceof HTMLTextAreaElement;
}

export function useShooterHotkeys(
  worldRef: MutableRefObject<ShooterWorld>,
  selectWeapon: (weapon: WeaponId) => void,
  setShopOpen: Dispatch<SetStateAction<boolean>>,
  throwGrenade: (kind: GrenadeId) => void,
) {
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (isTyping(event.target) || event.repeat) return;
      const slot = weaponKeys[event.code];
      if (slot !== undefined) {
        event.preventDefault();
        const weapon = worldRef.current.inventory[slot];
        if (weapon) selectWeapon(weapon);
        return;
      }
      const grenadeKeys: Partial<Record<string, GrenadeId>> = {
        Digit4: 'flash', Digit5: 'frag', Digit6: 'molotov',
      };
      const grenade = grenadeKeys[event.code];
      if (grenade) {
        event.preventDefault();
        throwGrenade(grenade);
        return;
      }
      if (event.code !== 'KeyB') return;
      event.preventDefault();
      setShopOpen((open) => {
        if (!open && document.pointerLockElement) document.exitPointerLock();
        return !open;
      });
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectWeapon, setShopOpen, throwGrenade, worldRef]);
}
