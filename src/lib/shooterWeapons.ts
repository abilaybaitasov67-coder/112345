import { ShooterTeam, WeaponId } from './shooterTypes';

export interface WeaponInfo {
  name: string;
  price: number;
  damage: number;
  cooldown: number;
  pellets: number;
  spread: number;
  recoil: number;
  bulletSpeed: number;
  detail: string;
  icon: string;
}

export const weaponInfo: Record<WeaponId, WeaponInfo> = {
  knife: {
    name: 'Тактический нож', price: 0, damage: 55, cooldown: 420,
    pellets: 0, spread: 0, recoil: 0, bulletSpeed: 0, detail: 'Ближний бой', icon: 'KNV',
  },
  pistol: {
    name: 'P12', price: 0, damage: 24, cooldown: 250,
    pellets: 1, spread: 0, recoil: .018, bulletSpeed: 1.25, detail: '12 патронов · полуавтомат', icon: 'P12',
  },
  revolver: {
    name: 'R6 Magnum', price: 450, damage: 45, cooldown: 480,
    pellets: 1, spread: .12, recoil: .038, bulletSpeed: 1.45, detail: '6 патронов · высокий урон', icon: 'R6',
  },
  smg: {
    name: 'Viper-9', price: 650, damage: 18, cooldown: 60,
    pellets: 1, spread: .055, recoil: .017, bulletSpeed: 1.15, detail: '9 мм · высокая скорострельность', icon: 'V9',
  },
  rifle: {
    name: 'AR-4', price: 900, damage: 30, cooldown: 95,
    pellets: 1, spread: .018, recoil: .027, bulletSpeed: 1.45, detail: '5,56 мм · штурмовая винтовка', icon: 'AR',
  },
  ak47: {
    name: 'АК-47', price: 900, damage: 36, cooldown: 105,
    pellets: 1, spread: .024, recoil: .035, bulletSpeed: 1.5,
    detail: '7,62 мм · мощный автомат террористов', icon: 'AK',
  },
  m4a1: {
    name: 'M4A1', price: 900, damage: 30, cooldown: 85,
    pellets: 1, spread: .015, recoil: .023, bulletSpeed: 1.5,
    detail: '5,56 мм · точная винтовка спецназа', icon: 'M4',
  },
  shotgun: {
    name: 'Breach-12', price: 1100, damage: 20, cooldown: 520,
    pellets: 5, spread: .19, recoil: .05, bulletSpeed: 1.05, detail: '12 калибр · ближняя дистанция', icon: 'B12',
  },
  sniper: {
    name: 'M90', price: 1400, damage: 70, cooldown: 720,
    pellets: 1, spread: 0, recoil: .065, bulletSpeed: 1.8, detail: 'Оптика · максимальный урон', icon: 'M90',
  },
};

export function weaponSlot(weapon: WeaponId) {
  if (weapon === 'knife') return 0;
  if (weapon === 'pistol' || weapon === 'revolver') return 1;
  return 2;
}

export const teamShopWeapons: Record<ShooterTeam, WeaponId[]> = {
  terrorists: ['revolver', 'smg', 'ak47', 'shotgun', 'sniper'],
  counter: ['pistol', 'm4a1', 'shotgun', 'sniper'],
};

export function canTeamBuyWeapon(team: ShooterTeam, weapon: WeaponId) {
  return weapon === 'knife' || teamShopWeapons[team].includes(weapon);
}
