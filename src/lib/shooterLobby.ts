import { WeaponId } from './shooterTypes';

export type LobbyTab = 'play' | 'loadout' | 'inventory' | 'cases';
export type ItemRarity = 'common' | 'rare' | 'epic';

export interface InventoryItem {
  id: string;
  weapon: WeaponId;
  name: string;
  finish: string;
  rarity: ItemRarity;
}

export interface WeaponCase {
  id: string;
  name: string;
  detail: string;
  price: number;
  color: string;
  rewards: string[];
}

export const primaryWeapons: WeaponId[] = ['ak47', 'smg', 'shotgun', 'sniper'];

export const inventoryItems: InventoryItem[] = [
  { id: 'ak-sand', weapon: 'ak47', name: 'АК-47', finish: 'Песчаная буря', rarity: 'common' },
  { id: 'smg-carbon', weapon: 'smg', name: 'Viper-9', finish: 'Карбон', rarity: 'common' },
  { id: 'pistol-ice', weapon: 'pistol', name: 'P12', finish: 'Ледник', rarity: 'rare' },
  { id: 'shotgun-ember', weapon: 'shotgun', name: 'Breach-12', finish: 'Уголь', rarity: 'rare' },
  { id: 'sniper-aurora', weapon: 'sniper', name: 'M90', finish: 'Аврора', rarity: 'epic' },
  { id: 'knife-gold', weapon: 'knife', name: 'Нож', finish: 'Золотая грань', rarity: 'epic' },
];

export const weaponCases: WeaponCase[] = [
  {
    id: 'field',
    name: 'Полевой кейс',
    detail: 'Простые и редкие покрытия',
    price: 250,
    color: '#78907f',
    rewards: ['ak-sand', 'smg-carbon', 'pistol-ice'],
  },
  {
    id: 'strike',
    name: 'Ударный кейс',
    detail: 'Шанс получить эпический предмет',
    price: 500,
    color: '#b7814c',
    rewards: ['pistol-ice', 'shotgun-ember', 'sniper-aurora'],
  },
  {
    id: 'elite',
    name: 'Элитный кейс',
    detail: 'Только редкие и эпические предметы',
    price: 800,
    color: '#8069a8',
    rewards: ['shotgun-ember', 'sniper-aurora', 'knife-gold'],
  },
];

export const lobbyTabs: Array<{ id: LobbyTab; label: string }> = [
  { id: 'play', label: 'Играть' },
  { id: 'loadout', label: 'Оружие' },
  { id: 'inventory', label: 'Инвентарь' },
  { id: 'cases', label: 'Кейсы' },
];
