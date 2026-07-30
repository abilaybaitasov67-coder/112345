import { WeaponId } from '../lib/shooterTypes';
import { weaponInfo } from '../lib/shooterWeapons';

interface Props {
  weapons: WeaponId[];
  active: WeaponId | null;
  onSelect: (weapon: WeaponId) => void;
}

export function ShooterInventory({ weapons, active, onSelect }: Props) {
  return (
    <div className="shooter-inventory">
      <p>ИНВЕНТАРЬ</p>
      <div className="shooter-inventory__slots">
        {weapons.map((weapon, index) => (
          <button
            key={weapon}
            className={weapon === active ? 'is-active' : ''}
            onClick={() => onSelect(weapon)}
            title={weaponInfo[weapon].name}
          >
            <small>{index + 1}</small>
            <span>{weaponInfo[weapon].icon}</span>
          </button>
        ))}
        {weapons.length === 0 && <span className="shooter-inventory__empty">Пусто</span>}
      </div>
    </div>
  );
}
