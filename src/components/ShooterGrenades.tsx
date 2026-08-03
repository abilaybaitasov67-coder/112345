import { GrenadeId } from '../lib/shooterTypes';

interface Props {
  counts: Record<GrenadeId, number>;
  selected: GrenadeId | null;
  onSelect: (kind: GrenadeId) => void;
}

const grenades: Array<{ id: GrenadeId; key: number; label: string }> = [
  { id: 'flash', key: 4, label: 'СВЕТОВАЯ' },
  { id: 'frag', key: 5, label: 'ОСКОЛОЧНАЯ' },
  { id: 'molotov', key: 6, label: 'МОЛОТОВ' },
];

export function ShooterGrenades({ counts, selected, onSelect }: Props) {
  return (
    <div className="shooter-grenades">
      {grenades.map((grenade) => (
        <button
          key={grenade.id}
          className={selected === grenade.id ? 'is-selected' : ''}
          disabled={counts[grenade.id] === 0}
          onClick={() => onSelect(grenade.id)}
        >
          <small>{grenade.key}</small>
          {grenade.label} ×{counts[grenade.id]}
        </button>
      ))}
    </div>
  );
}
