import { CoffeeAdditive } from '../lib/game';

interface CoffeeChoiceProps {
  hasPoison: boolean;
  hasSleepingPowder: boolean;
  onChoose: (additive: CoffeeAdditive) => void;
  onClose: () => void;
}

export function CoffeeChoice({
  hasPoison, hasSleepingPowder, onChoose, onClose,
}: CoffeeChoiceProps) {
  return (
    <div className="code-lock-backdrop">
      <section className="coffee-choice">
        <button className="code-lock__close" onClick={onClose}>×</button>
        <span className="coffee-choice__icon">☕</span>
        <p className="hud-label">Чашка директора</p>
        <h2>Что подсыпать?</h2>
        <p>Это вымышленные игровые предметы — выбери один эффект.</p>
        <div className="coffee-choice__options">
          <button onClick={() => onChoose('sleeping')} disabled={!hasSleepingPowder}>
            <b>💤 Снотворное</b>
            <span>{hasSleepingPowder ? 'Директор уснёт на 20 секунд' : 'Сначала найди на складе'}</span>
          </button>
          <button className="coffee-choice__danger" onClick={() => onChoose('poison')} disabled={!hasPoison}>
            <b>☠️ Яд</b>
            <span>{hasPoison ? 'Поднимет страх и привлечёт охрану' : 'Сначала найди на складе'}</span>
          </button>
        </div>
      </section>
    </div>
  );
}
