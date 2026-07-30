import { WeaponId } from '../lib/shooterTypes';
import { weaponInfo } from '../lib/shooterWeapons';

interface Props {
  money: number;
  onBuy: (weapon: WeaponId, price: number) => void;
}

const weaponIds = (Object.keys(weaponInfo) as WeaponId[])
  .filter((weapon) => weapon !== 'knife');

export function WeaponShop({ money, onBuy }: Props) {
  return (
    <div className="weapon-shop">
      <div className="weapon-shop__panel">
        <p className="weapon-shop__eyebrow">СНАРЯЖЕНИЕ ПЕРЕД МИССИЕЙ</p>
        <h1>Выбери оружие</h1>
        <p className="weapon-shop__money">Бюджет: <b>${money}</b></p>
        <div className="weapon-shop__grid">
          {weaponIds.map((id) => {
            const weapon = weaponInfo[id];
            return (
            <button
              key={id}
              disabled={weapon.price > money}
              onClick={() => onBuy(id, weapon.price)}
            >
              <span>{weapon.icon}</span>
              <strong>{weapon.name}</strong>
              <small>{weapon.detail}</small>
              <b>{weapon.price === 0 ? 'Бесплатно' : `$${weapon.price}`}</b>
            </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
