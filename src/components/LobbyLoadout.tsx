import { WeaponId } from '../lib/shooterTypes';
import { primaryWeapons } from '../lib/shooterLobby';
import { weaponInfo } from '../lib/shooterWeapons';

interface Props {
  primary: WeaponId;
  onChange: (weapon: WeaponId) => void;
}

export function LobbyLoadout({ primary, onChange }: Props) {
  return (
    <section className="lobby-panel">
      <div className="lobby-panel__heading">
        <div>
          <small>СНАРЯЖЕНИЕ</small>
          <h2>Выбери оружие на матч</h2>
        </div>
        <span>Слот 1 · основное</span>
      </div>
      <div className="loadout-grid">
        {primaryWeapons.map((id) => {
          const weapon = weaponInfo[id];
          return (
            <button
              className={id === primary ? 'is-selected' : ''}
              key={id}
              onClick={() => onChange(id)}
            >
              <span className="loadout-grid__icon">{weapon.icon}</span>
              <strong>{weapon.name}</strong>
              <small>{weapon.detail}</small>
              <i>{id === primary ? 'ВЫБРАНО' : 'ВЫБРАТЬ'}</i>
            </button>
          );
        })}
      </div>
      <div className="loadout-fixed">
        <span><b>2</b> P12 <small>Дополнительное</small></span>
        <span><b>3</b> KNV <small>Ближний бой</small></span>
        <span><b>4</b> Бомба <small>Задача раунда</small></span>
      </div>
    </section>
  );
}
