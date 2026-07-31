import { MutableRefObject } from 'react';
import { ShooterWorld } from '../lib/shooterTypes';
import { SHOOTER_WORLD_HEIGHT, SHOOTER_WORLD_WIDTH } from '../lib/shooterWorld';
import { ShooterMinimapTerrain } from './ShooterMinimapTerrain';

interface Props {
  worldRef: MutableRefObject<ShooterWorld>;
}

export function ShooterMinimap({ worldRef }: Props) {
  const world = worldRef.current;
  const rotation = world.angle * 180 / Math.PI + 90;
  return (
    <aside className="shooter-minimap" aria-label="Мини-карта">
      <svg viewBox={`0 0 ${SHOOTER_WORLD_WIDTH} ${SHOOTER_WORLD_HEIGHT}`}>
        <ShooterMinimapTerrain />
        {world.enemies.map((enemy, index) => (
          <circle key={index} cx={enemy.x} cy={enemy.y} r="24" fill="#d45b4f" />
        ))}
        {world.remotePlayers.filter((player) => player.health > 0).map((player) => (
          <circle key={player.id} cx={player.x} cy={player.y} r="22" fill="#63b7d1" />
        ))}
        {world.bomb.planted && !world.bomb.exploded && (
          <circle cx={world.bomb.x} cy={world.bomb.y} r="30" fill="#ffcf48" stroke="#2a1d16" strokeWidth="10" />
        )}
        <polygon
          points="0,-42 29,32 -29,32"
          fill="#f5dc6b"
          stroke="#151a18"
          strokeWidth="8"
          transform={`translate(${world.player.x} ${world.player.y}) rotate(${rotation})`}
        />
      </svg>
    </aside>
  );
}
