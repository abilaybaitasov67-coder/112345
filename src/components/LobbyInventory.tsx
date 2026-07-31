import { inventoryItems } from '../lib/shooterLobby';

interface Props {
  owned: string[];
  equipped: string | null;
  onEquip: (itemId: string) => void;
}

export function LobbyInventory({ owned, equipped, onEquip }: Props) {
  const items = inventoryItems.filter((item) => owned.includes(item.id));
  return (
    <section className="lobby-panel">
      <div className="lobby-panel__heading">
        <div>
          <small>КОЛЛЕКЦИЯ</small>
          <h2>Твой инвентарь</h2>
        </div>
        <span>{items.length} предметов</span>
      </div>
      <div className="inventory-grid">
        {items.map((item) => (
          <button
            className={`rarity-${item.rarity} ${equipped === item.id ? 'is-equipped' : ''}`}
            key={item.id}
            onClick={() => onEquip(item.id)}
          >
            <span>{item.name}</span>
            <strong>{item.finish}</strong>
            <small>{equipped === item.id ? 'ЭКИПИРОВАНО' : 'ЭКИПИРОВАТЬ'}</small>
          </button>
        ))}
      </div>
    </section>
  );
}
