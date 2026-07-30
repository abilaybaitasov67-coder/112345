import { WeaponId } from './shooterTypes';

export interface WeaponInfo {
  name: string;
  price: number;
  damage: number;
  cooldown: number;
  pellets: number;
  spread: number;
  recoil: number;
  detail: string;
  icon: string;
}

export const weaponInfo: Record<WeaponId, WeaponInfo> = {
  knife: {
    name: 'Тактический нож', price: 0, damage: 55, cooldown: 520,
    pellets: 0, spread: 0, recoil: 0, detail: 'Ближний бой', icon: 'KNV',
  },
  pistol: {
    name: 'P12', price: 0, damage: 24, cooldown: 380,
    pellets: 1, spread: 0, recoil: .012, detail: '12 патронов · полуавтомат', icon: 'P12',
  },
  revolver: {
    name: 'R6 Magnum', price: 450, damage: 45, cooldown: 650,
    pellets: 1, spread: .015, recoil: .026, detail: '6 патронов · высокий урон', icon: 'R6',
  },
  smg: {
    name: 'Viper-9', price: 650, damage: 18, cooldown: 90,
    pellets: 1, spread: .055, recoil: .012, detail: '9 мм · высокая скорострельность', icon: 'V9',
  },
  rifle: {
    name: 'AR-4', price: 900, damage: 30, cooldown: 150,
    pellets: 1, spread: .018, recoil: .018, detail: '5,56 мм · штурмовая винтовка', icon: 'AR',
  },
  shotgun: {
    name: 'Breach-12', price: 1100, damage: 20, cooldown: 700,
    pellets: 5, spread: .16, recoil: .035, detail: '12 калибр · ближняя дистанция', icon: 'B12',
  },
  sniper: {
    name: 'M90', price: 1400, damage: 70, cooldown: 950,
    pellets: 1, spread: 0, recoil: .04, detail: 'Оптика · максимальный урон', icon: 'M90',
  },
};

export function weaponSlot(weapon: WeaponId) {
  if (weapon === 'knife') return 0;
  if (weapon === 'pistol' || weapon === 'revolver') return 1;
  return 2;
}
