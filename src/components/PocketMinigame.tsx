import { useMemo, useState } from 'react';

interface PocketMinigameProps {
  onFound: () => void;
  onClose: () => void;
}

const pocketNames = [
  'Верхний левый', 'Верхний правый', 'Левый внутренний',
  'Правый внутренний', 'Левый нижний', 'Правый нижний',
];

export function PocketMinigame({ onFound, onClose }: PocketMinigameProps) {
  const correctPocket = useMemo(() => Math.floor(Math.random() * pocketNames.length), []);
  const [checked, setChecked] = useState<number[]>([]);

  function checkPocket(index: number) {
    if (checked.includes(index)) return;
    setChecked((current) => [...current, index]);
    if (index === correctPocket) window.setTimeout(onFound, 400);
  }

  return (
    <div className="code-lock-backdrop">
      <section className="pocket-game">
        <button className="code-lock__close" onClick={onClose}>×</button>
        <span className="pocket-game__icon">🧥</span>
        <p className="hud-label">Обыск директора</p>
        <h2>Найди записку с кодом</h2>
        <p>Нажимай на карманы. Записка спрятана только в одном из них.</p>
        <div className="pocket-game__grid">
          {pocketNames.map((name, index) => {
            const wasChecked = checked.includes(index);
            const found = wasChecked && index === correctPocket;
            return (
              <button key={name} onClick={() => checkPocket(index)} disabled={wasChecked}>
                <span>{found ? '📄' : wasChecked ? 'пусто' : '👆'}</span>
                <small>{name}</small>
              </button>
            );
          })}
        </div>
        <p className="pocket-game__count">Проверено: {checked.length} / {pocketNames.length}</p>
      </section>
    </div>
  );
}
