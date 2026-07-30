interface Props {
  onMove: (x: number, y: number) => void;
  onFire: () => void;
  onAim: (aiming: boolean) => void;
  onPickup: () => void;
}

export function ShooterControls({ onMove, onFire, onAim, onPickup }: Props) {
  const fireTimer = useRef<number | null>(null);
  const stopFire = () => {
    if (fireTimer.current !== null) window.clearInterval(fireTimer.current);
    fireTimer.current = null;
  };
  const startFire = () => {
    stopFire();
    onFire();
    fireTimer.current = window.setInterval(onFire, 35);
  };
  useEffect(() => stopFire, []);
  const stop = () => onMove(0, 0);
  const button = (label: string, x: number, y: number) => (
    <button
      onPointerDown={() => onMove(x, y)}
      onPointerUp={stop}
      onPointerCancel={stop}
      onPointerLeave={stop}
    >{label}</button>
  );
  return (
    <div className="shooter-controls">
      <div className="shooter-dpad">
        <span />
        {button('▲', 0, -1)}
        <span />
        {button('◀', -1, 0)}
        {button('▼', 0, 1)}
        {button('▶', 1, 0)}
      </div>
      <div className="shooter-actions">
        <button className="shooter-aim" onPointerDown={onPickup}>ПОДНЯТЬ</button>
        <button
          className="shooter-aim"
          onPointerDown={() => onAim(true)}
          onPointerUp={() => onAim(false)}
          onPointerCancel={() => onAim(false)}
          onPointerLeave={() => onAim(false)}
        >ПРИЦЕЛ</button>
        <button
          className="shooter-fire"
          onPointerDown={startFire}
          onPointerUp={stopFire}
          onPointerCancel={stopFire}
          onPointerLeave={stopFire}
        >ОГОНЬ</button>
      </div>
    </div>
  );
}
import { useEffect, useRef } from 'react';
