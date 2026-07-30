import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';

interface PanelMinigameProps {
  onComplete: () => void;
  onClose: () => void;
}

const wires = [
  { id: 'red', color: '#df554c', name: 'красный' },
  { id: 'blue', color: '#4c86d9', name: 'синий' },
  { id: 'yellow', color: '#e6be43', name: 'жёлтый' },
  { id: 'green', color: '#55a969', name: 'зелёный' },
];

export function PanelMinigame({ onComplete, onClose }: PanelMinigameProps) {
  const sequence = useMemo(() => [...wires].sort(() => Math.random() - 0.5), []);
  const [broken, setBroken] = useState<string[]>([]);
  const [error, setError] = useState(false);

  function breakWire(id: string) {
    if (broken.includes(id)) return;
    if (sequence[broken.length].id !== id) {
      setBroken([]);
      setError(true);
      return;
    }
    const next = [...broken, id];
    setBroken(next);
    setError(false);
    if (next.length === wires.length) window.setTimeout(onComplete, 350);
  }

  return (
    <div className="code-lock-backdrop">
      <section className="panel-game">
        <button className="code-lock__close" onClick={onClose}>×</button>
        <span className="panel-game__icon">⚡</span>
        <p className="hud-label">Электрический щиток</p>
        <h2>Сломай провода</h2>
        <p className="panel-game__sequence">
          Порядок: {sequence.map((wire) => <i key={wire.id} style={{ background: wire.color }} />)}
        </p>
        <div className="panel-game__wires">
          {wires.map((wire) => {
            const isBroken = broken.includes(wire.id);
            return (
              <button
                key={wire.id}
                className={isBroken ? 'is-broken' : ''}
                style={{ '--wire-color': wire.color } as CSSProperties}
                onClick={() => breakWire(wire.id)}
                disabled={isBroken}
              >
                <span />{isBroken ? 'Сломан' : wire.name}
              </button>
            );
          })}
        </div>
        {error && <p className="code-lock__error">Искра! Неверный порядок — начни заново.</p>}
        <p className="panel-game__progress">{broken.length} / {wires.length}</p>
      </section>
    </div>
  );
}
