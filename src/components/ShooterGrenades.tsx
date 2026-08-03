import { GrenadeId } from '../lib/shooterTypes';

interface Props {
  counts: Record<GrenadeId, number>;
  onThrow: (kind: GrenadeId) => void;
}

const grenades: Array<{ id: GrenadeId; key: number; label: string }> = [
  { id: 'flash', key: 4, label: 'СВЕТОВАЯ' },
  { id: 'frag', key: 5, label: 'ОСКОЛОЧНАЯ' },
  { id: 'molotov', key: 6, label: 'МОЛОТОВ' },
];

export function ShooterGrenades({ counts, onThrow }: Props) {
  return (
    <div className="shooter-grenades">
      {grenades.map((grenade) => (
        <button
          key={grenade.id}
          disabled={counts[grenade.id] === 0}
          onClick={() => onThrow(grenade.id)}
        >
          <small>{grenade.key}</small>
          {grenade.label} ×{counts[grenade.id]}
        </button>
      ))}
    </div>
  );
}
