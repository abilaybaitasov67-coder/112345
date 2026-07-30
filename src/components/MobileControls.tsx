import { Direction } from '../lib/game';

interface MobileControlsProps {
  onDirection: (direction: Direction, pressed: boolean) => void;
  onAction: () => void;
}

export function MobileControls({ onDirection, onAction }: MobileControlsProps) {
  const directionButton = (direction: Direction, symbol: string, className: string) => (
    <button
      className={`move-button ${className}`}
      onPointerDown={(event) => { event.preventDefault(); onDirection(direction, true); }}
      onPointerUp={() => onDirection(direction, false)}
      onPointerCancel={() => onDirection(direction, false)}
      onPointerLeave={() => onDirection(direction, false)}
      aria-label={`Идти ${direction}`}
    >
      {symbol}
    </button>
  );

  return (
    <div className="mobile-controls">
      <div className="d-pad">
        {directionButton('up', '▲', 'move-up')}
        {directionButton('left', '◀', 'move-left')}
        {directionButton('right', '▶', 'move-right')}
        {directionButton('down', '▼', 'move-down')}
      </div>
      <button className="action-button" onClick={onAction}><b>E</b><span>Действовать</span></button>
    </div>
  );
}
