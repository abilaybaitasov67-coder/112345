import { WeaponCase } from '../lib/shooterLobby';

interface Props {
  cases: WeaponCase[];
  credits: number;
  onOpen: (weaponCase: WeaponCase) => void;
}

export function CaseShop({ cases, credits, onOpen }: Props) {
  return (
    <section className="lobby-panel">
      <div className="lobby-panel__heading">
        <div>
          <small>МАГАЗИН</small>
          <h2>Кейсы с предметами</h2>
        </div>
        <span>Баланс: <b>◈ {credits}</b></span>
      </div>
      <div className="case-grid">
        {cases.map((weaponCase) => (
          <article key={weaponCase.id}>
            <div
              className="case-grid__box"
              style={{ '--case-color': weaponCase.color } as React.CSSProperties}
            >
              <i />
              <b>CASE</b>
            </div>
            <h3>{weaponCase.name}</h3>
            <p>{weaponCase.detail}</p>
            <button
              disabled={credits < weaponCase.price}
              onClick={() => onOpen(weaponCase)}
            >
              Открыть · ◈ {weaponCase.price}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
