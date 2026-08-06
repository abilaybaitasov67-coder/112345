import { useEffect, useState } from 'react';

interface Props {
  targetId: string;
}

export function FullscreenButton({ targetId }: Props) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const update = () => setActive(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', update);
    return () => document.removeEventListener('fullscreenchange', update);
  }, []);

  const toggle = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    await document.getElementById(targetId)?.requestFullscreen();
  };

  return (
    <button onClick={() => void toggle()}>
      {active ? 'Свернуть' : '⛶ Полный экран'}
    </button>
  );
}
