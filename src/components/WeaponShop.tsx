import { GrenadeId, ShooterTeam, WeaponId } from '../lib/shooterTypes';
import { teamShopWeapons, weaponInfo } from '../lib/shooterWeapons';
import { grenadeShopItems } from '../lib/shooterGrenades';

interface Props {
  money: number;
  team: ShooterTeam;
  onBuy: (weapon: WeaponId, price: number) => void;
  onBuyGrenade: (kind: GrenadeId, price: number) => void;
  onClose?: () => void;
}

export function WeaponShop({ money, team, onBuy, onBuyGrenade, onClose }: Props) {
  const weaponIds = teamShopWeapons[team];
  return (
    <div className="weapon-shop">
      <div className="weapon-shop__panel">
        <p className="weapon-shop__eyebrow">СНАРЯЖЕНИЕ ПЕРЕД МИССИЕЙ</p>
        <h1>{team === 'counter' ? 'Арсенал спецназа' : 'Арсенал террористов'}</h1>
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
        <h2 className="weapon-shop__section-title">Гранаты</h2>
        <div className="weapon-shop__grid weapon-shop__grenades">
          {grenadeShopItems.map((grenade) => (
            <button
              key={grenade.id}
              disabled={grenade.price > money}
              onClick={() => onBuyGrenade(grenade.id, grenade.price)}
            >
              <span>◉</span>
              <strong>{grenade.name}</strong>
              <small>{grenade.detail}</small>
              <b>${grenade.price}</b>
            </button>
          ))}
        </div>
        {onClose && (
          <button className="weapon-shop__close" onClick={onClose}>
            Закрыть магазин
          </button>
        )}
      </div>
    </div>
  );
}
