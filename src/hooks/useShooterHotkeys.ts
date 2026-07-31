import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
} from 'react';
import { ShooterWorld, WeaponId } from '../lib/shooterTypes';

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
      if (event.code !== 'KeyB') return;
      event.preventDefault();
      setShopOpen((open) => {
        if (!open && document.pointerLockElement) document.exitPointerLock();
        return !open;
      });
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectWeapon, setShopOpen, worldRef]);
}
